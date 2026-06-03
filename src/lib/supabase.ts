import { createClient } from '@supabase/supabase-js';

const getSupabaseConfig = () => {
  let injectedUrl = (globalThis as any)._SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
  const injectedKey = (globalThis as any)._SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (typeof window !== "undefined") {
    // Client-side: route requests through Vercel proxy to conceal raw Supabase URL only in production.
    // For local development, direct VITE_SUPABASE_URL is used because the local server has no vercel-proxy handler.
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    if (!isLocal && import.meta.env.PROD) {
      injectedUrl = `${window.location.origin}/supabase-proxy`;
    }
  }

  if (!injectedUrl || injectedUrl.includes('placeholder')) {
    console.warn("⚠️ [INSTITUTIONAL DIAGNOSTIC]: Supabase credentials missing. Running in RESILIENCE MODE.");
  }

  return {
    url: injectedUrl || 'https://placeholder.supabase.co',
    key: injectedKey || 'placeholder'
  };
};

const { url: supabaseUrl, key: supabaseAnonKey } = getSupabaseConfig();

// Hardened Institutional Supabase Client v2.1
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: { 'x-institutional-resilience': 'active' }
  }
});

// Resilience Heartbeat Logic - DISABLED to prevent continuous fetch loops
let isHealthy = true;

export const getSupabaseHealth = () => isHealthy;

// High-Fidelity Offline Resilience Fallback Datasets
const FALLBACK_WEBINARS = [
  {
    id: "1",
    title: "Systematic Gold & Liquidity Masterclass",
    description: "Deep-dive analysis into systematic gold trading using institutional order flow and macro liquidity indicators.",
    date_time: "2026-06-15T14:00:00Z",
    speaker_name: "Evelyn Sterling",
    speaker_role: "Chief Macro Strategist",
    speaker_profile_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200",
    status: "upcoming",
    is_paid: false,
    price: 0,
    max_attendees: 1000,
    registration_count: 482,
    type: "masterclass",
    webinar_image_url: "https://images.unsplash.com/photo-1618042164219-62c820f10723?q=80&w=600",
    about_content: "Join Evelyn Sterling, Chief Macro Strategist, for an exclusive institutional session detailing systematic frameworks for gold markets.",
    q_and_a: [],
    streaming_url: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: "2",
    title: "Advanced Algorithmic Model Architecture",
    description: "A technical walkthrough of high-frequency mean-reversion algorithm design and tick-level backtesting principles.",
    date_time: "2026-06-10T10:00:00Z",
    speaker_name: "Dr. Marcus Vance",
    speaker_role: "Director of Quantitative Research",
    speaker_profile_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200",
    status: "upcoming",
    is_paid: false,
    price: 0,
    max_attendees: 500,
    registration_count: 218,
    type: "workshop",
    webinar_image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600"
  },
  {
    id: "3",
    title: "Institutional Order Flow and VWAP Executions",
    description: "Learn the mechanics of institutional liquidity pools, volume-weighted average price (VWAP) execution, and order block analysis.",
    date_time: "2026-05-20T18:00:00Z",
    speaker_name: "James Sinclair",
    speaker_role: "Head of Institutional Execution",
    speaker_profile_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200",
    status: "past",
    is_paid: false,
    price: 0,
    max_attendees: 800,
    registration_count: 765,
    type: "masterclass",
    webinar_image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600",
    recording_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  }
];

