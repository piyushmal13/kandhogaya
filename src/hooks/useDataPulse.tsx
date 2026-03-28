import { useState, useEffect, useCallback, createContext, useContext, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { Signal, Webinar } from '../types';

interface DataPulseContextValue {
  signals: Signal[];
  webinars: Webinar[];
  marketData: any[];
  loading: boolean;
  refresh: () => Promise<void>;
}

const DataPulseContext = createContext<DataPulseContextValue | null>(null);

export const DataPulseProvider = ({ children }: { children: React.ReactNode }) => {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [marketData, setMarketData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [sigRes, webRes, markRes] = await Promise.all([
        supabase.from("signals").select("*").order("created_at", { ascending: false }).limit(6),
        supabase.from("webinars").select("*").order("date_time", { ascending: true }).limit(3),
        supabase.from("market_data").select("*").order("symbol", { ascending: true })
      ]);

      setSignals(sigRes.data || []);
      setWebinars(webRes.data || []);
      setMarketData(markRes.data || []);
    } catch (err) {
      console.error("[DataPulse] Discovery Failure:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Refresh every 5 minutes for public discovery pulse
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, [fetchData]);

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
