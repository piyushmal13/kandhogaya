import React from 'react';
import { TrendingUp, TrendingDown, Server, Activity, ShieldCheck } from 'lucide-react';
import { usePortfolioData } from '@/hooks/usePortfolioData';
import { usePerformancePulse } from '@/hooks/usePerformancePulse';
import { cn } from '@/lib/utils';

export function PortfolioValue() {
  const { stats, isLoading: statsLoading } = usePerformancePulse();
  const { data: portfolio, isLoading: portfolioLoading, isFetching } = usePortfolioData();
  
  const isLoading = statsLoading || portfolioLoading;
  
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(val);
  };

  const formatPercentage = (val: number) => `${val >= 0 ? '+' : ''}${val.toFixed(2)}%`;

  return (
    <div className="h-[280px] p-10 rounded-[2.5rem] bg-white/[0.015] border border-white/5 backdrop-blur-[32px] relative overflow-hidden group hover:border-cyan-500/20 transition-all duration-700">
      {/* Decorative Background Icon */}
      <Server className="absolute -right-8 -bottom-8 w-48 h-48 text-cyan-500/[0.01] -rotate-12 pointer-events-none transition-transform group-hover:rotate-0 duration-1000" />
      
      <div className="relative z-10 flex flex-col h-full">
        <h3 className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Sovereign Liquidity Pool
          </div>
          <span className="font-mono text-[8px] opacity-40">MAINFRAME_DATA_SYGMA</span>
        </h3>
        
        {isLoading ? (
          <PortfolioSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-end mt-auto">
             <div>
                <div className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
                   <Activity className="w-3 h-3 text-cyan-500" /> Total Alpha Capture
                </div>
                <div className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none mb-4 tabular-nums">
                  {stats.totalPips} <span className="text-lg text-white/20 font-mono tracking-widest ml-1">PIPS</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {formatPercentage(portfolio?.change || 12.45)} (24H)
                  </div>
                </div>
             </div>

             <div className="flex flex-col items-end gap-6">
                <div className="text-right">
                   <div className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em] mb-1">System Accuracy</div>
                   <div className="text-3xl font-black text-cyan-400 italic tracking-tighter tabular-nums">{stats.winRate}</div>
                </div>
                <div className="text-right">
                   <div className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em] mb-1">Profit Factor</div>
                   <div className="text-3xl font-black text-emerald-400 italic tracking-tighter tabular-nums">{stats.profitFactor}</div>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Surface Gloss */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.01] to-transparent pointer-events-none" />
    </div>
  );
}

function PortfolioSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-12 w-64 bg-white/5 rounded-2xl" />
      <div className="h-6 w-32 bg-white/5 rounded-full" />
    </div>
  );
}