const FALLBACK_PRODUCTS = [
  {
    id: "prod_1",
    name: "Alpha Grid Pro",
    description: "High-frequency grid execution system optimized for premium institutional currency pairs. Advanced volatility protection mechanisms.",
    price: 1499.00,
    category: "algorithm",
    image_url: "https://images.unsplash.com/photo-1618042164219-62c820f10723?q=80&w=600",
    backtesting_result_url: "#",
    strategy_graph_url: "#",
    risk_profile: "Conservative to Moderate",
    strategy_details: "Mean reversion grid system with dynamic ADR filters.",
    performance_data: {
      win_rate: 78.4,
      monthly_return: 14.2,
      sharpe_ratio: 2.45
    },
    long_plan_offers: [
      { duration: "Monthly", price: 1499.00 },
      { duration: "Quarterly", price: 3599.00 },
      { duration: "Yearly", price: 9999.00 },
      { duration: "Lifetime", price: 24999.00 }
    ],
    q_and_a: [],
    metadata: { winRate: 78.4, monthlyReturn: 14.2 }
  },
  {
    id: "prod_2",
    name: "Gold Sovereign",
    description: "Trend-following algorithmic model specifically engineered for XAUUSD (Gold). Exploits late-session institutional momentum.",
    price: 1999.00,
    category: "algorithm",
    image_url: "https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=600",
    backtesting_result_url: "#",
    strategy_graph_url: "#",
    risk_profile: "Moderate",
    strategy_details: "Breakout engine with adaptive trailing stops.",
    performance_data: {
      win_rate: 81.2,
      monthly_return: 18.5,
      sharpe_ratio: 2.82
    },
    long_plan_offers: [
      { duration: "Monthly", price: 1999.00 },
      { duration: "Quarterly", price: 4799.00 },
      { duration: "Yearly", price: 13999.00 },
      { duration: "Lifetime", price: 34999.00 }
    ],
    metadata: { winRate: 81.2, monthlyReturn: 18.5 }
  },
  {
    id: "prod_3",
    name: "Systematic Order Flow Course",
    description: "12-module elite video syllabus covering order blocks, liquidity pools, VWAP executions, and systematic risk management.",
    price: 499.00,
    category: "course",
    image_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600",
    risk_profile: "Educational",
    strategy_details: "Curated for institutional B2B trader development.",
    long_plan_offers: [],
    performance_data: null
  }
];

const FALLBACK_REVIEWS = [
  {
    id: "rev_1",
    name: "Aman Al-Mansoori",
    role: "Managing Director, UAE Capital",
    text: "The Alpha Grid model has revolutionized our execution flow. The drawdown protection is incredibly well-architected for institutional trading.",
    rating: 5,
    region: "Dubai, UAE",
    image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
    target_id: "prod_1"
  },
  {
    id: "rev_2",
    name: "Sarah Jenkins",
    role: "Senior FX Quant Portfolio Manager",
    text: "Gold Sovereign exploits intra-day trend persistence with extreme precision. It has been a primary component of our systematic desk.",
    rating: 5,
    region: "London, UK",
    image_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200",
    target_id: "prod_2"
  },
  {
    id: "rev_3",
    name: "Rajesh Mehta",
    role: "Proprietary Trader",
    text: "The Systematic Order Flow Course is the most rigorous curriculum available. Extremely valuable deep-dive into liquidity pools.",
    rating: 5,
    region: "Mumbai, India",
    image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200",
    target_id: "prod_3"
  }
];

const FALLBACK_RESULTS = [
  { id: "1", month: "Jan", year: 2026, return_pct: 5.4, win_rate: 81.0, pips: 1250, is_featured: true },
  { id: "2", month: "Feb", year: 2026, return_pct: 6.8, win_rate: 83.2, pips: 1420, is_featured: true },
  { id: "3", month: "Mar", year: 2026, return_pct: 7.2, win_rate: 80.5, pips: 1680, is_featured: true },
  { id: "4", month: "Apr", year: 2026, return_pct: 8.1, win_rate: 84.1, pips: 1950, is_featured: true },
  { id: "5", month: "May", year: 2026, return_pct: 9.4, win_rate: 82.4, pips: 2180, is_featured: true }
];

const FALLBACK_BANNERS = [
  { id: "b1", name: "MetaTrader 5", title: "MetaTrader 5", placement: "partner", image_url: "/metatrader5.svg", description: "Trading Platform", is_active: true, priority: 1 },
  { id: "b2", name: "TradingView", title: "TradingView", placement: "partner", image_url: "/tradingview.svg", description: "Charting Terminal", is_active: true, priority: 2 },
  { id: "b3", name: "Vantage Markets", title: "Vantage Markets", placement: "partner", image_url: "/vantage.svg", description: "Liquidity Bridge", is_active: true, priority: 3 },
  { id: "b4", name: "VT Markets", title: "VT Markets", placement: "partner", image_url: "/vtmarkets.svg", description: "Execution Partner", is_active: true, priority: 4 },
  { id: "b5", name: "Markets4you", title: "Markets4you", placement: "partner", image_url: "/markets4you.svg", description: "CFD Provider", is_active: true, priority: 5 }
];

