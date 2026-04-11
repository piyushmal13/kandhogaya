import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Clock, Activity } from 'lucide-react';
import { useSignals, Signal } from '@/hooks/useSignals';
import { cn } from '@/lib/utils';

export function SignalFeed() {
  const { data: signals = [], isLoading: loading, isError } = useSignals();

  return (
    <div className="h-[640px] flex flex-col border border-white/5 rounded-[2.5rem] bg-white/[0.01] backdrop-blur-[32px] overflow-hidden shadow-2xl relative group">
      {/* ── CINEMATIC DEPTH ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.02] to-transparent pointer-events-none" />
      {/* ── FIXED HEADER: CLS Prevention ── */}
      <div className="h-20 px-10 flex items-center border-b border-white/5 bg-white/[0.01] shrink-0 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shadow-[0_0_20px_rgba(0,229,255,0.1)]">
            <Activity className="w-5 h-5 text-cyan-500" />
          </div>
          <div>
            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em] font-sans">Alpha Stream</h3>
            <p className="text-[8px] font-mono text-white/20 uppercase tracking-[0.5em] mt-0.5">Sovereign Intelligence Origin</p>
          </div>
        </div>
        
        <div className="ml-auto flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/5 bg-black/40">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </div>
          <span className="text-[9px] font-black text-cyan-400 uppercase tracking-[0.2em] font-mono">Synced</span>
        </div>
      </div>
      
      {/* ── SCROLLABLE STAGE: aria-live enabled ── */}
      <div 
        className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar" 
        aria-live="polite" 
        aria-atomic="false"
      >
        <AnimatePresence initial={false}>
          {(() => {
            if (loading) {
              return new Array(6).fill(null).map((_, i) => (
                <SignalSkeleton key={`signal-skel-${i}`} />
              ));
            }
            if (isError) {
              return (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <p className="text-xs font-black text-red-400 uppercase tracking-widest mb-2">Transmission Interrupted</p>
                  <p className="text-[10px] text-white/20 uppercase tracking-widest leading-relaxed">Failed to establish link with sovereign signal nodes.</p>
                </div>
              );
            }
            return signals?.map((signal) => (
              <SignalRow key={signal.id} signal={signal} />
            ));
          })()}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SignalRow({ signal }: { readonly signal: Signal }) {
  const isBuy = signal.direction === 'BUY';
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="group relative p-6 rounded-[1.75rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all duration-300"
    >
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center border shrink-0 transition-transform group-hover:scale-105",
            isBuy 
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
              : "bg-red-500/10 border-red-500/20 text-red-500"
          )}>
            {isBuy ? <TrendingUp className="w-7 h-7" /> : <TrendingDown className="w-7 h-7" />}
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-lg font-black text-white tracking-tighter uppercase leading-none">
              {signal.symbol} <span className={cn("ml-2 text-xs", isBuy ? "text-emerald-400" : "text-red-400")}>{signal.direction}</span>
            </span>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-white/10" />
              <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">
                {new Date(signal.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-10">
          <div className="flex flex-col items-end gap-1.5">
            <span className="text-[8px] font-black text-white/10 uppercase tracking-[0.4em]">Price_Origin</span>
            <span className="text-base font-mono font-black text-white tabular-nums">{signal.entry?.toFixed(5) || '0.00000'}</span>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className="text-[8px] font-black text-white/10 uppercase tracking-[0.4em]">Target_Node</span>
            <span className="text-base font-mono font-black text-emerald-400 tabular-nums">{signal.take_profit?.toFixed(5) || '0.00000'}</span>
          </div>
        </div>
      </div>
      
      {/* Precision Marker */}
      <div className={cn(
        "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/4 rounded-r-full opacity-20 group-hover:opacity-100 transition-opacity",
        isBuy ? "bg-emerald-500" : "bg-red-500"
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
