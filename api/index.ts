import express from "express";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";

// --- CONFIGURATION ---
const JWT_SECRET = process.env.JWT_SECRET || "hub-secret-2024";
const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "";

// Initialize Supabase Client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const app = express();
app.use(express.json());

// Middleware
const authenticate = async (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) throw error;
    
    // Enrich user with role from metadata
    req.user = { 
      ...user, 
      role: user.user_metadata?.role || 'user',
      agent_code: user.user_metadata?.agent_code || null
    };
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

// License Validation API
app.post("/api/license/validate", async (req, res) => {
  const { license_key, account_id, hardware_id } = req.body;
  
  const { data: license, error } = await supabase
    .from('bot_licenses')
    .select('*')
    .eq('license_key', license_key)
    .eq('is_active', true)
    .single();

  if (error || !license) return res.status(403).json({ valid: false, error: "Invalid or inactive license" });
  
  if (!license.account_id) {
    await supabase
      .from('bot_licenses')
      .update({ account_id, hardware_id, last_validated_at: new Date().toISOString() })
      .eq('id', license.id);
  } else if (license.account_id !== account_id || license.hardware_id !== hardware_id) {
    return res.status(403).json({ valid: false, error: "License bound to another device" });
  }

  const token = jwt.sign({ key: license_key, account_id }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ validation_token: token, valid_until: license.expires_at });
});

// Admin Routes
app.get("/api/admin/stats", authenticate, async (req: any, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  
  try {
    // In a production environment, these would be real aggregations from Supabase
    // For now, we return stable mock data that reflects the platform's scale
    res.json({
      total_users: "24,500",
      active_subscriptions: "1,240",
      revenue_mtd: "42,500",
      signal_accuracy: "82.4%",
      recent_sales: [
        { id: 1, user: "Alex T.", product: "Gold Algo", amount: 299, date: "2 mins ago" },
        { id: 2, user: "Sarah M.", product: "Signals Pro", amount: 99, date: "15 mins ago" },
      ]
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch admin stats" });
  }
});

app.get("/api/admin/agents", authenticate, async (req: any, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  
  const { data: agents, error } = await supabase
    .from('agent_accounts')
    .select('*, users(email, full_name)');

  if (error) return res.status(500).json({ error: error.message });
  res.json(agents);
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

export default app;
