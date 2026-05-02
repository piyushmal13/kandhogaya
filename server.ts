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
import Stripe from 'stripe';

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
const isProduction = process.env.NODE_ENV === "production";
const PORT = parseInt(process.env.PORT || "3000", 10);
const JWT_SECRET = process.env.JWT_SECRET || (isProduction ? "" : "dev-only-jwt-secret");
const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "placeholder";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY && 
                          !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("your-service")
  ? process.env.SUPABASE_SERVICE_ROLE_KEY 
  : undefined;

if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
  logger.error("Missing required environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY). Exiting.");
  process.exit(1);
}

if (!JWT_SECRET) {
  logger.error("Missing JWT_SECRET. Set a strong secret before running in production.");
  process.exit(1);
}

if (isProduction && !supabaseServiceKey) {
  logger.warn("SUPABASE_SERVICE_ROLE_KEY is not configured. Admin reconciliation, audit logs, and payment webhooks may be limited by RLS.");
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

// Robust Verification Bridge
const verifyConnection = async () => {
  try {
    const { error } = await supabase.from('products').select('id').limit(1);
    if (error) {
      logger.warn({ error: error.message, hint: error.hint }, "Supabase connectivity warning during startup");
    } else {
      logger.info("Supabase connection established");
    }
  } catch (err) {
    logger.error({ err }, "Supabase initialization crash");
  }
};
verifyConnection();

if (!process.env.STRIPE_SECRET_KEY) {
  logger.warn('STRIPE_SECRET_KEY not configured; payments disabled until configured');
}

let stripeClient: Stripe | null = null;
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-08-16' });
  }
  return stripeClient;
};

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

type AppUserRole = "user" | "admin" | "agent" | "sales_agent" | "support" | "analyst";

const validRoles = new Set<AppUserRole>(["user", "admin", "agent", "sales_agent", "support", "analyst"]);

const normalizeRole = (role: unknown): AppUserRole | null => {
  return typeof role === "string" && validRoles.has(role as AppUserRole)
    ? role as AppUserRole
    : null;
};

const createAuthedSupabaseClient = (token: string) => createClient(supabaseUrl, supabaseAnonKey, {
  global: { headers: { Authorization: `Bearer ${token}` } },
  auth: { persistSession: false, autoRefreshToken: false }
});

const resolveUserRole = async (authUser: any, authedClient: ReturnType<typeof createClient>): Promise<AppUserRole> => {
  const appMetadataRole = normalizeRole(authUser.app_metadata?.role);
  const roleClient = supabaseServiceKey ? supabase : authedClient;

  try {
    const { data, error } = await roleClient
      .from("users")
      .select("role")
      .eq("id", authUser.id)
      .maybeSingle();

    if (error) {
      logger.warn({ userId: authUser.id, code: error.code, message: error.message }, "Could not resolve database role");
    }

    return normalizeRole(data?.role) || appMetadataRole || "user";
  } catch (err) {
    logger.warn({ err, userId: authUser.id }, "Role resolution failed");
    return appMetadataRole || "user";
  }
};

const allowedPaymentCurrencies = new Set(["usd", "inr", "aed"]);

const normalizeCurrency = (currency: unknown) => {
  const normalized = typeof currency === "string" ? currency.toLowerCase() : "usd";
  return allowedPaymentCurrencies.has(normalized) ? normalized : "usd";
};

const toAmountCents = (amount: unknown) => {
  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) return 0;
  return Math.round(numericAmount * 100);
};

const appBaseUrl = () => process.env.APP_URL || process.env.BASE_URL || "http://localhost:3000";

