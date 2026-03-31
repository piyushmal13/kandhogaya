import { supabase, safeQuery } from "../lib/supabase";
import { Product, BotLicense } from "../types";

/**
 * Product Service - Institutional Data Layer
 */
export const productService = {
  /**
   * Fetch all products
   */
  getProducts: async (): Promise<Product[]> => {
    console.log("📦 [PRODUCT FETCH] START (Intelligence Deep Join Strategy)");
    try {
        const query = supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

      let products = await safeQuery<Product[]>(query);
      
      if (!products || products.length === 0) {
        products = [
          {
            id: 'mock-prod1',
            name: 'Gold Masterclass PRO',
            description: 'Institutional macro research and execution logic for XAUUSD supercycles.',
            price: 499,
            created_at: new Date().toISOString(),
            performance_data: [],
            q_and_a: [],
            long_plan_offers: [],
            category: 'Course',
            image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80'
          },
          {
            id: 'mock-prod2',
            name: 'Ares Quantum Bot',
            description: 'High-frequency scalping logic designed for MT5/CTrader integration.',
            price: 999,
            created_at: new Date().toISOString(),
            performance_data: [],
            q_and_a: [],
            long_plan_offers: [],
            category: 'Algorithmic',
            image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80'
          }
        ] as Product[];
      }
      
      console.log("📦 [PRODUCT FETCH] RESPONSE", products.length, "products");
      return products;
    } catch (error) {
      console.error("📦 [PRODUCT FETCH] ERROR", error);
      return [];
    }
  },

  /**
   * Fetch bot licenses for a specific user
   */
  getUserLicenses: async (userId: string): Promise<BotLicense[]> => {
    console.log(`📦 [LICENSE FETCH] START FOR USER: ${userId}`);
    try {
      const query = supabase
        .from("bot_licenses")
        .select("*, algo_bots(name)")
        .eq("user_id", userId);

      const licenses = await safeQuery<BotLicense[]>(query);
      console.log(`📦 [LICENSE FETCH] RESPONSE: ${licenses.length} licenses for user`);
      return licenses;
    } catch (error) {
      console.error(`📦 [LICENSE FETCH] ERROR for USER ${userId}:`, error);
      return [];
    }
  },

  /**
   * Fetch algo bots for marketplace
   */
  getAlgoBots: async (limit = 3): Promise<any[]> => {
    console.log(`🤖 [ALGO FETCH] START (limit: ${limit})`);
    try {
      const query = supabase
        .from("algo_bots")
        .select("*")
        .limit(limit);

      let bots = await safeQuery<any[]>(query);
      
      if (!bots || bots.length === 0) {
         bots = [
           { id: 'mock-bot1', name: 'Ares HFT', version: 'v3.2', created_at: new Date().toISOString() },
           { id: 'mock-bot2', name: 'Chronos Grid', version: 'v1.0', created_at: new Date().toISOString() }
         ];
      }
      console.log(`🤖 [ALGO FETCH] RESPONSE: ${bots.length} bots`);
      return bots;
    } catch (error) {
      console.error("🤖 [ALGO FETCH] ERROR:", error);
      return [
         { id: 'mock-bot1', name: 'Ares HFT', version: 'v3.2', created_at: new Date().toISOString() },
         { id: 'mock-bot2', name: 'Chronos Grid', version: 'v1.0', created_at: new Date().toISOString() }
      ];
    }
  },

  /**
   * Subscribe a user to an algorithm (License Creation)
   */
  subscribeToAlgo: async (userId: string, algoId: string, durationDays: number) => {
    console.log(`🤖 [ALGO SUB] START: user=${userId}, algo=${algoId}`);
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
        .select()
        .maybeSingle();

      if (error) throw error;
      
      console.log(`🤖 [ALGO SUB] RESPONSE: SUCCESS key=${key}`);
      return { success: true, data };
    } catch (err) {
      console.error("🤖 [ALGO SUB] ERROR:", err);
      return { success: false, error: "Something went wrong. Please try again." };
    }
  },

  /**
   * Subscribe to new licenses for a user
   */
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
