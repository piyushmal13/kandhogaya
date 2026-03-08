import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import pino from "pino";
import rateLimit from "express-rate-limit";

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

// Initialize Supabase Client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- BACKEND SERVICES ---

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
  app.use(express.json());

  // Request Logging Middleware
  app.use((req, res, next) => {
    if (req.url.startsWith('/api')) {
      logger.info({ method: req.method, url: req.url }, "Incoming API Request");
    }
    next();
  });

  // Middleware
  const authenticate = async (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) throw error;
      // Check for admin role in metadata
      req.user = { ...user, role: user.user_metadata?.role || 'user' };
      next();
    } catch (e) {
      res.status(401).json({ error: "Invalid token" });
    }
  };

  // Content Routes
  app.get("/api/content", async (req, res) => {
    const { type } = req.query;
    const { data: posts, error } = await supabase
      .from('content_posts')
      .select('*')
      .eq('content_type', type || 'blog')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(posts);
  });

  // Product Routes
  app.get("/api/products", async (req, res) => {
    const { data: products, error } = await supabase
      .from('products')
      .select('*, product_variants(*)');

    if (error) return res.status(500).json({ error: error.message });
    
    // Format to match frontend expectations if needed
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
      .order('start_time', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    res.json(webinars);
  });

  app.post("/api/webinars/register", authenticate, async (req: any, res) => {
    const { webinar_id, name, email } = req.body;
    
    // 1. Trigger Automated Email Reminders (Mocked)
    console.log(`[EMAIL SERVICE] Sending confirmation to ${email} for webinar ${webinar_id}`);
    console.log(`[EMAIL SERVICE] Scheduled reminders for ${email} at T-24h and T-1h`);

    res.json({ 
      success: true, 
      message: "Registered successfully",
      calendar_details: {
        title: "IFXTrades Live Session",
        reminder_sent: true
      }
    });
  });

  // License Validation API (MT5)
  const licenseRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { error: "Too many validation requests from this IP, please try again after 15 minutes" },
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.post("/api/license/validate", licenseRateLimiter, async (req, res) => {
    try {
      const { license_key, account_id, hardware_id } = req.body;
      logger.info({ license_key, account_id }, "Validating license");
      const result = await LicenseService.validate(license_key, account_id, hardware_id);
      if (!result.valid) {
        logger.warn({ license_key, account_id, error: result.error }, "License validation failed");
        return res.status(403).json(result);
      }
      
      const token = jwt.sign({ key: license_key, account_id }, JWT_SECRET, { expiresIn: "1h" });
      logger.info({ license_key, account_id }, "License validated successfully");
      res.json({ validation_token: token, valid_until: result.expires_at });
    } catch (error) {
      logger.error({ err: error }, "Error validating license");
      res.status(500).json({ error: "Internal server error during validation" });
    }
  });

  // User Routes
  app.get("/api/user/licenses", authenticate, async (req: any, res) => {
    // RLS Enforcement: Only fetch licenses belonging to the authenticated user
    const { data: licenses, error } = await supabase
      .from('bot_licenses')
      .select('*, products(name)')
      .eq('user_id', req.user.id);

    if (error) {
      logger.error({ err: error, user_id: req.user.id }, "Error fetching user licenses");
      return res.status(500).json({ error: "Failed to fetch licenses" });
    }
    res.json(licenses);
  });

  // Admin Routes
  app.get("/api/admin/stats", authenticate, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    
    // Mock stats for the dashboard
    res.json({
      total_users: 24500,
      active_subscriptions: 1240,
      revenue_mtd: 42500,
      signal_accuracy: "82.4%"
    });
  });

  app.post("/api/admin/licenses", authenticate, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    
    const { user_id, algo_id, duration_days } = req.body;
    const key = `IFX-${Math.random().toString(36).toUpperCase().substr(2, 4)}-${Math.random().toString(36).toUpperCase().substr(2, 4)}`;
    const expires_at = new Date();
    expires_at.setDate(expires_at.getDate() + (duration_days || 30));

    const { data, error } = await supabase
      .from('bot_licenses')
      .insert({
        user_id,
        algo_id,
        license_key: key,
        expires_at: expires_at.toISOString(),
        is_active: true
      })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  app.post("/api/admin/content", authenticate, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    
    const { title, content_type, body, data } = req.body;
    const slug = title.toLowerCase().replace(/ /g, "-") + "-" + Math.random().toString(36).substr(2, 5);
    
    const { error } = await supabase
      .from('content_posts')
      .insert({
        title,
        slug,
        content_type,
        status: 'published',
        body,
        data: data || {},
        published_at: new Date().toISOString(),
        author_id: req.user.id
      });

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  // Global Error Handler for API routes
  app.use("/api", (err: any, req: any, res: any, next: any) => {
    logger.error({ err, req: { method: req.method, url: req.url } }, "Unhandled API Error");
    res.status(500).json({ error: "Internal Server Error" });
  });

  // Vite Integration
  console.log(`[SERVER] NODE_ENV is: ${process.env.NODE_ENV}`);
  if (process.env.NODE_ENV !== "production") {
    console.log("[SERVER] Starting Vite in middleware mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("[SERVER] Vite middleware attached.");
  } else {
    console.log("[SERVER] Serving static files from dist...");
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => res.sendFile(path.join(__dirname, "dist", "index.html")));
  }

  app.listen(3000, "0.0.0.0", () => console.log("IFXTrades Hub API running on port 3000"));
}

startServer();
