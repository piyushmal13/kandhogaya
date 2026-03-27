import { supabase, safeQuery } from "../lib/supabase";
import {
  Webinar, Signal, Product, Blog, Course
} from "../types";

/**
 * API Handlers Service
 * Centralizes all database interactions for the IFXTrades platform.
 * Ensures defensive checks and consistent data structures.
 */

// --- WEBINARS ---

export const getWebinars = async () => {
  return safeQuery<Webinar[]>(
    supabase
      .from("webinars")
      .select("*")
      .order("date_time", { ascending: true })
  );
};

export const getWebinarById = async (id: string) => {
  const { data, error } = await supabase
    .from("webinars")
    .select("*")
    .eq("id", id)
    .single();
  
  if (error) {
    console.error(`Error fetching webinar ${id}:`, error);
    return null;
  }
  return data as Webinar;
};

export const checkWebinarRegistration = async (webinarId: string, userId: string) => {
  const { data, error } = await supabase
    .from("webinar_registrations")
    .select("id")
    .eq("webinar_id", webinarId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error checking registration:", error);
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
  return safeQuery<Product[]>(
    supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
  );
};

export const getProductById = async (id: string) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  
  if (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
  return data as Product;
};

export const subscribeToAlgo = async (userId: string, algoId: string, durationDays: number) => {
  const key = `IFX-${Math.random().toString(36).toUpperCase().substring(2, 6)}-${Math.random().toString(36).toUpperCase().substring(2, 6)}`;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + durationDays);

  const { data, error } = await supabase.from('bot_licenses').insert({
    user_id: userId,
    algo_id: algoId,
    license_key: key,
    is_active: true,
    expires_at: expiresAt.toISOString()
  }).select().single();

  if (error) {
    console.error("Error creating license:", error);
    return { success: false, error };
  }
  return { success: true, license: data };
};

// --- BLOG / CONTENT ---

export const getBlogPosts = async (page = 0, pageSize = 9, searchQuery = "") => {
  let query = supabase
    .from('content_posts')
    .select('*, author:users!content_posts_author_id_fkey(full_name, avatar_url)')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .range(page * pageSize, (page + 1) * pageSize - 1);

  if (searchQuery) {
    query = query.ilike('title', `%${searchQuery}%`);
  }

  return safeQuery<Blog[]>(query);
};

export const getBlogPostBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('content_posts')
    .select('*, author:users!content_posts_author_id_fkey(full_name, avatar_url)')
    .eq('slug', slug)
    .single();
  
  if (error) {
    console.error(`Error fetching blog post ${slug}:`, error);
    return null;
  }
  return data as Blog;
};

// --- ACADEMY / COURSES ---

export const getCourses = async () => {
  return safeQuery<Course[]>(
    supabase
      .from("courses")
      .select("*, chapters:lessons(*)")
      .order("created_at", { ascending: false })
  );
};

export const getCourseById = async (id: string) => {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .single();
  
  if (error) {
    console.error(`Error fetching course ${id}:`, error);
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
  return supabase
    .from("sales_tracking")
    .insert({
      agent_id: agentId,
      user_id: userId,
      product_id: productId,
      sale_amount: amount
    });
};

// --- MARKET DATA ---

export const getMarketData = async () => {
  return safeQuery<any[]>(
    supabase
      .from("market_data")
      .select("*")
      .order("symbol", { ascending: true })
  );
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
