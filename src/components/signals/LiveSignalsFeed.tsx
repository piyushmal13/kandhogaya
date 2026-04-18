import React, { useEffect } from "react";
import { motion } from "motion/react";
import { Zap, ShieldCheck, Activity } from "lucide-react";
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
    <section className="py-24 md:py-32 border-b border-white/[0.05] bg-[#020202] relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-20">
          <div className="flex flex-col items-center md:items-start gap-4 text-center md:text-left">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_20px_rgba(16,185,129,0.8)]" />
              <h2 className="text-[11px] font-black text-white uppercase tracking-[0.4em] font-mono">
                Neural Execution Stream
              </h2>
            </div>
            <p className="text-gray-500 text-sm max-w-md font-light leading-relaxed">
              Real-time synchronization with our proprietary quantitative models. All parameters are derived from institutional liquidity voids.
            </p>
          </div>
          <div className="flex items-center gap-6 px-6 py-3 rounded-2xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-white/20 uppercase tracking-widest leading-none mb-1">Stream Status</span>
              <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">Active / Synchronized</span>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
          </div>
        </div>

        <BlurGate 
          requiredPlan="pro" 
          title="Institutional Parameters Encrypted"
          description="Access to real-time execution nodes, deep-liquidity zones, and risk hardeners requires the Sovereign Pass. High-fidelity discovery remains active for preview."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {loading
              ? ['skel-1', 'skel-2', 'skel-3'].map(key => <SignalCardSkeleton key={key} />)
              : signals.slice(0, 6).map((signal: Signal, i: number) => (
                  <motion.div
                    key={signal.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="group relative"
                  >
                    <div className="relative overflow-hidden rounded-[2.5rem] bg-[#080B12] border border-white/[0.06] p-10 transition-all duration-700 group-hover:border-emerald-500/30 group-hover:bg-[#0C0F18] group-hover:-translate-y-2 group-hover:shadow-2xl">
                      {/* Technical Detail Overlays */}
                      <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                        <Activity className="w-4 h-4 text-emerald-500/20" />
                      </div>

                      <div className="flex justify-between items-start mb-8">
                        <div>
                          <div className="text-4xl font-black text-white font-mono tracking-tighter mb-2 italic">
                            {signal.symbol}
                          </div>
                          <div
                            className={`text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full inline-flex items-center gap-2 ${
                              signal.direction === "BUY" 
                                ? "bg-emerald-500/[0.05] text-emerald-500 border border-emerald-500/20" 
                                : "bg-rose-500/[0.05] text-rose-500 border border-rose-500/20"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${signal.direction === 'BUY' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            {signal.direction} NODE
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">Entry Price</div>
                          <div className="text-xl font-black text-white font-mono tracking-tighter">{signal.entry}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-10 mb-10 border-y border-white/[0.04] py-8">
                        <div className="space-y-2">
                          <div className="text-[9px] font-black text-emerald-500/40 uppercase tracking-[0.3em]">
                            Target Alpha
                          </div>
                          <div className="text-2xl font-black text-emerald-400 font-mono tracking-tighter leading-none">
                            {signal.take_profit}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-[9px] font-black text-rose-500/40 uppercase tracking-[0.3em]">
                            Hard Stop
                          </div>
                          <div className="text-2xl font-black text-white/40 font-mono tracking-tighter leading-none">
                            {signal.stop_loss}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center">
                              <Zap className="w-4 h-4 text-emerald-500" />
                           </div>
                           <div className="flex flex-col">
                              <span className="text-[9px] font-black text-white/20 uppercase tracking-widest leading-none mb-1">Time Latency</span>
                              <time className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none">
                                {new Date(signal.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </time>
                           </div>
                        </div>
                        <div className="text-[10px] font-black text-emerald-500/20 uppercase tracking-[0.4em] italic group-hover:text-emerald-500 transition-colors">
                           Verified
                        </div>
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
