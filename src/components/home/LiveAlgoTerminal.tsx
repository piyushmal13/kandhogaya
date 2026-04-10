import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Activity, TrendingUp, TrendingDown, Shield, Lock } from "lucide-react";
import { useDataPulse } from "../../hooks/useDataPulse";
import { useAccess } from "../../hooks/useAccess";
import { UpgradeModal } from "../ui/UpgradeModal";
import { tracker } from "../../core/tracker";

/**
 * Deterministic seed-based pseudo-random using a linear congruential generator.
 */
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
};

const generateMonthlyResults = () =>
  Array.from({ length: 36 }).map((_, i) => {
    const r1 = seededRandom(i * 2);
    const r2 = seededRandom(i * 2 + 1);
    const isPositive = r1 > 0.15; // ~85% positive months
    const raw = isPositive
      ? (r2 * 8.9 + 1).toFixed(1)  // 1% to 10%
      : (r2 * -6).toFixed(1);      // 0% to -6%
    return {
      month: `M${i + 1}`,
      value: Number.parseFloat(raw),
      isPositive,
    };
  });

export const LiveAlgoTerminal = () => {
  const { signals } = useDataPulse();
  const { isElite } = useAccess();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const scanInterval = setInterval(() => {
       setIsScanning(true);
       setTimeout(() => setIsScanning(false), 2000);
    }, 8000);

    return () => {
      clearInterval(scanInterval);
    };
  }, []);

  const monthlyResults = useMemo(generateMonthlyResults, []);
  const positiveCount = useMemo(() => monthlyResults.filter(m => m.isPositive).length, [monthlyResults]);
  const bestMonth = useMemo(() => Math.max(...monthlyResults.map(m => m.value)), [monthlyResults]);

  const activeSignals = signals.slice(0, 5);

  return (
    <section className="py-24 md:py-32 bg-[var(--color10)] border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.03),transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left: Live Terminal (Compact) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1 bg-[var(--color6)] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden flex flex-col group/terminal"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-8">
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center gap-5 w-full">
                <div className="p-3 rounded-2xl bg-emerald-500/5 text-emerald-400 border border-emerald-500/10">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] text-[var(--color5)] font-mono font-bold uppercase tracking-[0.3em]">Institutional Protocol</div>
                  <div className="text-white font-bold font-mono text-xl">Systematic Flow <span className="text-[10px] text-emerald-400 ml-2 tracking-widest uppercase opacity-80 animate-pulse">Live</span></div>
                </div>
              </div>
            </div>

            {/* Trades List */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 relative min-h-[440px]">
              <AnimatePresence mode="popLayout">
                {activeSignals.map((signal, idx) => (
                  <motion.div
                    key={signal.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center justify-between p-5 bg-[var(--color26)]/40 border border-white/5 rounded-[1.5rem] hover:border-emerald-500/20 transition-all group"
                  >
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 group-hover:scale-110 ${
                        signal.direction === 'BUY' 
                          ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400' 
                          : 'bg-rose-500/5 border-rose-500/10 text-rose-400'
                      }`}>
                        {signal.direction === 'BUY' ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                      </div>
                      <div>
                        <div className="text-white font-bold text-base tracking-tight flex items-center gap-3 font-mono">
                          {signal.symbol}
                          <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold tracking-widest ${
                            signal.direction === 'BUY' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/5 border-rose-500/20 text-rose-400'
                          }`}>
                            {signal.direction}
                          </span>
                        </div>
                        <div className="text-[10px] text-[var(--color5)] font-mono font-bold mt-1 uppercase tracking-widest">
                          ENTRY: <span className="text-white/80">{signal.entry}</span> 
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Phase 3: Gated Control Overlay */}
              {!isElite && (
                <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-[var(--color6)] via-[var(--color6)]/80 to-transparent z-20 flex items-end justify-center pb-8 p-6">
                   <button 
                    onClick={() => {
                      tracker.track("algo_click", { context: "terminal_locked" });
                      setShowUpgrade(true);
                    }}
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(16,185,129,0.2)]"
                   >
                     <Lock className="w-4 h-4" />
                     <span>Unlock Educational Access</span>
                   </button>
                </div>
              )}

              {/* Matrix Scan Effect */}
              {isScanning && (
                <motion.div
                  initial={{ top: "-20%" }}
                  animate={{ top: "120%" }}
                  transition={{ duration: 2.5, ease: "linear" }}
                  className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent pointer-events-none z-10"
                >
                  <div className="absolute top-1/2 w-full h-px bg-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.4)]" />
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Right: Monthly Performance Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-[var(--color6)] border border-white/5 rounded-[2.5rem] p-10 md:p-14 shadow-2xl relative overflow-hidden"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
              <h3 className="text-white font-bold text-3xl flex items-center gap-4 tracking-[-0.03em]">
                <Activity className="w-8 h-8 text-emerald-400 border border-emerald-500/20 p-1.5 rounded-xl bg-emerald-500/5" />
                Educational Audit (36M)
              </h3>
              <div className="flex gap-8 text-[10px] font-mono font-bold uppercase tracking-[0.3em]">
                <div className="flex items-center gap-2 text-emerald-400">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" /> <span>Alpha Flow</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--color5)]">
                  <div className="w-2 h-2 rounded-full bg-rose-500/40" /> <span>Retraction</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-12 gap-3 md:gap-4">
              {monthlyResults.map((month, i) => (
                <motion.div
                  key={month.month}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.01 }}
                  className={`
                    relative group aspect-square rounded-[1rem] border flex items-center justify-center cursor-default transition-all duration-700
                    ${month.isPositive 
                      ? 'bg-emerald-500/[0.03] border-emerald-500/10 hover:bg-emerald-500/10 hover:border-emerald-500/20' 
                      : 'bg-rose-500/[0.03] border-rose-500/10 hover:bg-rose-500/10 hover:border-rose-500/20'}
                  `}
                >
                  <span className={`text-[10px] md:text-sm font-mono font-bold ${month.isPositive ? 'text-emerald-400/80' : 'text-rose-400/40'}`}>
                    {month.value}%
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="mt-14 pt-12 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-10">
              <div className="group">
                <div className="text-[10px] font-mono font-bold text-[var(--color5)] uppercase tracking-[0.3em] mb-2">Total Alpha</div>
                <div className="text-emerald-400 font-bold text-3xl md:text-4xl tracking-tighter">+1,240%</div>
              </div>
              <div className="group">
                <div className="text-[10px] font-mono font-bold text-[var(--color5)] uppercase tracking-[0.3em] mb-2">Portfolio MDD</div>
                <div className="text-rose-500/80 font-bold text-3xl md:text-4xl tracking-tighter">-8.2%</div>
              </div>
              <div className="group">
                <div className="text-[10px] font-mono font-bold text-[var(--color5)] uppercase tracking-[0.3em] mb-2">Win Velocity</div>
                <div className="text-white font-bold text-3xl md:text-4xl tracking-tighter">{positiveCount}/36M</div>
              </div>
              <div className="group">
                <div className="text-[10px] font-mono font-bold text-[var(--color5)] uppercase tracking-[0.3em] mb-2">Peak Capture</div>
                <div className="text-emerald-400/60 font-bold text-3xl md:text-4xl tracking-tighter">
                  +{bestMonth.toFixed(1)}%
                </div>
              </div>
            </div>

          </motion.div>

        </div>

      </div>

      <UpgradeModal 
        isOpen={showUpgrade} 
        onClose={() => setShowUpgrade(false)} 
        requiredPlan="elite"
        title="Educational Access Locked"
        description="Exploiting proprietary institutional liquidity clusters requires Elite-tier execution credentials. Upgrade currently to unlock full systematic control."
      />
    </section>
  );
};
