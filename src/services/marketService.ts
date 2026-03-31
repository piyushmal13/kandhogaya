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
      let marketData = Array.isArray(rawData) ? rawData.map(mapMarketTicker) : [];
      
      // FALLBACK TO HIGH-FIDELITY MOCK DATA IF DB IS EMPTY (Pre-API Key implementation)
      if (marketData.length === 0) {
        marketData = [
          { id: '1', symbol: 'EUR/USD', price: 1.0942, change: '+0.12%', up: true },
          { id: '2', symbol: 'GBP/USD', price: 1.2651, change: '-0.08%', up: false },
          { id: '3', symbol: 'USD/JPY', price: 151.24, change: '+0.45%', up: true },
          { id: '4', symbol: 'XAU/USD', price: 2341.5, change: '+1.20%', up: true },
          { id: '5', symbol: 'XAG/USD', price: 28.15, change: '-0.30%', up: false },
          { id: '6', symbol: 'BTC/USD', price: 68540, change: '+2.10%', up: true },
          { id: '7', symbol: 'ETH/USD', price: 3540.2, change: '+1.80%', up: true }
        ];
      }
      
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
