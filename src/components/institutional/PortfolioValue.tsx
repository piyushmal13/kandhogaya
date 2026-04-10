import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';
import { usePortfolioData } from '@/hooks/usePortfolioData';
import { cn } from '@/lib/utils';

export function PortfolioValue() {
  const { data: portfolio, isLoading } = usePortfolioData();
  
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(val);
  };

  const formatPercentage = (val: number) => `${val >= 0 ? '+' : ''}${val.toFixed(2)}%`;

  return (
    <div className="h-[180px] p-8 rounded-3xl bg-black/20 border border-white/10 backdrop-blur-3xl relative overflow-hidden group">
      {/* Decorative Background Icon */}
      <Wallet className="absolute -right-8 -bottom-8 w-48 h-48 text-white/[0.02] -rotate-12 pointer-events-none transition-transform group-hover:rotate-0 duration-700" />
      
      <div className="relative z-10 flex flex-col h-full">
        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
          Aggregate Liquidity
        </h3>
        
        {isLoading ? (
          <PortfolioSkeleton />
        ) : portfolio ? (
          <div 
            aria-live="polite" 
            aria-atomic="true"
            aria-label={`Current portfolio value is ${formatCurrency(portfolio.total)}. Growth rate: ${formatPercentage(portfolio.change)}`}
            className="mt-auto"
          >
            <div className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase mb-2">
              {formatCurrency(portfolio.total)}
            </div>
            
            <div className={cn(
              "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest border",
              portfolio.change >= 0 
                ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' 
                : 'bg-red-500/20 border-red-500/30 text-red-400'
            )}>
              {portfolio.change >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              <span>{formatPercentage(portfolio.change)} (24H)</span>
            </div>
          </div>
        ) : (
          <div className="mt-auto">
            <div className="text-4xl font-black text-white/10 italic tracking-tighter uppercase mb-2">
              --.---,--
            </div>
            <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">
              Synchronization Pending
            </div>
          </div>
        )}
      </div>

      {/* Surface Gloss */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-transparent pointer-events-none" />
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
