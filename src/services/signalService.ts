import { supabase, safeQuery } from "../lib/supabase";
import { Signal } from "../types";

export const signalService = {
  async getSignals(): Promise<Signal[]> {
    const { data } = await (supabase
      .from("signals" as any)
      .select("id, asset, direction, entry_price, stop_loss, take_profit, status, created_at")
      .order("created_at", { ascending: false })
      .limit(10) as any);
    
    if (!data) return [];

    return data.map(item => ({
      id: item.id,
      symbol: item.asset || 'IFX-ALPHA',
      asset: item.asset,
      direction: item.direction as 'BUY' | 'SELL',
      entry: item.entry_price,
      stop_loss: item.stop_loss,
      take_profit: item.take_profit,
      status: item.status as 'active' | 'closed' | 'cancelled',
      created_at: item.created_at,
      result: null,
      pips: undefined
    })) as unknown as Signal[];
  }
};
