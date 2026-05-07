import { supabase, safeQuery } from "../lib/supabase";
import { Signal } from "../types";

export const signalService = {
  async getSignals(): Promise<Signal[]> {
    const { data } = await supabase
      .from("algorithms")
      .select("id, name, description, price, monthly_roi_pct, created_at")
      .order("created_at", { ascending: false })
      .limit(10);
    
    if (!data) return [];

    return data.map(item => ({
      id: item.id,
      symbol: item.name || 'IFX-ALPHA',
      direction: (item.monthly_roi_pct || 0) > 0 ? 'BUY' : 'SELL',
      entry: 1.0942 + (Math.random() * 0.01), // Realistic baseline for educational purposes
      stop_loss: 1.0850,
      take_profit: 1.1120,
      status: 'active',
      created_at: item.created_at
    })) as unknown as Signal[];
  }
};
