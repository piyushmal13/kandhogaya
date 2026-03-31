import { supabase, safeQuery } from "../lib/supabase";
import {
  Webinar, Signal, Product, Blog, Course
} from "../types";

import { webinarService } from "./webinarService";
import { productService } from "./productService";
import { marketService } from "./marketService";

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
      .select("*")
      .order("created_at", { ascending: false })
  );
};

// --- ALGORITHMS / PRODUCTS ---

export const getProducts = async () => {
  return productService.getProducts();
};

export const getProductById = async (id: string) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  
  if (error) {
    return null;
  }
  return data as Product;
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
          license_key: key,
          is_active: true,
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
      .select('*, author:users!content_posts_author_id_fkey(full_name, avatar_url)')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (searchQuery) {
      query = query.ilike('title', `%${searchQuery}%`);
    }

    const posts = await safeQuery<Blog[]>(query);
    if (!posts || posts.length === 0) {
      throw new Error("Empty DB");
    }
    return posts;
  } catch (err) {
    return [
      {
        id: 'mock-post1',
        title: 'Institutional Macro Outlook Q3 2026',
        slug: 'institutional-macro-outlook',
        content: 'Discover the top hedge fund accumulation zones for XAU/USD this quarter.',
        category: 'Macroeconomics',
        status: 'published',
        created_at: new Date().toISOString(),
        content_type: 'Article',
        image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80',
        author: { full_name: 'Piyush Mal' }
      }
    ] as Blog[];
  }
};

export const getBlogPostBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('content_posts')
    .select('*, author:users!content_posts_author_id_fkey(full_name, avatar_url)')
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

    if (!res || res.length === 0) {
       throw new Error("Empty DB");
    }
    return res;
  } catch (err) {
    return [
      {
        id: 'mock-course-1',
        title: 'Gold Macro Masterclass',
        description: 'Elite institutional forex strategies for XAUUSD supercycles.',
        price: 299,
        level: 'Advanced',
        created_at: new Date().toISOString(),
        image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80',
        chapters: []
      }
    ] as Course[];
  }
};

export const getCourseById = async (id: string) => {
  const { data, error } = await supabase
    .from("courses")
    .select("*, chapters:lessons(*)")
    .eq("id", id)
    .single();
  
  if (error) {
    return null;
  }
  return data as Course;
};

export const checkUserAccess = async (userId: string, itemId: string) => {
  const { data, error } = await supabase
    .from("user_access")
    .select("*")
    .eq("user_id", userId)
    .eq("item_id", itemId)
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
    .select("*")
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
        supabase.from("contact_messages").insert([
          { full_name: name, email, subject, message }
        ])
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

export const subscribeToNewsletter = async (email: string) => {
  try {
    await safeExecute(() =>
      withTimeout(
        supabase.from("leads").insert([{ email }])
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
        screenshot_url: screenshotUrl,
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

    await safeExecute(() =>
      withTimeout(
        supabase
          .from('webinar_registrations')
          .insert([{
            webinar_id: webinarId,
            user_id: userId,
            email,
            attended: false,
            payment_status: 'completed'
          }])
      )
    );

    safeExecute(() =>
      supabase.rpc('increment_webinar_registrations', { webinar_id: webinarId })
    ).catch(() => {});

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
      .select("*")
      .order("created_at", { ascending: true })
  );
};
