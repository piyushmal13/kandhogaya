import { supabase, safeQuery } from "./supabaseClient";

/**
 * API Handlers Service
 * Centralizes all database interactions for the IFXTrades platform.
 * Ensures defensive checks and consistent data structures.
 */

// --- WEBINARS ---

export const getWebinars = async () => {
  return safeQuery<any[]>(
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
  return data;
};

// --- SIGNALS ---

export const getSignals = async () => {
  return safeQuery<any[]>(
    supabase
      .from("signals")
      .select("*")
      .order("created_at", { ascending: false })
  );
};

// --- ALGORITHMS ---

export const getAlgorithms = async () => {
  return safeQuery<any[]>(
    supabase
      .from("algorithms")
      .select("*")
      .order("created_at", { ascending: false })
  );
};

// --- BLOG / CONTENT ---

export const getBlogPosts = async (page = 0, pageSize = 9, searchQuery = "") => {
  let query = supabase
    .from('content_posts')
    .select('*')
    .eq('content_type', 'blog')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(page * pageSize, (page + 1) * pageSize - 1);

  if (searchQuery) {
    query = query.ilike('title', `%${searchQuery}%`);
  }

  return safeQuery<any[]>(query);
};

export const getBlogPostBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('content_posts')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) {
    console.error(`Error fetching blog post ${slug}:`, error);
    return null;
  }
  return data;
};

// --- AGENTS & SALES ---

export const getAgentStats = async (agentId: string) => {
  const { data: sales, error: salesError } = await supabase
    .from("sales_tracking")
    .select("*")
    .eq("agent_id", agentId);

  if (salesError) return { totalSales: 0, revenue: 0, referrals: 0 };

  const revenue = (sales || []).reduce((acc, sale) => acc + (sale.sale_amount || 0), 0);
  
  const { count: referrals, error: refError } = await supabase
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
