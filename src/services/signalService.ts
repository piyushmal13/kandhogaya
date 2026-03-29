import { supabase, safeQuery } from "../lib/supabase";
import { Signal } from "../types";
import { mapSignal } from "../utils/dataMapper";

/**
 * Signal Service - Institutional Data Layer
 */
export const signalService = {
  /**
   * Fetch all signals with normalization
   */
  getSignals: async (): Promise<Signal[]> => {
    console.log("📡 [SIGNAL FETCH] START");
    try {
      const query = supabase
        .from("signals")
        .select("*")
        .order("created_at", { ascending: false });

      const rawData = await safeQuery<any[]>(query);
      console.log("📡 [SIGNAL FETCH] RESPONSE", rawData.length, "signals");
      
      const signals = (rawData as any[]).map(mapSignal);
      return signals;
    } catch (error) {
      console.error("📡 [SIGNAL FETCH] ERROR", error);
      return [];
    }
  },

  /**
   * Subscribe to real-time signal updates
   */
  subscribe: (callback: (payload: any) => void) => {
    return supabase
      .channel('public:signals')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'signals' }, callback)
      .subscribe();
  }
};
