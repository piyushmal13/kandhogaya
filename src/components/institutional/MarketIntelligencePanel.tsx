import React from 'react';
import { Activity, X, TrendingUp } from 'lucide-react';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';

export function MarketIntelligencePanel() {
  const { isEnabled: alphaMode } = useFeatureFlag('dashboard_enable_alpha_mode', false);

  return (
    <div className="flex flex-col h-full">
      <div className="h-16 flex items-center px-6 border-b border-white/5 shrink-0 justify-between">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Market Intelligence</span>
        <button className="p-1 hover:bg-white/5 rounded-lg transition-colors">
          <X className="w-4 h-4 text-white/30" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {/* Real-time Ticker Mock */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-[9px] font-black flex items-center gap-2 uppercase tracking-widest text-emerald-500">
              <Activity className="w-3 h-3" />
              Strategic Intelligence
            </h4>
            <span className="text-[9px] font-mono text-white/20 uppercase">Education Feed</span>
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/10 transition-colors flex items-center justify-between group">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-black uppercase text-white group-hover:text-emerald-400 transition-colors">Study: Gold Order Flow</span>
                  <span className="text-[9px] font-mono text-white/40">Macro Scenario Analysis</span>
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-xs font-black text-emerald-400 font-mono">+$42.5k</span>
                   <div className="flex items-center gap-1">
                      <TrendingUp className="w-2 h-2 text-emerald-500" />
                      <span className="text-[8px] text-white/20 uppercase tracking-tighter">Settled</span>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alpha Analytics (Feature Gated) */}
        {alphaMode && (
          <div className="p-6 rounded-3xl bg-grad-primary/10 border border-emerald-500/20 relative overflow-hidden group hover:bg-grad-primary/15 transition-all">
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-500/10 blur-2xl group-hover:bg-emerald-500/20 transition-all duration-700" />
            <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-3 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_var(--color8)]" />
              Alpha Signals
            </h4>
            <p className="text-[10px] text-emerald-100/60 leading-relaxed uppercase tracking-wider italic font-medium">
              Aggregated institutional sentiment cross-correlated with darkpool liquidity. Trend: Ultra-Bullish. Liquidity grab expected at 2412.50.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
