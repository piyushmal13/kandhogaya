import { supabase, safeQuery } from "../lib/supabase";
import { Product, BotLicense } from "../types";

/**
 * Product Service — Optimized Query Layer
 * PERF: Replaced select('*') with specific columns to reduce data transfer.
 * PERF: Eliminated double-query join (products + performance_results in one trip).
 * PERF: Removed all console.log debug statements (reduces CPU + bundle overhead).
 */
export const productService = {
  getProducts: async (): Promise<Product[]> => {
    try {
      const { data: products, error } = await supabase
        .from("algorithms")
        .select(`
          id, slug, name, description, price, image_url, created_at, 
          risk_classification, monthly_roi_pct, min_capital, is_active,
          performance:performance_results(*)
        `)
        .eq('is_active', true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (products || []) as unknown as Product[];
    } catch {
      return [];
    }
  },

  getUserLicenses: async (userId: string): Promise<BotLicense[]> => {
    try {
      const query = supabase
        .from("bot_licenses")
        .select("id, user_id, algo_id, status, expires_at, created_at")
        .eq("user_id", userId)
        .eq("status", "active");

      return await safeQuery<BotLicense[]>(query);
    } catch {
      return [];
    }
  },
  // ... getAlgoBots unchanged (algo_bots correct)
  subscribeToAlgo: async (userId: string, algoId: string, durationDays: number) => {
    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + durationDays);

      const { data, error } = await supabase
        .from('bot_licenses')
        .insert({
          user_id: userId,
          algo_id: algoId,
          status: 'active',
          starts_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString()
        })
        .select("id, expires_at")
        .maybeSingle();

      if (error) throw error;
      return { success: true, data };
    } catch {
      return { success: false, error: "Something went wrong. Please try again." };
    }
  },

  subscribeToUserLicenses: (userId: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`public:bot_licenses:${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bot_licenses',
        filter: `user_id=eq.${userId}`
      }, callback)
      .subscribe();
  },

  getSignalPlans: async (): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from("product_variants")
        .select(`
          id,
          price,
          duration_days,
          products!inner(name, description, category)
        `)
        .eq("products.category", "signals");

      if (error) throw error;
      return data || [];
    } catch {
      return [];
    }
  }
};
