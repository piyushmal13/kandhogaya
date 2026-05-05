import { supabase, safeQuery } from "../lib/supabase";
import { Signal } from "../types";

export const signalService = {
  async getSignals(): Promise<Signal[]> {
    const { data } = await supabase
      .from("signals")
      .select("id, asset, direction, entry_price, stop_loss, take_profit, status, created_at")
      .order("created_at", { ascending: false })
      .limit(50);
    
    if (!data) return [];

    return data.map(item => ({
      ...item,
      symbol: item.asset || 'UNKNOWN',
      entry: item.entry_price || 0
    })) as Signal[];
  }
};
