import { useState, useEffect, useCallback, createContext, useContext, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
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

  const { user } = useAuth();

  useEffect(() => {
    fetchData();
    // Refresh discovery pulse on identity transition or pulse tick
    const interval = setInterval(fetchData, 300000);
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