const trustedRedirectUrl = (candidate: unknown, fallbackPath: string) => {
  const base = new URL(appBaseUrl());
  if (typeof candidate !== "string" || candidate.trim().length === 0) {
    return new URL(fallbackPath, base).toString();
  }

  try {
    const parsed = new URL(candidate, base);
    return parsed.origin === base.origin ? parsed.toString() : new URL(fallbackPath, base).toString();
  } catch {
    return new URL(fallbackPath, base).toString();
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
        "connect-src": ["'self'", "https://*.supabase.co", "wss://*.supabase.co", "https://api.twelvedata.com", "https://*.replicate.com"],
        "font-src": ["'self'", "https://fonts.gstatic.com"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));

  // Performance Optimization (Compression)
  app.use(compression());

  app.use(express.json({
    verify: (req: any, res: any, buf: Buffer) => {
      (req as any).rawBody = buf;
    }
  }));

  // CORS: allow configured frontend origins via CORS_ALLOW env (comma-separated).
  const allowedOrigins = (process.env.CORS_ALLOW || '').split(',').map(s => s.trim()).filter(Boolean);
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    const allowOrigin = !origin
      ? ""
      : allowedOrigins.length === 0 || allowedOrigins.includes(origin)
        ? origin
        : "";

    if (allowOrigin) {
      res.setHeader("Access-Control-Allow-Origin", allowOrigin);
      res.setHeader("Vary", "Origin");
      res.setHeader("Access-Control-Allow-Credentials", "true");
    }

    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization,Stripe-Signature");

    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }

    next();
  });

  // Metrics
  const metrics = {
    requests: 0,
    errors: 0,
    startTime: Date.now()
  };

  // Global rate limiter (mild) to protect APIs
  const globalRateLimiter = rateLimit({ windowMs: 60 * 1000, max: 600, standardHeaders: true, legacyHeaders: false });
  app.use('/api', globalRateLimiter);

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

  // Research Config & Flags
  app.get("/api/config", (req, res) => {
    res.json({
      supabaseUrl,
      supabaseAnonKey
    });
  });

  app.get("/api/flags", async (req, res) => {
    try {
      const { data, error } = await supabase.from('feature_flags').select('key, enabled');
      if (error) throw error;
      const flags = (data || []).reduce((acc: any, curr: any) => {
        acc[curr.key] = curr.enabled;
        return acc;
      }, {});
      res.json(flags);
    } catch (err) {
      res.json({ maintenance_mode: false, webinar_registration_open: true });
    }
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
      
      req.supabase = createAuthedSupabaseClient(token);
      const role = await resolveUserRole(authUser, req.supabase);

      req.user = { ...authUser, role };
      next();
    } catch (e: any) {
      const errorMessage = e instanceof Error ? e.message : "Authentication failed";
      logger.warn({ err: e }, errorMessage);
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

  // Product Variant Routes
  app.get("/api/products/:id/variants", async (req, res) => {
    try {
      const { id } = req.params;
      const { data, error } = await supabase.from('product_variants').select('*').eq('product_id', id).order('priority', { ascending: true });
      if (error) return res.status(500).json({ error: error.message });
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch product variants' });
    }
  });

  app.post("/api/admin/products/:id/variants", authenticate, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    try {
      const { id } = req.params; // product id
      const payload = { ...req.body, product_id: id };
      const { data, error } = await req.supabase.from('product_variants').insert([payload]).select().single();
      if (error) return res.status(500).json({ error: error.message });
      await logAudit(req.supabase, req.user.id, 'CREATE', 'product_variant', data.id, payload);
      res.json({ success: true, variant: data });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to create variant' });
    }
  });

  app.put("/api/admin/products/:productId/variants/:variantId", authenticate, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    try {
      const { productId, variantId } = req.params;
      const { error } = await req.supabase.from('product_variants').update(req.body).eq('id', variantId).eq('product_id', productId);
      if (error) return res.status(500).json({ error: error.message });
      await logAudit(req.supabase, req.user.id, 'UPDATE', 'product_variant', variantId, req.body);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to update variant' });
    }
  });

  app.delete("/api/admin/products/:productId/variants/:variantId", authenticate, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    try {
      const { productId, variantId } = req.params;
      const { error } = await req.supabase.from('product_variants').delete().eq('id', variantId).eq('product_id', productId);
      if (error) return res.status(500).json({ error: error.message });
      await logAudit(req.supabase, req.user.id, 'DELETE', 'product_variant', variantId);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to delete variant' });
    }
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

  // Banner Routes - public fetch + admin management
  app.get("/api/banners", async (req, res) => {
    try {
      const placement = req.query.placement;
      let query = supabase.from('banners').select('*').eq('is_active', true);
      if (placement) query = query.eq('placement', placement as string);
      const { data, error } = await query.order('priority', { ascending: false });
      if (error) return res.status(500).json({ error: error.message });
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch banners" });
    }
  });

  app.post("/api/admin/banners", authenticate, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    const { data, error } = await req.supabase.from('banners').insert([req.body]).select().single();
    if (error) return res.status(500).json({ error: error.message });
    await logAudit(req.supabase, req.user.id, 'CREATE', 'banner', data.id, req.body);
    res.json({ success: true, banner: data });
  });

  app.put("/api/admin/banners/:id", authenticate, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    const { id } = req.params;
    const { error } = await req.supabase.from('banners').update(req.body).eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    await logAudit(req.supabase, req.user.id, 'UPDATE', 'banner', id, req.body);
    res.json({ success: true });
  });

  app.delete("/api/admin/banners/:id", authenticate, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    const { id } = req.params;
    const { error } = await req.supabase.from('banners').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    await logAudit(req.supabase, req.user.id, 'DELETE', 'banner', id);
    res.json({ success: true });
  });

  app.post("/api/admin/reviews", authenticate, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    const { error } = await req.supabase.from('reviews').insert([req.body]).select().single();
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

  // Payments: create payment intent (authenticated users)
  app.post('/api/payments/create-intent', authenticate, async (req: any, res) => {
    const stripe = getStripe();
    if (!stripe) return res.status(503).json({ error: 'Stripe not configured' });
    try {
      const { product_id, variant_id, amount, currency = 'usd', affiliate_code } = req.body;
      let amountCents = 0;
      if (product_id) {
        const { data: product, error } = await req.supabase.from('products').select('id, price').eq('id', product_id).single();
        if (error || !product) return res.status(400).json({ error: 'Product not found' });
        amountCents = toAmountCents(product.price);
      } else if (amount) {
        amountCents = toAmountCents(amount);
      } else {
        return res.status(400).json({ error: 'Missing amount or product_id' });
      }

      if (amountCents < 50) {
        return res.status(400).json({ error: 'Payment amount is invalid' });
      }

      const paymentCurrency = normalizeCurrency(currency);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountCents,
        currency: paymentCurrency,
        metadata: {
          user_id: req.user?.id || null,
          product_id: product_id || null,
          variant_id: variant_id || null,
          affiliate_code: affiliate_code || null
        }
      });

      // record payment in DB (best-effort)
      try {
        const { data: paymentRecord, error } = await req.supabase.from('payments').insert({
          stripe_payment_intent_id: paymentIntent.id,
          user_id: req.user?.id || null,
          amount: amountCents,
          currency: paymentCurrency,
          status: paymentIntent.status,
          affiliate_code
        }).select().single();
        if (error) logger.error({ err: error }, 'Failed to insert payment record');
      } catch (e: any) {
        logger.error({ err: e }, 'Payments table insert failed');
      }

      await logAudit(req.supabase, req.user?.id || 'system', 'CREATE', 'payment', paymentIntent.id, { amount: amountCents });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (err: any) {
      logger.error({ err }, 'Create payment intent failed');
      res.status(500).json({ error: err.message || 'Failed to create payment intent' });
    }
  });

      // Create a Stripe Checkout Session and return a redirect URL
      app.post('/api/payments/create-checkout-session', authenticate, async (req: any, res) => {
        const stripe = getStripe();
        if (!stripe) return res.status(503).json({ error: 'Stripe not configured' });
        try {
          const { product_id, amount, currency = 'usd', affiliate_code, success_url, cancel_url } = req.body;
          let priceCents = 0;
          let name = 'Purchase';
          if (product_id) {
            const { data: product, error } = await req.supabase.from('products').select('id, name, price').eq('id', product_id).single();
            if (error || !product) return res.status(400).json({ error: 'Product not found' });
            priceCents = toAmountCents(product.price);
            name = product.name || name;
          } else if (amount) {
            priceCents = toAmountCents(amount);
          } else {
            return res.status(400).json({ error: 'Missing amount or product_id' });
          }

          if (priceCents < 50) {
            return res.status(400).json({ error: 'Payment amount is invalid' });
          }

          const paymentCurrency = normalizeCurrency(currency);

          const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
              {
                price_data: {
                  currency: paymentCurrency,
                  product_data: { name },
                  unit_amount: priceCents
                },
                quantity: 1
              }
            ],
            mode: 'payment',
            success_url: process.env.STRIPE_SUCCESS_URL || trustedRedirectUrl(success_url, '/payments/success'),
            cancel_url: process.env.STRIPE_CANCEL_URL || trustedRedirectUrl(cancel_url, '/payments/cancel'),
            metadata: { user_id: req.user?.id || null, product_id, affiliate_code }
          });

          try {
            await req.supabase.from('payments').insert({
              stripe_payment_intent_id: session.payment_intent || session.id,
              user_id: req.user?.id || null,
              amount: priceCents,
              currency: paymentCurrency,
              status: 'created',
              affiliate_code,
              metadata: { stripe_session: session }
            });
          } catch (e: any) {
            logger.error({ err: e }, 'Failed to record checkout session');
          }

          res.json({ url: session.url });
        } catch (err: any) {
          logger.error({ err }, 'Create checkout session failed');
          res.status(500).json({ error: err.message || 'Failed to create checkout session' });
        }
      });

  // Stripe Webhook endpoint (verify signature)
  app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req: any, res) => {
    const stripe = getStripe();
    if (!stripe) return res.status(503).send('Stripe not configured');
    const sig = req.headers['stripe-signature'] as string | undefined;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) return res.status(400).send('Webhook secret not configured');
    try {
      const raw = (req as any).rawBody || req.body;
      const event = stripe.webhooks.constructEvent(raw, sig || '', webhookSecret);

      if (event.type === 'payment_intent.succeeded') {
        const pi: any = event.data.object;
        const intentId = pi.id;
        await supabase.from('payments').update({ status: 'succeeded', raw: pi }).eq('stripe_payment_intent_id', intentId);
        await logAudit(supabase, 'system', 'UPDATE', 'payment', intentId, { status: 'succeeded' });
      } else if (event.type === 'payment_intent.payment_failed') {
        const pi: any = event.data.object;
        const intentId = pi.id;
        await supabase.from('payments').update({ status: 'failed', raw: pi }).eq('stripe_payment_intent_id', intentId);
        await logAudit(supabase, 'system', 'UPDATE', 'payment', intentId, { status: 'failed' });
      } else if (event.type === 'checkout.session.completed') {
        const session: any = event.data.object;
        const recordIds = [session.id, session.payment_intent].filter(Boolean);
        await supabase
          .from('payments')
          .update({ status: 'succeeded', raw: session })
          .in('stripe_payment_intent_id', recordIds);
        await logAudit(supabase, 'system', 'UPDATE', 'payment', session.id, { status: 'succeeded', source: 'checkout.session.completed' });
      } else {
        logger.info({ event: event.type }, 'Unhandled stripe event');
      }
      res.json({ received: true });
    } catch (err: any) {
      logger.error({ err }, 'Stripe webhook error');
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
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
    // Serve static assets first with absolute path resolution
    app.use(express.static(distPath, {
      index: false,
      maxAge: '1y',
      immutable: true,
      fallthrough: true
    }));

    // Prevent MIME type mismatch (text/html) for missing JS/CSS chunks
    app.get(/.*\.(js|css|png|jpg|jpeg|gif|svg|ico|json|map|webmanifest)/, (req: any, res: any) => {
      res.status(404).json({ error: "Asset not found" });
    });
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

  // Graceful shutdown and global error handlers
  const shutdown = async (signal: string) => {
    logger.info({ signal }, 'Shutting down server');
    try {
      // TODO: close DB connections, flush logs, finish background jobs
      setTimeout(() => process.exit(0), 250);
    } catch (e: any) {
      logger.error({ err: e }, 'Error during shutdown');
      process.exit(1);
    }
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('uncaughtException', (err) => { logger.error({ err }, 'uncaughtException'); process.exit(1); });
  process.on('unhandledRejection', (reason) => { logger.error({ reason }, 'unhandledRejection'); });

  app.listen(PORT, "0.0.0.0", () => console.log(`IFXTrades Hub API running on port ${PORT}`));
}

await startServer();
