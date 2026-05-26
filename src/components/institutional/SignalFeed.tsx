import { Activity, ArrowUpRight, ArrowDownRight, HardDrive, Terminal } from 'lucide-react';
import { EliteButton } from '@/components/ui/Button';
import { motion, AnimatePresence } from "motion/react";
import { useSignals } from '@/hooks/useSignals';

/**
 * SignalFeed — Overhauled to: Quantitative Operations & Execution Logs Feed
 * Displays high-density systematic execution logs from the quant desk.
 * Absolutely 0 retail signal jargon.
 */
export function SignalFeed() {
  const { data: executions, isLoading } = useSignals();

  return (
    <div className="flex flex-col h-[600px] rounded-[2.5rem] bg-white/[0.02] border border-white/10 overflow-hidden backdrop-blur-xl shadow-2xl relative">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.02] to-transparent pointer-events-none" />

      {/* Header */}
      <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.03] relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-foreground">Sovereign Desk Logs</h3>
        </div>
        <div className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
          {executions?.length || 0} Systems Active
        </div>
      </div>

      {/* Feed Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar relative z-10">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse border border-white/5" />
            ))}
          </div>
        ) : !executions?.length ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Terminal className="w-8 h-8 text-white/10 mx-auto mb-4" />
              <p className="text-white/30 text-sm font-bold">Awaiting Operational Cycles</p>
              <p className="text-white/15 text-xs mt-1">Quantitative logs will sync automatically when active.</p>
            </div>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {executions.map((exec) => (
              <motion.div
                key={exec.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative p-4 md:p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] hover:border-emerald-500/20 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 md:gap-5">
                    <div className={`p-2.5 md:p-3 rounded-xl border ${
                      exec.direction === 'BUY'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/10 border-red-500/20 text-red-500'
                    }`}>
                      {exec.direction === 'BUY' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="text-base md:text-lg font-black text-foreground tracking-tighter uppercase leading-none mb-1">
                        {exec.symbol}
                        <span className={`ml-2 text-[10px] ${exec.direction === 'BUY' ? 'text-emerald-400' : 'text-red-500'}`}>
                          {exec.direction === 'BUY' ? 'LONG' : 'SHORT'}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
                        {exec.status === 'active' ? '● Executing' : 'Concluded'}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base md:text-lg font-mono font-black text-foreground tracking-tighter tabular-nums mb-0.5">
                      {exec.entry?.toFixed(5) || '0.00000'}
                    </div>
                    <div className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-500/60">Execution Value</div>
                  </div>
                </div>

                <div className="mt-4 md:mt-5 flex items-center justify-between">
                  <div className="flex gap-4">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Target Ceiling</span>
                      <span className="text-xs font-mono font-black text-emerald-400">{exec.take_profit?.toFixed(5) || '—'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Risk Floor</span>
                      <span className="text-xs font-mono font-black text-red-400">{exec.stop_loss?.toFixed(5) || '—'}</span>
                    </div>
                  </div>

                  <EliteButton
                    variant="institutional-outline"
                    size="sm"
                    className="h-8 px-4"
                    trackingEvent={`execution_log_view_${exec.id}`}
                  >
                    System Specs
                  </EliteButton>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Footer */}
      <div className="h-10 px-6 md:px-8 flex items-center justify-between border-t border-white/5 bg-black/20 relative z-10">
        <div className="flex items-center gap-2">
           <HardDrive className="w-3 h-3 text-white/20" />
           <span className="text-[8px] font-black uppercase tracking-widest text-white/20">System Telemetry Feed</span>
        </div>
        <span className="text-[8px] font-mono text-white/10 uppercase tracking-widest">IFX Trades</span>
      </div>
    </div>
  );
}
