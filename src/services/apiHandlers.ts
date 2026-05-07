import { supabase, safeQuery } from "../lib/supabase";
import {
  Signal, Product, Blog, Course
} from "../types";

import { webinarService } from "./webinarService";
import { productService } from "./productService";
import { marketService } from "./marketService";
import { faqService } from "./faqService";
import { bannerService } from "./bannerService";
import { CRMService } from "../core/crmService";

/**
 * Institutional Reliability Wrappers
 */
const withTimeout = async <T>(promise: PromiseLike<T>, ms = 5000): Promise<T> => {
  let timeoutId: any;

  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error("timeout")), ms);
  });

  return Promise.race([
    Promise.resolve(promise).finally(() => clearTimeout(timeoutId)),
    timeout,
  ]);
};

const safeExecute = async (
  fn: () => PromiseLike<any> | Promise<any>,
  retries = 1
): Promise<any> => {
  try {
    const res = await fn();

    if (res?.error) throw res.error;

    return res;
  } catch {
    if (retries > 0) return safeExecute(fn, retries - 1);
    throw new Error("Operation failed");
  }
};

// --- WEBINARS ---

export const getWebinars = async () => {
  return webinarService.getWebinars();
};

export const getWebinarById = async (id: string) => {
  return webinarService.getWebinarById(id);
};

export const checkWebinarRegistration = async (webinarId: string, userId: string) => {
  const { data, error } = await supabase
    .from("webinar_registrations")
    .select("id")
    .eq("webinar_id", webinarId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    return false;
  }
  return !!data;
};

// --- SIGNALS ---

export const getSignals = async () => {
  return safeQuery<Signal[]>(
    supabase
      .from("signals")
      .select("id, asset, direction, entry_price, stop_loss, take_profit, status, created_at")
      .order("created_at", { ascending: false })
      .limit(50)
  );
};

// --- ALGORITHMS / PRODUCTS ---

export const getProducts = async () => {
  return productService.getProducts();
};

export const getProductById = async (id: string) => {
  const { data, error } = await supabase
    .from("algorithms")
    .select("id, name, description, price, image_url, created_at, risk_classification, monthly_roi_pct, min_capital, slug")
    .eq("id", id)
    .maybeSingle();
  
  if (error) {
    return null;
  }
  return data as unknown as Product;
};

export const subscribeToAlgo = async (userId: string, algoId: string, durationDays: number) => {
  try {
    const key = `IFX-${Math.random().toString(36).toUpperCase().substring(2, 6)}-${Math.random().toString(36).toUpperCase().substring(2, 6)}`;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + durationDays);

    const res = await safeExecute(() =>
      withTimeout(
        supabase.from('bot_licenses').insert({
          user_id: userId,
          algo_id: algoId,
          status: 'active',
          starts_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString()
        }).select().maybeSingle()
      )
    );

    const data = res?.data ?? null;

    return {
      success: true,
      data: data ?? null
    };
  } catch {
    return {
      success: false,
      error: "Something went wrong. Please try again."
    };
  }
};

// --- BLOG / CONTENT ---

export const getBlogPosts = async (page = 0, pageSize = 9, searchQuery = "") => {
  try {
    let query = supabase
      .from('content_posts')
      .select('id, author_name, category, title, slug, featured_image_url, created_at, excerpt, body')
      .order('created_at', { ascending: false })
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (searchQuery) {
      query = query.ilike('title', `%${searchQuery}%`);
    }

    const posts = await safeQuery<any[]>(query);
    if (!posts || posts.length === 0) {
      return [];
    }
    // Map body to content for UI
    return posts.map(p => ({
      ...p,
      content: p.body
    }));
  } catch (err) {
    console.error("Institutional Blog Fetch Error:", err);
    return [];
  }
};


export const getBlogPostBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('content_posts')
    .select('id, author_name, category, title, slug, body as content, featured_image_url, created_at, excerpt')
    .eq('slug', slug)
    .single();

  if (error) {
    return null;
  }
  return data as Blog;
};

// --- ACADEMY / COURSES ---

export const getCourses = async () => {
  try {
    const res = await safeQuery<Course[]>(
      supabase
        .from("courses")
        .select("*, chapters:lessons(*)")
        .order("created_at", { ascending: false })
    );

    return res || [];
  } catch (err) {
    console.error("Institutional Academy Course Error:", err);
    return [];
  }
};


export const getCourseById = async (id: string) => {
  const { data, error } = await supabase
    .from("courses")
    .select("*, chapters:lessons(*)")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return null;
  }
  return data as Course;
};

export const checkUserAccess = async (userId: string, itemId: string) => {
  const { data, error } = await supabase
    .from("course_enrollments")
    .select("id")
    .eq("user_id", userId)
    .eq("course_id", itemId)
    .maybeSingle();
  
  if (error) return false;
  return !!data;
};

// --- REALTIME ---

export const subscribeToSignals = (callback: (payload: unknown) => void) => {
  return supabase
    .channel('public:signals')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'signals' }, callback)
    .subscribe();
};

export const subscribeToWebinars = (callback: (payload: unknown) => void) => {
  return supabase
    .channel('public:webinars')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'webinars' }, callback)
    .subscribe();
};

// --- AGENTS & SALES ---

