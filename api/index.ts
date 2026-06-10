import express from "express";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";
import { generateText } from "../src/lib/gemini";

const CEO_SEO_SYSTEM_PROMPT = `You are the IFXTrades CEO & SEO Strategic Advisor Agent. You have world-class expertise in digital marketing, SEO, SaaS growth, business strategy, and web optimization.

You have been designed to serve as the ultimate digital strategist. You combine:
1. Google Core Developer & SEO Optimizer Mindset: Highly technical SEO advice, keyword mapping, semantic HTML improvements, schema.org markup, PageSpeed optimization (Core Web Vitals), and click-through rate optimization.
2. Chief Executive Officer (CEO) Growth Mindset: Scaling SaaS products, client acquisition pipelines, algorithmic trading software licensing, and conversion rate optimization.

Guidelines for your replies:
- Keep your tone sharp, authoritative, technical, yet highly engaging (matching premium finance/tech brands like OpenAI, Stripe, or Vercel).
- Use clear Markdown formatting with headers, code blocks (for HTML/JS/CSS optimization snippets), bullet points, and strong emphasis where necessary.
- Proactively suggest concrete SEO strategies, target keywords, sitemap improvements, and marketing ideas for IFXTrades (Trading Intelligence Hub, Gold trading signals, MT5 bots, Academy courses, Webinars).
- If the user asks about general business strategy or quantitative systems, connect it back to organic discovery (SEO) and scaling the business.`;

// --- CONFIGURATION RESOLVERS ---
const getIndexEnv = (key: string, fallback = ""): string => {
  if (typeof process === "undefined" || !process.env) return fallback;
  return process.env[key] || fallback;
};

const getIsProduction = () => getIndexEnv("NODE_ENV") === "production";
const getJwtSecret = () => getIndexEnv("JWT_SECRET") || (getIsProduction() ? "" : "dev-only-jwt-secret");
const getSupabaseUrl = () => getIndexEnv("VITE_SUPABASE_URL", "https://placeholder.supabase.co");
const getSupabaseAnonKey = () => getIndexEnv("VITE_SUPABASE_ANON_KEY", "placeholder");
const getSupabaseServiceKey = () => getIndexEnv("SUPABASE_SERVICE_ROLE_KEY") || undefined;

// Supabase Client Getter
let supabaseInstance: any = null;
const getSupabase = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(
      getSupabaseUrl(),
      getSupabaseServiceKey() || getSupabaseAnonKey(),
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
  }
  return supabaseInstance;
};

// Verify connection at startup
try {
  const { error } = await getSupabase().from('products').select('id').limit(1);
  if (error) {
    console.error("[Vercel API]: Supabase connection failed:", error.message);
  } else {
    console.log("[Vercel API]: Supabase connection successful.");
  }
} catch (e) {
  console.error("[Vercel API]: Supabase connection exception:", e);
}

const app = express();
app.use(express.json());

type AppUserRole = "user" | "admin" | "agent" | "sales_agent" | "support" | "analyst";
const validRoles = new Set<AppUserRole>(["user", "admin", "agent", "sales_agent", "support", "analyst"]);

const normalizeRole = (role: unknown): AppUserRole | null => {
  return typeof role === "string" && validRoles.has(role as AppUserRole)
    ? role as AppUserRole
    : null;
};

const createAuthedSupabaseClient = (token: string) => createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
  global: { headers: { Authorization: `Bearer ${token}` } },
  auth: { persistSession: false, autoRefreshToken: false }
});

const resolveUserRole = async (authUser: any, authedClient: any): Promise<AppUserRole> => {
  const appMetadataRole = normalizeRole(authUser.app_metadata?.role);
  const roleClient = getSupabaseServiceKey() ? getSupabase() : authedClient;

  const { data } = await roleClient
    .from("users")
    .select("role")
    .eq("id", authUser.id)
    .maybeSingle();

  return normalizeRole(data?.role) || appMetadataRole || "user";
};

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    env: {
      hasSupabaseUrl: !!process.env.VITE_SUPABASE_URL,
      hasSupabaseAnonKey: !!process.env.VITE_SUPABASE_ANON_KEY
    }
  });
});

