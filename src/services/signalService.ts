import { supabase, safeQuery } from "../lib/supabase";
import { Signal } from "../types";

export const signalService = {
  async getSignals(): Promise<Signal[]> {
    const data = await safeQuery<Signal[]>(
      supabase
        .from("signals")
        .select("id, asset, direction, entry_price, stop_loss, take_profit, status, created_at")
        .order("created_at", { ascending: false })
        .limit(50)
    );
    return data || [];
  }
};
