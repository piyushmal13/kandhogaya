import React, { useEffect } from "react";
import { motion } from "motion/react";
import { Zap, ShieldCheck } from "lucide-react";
import { useSignals, Signal } from "../../hooks/useSignals";
import { SignalCardSkeleton } from "../ui/Skeleton";
import { BlurGate } from "../ui/BlurGate";
import { tracker } from "../../core/tracker";

export const LiveSignalsFeed = () => {
  const { data: signals = [], isLoading: loading } = useSignals();

  useEffect(() => {
    if (signals.length > 0) {
      tracker.track("signal_view", { count: signals.length });
    }
  }, [signals.length]);

  return (
    <section className="py-12 border-b border-white/5 bg-[var(--color27)]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" aria-hidden="true" />
            <h2 className="text-xl font-bold text-white tracking-tight uppercase font-mono">
              Quantitative Alert Pulse
            </h2>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color28)]">
              Institutional Execution Active
            </span>
          </div>
        </div>

        <BlurGate 
          requiredPlan="pro" 
          title="Institutional Parameters Locked"
          description="Educational Entry, Risk Parameter structure, and TP projections for institutional setups require an active Pro subscription. High-fidelity signal discovery remains active for your strategy review."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? ['skel-1', 'skel-2', 'skel-3'].map(key => <SignalCardSkeleton key={key} />)
              : signals.slice(0, 6).map((signal: Signal) => (
                  <motion.div
                    key={signal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="rounded-[2rem] border border-white/5 p-8 hover:border-emerald-500/30 hover:shadow-[0_0_60px_rgba(16,185,129,0.1)] transition-all duration-500 group relative bg-[var(--color26)]/60 backdrop-blur-2xl"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <div className="text-3xl font-bold text-white font-mono tracking-tighter mb-1">
                          {signal.symbol}
                        </div>
                        <div
                          className={`text-[11px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full inline-block ${
                            signal.direction === "BUY" 
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          }`}
                        >
                          {signal.direction} @ {signal.entry}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div
                          className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                            signal.status === "active"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-white/5 text-[var(--color28)]"
                          }`}
                        >
                          {signal.status}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mb-8">
                      <div className="space-y-1">
                        <div className="text-[10px] uppercase font-bold tracking-widest text-[var(--color5)]">
                          Target Output
                        </div>
                        <div className="text-xl font-bold text-white font-mono">
                          {signal.take_profit}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[10px] uppercase font-bold tracking-widest text-[var(--color5)]">
                          Risk Parameter
                        </div>
                        <div className="text-xl font-bold text-white font-mono text-rose-400/80">
                          {signal.stop_loss}
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                      <div className="text-[11px] font-mono text-[var(--color5)] flex items-center gap-2">
                        <time dateTime={signal.created_at}>
                          {new Date(signal.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </time>
                        <span className="w-1 h-1 rounded-full bg-white/10" />
                        <span>SWR/RESILIENCE</span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/10 transition-colors">
                        <Zap className="w-4 h-4" />
                      </div>
                    </div>
                  </motion.div>
                ))}
          </div>
        </BlurGate>
      </div>
    </section>
  );
};