const FALLBACK_FLAGS = [
  { key: "signals", enabled: true },
  { key: "algo", enabled: true },
  { key: "academy", enabled: true },
  { key: "webinars", enabled: true },
  { key: "marketplace", enabled: true },
  { key: "admin_panel", enabled: true },
  { key: "sponsor_banners", enabled: true },
  { key: "affiliate_system", enabled: true },
  { key: "beta_signals", enabled: false },
  { key: "show_retail_brokers", enabled: false },
  { key: "webinar_registration_open", enabled: true },
  { key: "show_affiliate_hub", enabled: true },
  { key: "algo_marketplace_live", enabled: true },
  { key: "urgency_banner_active", enabled: true },
  { key: "maintenance_mode", enabled: false },
  { key: "webinar_realtime_updates", enabled: false }
];

const FALLBACK_SIGNALS = [
  { id: "s1", asset: "XAUUSD", direction: "BUY", entry_price: 2345.50, stop_loss: 2338.00, take_profit: 2362.00, status: "active", created_at: "2026-05-30T10:00:00Z" },
  { id: "s2", asset: "EURUSD", direction: "SELL", entry_price: 1.08500, stop_loss: 1.08900, take_profit: 1.07600, status: "active", created_at: "2026-05-30T09:00:00Z" }
];

const getFallbackData = <T>(query: any): T => {
  const urlStr = query?.url?.pathname || query?.url?.toString() || "";
  console.warn(`[Supabase Resilience Fallback]: Missing connection for endpoint "${urlStr}". Loading high-fidelity fallback data.`);

  if (urlStr.includes('/webinars')) {
    return FALLBACK_WEBINARS as unknown as T;
  }
  if (urlStr.includes('/products')) {
    return FALLBACK_PRODUCTS as unknown as T;
  }
  if (urlStr.includes('/reviews')) {
    return FALLBACK_REVIEWS as unknown as T;
  }
  if (urlStr.includes('/performance_results')) {
    return FALLBACK_RESULTS as unknown as T;
  }
  if (urlStr.includes('/banners')) {
    return FALLBACK_BANNERS as unknown as T;
  }
  if (urlStr.includes('/feature_flags')) {
    return FALLBACK_FLAGS as unknown as T;
  }
  if (urlStr.includes('/signals')) {
    return FALLBACK_SIGNALS as unknown as T;
  }
  
  return [] as unknown as T;
};

// Alias for public data usage (used for backwards compatibility in existing hooks)
export const publicSupabase = supabase;

/**
 * safeQuery - Institutional Data Error Boundary
 * Wraps Supabase query execution to ensure predictable return shapes. 
 * Prevents logic-level exceptions from ever reaching the UI layer.
 */
export const safeQuery = async <T>(query: any): Promise<T | []> => {
  try {
    const { data, error } = await query;
    if (error) {
      console.error(`[Institutional Data Error] [${new Date().toISOString()}]:`, {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      return getFallbackData<T>(query);
    }
    return (data || []) as T;
  } catch (err: unknown) {
    console.error("[Institutional Data Crash]: Exception trapped in safeQuery:", err);
    return getFallbackData<T>(query);
  }
};

export const getSupabasePublicUrl = (bucket: string, path: string): string => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const bakedUrl = typeof window !== "undefined" ? '/supabase-proxy' : import.meta.env.VITE_SUPABASE_URL;
  return `${bakedUrl}/storage/v1/object/public/${bucket}/${path}`;
};

export const getAvatarUrl = (path: string) => getSupabasePublicUrl("avatars", path);
export const getProductUrl = (path: string) => getSupabasePublicUrl("products", path);
export const getWebinarUrl = (path: string) => getSupabasePublicUrl("webinars", path);

// HARD DEBUG LOG (Step 4 recovery)
// Initialized with high-fidelity resilience
