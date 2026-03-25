import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";
import pino from "pino";
import rateLimit from "express-rate-limit";
import multer from "multer";
import fs from "node:fs";
import helmet from "helmet";
import compression from "compression";

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true
    }
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- CONFIGURATION ---
const JWT_SECRET = process.env.JWT_SECRET || "hub-secret-2024";
const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "placeholder";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY !== "your-service-role-key-here" 
  ? process.env.SUPABASE_SERVICE_ROLE_KEY 
  : undefined;

if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
  logger.error("Missing required environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY). Exiting.");
  process.exit(1);
}

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "uploads", "logo");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Ensure default logo exists
const defaultLogoPath = path.join(uploadDir, "logo.png");
if (!fs.existsSync(defaultLogoPath)) {
  const publicLogo = path.join(__dirname, "public", "logo.png");
  if (fs.existsSync(publicLogo)) {
    fs.copyFileSync(publicLogo, defaultLogoPath);
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype === 'image/svg+xml' ? 'svg' : 'png';
    cb(null, `logo.${ext}`)
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 1024 * 1024 }, // 1MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/svg+xml') {
      cb(null, true);
    } else {
      cb(new Error('Only PNG and SVG files are allowed'));
    }
  }
});

// Initialize Supabase Client
const supabase = createClient(
  supabaseUrl, 
  supabaseServiceKey || supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// --- BACKEND SERVICES ---

const logAudit = async (supabaseClient: any, actorId: string, action: string, entityType: string, entityId: string | null, details: any = {}) => {
  try {
    await supabaseClient.from('audit_logs').insert({
      actor_id: actorId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details
    });
  } catch (err) {
    logger.error({ err, actorId, action }, "Failed to write audit log");
  }
};

const LicenseService = {
  validate: async (key: string, accountId: string, hwid: string) => {
    const { data: license, error } = await supabase
      .from('bot_licenses')
      .select('*')
      .eq('license_key', key)
      .eq('is_active', true)
      .single();

    if (error || !license) return { valid: false, error: "Invalid or inactive license" };
    
    if (!license.account_id) {
      // First time activation - bind to this account and hardware
      const { error: updateError } = await supabase
        .from('bot_licenses')
        .update({ account_id: accountId, hardware_id: hwid, last_validated_at: new Date().toISOString() })
        .eq('id', license.id);
      
      if (updateError) return { valid: false, error: "Failed to bind license" };
      return { valid: true, expires_at: license.expires_at };
    }
    
    if (license.account_id !== accountId || license.hardware_id !== hwid) {
      return { valid: false, error: "License bound to another device/account" };
    }

    // Update last validated
    await supabase
      .from('bot_licenses')
      .update({ last_validated_at: new Date().toISOString() })
      .eq('id', license.id);
    
    return { valid: true, expires_at: license.expires_at };
  }
};

// --- API CONTROLLERS ---

async function startServer() {
  const app = express();

  // Security Hardening (Helmet)
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "img-src": ["'self'", "data:", "https://grainy-gradients.vercel.app", "https://*.supabase.co"],
        "script-src": ["'self'", "'unsafe-inline'", "https://*.supabase.co"],
        "connect-src": ["'self'", "https://*.supabase.co", "https://*.replicate.com"],
        "font-src": ["'self'", "https://fonts.gstatic.com"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));

  // Performance Optimization (Compression)
  app.use(compression());

  app.use(express.json());

  // Metrics
  const metrics = {
    requests: 0,
    errors: 0,
    startTime: Date.now()
  };

  // Request Logging Middleware
  app.use((req, res, next) => {
    if (req.url.startsWith('/api')) {
      metrics.requests++;
      logger.info({ method: req.method, url: req.url }, "Incoming API Request");
    }
    next();
  });

  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      uptime: Math.floor((Date.now() - metrics.startTime) / 1000),
      metrics,
      env: {
        hasSupabaseUrl: !!process.env.VITE_SUPABASE_URL,
        hasSupabaseAnonKey: !!process.env.VITE_SUPABASE_ANON_KEY,
        nodeEnv: process.env.NODE_ENV
      }
    });
  });

  // Public config for the frontend to pick up keys if they weren't baked in at build time
  app.get("/api/config", (req, res) => {
    res.json({
      supabaseUrl: process.env.VITE_SUPABASE_URL,
      supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY
    });
  });

  // Serve uploads directory
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  // Middleware
  const authenticate = async (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    try {
      const authClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false, autoRefreshToken: false }
      });
      const { data: { user: authUser }, error: authError } = await authClient.auth.getUser(token);
      if (authError || !authUser) throw authError;
      
      req.supabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: `Bearer ${token}` } },
        auth: { persistSession: false, autoRefreshToken: false }
      });
      const isAdmin = authUser.email === 'admin@ifxtrades.com' || 
                      authUser.email === 'admin@tradinghub.com' || 
                      authUser.email === 'piyushmal1301@gmail.com' ||
                      authUser.user_metadata?.role === 'admin';
                      
      req.user = { ...authUser, role: isAdmin ? 'admin' : 'user' };
      next();
    } catch (e: any) {
      logger.error({ err: e, token }, "Authentication failed");
      res.status(401).json({ error: "Invalid token" });
    }
  };

  // Content Routes
  app.get("/api/content", async (req, res) => {
    const { type, page = 1, limit = 9, search = "" } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = supabase
      .from('content_posts')
      .select('*')
      .eq('content_type', type || 'blog')
      .eq('status', 'published');

    const searchStr = typeof search === 'string' ? search : "";
    if (searchStr.length > 0) {
      query = query.or(`title.ilike.%${searchStr}%,body.ilike.%${searchStr}%`);
    }

    const { data: posts, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + Number(limit) - 1);

    if (error) return res.status(500).json({ error: error.message });
    res.json(posts);
  });

  app.get("/api/content/:slug", async (req, res) => {
    const { slug } = req.params;
    const { data: post, error } = await supabase
      .from('content_posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  });

  // Product Routes
  app.get("/api/products", async (req, res) => {
    const { data: products, error } = await supabase
      .from('products')
      .select('*, product_variants(*)');

    if (error) return res.status(500).json({ error: error.message });
    const formatted = products.map(p => ({
      ...p,
      variants: p.product_variants
    }));
    res.json(formatted);
  });

  // Webinar Routes
  app.get("/api/webinars", async (req, res) => {
    const { data: webinars, error } = await supabase
      .from('webinars')
      .select('*')
      .order('date_time', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    res.json(webinars);
  });

  app.post("/api/webinars/register", authenticate, async (req: any, res) => {
    const { webinar_id, email } = req.body;
    console.log(`[EMAIL SERVICE] Sending confirmation to ${email} for webinar ${webinar_id}`);
    res.json({ success: true, message: "Registered successfully" });
  });

  // License Validation API (MT5)
  const licenseRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: "Too many validation requests" },
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.post("/api/license/validate", licenseRateLimiter, async (req, res) => {
    try {
      const { license_key, account_id, hardware_id } = req.body;
      const result = await LicenseService.validate(license_key, account_id, hardware_id);
      if (!result.valid) return res.status(403).json(result);
      const token = jwt.sign({ key: license_key, account_id }, JWT_SECRET, { expiresIn: "1h" });
      res.json({ validation_token: token, valid_until: result.expires_at });
    } catch (error) {
      logger.error({ err: error }, "License validation exception");
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // User Routes
  app.get("/api/user/licenses", authenticate, async (req: any, res) => {
    const { data: licenses, error } = await req.supabase
      .from('bot_licenses')
      .select('*, algo_bots(name)')
      .eq('user_id', req.user.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json(licenses);
  });

  // Admin Routes
  app.get("/api/admin/stats", authenticate, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    try {
      const { count: usersCount } = await req.supabase
        .from('users')
        .select('*', { count: 'exact', head: true });
      const { count: subsCount } = await req.supabase
        .from('bot_licenses')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);
      const { data: sales } = await req.supabase.from('sales_tracking').select('sale_amount');
      const totalRev = sales?.reduce((acc: any, curr: any) => acc + (curr.sale_amount || 0), 0) || 0;
      res.json({ total_users: usersCount || 0, active_subscriptions: subsCount || 0, revenue_mtd: totalRev });
    } catch (err) {
      logger.error({ err }, "Stats fetch exception");
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.post("/api/admin/products", authenticate, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    const { data, error } = await req.supabase.from('products').insert([req.body]).select().single();
    if (error) return res.status(500).json({ error: error.message });
    await logAudit(req.supabase, req.user.id, 'CREATE', 'product', data.id, req.body);
    res.json({ success: true });
  });

  app.put("/api/admin/products/:id", authenticate, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    const { id } = req.params;
    const { error } = await req.supabase.from('products').update(req.body).eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    await logAudit(req.supabase, req.user.id, 'UPDATE', 'product', id, req.body);
    res.json({ success: true });
  });

  app.delete("/api/admin/products/:id", authenticate, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    const { id } = req.params;
    const { error } = await req.supabase.from('products').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    await logAudit(req.supabase, req.user.id, 'DELETE', 'product', id);
    res.json({ success: true });
  });

  app.get("/api/admin/licenses", authenticate, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    const { data, error } = await req.supabase
      .from('bot_licenses')
      .select('*, algo_bots(name), users(email)')
      .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  app.post("/api/admin/licenses", authenticate, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    const { user_id, algo_id, duration_days } = req.body;
    const key = `IFX-${Math.random().toString(36).toUpperCase().substring(2, 6)}`;
    const expires_at = new Date();
    expires_at.setDate(expires_at.getDate() + (duration_days || 30));
    const { data, error } = await req.supabase.from('bot_licenses').insert({ user_id, algo_id, license_key: key, expires_at: expires_at.toISOString(), is_active: true }).select().single();
    if (error) return res.status(500).json({ error: error.message });
    await logAudit(req.supabase, req.user.id, 'CREATE', 'license', data.id);
    res.json(data);
  });

  app.delete("/api/admin/licenses/:id", authenticate, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    const { id } = req.params;
    const { error } = await req.supabase.from('bot_licenses').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    await logAudit(req.supabase, req.user.id, 'DELETE', 'license', id);
    res.json({ success: true });
  });

  app.post("/api/admin/content", authenticate, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    const { title, content_type, content } = req.body;
    const slug = title.toLowerCase().replaceAll(" ", "-") + "-" + Math.random().toString(36).substring(2, 7);
    const { error } = await req.supabase.from('content_posts').insert({ title, slug, content_type, status: 'published', content, author_id: req.user.id });
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  app.put("/api/admin/content/:id", authenticate, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    const { id } = req.params;
    const { error } = await req.supabase.from('content_posts').update(req.body).eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  app.delete("/api/admin/content/:id", authenticate, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    const { id } = req.params;
    const { error } = await req.supabase.from('content_posts').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  app.post("/api/admin/webinars", authenticate, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    const { error } = await req.supabase.from('webinars').insert([req.body]).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  app.put("/api/admin/webinars/:id", authenticate, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    const { id } = req.params;
    const { error } = await req.supabase.from('webinars').update(req.body).eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  app.delete("/api/admin/webinars/:id", authenticate, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    const { id } = req.params;
    const { error } = await req.supabase.from('webinars').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  app.post("/api/admin/reviews", authenticate, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    const { data, error } = await req.supabase.from('reviews').insert([req.body]).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  app.put("/api/admin/reviews/:id", authenticate, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    const { id } = req.params;
    const { error } = await req.supabase.from('reviews').update(req.body).eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  app.delete("/api/admin/reviews/:id", authenticate, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    const { id } = req.params;
    const { error } = await req.supabase.from('reviews').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  app.post("/api/admin/logo", authenticate, (req: any, res: any, next: any) => {
    upload.single('logo')(req, res, (err) => {
      if (err) return res.status(400).json({ error: err.message });
      next();
    });
  }, async (req: any, res: any) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    const logoUrl = `/uploads/logo/logo.png?v=${Date.now()}`;
    res.json({ success: true, url: logoUrl });
  });

  // Global Error Handler
  app.use("/api", (err: any, req: any, res: any, next: any) => {
    metrics.errors++;
    logger.error({ err }, "Unhandled API Error");
    res.status(500).json({ error: "Internal Server Error" });
  });

  // Vite Integration
  if (process.env.NODE_ENV === "production") {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    const { injectMetaTags } = await import("./src/utils/seoRoutes");
    app.get("*", (req, res) => {
      const indexPath = path.join(distPath, "index.html");
      if (fs.existsSync(indexPath)) {
        let html = fs.readFileSync(indexPath, 'utf8');
        html = injectMetaTags(html, req.path);
        const injection = `
          <script>
            globalThis._SUPABASE_URL = "${process.env.VITE_SUPABASE_URL || ''}";
            globalThis._SUPABASE_ANON_KEY = "${process.env.VITE_SUPABASE_ANON_KEY || ''}";
          </script>
        `;
        html = html.replace('</head>', `${injection}</head>`);
        res.send(html);
      } else {
        res.status(404).send("Not found");
      }
    });
  } else {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(async (req, res, next) => {
      if (req.method === 'GET' && req.headers.accept?.includes('text/html')) {
        const indexPath = path.join(__dirname, "index.html");
        let html = fs.readFileSync(indexPath, 'utf8');
        html = await vite.transformIndexHtml(req.url, html);
        const injection = `<script>globalThis._SUPABASE_URL = "${process.env.VITE_SUPABASE_URL || ''}";globalThis._SUPABASE_ANON_KEY = "${process.env.VITE_SUPABASE_ANON_KEY || ''}";</script>`;
        html = html.replace('</head>', `${injection}</head>`);
        return res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      }
      next();
    });
    app.use(vite.middlewares);
  }

  app.listen(3000, "0.0.0.0", () => console.log("IFXTrades Hub API running on port 3000"));
}

await startServer();
