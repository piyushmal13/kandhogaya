import { useState, useEffect, useCallback, createContext, useContext, useMemo } from 'react';
import { Signal, Webinar } from '../types';
import { signalService } from '../services/signalService';
import { webinarService } from '../services/webinarService';
import { marketService } from '../services/marketService';
import { supabase } from '../lib/supabase';

interface DataPulseContextValue {
  signals: Signal[];
  webinars: Webinar[];
  marketData: any[];
  performanceStats: {
    winRate: string;
    profitFactor: string;
    totalPips: number;
  };
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
  const [performanceStats, setPerformanceStats] = useState({
    winRate: "82.4%",
    profitFactor: "3.24",
    totalPips: 4200
  });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      // Parallel high-fidelity fetch
      const [sigData, webData, markData, perfResult] = await Promise.all([
        signalService.getSignals(),
        webinarService.getWebinars(),
        marketService.getMarketPairs(),
        supabase.from('performance_results').select('*').eq('is_featured', true).single()
      ]);

      setSignals(sigData || []);
      setWebinars(webData || []);
      setMarketData(markData || []);

      if (perfResult.data) {
        setPerformanceStats({
          winRate: `${perfResult.data.win_rate}%`,
          profitFactor: perfResult.data.profit_factor,
          totalPips: perfResult.data.pips
        });
      }

      localStorage.setItem('pulse_signals', JSON.stringify(sigData || []));
      localStorage.setItem('pulse_webinars', JSON.stringify(webData || []));
      localStorage.setItem('pulse_market', JSON.stringify(markData || []));
    } catch (err) {
      console.error("[DataPulse] Institutional Recovery Crash:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    // 🚀 [ELITE POD] REALTIME ENGAGEMENT
    // We are subscribing to the core asset tables to ensure zero-lag updates.
    const signalChannel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'signals' },
        () => {
          console.log("⚡ [REALTIME] SIGNALS UPDATE DETECTED");
          fetchData();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'market_data' },
        () => {
          console.log("⚡ [REALTIME] MARKET DATA UPDATE DETECTED");
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(signalChannel);
    };
  }, [fetchData]);

  const contextValue = useMemo(() => ({
    signals,
    webinars,
    marketData,
    performanceStats,
    loading,
    refresh: fetchData
  }), [signals, webinars, marketData, performanceStats, loading, fetchData]);

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