app.get("/api/config", (req, res) => {
  res.json({
    supabaseUrl: process.env.VITE_SUPABASE_URL,
    supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY
  });
});

// Middleware
const authenticate = async (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const authClient = createAuthedSupabaseClient(token);
    const { data: { user }, error } = await authClient.auth.getUser(token);
    if (error || !user) throw error;

    req.supabase = authClient;
    req.user = { ...user, role: await resolveUserRole(user, authClient) };
    next();
  } catch (err) {
    console.error("[Vercel API]: Authentication failure:", err);
    res.status(401).json({ error: "Invalid token" });
  }
};

// Content Routes
app.get("/api/content", async (req, res) => {
  const { type } = req.query;
  const { data: posts, error } = await getSupabase()
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
  const { data: products, error } = await getSupabase()
    .from('products')
    .select('*, product_variants(*)');

  if (error) return res.status(500).json({ error: error.message });
  const formatted = products.map((p: any) => ({
    ...p,
    variants: p.product_variants
  }));
  res.json(formatted);
});

// Webinar Routes
app.get("/api/webinars", async (req, res) => {
  const { data: webinars, error } = await getSupabase()
    .from('webinars')
    .select('*')
    .order('date_time', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json(webinars);
});

app.post("/api/webinars/register", authenticate, async (req: any, res) => {
  const { webinar_id, email } = req.body;
  
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
  
  const { data: license, error } = await getSupabase()
    .from('bot_licenses')
    .select('*')
    .eq('license_key', license_key)
    .eq('is_active', true)
    .single();

  if (error || !license) return res.status(403).json({ valid: false, error: "Invalid or inactive license" });
  
  if (!license.account_id) {
    await getSupabase()
      .from('bot_licenses')
      .update({ account_id, hardware_id, last_validated_at: new Date().toISOString() })
      .eq('id', license.id);
  } else if (license.account_id !== account_id || license.hardware_id !== hardware_id) {
    return res.status(403).json({ valid: false, error: "License bound to another device" });
  }

  const token = jwt.sign({ key: license_key, account_id }, getJwtSecret(), { expiresIn: "1h" });
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
    console.error("[Vercel API]: Admin stats retrieval failure:", error);
    res.status(500).json({ error: "Failed to fetch admin stats" });
  }
});

app.get("/api/admin/agents", authenticate, async (req: any, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  
  const { data: agents, error } = await getSupabase()
    .from('agent_accounts')
    .select('*, users(email, full_name)');

  if (error) return res.status(500).json({ error: error.message });
  res.json(agents);
});

app.post("/api/admin/licenses", authenticate, async (req: any, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  const { user_id, algo_id, duration_days } = req.body;
  const key = `IFX-${Math.random().toString(36).toUpperCase().substring(2, 6)}-${Math.random().toString(36).toUpperCase().substring(2, 6)}`;
  const expires_at = new Date();
  expires_at.setDate(expires_at.getDate() + (duration_days || 30));

  const { data, error } = await getSupabase()
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
  const slug = title.toLowerCase().replaceAll(" ", "-") + "-" + Math.random().toString(36).substring(2, 7);
  
  const { error } = await getSupabase()
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

app.post("/api/ai/advisor", async (req, res) => {
  try {
    const { message, history } = req.body;
    const contents = [];
    if (history && Array.isArray(history)) {
      for (const turn of history) {
        contents.push({
          role: turn.role === "assistant" ? "model" : "user",
          parts: [{ text: turn.content }]
        });
      }
    }

    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const reply = await generateText(CEO_SEO_SYSTEM_PROMPT, contents);
    res.json({ success: true, reply });
  } catch (err: any) {
    console.error("[Vercel API]: AI Advisor Failure:", err);
    res.status(500).json({ error: "Failed to generate advisor response" });
  }
});

export default app;
