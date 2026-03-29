import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { signalService } from "../services/signalService";
import { webinarService } from "../services/webinarService";
import { marketService } from "../services/marketService";
import { supabase } from "../lib/supabase";
import { Signal, Webinar, MarketPair } from "../types";

export interface DashboardStats {
  winRate: string;
  totalPips: number;
}

interface DataPulseContextType {
  signals: Signal[];
  webinars: Webinar[];
  marketData: MarketPair[];
  performanceStats: DashboardStats;
  loading: boolean;
  refresh: () => Promise<void>;
}

const DataPulseContext = createContext<DataPulseContextType | undefined>(undefined);

export const DataPulseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  
  const [signals, setSignals] = useState<Signal[]>(() => {
    try {
      const cached = localStorage.getItem('pulse_signals');
      return cached ? JSON.parse(cached) : [];
    } catch { return []; }
  });

  const [webinars, setWebinars] = useState<Webinar[]>(() => {
    try {
      const cached = localStorage.getItem('pulse_webinars');
      return cached ? JSON.parse(cached) : [];
    } catch { return []; }
  });

  const [marketData, setMarketData] = useState<MarketPair[]>(() => {
    try {
      const cached = localStorage.getItem('pulse_market');
      return cached ? JSON.parse(cached) : [];
    } catch { return []; }
  });

  const [performanceStats, setPerformanceStats] = useState<DashboardStats>({
    winRate: "78%",
    totalPips: 12450
  });

  const fetchData = useCallback(async () => {
    console.log("🌐 [DATA PULSE] INITIATING DISCOVERY...");
    // Only show loader if we have no cached data to show
    if (signals.length === 0 && webinars.length === 0 && marketData.length === 0) {
      setLoading(true);
    }
    
    try {
      // Parallel resilient fetch
      const [sigData, webData, markData, perfResult] = await Promise.all([
        signalService.getSignals().catch(e => { console.error("Signals Fetch Failed", e); return []; }),
        webinarService.getWebinars().catch(e => { console.error("Webinars Fetch Failed", e); return []; }),
        marketService.getMarketPairs().catch(e => { console.error("Market Fetch Failed", e); return []; }),
        supabase.from('performance_results').select('*').eq('is_featured', true).maybeSingle().catch(() => ({ data: null }))
      ]);

      setSignals(sigData || []);
      setWebinars(webData || []);
      setMarketData(markData || []);

      if (perfResult && (perfResult as any).data) {
        const d = (perfResult as any).data;
        setPerformanceStats({
          winRate: d.win_rate || "74%",
          totalPips: d.total_pips || 12000
        });
      }

      // Preserve institutional state for offline/latency scenarios
      localStorage.setItem('pulse_signals', JSON.stringify(sigData || []));
      localStorage.setItem('pulse_webinars', JSON.stringify(webData || []));
      localStorage.setItem('pulse_market', JSON.stringify(markData || []));

    } catch (err) {
      console.error("[DataPulse] Institutional Recovery Crash:", err);
    } finally {
      setLoading(false);
    }
  }, [signals.length, webinars.length, marketData.length]);

  useEffect(() => {
    fetchData();
    
    // Subscribe to changes if needed
    const signalSub = signalService.subscribe(() => fetchData());
    const webinarSub = webinarService.subscribe(() => fetchData());

    return () => {
      signalSub.unsubscribe();
      webinarSub.unsubscribe();
    };
  }, [fetchData]);

  return (
    <DataPulseContext.Provider value={{
      signals,
      webinars,
      marketData,
      performanceStats,
      loading,
      refresh: fetchData
    }}>
      {children}
    </DataPulseContext.Provider>
  );
};

export const useDataPulse = () => {
  const context = useContext(DataPulseContext);
  if (context === undefined) {
    throw new Error("useDataPulse must be used within a DataPulseProvider");
  }
  return context;
};
