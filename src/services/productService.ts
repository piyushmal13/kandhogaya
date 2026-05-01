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
        .from("products")
        .select("id, name, description, price, category, video_explanation_url, image_url, created_at, performance_data, long_plan_offers")
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
        .select("id, user_id, algo_id, license_key, is_active, expires_at, created_at")
        .eq("user_id", userId)
        .eq("is_active", true);

      return await safeQuery<BotLicense[]>(query);
    } catch {
      return [];
    }
  },
  getAlgoBots: async (limit: number = 10): Promise<any[]> => {
    try {
      const query = supabase
        .from("algo_bots")
        .select(`
          id, 
          name, 
          version, 
          download_url,
          product:product_id (
            description,
            price,
            category,
            image_url,
            metadata
          )
        `)
        .limit(limit);

      return await safeQuery<any[]>(query) || [];
    } catch {
      return [];
    }
  },

  subscribeToAlgo: async (userId: string, algoId: string, durationDays: number) => {
    try {
      const key = `IFX-${Math.random().toString(36).toUpperCase().substring(2, 6)}-${Math.random().toString(36).toUpperCase().substring(2, 6)}`;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + durationDays);

      const { data, error } = await supabase
        .from('bot_licenses')
        .insert({
          user_id: userId,
          algo_id: algoId,
          license_key: key,
          is_active: true,
          expires_at: expiresAt.toISOString()
        })
        .select("id, license_key, expires_at")
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
  }
};
