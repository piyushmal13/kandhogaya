import React, { createContext, useContext, useMemo } from "react";
import { useQuery } from '@tanstack/react-query';
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
  
  // Independent resilient query channels
  const { data: signals, isLoading: isSignalsLoading, refetch: refetchSignals } = useQuery({
    queryKey: ['pulse_signals'],
    queryFn: () => signalService.getSignals(),
    refetchInterval: 30000,
  });

  const { data: webinars, isLoading: isWebinarsLoading, refetch: refetchWebinars } = useQuery({
    queryKey: ['pulse_webinars'],
    queryFn: () => webinarService.getWebinars(),
    refetchInterval: 60000,
  });

  const { data: marketData, isLoading: isMarketLoading, refetch: refetchMarket } = useQuery({
    queryKey: ['pulse_market'],
    queryFn: () => marketService.getMarketPairs(),
    refetchInterval: 15000,
  });

  const { data: registrations, refetch: refetchRegs } = useQuery({
    queryKey: ['pulse_registrations'],
    queryFn: () => safeQuery<any[]>(supabase.from('webinar_registrations').select('webinar_id'))
  });

  const { data: perfResult, refetch: refetchPerf } = useQuery({
    queryKey: ['pulse_performance'],
    queryFn: () => safeQuery<any>(supabase.from('performance_results').select('*').eq('is_featured', true).maybeSingle())
  });

  const loading = isSignalsLoading || isWebinarsLoading || isMarketLoading;

  const performanceStats: DashboardStats = useMemo(() => {
    const perfData = Array.isArray(perfResult) ? perfResult[0] : (perfResult?.data || perfResult);
    return {
      winRate: perfData?.win_rate || "74%",
      totalPips: perfData?.total_pips || 12000
    };
  }, [perfResult]);

  const refreshAll = async () => {
    await Promise.all([
      refetchSignals(), 
      refetchWebinars(), 
      refetchMarket(), 
      refetchRegs(), 
      refetchPerf()
    ]);
  };

  const contextValue = React.useMemo(() => ({
    signals: signals || [],
    webinars: webinars || [],
    marketData: marketData || [],
    registrations: registrations || [],
    performanceStats,
    loading,
    refresh: refreshAll
  }), [signals, webinars, marketData, registrations, performanceStats, loading]);

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
