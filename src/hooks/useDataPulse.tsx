import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { signalService } from "../services/signalService";
import { webinarService } from "../services/webinarService";
import { marketService } from "../services/marketService";
import { supabase, safeQuery } from "../lib/supabase";
import { Signal, Webinar, MarketPair } from "../types";

export interface DashboardStats {
  winRate: string;
  totalPips: number;
}

interface DataPulseContextType {
  signals: Signal[];
  webinars: Webinar[];
  marketData: MarketPair[];
  registrations: any[];
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

  const [marketData, setMarketData] = useState<MarketPair[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);

  const [performanceStats, setPerformanceStats] = useState<DashboardStats>({
    winRate: "78%",
    totalPips: 12450
  });

  const fetchData = useCallback(async (retryCount = 0) => {
    console.log(`🌐 [DATA PULSE] DISCOVERY CYCLE ${retryCount + 1}...`);
    // Only show loader if we have no cached data to show
    if (signals.length === 0 && webinars.length === 0 && marketData.length === 0) {
      setLoading(true);
    }
    
    try {
      // Parallel resilient fetch with independent catch-boundaries
      const [sigData, webData, markData, perfResult, regData] = await Promise.all([
        signalService.getSignals().catch(e => { 
          console.error("Signals Pulse Failed", e); 
          return JSON.parse(localStorage.getItem('pulse_signals') || '[]');
        }),
        webinarService.getWebinars().catch(e => { 
          console.error("Webinars Pulse Failed", e); 
          return JSON.parse(localStorage.getItem('pulse_webinars') || '[]');
        }),
        marketService.getMarketPairs().catch(e => { 
          console.error("Market Pulse Failed", e); 
          return JSON.parse(localStorage.getItem('pulse_market') || '[]');
        }),
        safeQuery<any>(supabase.from('performance_results').select('*').eq('is_featured', true).maybeSingle()),
        safeQuery<any[]>(supabase.from('webinar_registrations').select('webinar_id'))
      ]);

      setSignals(sigData || []);
      setWebinars(webData || []);
      setMarketData(markData || []);
      setRegistrations(regData || []);

      const perfData = Array.isArray(perfResult) ? perfResult[0] : (perfResult?.data || perfResult);
      if (perfData) {
        setPerformanceStats({
          winRate: perfData.win_rate || "74%",
          totalPips: perfData.total_pips || 12000
        });
      }

      // Preserve institutional state for offline/latency scenarios
      localStorage.setItem('pulse_signals', JSON.stringify(sigData || []));
      localStorage.setItem('pulse_webinars', JSON.stringify(webData || []));
      localStorage.setItem('pulse_market', JSON.stringify(markData || []));

    } catch (err) {
      console.warn("[DataPulse] Institutional Recovery Active. Retry in 5s.", err);
      if (retryCount < 3) {
        setTimeout(() => fetchData(retryCount + 1), 5000);
      }
    } finally {
      setLoading(false);
    }
  }, [signals.length, webinars.length, marketData.length]);

  useEffect(() => {
    fetchData();
    
    // Subscribe to changes if needed
    const signalSub = signalService.subscribe(() => fetchData());
    const webinarSub = webinarService.subscribe(() => fetchData());
    const marketSub = marketService.subscribe(() => fetchData());

    return () => {
      signalSub.unsubscribe();
      webinarSub.unsubscribe();
      marketSub.unsubscribe();
    };
  }, [fetchData]);

  const contextValue = React.useMemo(() => ({
    signals,
    webinars,
    marketData,
    registrations,
    performanceStats,
    loading,
    refresh: fetchData
  }), [signals, webinars, marketData, registrations, performanceStats, loading, fetchData]);

  return (
    <DataPulseContext.Provider value={contextValue}>
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
