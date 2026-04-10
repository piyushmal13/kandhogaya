import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Clock, Activity } from 'lucide-react';
import { useSignals, Signal } from '@/hooks/useSignals';
import { cn } from '@/lib/utils';

export function SignalFeed() {
  const { data: signals, isLoading, isError } = useSignals();

  return (
    <div className="h-[600px] flex flex-col border border-white/10 rounded-3xl bg-black/20 backdrop-blur-3xl overflow-hidden shadow-2xl shadow-emerald-500/5">
      {/* ── FIXED HEADER: CLS Prevention ── */}
      <div className="h-16 px-6 flex items-center border-b border-white/10 bg-white/[0.02] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Signal Intelligence</h3>
            <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Real-time Alpha Stream</p>
          </div>
        </div>
        
        <div className="ml-auto flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest font-mono">Live</span>
        </div>
      </div>
      
      {/* ── SCROLLABLE STAGE: aria-live enabled ── */}
      <div 
        className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar" 
        aria-live="polite" 
        aria-atomic="false"
      >
        <AnimatePresence initial={false}>
          {isLoading ? (
            [...Array(6)].map((_, i) => <SignalSkeleton key={i} />)
          ) : isError ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <p className="text-xs font-black text-red-400 uppercase tracking-widest mb-2">Transmission Interrupted</p>
              <p className="text-[10px] text-white/20 uppercase tracking-widest leading-relaxed">Failed to establish link with sovereign signal nodes.</p>
            </div>
          ) : (
            signals?.map((signal) => (
              <SignalRow key={signal.id} signal={signal} />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SignalRow({ signal }: { signal: Signal }) {
  const isBuy = signal.type === 'BUY';
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] as const }}
      className="group relative p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.07] hover:border-white/10 transition-all duration-300"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center border shrink-0",
            isBuy ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" : "bg-red-500/20 border-red-500/30 text-red-400"
          )}>
            {isBuy ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-base font-black text-white italic tracking-tighter uppercase leading-none">
              {signal.symbol} <span className={cn("ml-1", isBuy ? "text-emerald-400" : "text-red-400")}>{signal.type}</span>
            </span>
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-white/20" />
              <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">
                {new Date(signal.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end gap-1">
            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Entry</span>
            <span className="text-sm font-mono font-black text-white">{signal.entry.toFixed(5)}</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Objective</span>
            <span className="text-sm font-mono font-black text-emerald-400">{signal.tp.toFixed(5)}</span>
          </div>
        </div>
      </div>
      
      {/* Decorative Glow */}
      <div className={cn(
        "absolute -left-px top-1/2 -translate-y-1/2 w-0.5 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity",
        isBuy ? "bg-emerald-500 shadow-[0_0_10px_var(--color8)]" : "bg-red-500 shadow-[0_0_10px_var(--color9)]"
      )} />
    </motion.div>
  );
}

function SignalSkeleton() {
  return (
    <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-white/5" />
        <div className="space-y-2">
          <div className="h-4 w-24 bg-white/5 rounded" />
          <div className="h-2 w-16 bg-white/5 rounded" />
        </div>
        <div className="ml-auto flex gap-6">
          <div className="h-8 w-16 bg-white/5 rounded" />
          <div className="h-8 w-16 bg-white/5 rounded" />
        </div>
      </div>
    </div>
  );
}
