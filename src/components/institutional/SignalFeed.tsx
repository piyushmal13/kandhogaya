import { Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { SovereignButton } from '@/components/ui/SovereignButton';
import { motion, AnimatePresence } from "motion/react";
import { useSignals } from '@/hooks/useSignals';

/**
 * SignalFeed (v2.0)
 * 
 * The Live Alpha Pulse of the Sovereign Terminal.
 * Features: Absolute zero-CLS state management, institutional telemetry markers, and instant execution triggers.
 */
export function SignalFeed() {
  const { data: signals, isLoading } = useSignals();

  return (
    <div className="flex flex-col h-[600px] rounded-[2.5rem] bg-white/[0.02] border border-white/10 overflow-hidden backdrop-blur-xl shadow-2xl relative">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/[0.02] to-transparent pointer-events-none" />

      {/* Institutional Header */}
      <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.03] relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </div>
          <h3 className="text-xs font-black uppercase tracking-[0.4em] text-foreground">Strategic Signal Hub</h3>
        </div>
        <div className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Educational Stream: SYNCED</div>
      </div>

      {/* Feed Area - Fixed Height for Zero-CLS */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar relative z-10">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse border border-white/5" />
            ))}
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {signals?.map((signal) => (
              <motion.div
                key={signal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] hover:border-primary-500/20 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className={`p-3 rounded-xl border ${
                      signal.direction === 'BUY' 
                        ? 'bg-primary-500/10 border-primary-500/20 text-primary-400' 
                        : 'bg-red-500/10 border-red-500/20 text-red-500'
                    }`}>
                      {signal.direction === 'BUY' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="text-lg font-black text-foreground tracking-tighter uppercase leading-none mb-1">
                        {signal.symbol} 
                        <span className={`ml-2 text-[10px] ${signal.direction === 'BUY' ? 'text-primary-400' : 'text-red-500'}`}>
                          {signal.direction}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
                        NodeID: {signal.id.slice(0, 8)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-mono font-black text-foreground tracking-tighter tabular-nums mb-0.5">
                      {signal.entry?.toFixed(5) || '0.00000'}
                    </div>
                    <div className="text-[8px] font-black uppercase tracking-[0.3em] text-primary-500/60">Sovereign Alpha Entry</div>
                  </div>
                </div>
                
                <div className="mt-5 flex items-center justify-between">
                  <div className="flex gap-4">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black uppercase tracking-widest text-white/20">TP_Target</span>
                      <span className="text-xs font-mono font-black text-primary-400">{signal.take_profit?.toFixed(5) || '—'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black uppercase tracking-widest text-white/20">SL_Guard</span>
                      <span className="text-xs font-mono font-black text-red-400">{signal.stop_loss?.toFixed(5) || '—'}</span>
                    </div>
                  </div>

                  <SovereignButton 
                    variant="outline" 
                    size="sm"
                    className="h-8 px-4"
                    trackingEvent={`signal_view_${signal.id}`}
                  >
                    View Research
                  </SovereignButton>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Footer Connectivity Bar */}
      <div className="h-10 px-8 flex items-center justify-between border-t border-white/5 bg-black/20 relative z-10">
        <div className="flex items-center gap-2">
           <Activity className="w-3 h-3 text-white/20" />
           <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Protocol Node Synced</span>
        </div>
        <span className="text-[8px] font-mono text-white/10 uppercase tracking-widest italic">Institutional Environment</span>
      </div>
    </div>
  );
}
