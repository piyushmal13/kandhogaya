import { Activity, X, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { marketService } from '@/services/marketService';
import { motion, AnimatePresence } from 'motion/react';

export function MarketIntelligencePanel() {
  const { isEnabled: alphaMode } = useFeatureFlag('dashboard_enable_alpha_mode', false);
  const [pairs, setPairs] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchMarket = async () => {
      const data = await marketService.getMarketPairs();
      setPairs(data);
      setLoading(false);
    };

    fetchMarket();
    const sub = marketService.subscribe(fetchMarket);
    return () => sub.unsubscribe();
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="h-16 flex items-center px-6 border-b border-white/5 shrink-0 justify-between">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Market Intelligence</span>
        <button className="p-1 hover:bg-white/5 rounded-lg transition-colors">
          <X className="w-4 h-4 text-white/30" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {/* Real-time Ticker */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-[9px] font-black flex items-center gap-2 uppercase tracking-widest text-emerald-500">
              <Activity className="w-3 h-3" />
              Strategic Intelligence
            </h4>
            <span className="text-[9px] font-mono text-white/20 uppercase">Live Exchange Feed</span>
          </div>
          
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 rounded-2xl bg-white/[0.02] border border-white/[0.05] animate-pulse" />
                ))
              ) : (
                pairs.map((pair) => (
                  <motion.div 
                    layout
                    key={pair.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-emerald-500/20 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "p-2 rounded-lg border",
                        pair.up ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-500"
                      )}>
                        {pair.up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-black uppercase text-white group-hover:text-emerald-400 transition-colors">{pair.symbol}</span>
                        <span className="text-[9px] font-mono text-white/40">Verified Institutional Node</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                       <span className="text-xs font-black text-white font-mono tabular-nums">{pair.price}</span>
                       <div className="flex items-center gap-1">
                          <span className={cn("text-[8px] font-black uppercase tracking-tighter", pair.up ? "text-emerald-400" : "text-red-400")}>
                            {pair.change}
                          </span>
                       </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Alpha Analytics (Feature Gated) */}
        {alphaMode && (
          <div className="p-6 rounded-3xl bg-grad-primary/10 border border-emerald-500/20 relative overflow-hidden group hover:bg-grad-primary/15 transition-all">
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-500/10 blur-2xl group-hover:bg-emerald-500/20 transition-all duration-700" />
            <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-3 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]" />
              Alpha Pulse
            </h4>
            <p className="text-[10px] text-emerald-100/60 leading-relaxed uppercase tracking-wider italic font-medium">
              Aggregated institutional sentiment cross-correlated with darkpool liquidity. Trend: Ultra-Bullish. Liquidity grab expected at historical Fibonacci levels.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
