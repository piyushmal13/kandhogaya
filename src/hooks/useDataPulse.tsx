import { useState, useEffect, useCallback, createContext, useContext, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Signal, Webinar } from '../types';
import { signalService } from '../services/signalService';
import { webinarService } from '../services/webinarService';
import { marketService } from '../services/marketService';

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
    console.log("🔄 [DATA PULSE REFRESH] STARTING CONCURRENT DISCOVERY");
    try {
      // 🚀 [IT TEAM] Phase 3 - Service-Driven Data Layer (Unified Flow)
      const [sigData, webData, markData] = await Promise.all([
        signalService.getSignals(),
        webinarService.getWebinars(),
        marketService.getMarketPairs()
      ]);

      setSignals(sigData);
      setWebinars(webData);
      setMarketData(markData);

      localStorage.setItem('pulse_signals', JSON.stringify(sigData));
      localStorage.setItem('pulse_webinars', JSON.stringify(webData));
      localStorage.setItem('pulse_market', JSON.stringify(markData));
      console.log("🔄 [DATA PULSE REFRESH] DISCOVERY COMPLETE", { signals: sigData.length, webinars: webData.length, market: markData.length });
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
