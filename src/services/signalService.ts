import { supabase, safeQuery } from "../lib/supabase";
import { Signal } from "../types";

const MOCK_EXECUTIONS: Signal[] = [
  {
    id: "exec-1",
    asset: "XAUUSD",
    symbol: "XAUUSD",
    direction: "BUY",
    entry_price: 2345.85,
    entry: 2345.85,
    stop_loss: 2330.00,
    take_profit: 2380.00,
    status: "active",
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString()
  },
  {
    id: "exec-2",
    asset: "EURUSD",
    symbol: "EURUSD",
    direction: "SELL",
    entry_price: 1.08250,
    entry: 1.08250,
    stop_loss: 1.08900,
    take_profit: 1.07200,
    status: "active",
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  },
  {
    id: "exec-3",
    asset: "GBPUSD",
    symbol: "GBPUSD",
    direction: "BUY",
    entry_price: 1.27420,
    entry: 1.27420,
    stop_loss: 1.26800,
    take_profit: 1.28900,
    status: "active",
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString()
  },
  {
    id: "exec-4",
    asset: "USDJPY",
    symbol: "USDJPY",
    direction: "BUY",
    entry_price: 156.40,
    entry: 156.40,
    stop_loss: 155.20,
    take_profit: 158.50,
    status: "active",
    created_at: new Date(Date.now() - 120 * 60 * 1000).toISOString()
  },
  {
    id: "exec-5",
    asset: "USDCAD",
    symbol: "USDCAD",
    direction: "SELL",
    entry_price: 1.3650,
    entry: 1.3650,
    stop_loss: 1.3720,
    take_profit: 1.3510,
    status: "active",
    created_at: new Date(Date.now() - 180 * 60 * 1000).toISOString()
  }
];

export const signalService = {
  async getSignals(): Promise<Signal[]> {
    return MOCK_EXECUTIONS;
  }
};
