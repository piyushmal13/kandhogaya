import { supabase, safeQuery } from "../lib/supabase";
import { mapMarketTicker } from "../utils/dataMapper";

/**
 * Market Service - Institutional Data Layer
 */
export const marketService = {
  /**
   * Fetch all market data with normalization
   */
  getMarketPairs: async (): Promise<any[]> => {
    console.log("📈 [MARKET FETCH] START");
    try {
      const query = supabase
        .from("market_data")
        .select("*")
        .order("symbol", { ascending: true });

      const rawData = await safeQuery<any[]>(query);
      console.log("📈 [MARKET FETCH] RESPONSE", rawData.length, "market pairs");

      const marketData = (rawData as any[]).map(mapMarketTicker);
      return marketData;
    } catch (error) {
      console.error("📈 [MARKET FETCH] ERROR", error);
      return [];
    }
  },

  /**
   * Subscribe to real-time market updates
   */
  subscribe: (callback: (payload: any) => void) => {
    return supabase
      .channel('public:market_data')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'market_data' }, callback)
      .subscribe();
  }
};
