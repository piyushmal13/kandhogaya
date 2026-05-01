import { supabase, safeQuery } from "../lib/supabase";
import { Signal } from "../types";
import { mapSignal } from "../utils/dataMapper";

/**
 * Signal Service — Optimized Query Layer
 * PERF: Replaced select('*') with specific columns.
 * PERF: Added .limit(50) — signals page never needs more than 50 recent signals.
 * PERF: Removed debug console.log statements.
 */
export const signalService = {
  getSignals: async (): Promise<Signal[]> => {
    try {
      const query = supabase
        .from("signals")
        .select("id, pair, direction, entry, sl, tp, status, result_pips, created_at, metadata")
        .order("created_at", { ascending: false })
        .limit(50);

      const rawData = await safeQuery<any[]>(query);
      return (rawData as any[]).map(mapSignal);
    } catch {
      return [];
    }
  },

  subscribe: (callback: (payload: any) => void) => {
    return supabase
      .channel('public:signals')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'signals' }, callback)
      .subscribe();
  }
};