export const getAgentStats = async (agentId: string) => {
  const { data: sales, error: salesError } = await supabase
    .from("sales_tracking")
    .select("id, sale_amount, created_at")
    .eq("agent_id", agentId);

  if (salesError) return { totalSales: 0, revenue: 0, referrals: 0 };

  const revenue = (sales || []).reduce((acc, sale) => acc + (sale.sale_amount || 0), 0);
  
  const { count: referrals } = await supabase
    .from("users")
    .select("*", { count: 'exact', head: true })
    .eq("referred_by", agentId);

  return {
    totalSales: (sales || []).length,
    revenue,
    referrals: referrals || 0
  };
};

export const trackSale = async (agentId: string, userId: string, productId: string, amount: number) => {
  try {
    const res = await safeExecute(() =>
      withTimeout(
        supabase
          .from("sales_tracking")
          .insert({
            agent_id: agentId,
            user_id: userId,
            product_id: productId,
            sale_amount: amount
          }).select().maybeSingle()
      )
    );

    const data = res?.data ?? null;

    return {
      success: true,
      data: data ?? null
    };
  } catch {
    return {
      success: false,
      error: "Something went wrong. Please try again."
    };
  }
};

export const sendContactMessage = async (name: string, email: string, subject: string, message: string) => {
  try {
    await safeExecute(() =>
      withTimeout(
        CRMService.captureInquiry({ name, email, subject, message })
      )
    );
    return {
      success: true
    };
  } catch (err) {
    console.error("Institutional Contact Signal Error:", err);
    return {
      success: false,
      error: "Something went wrong. Please try again."
    };
  }
};

export const subscribeToNewsletter = async (email: string) => {
  try {
    await safeExecute(() =>
      withTimeout(
        CRMService.captureLead(email, "Newsletter_Subscription")
      )
    );
    return {
      success: true
    };
  } catch {
    return {
      success: false,
      error: "Something went wrong. Please try again."
    };
  }
};

export const submitPaymentProof = async (userId: string, plan: string, amount: number, screenshotUrl: string) => {
  // 1. Structural Signal Validation
  if (!userId || !plan || !screenshotUrl || amount <= 0) {
    return { success: false, error: "Invalid payment signal. All fields are required." };
  }

  try {
    // 2. Performance Discovery: Prevent Spam Toggles
    const { data: existing } = await supabase
      .from("payment_proofs")
      .select("id")
      .eq("user_id", userId)
      .eq("status", "pending")
      .maybeSingle();

    if (existing) {
      return { success: false, error: "Active fulfillment signal already exists. Awaiting institutional approval." };
    }

    // 3. Fulfill Discovery: Register Proof Signal
    const { error } = await supabase
      .from("payment_proofs")
      .insert([{
        user_id: userId,
        plan,
        amount,
        proof_url: screenshotUrl,
        status: "pending"
      }]);

    if (error) throw error;

    return { success: true };
  } catch (err) {
    console.error("Institutional Payment Proof Signal: Submission failed.", err);
    return { success: false, error: "Communication signal lost. Please retry artifact discovery." };
  }
};

export const registerForWebinar = async (webinarId: string, userId: string, email: string) => {
  try {
    const { data: existing } = await supabase
      .from('webinar_registrations')
      .select('id')
      .eq('webinar_id', webinarId)
      .eq('user_id', userId)
      .maybeSingle();

    if (existing) return { success: true, alreadyRegistered: true };

    // Get webinar title for better CRM context
    const { data: webinar } = await supabase.from("webinars").select("title").eq("id", webinarId).maybeSingle();

    await safeExecute(() =>
      withTimeout(
        CRMService.registerForWebinar(userId, webinarId, email, webinar?.title)
      )
    );

    safeExecute(() =>
      supabase.rpc('increment_webinar_registrations', { webinar_id: webinarId })
    ).catch(() => {});

    return {
      success: true
    };
  } catch (err) {
    console.error("Institutional Webinar Registration Error:", err);
    return {
      success: false,
      error: "Something went wrong. Please try again."
    };
  }
};


// --- MARKET DATA ---

export const getMarketData = async () => {
  return marketService.getMarketPairs();
};

export const subscribeToMarketData = (callback: (payload: any) => void) => {
  return supabase
    .channel('public:market_data')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'market_data' }, callback)
    .subscribe();
};

// --- PERFORMANCE RESULTS ---

export const getPerformanceResults = async () => {
  return safeQuery<any[]>(
    supabase
      .from("performance_results")
      .select("id, win_rate, monthly_return, drawdown, total_trades, created_at")
      .order("created_at", { ascending: true })
  );
};
// --- REVIEWS / SOCIAL PROOF ---

export const getReviews = async (limit = 10) => {
  const { data, error } = await supabase
    .from("reviews")
    .select("id, name, role, text, rating, region, image_url, created_at")
    .eq("status", "approved")
    .order("priority", { ascending: false })
    .limit(limit);

  if (error) return [];
  return data.map((r: any) => ({
    id: r.id,
    name: r.name || "Institutional Client",
    role: r.role || "Elite Trader",
    feedback: r.text,
    location: r.region || "Confidential",
    rating: r.rating || 5,
    image_url: r.image_url
  }));
};

// --- FAQ ---

export const getFaqs = async (limit = 10) => {
  return faqService.getFaqs(limit);
};

// --- BANNERS ---

export const getBanners = async (placement?: string) => {
  return bannerService.getBanners(placement);
};
