import { useState, useEffect, useCallback, createContext, useContext, useMemo } from 'react';
import { publicSupabase, safeQuery } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Signal, Webinar } from '../types';
import { mapSignal, mapWebinar, mapMarketTicker } from '../utils/dataMapper';

interface DataPulseContextValue {
  signals: Signal[];
  webinars: Webinar[];
  marketData: any[];
  loading: boolean;
  refresh: () => Promise<void>;
}

const DataPulseContext = createContext<DataPulseContextValue | null>(null);

export const DataPulseProvider = ({ children }: { children: React.ReactNode }) => {
  const [signals, setSignals] = useState<Signal[]>(() => {
    const cached = localStorage.getItem('pulse_signals');
    return cached ? JSON.parse(cached) : [];
  });
  const [webinars, setWebinars] = useState<Webinar[]>(() => {
    const cached = localStorage.getItem('pulse_webinars');
    return cached ? JSON.parse(cached) : [];
  });
  const [marketData, setMarketData] = useState<any[]>(() => {
    const cached = localStorage.getItem('pulse_market');
    return cached ? JSON.parse(cached) : [];
  });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      // 🚀 [IT TEAM] Phase 2 - Institutional Data Layer (SWR via safeQuery)
      const [rawSignals, rawWebinars, rawMarket] = await Promise.all([
        safeQuery<any[]>(publicSupabase.from("signals").select("*").order("created_at", { ascending: false }).limit(6)),
        safeQuery<any[]>(publicSupabase.from("webinars").select("*").order("date_time", { ascending: true }).limit(3)),
        safeQuery<any[]>(publicSupabase.from("market_data").select("*").order("symbol", { ascending: true }))
      ]);

      const sigData = (rawSignals as any[]).map(mapSignal);
      const webData = (rawWebinars as any[]).map(mapWebinar);
      const markData = (rawMarket as any[]).map(mapMarketTicker);

      setSignals(sigData);
      setWebinars(webData);
      setMarketData(markData);

      localStorage.setItem('pulse_signals', JSON.stringify(sigData));
      localStorage.setItem('pulse_webinars', JSON.stringify(webData));
      localStorage.setItem('pulse_market', JSON.stringify(markData));
    } catch (err) {
      console.error("[DataPulse] Institutional Recovery Crash:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const { user } = useAuth();

  useEffect(() => {
    fetchData();

    // 🚀 [IT TEAM] High-frequency heartbeat for discovery (60s)
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData, user?.id]);

  const contextValue = useMemo(() => ({
    signals,
    webinars,
    marketData,
    loading,
    refresh: fetchData
  }), [signals, webinars, marketData, loading, fetchData]);

  return (
    <DataPulseContext.Provider value={contextValue}>
      {children}
    </DataPulseContext.Provider>
  );
};

export const useDataPulse = () => {
  const ctx = useContext(DataPulseContext);
  if (!ctx) throw new Error("useDataPulse must be used within DataPulseProvider");
  return ctx;
};
