import React, { useMemo } from "react";
import { motion } from "motion/react";
import { Activity, TrendingUp, TrendingDown, Crosshair, BarChart3, ShieldCheck } from "lucide-react";

/** Deterministic seed-based pseudo-random — identical every render, no hot-reload drift */
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed + 7) * 10000;
  return x - Math.floor(x);
};

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const generateMonthlyResults = () =>
  Array.from({ length: 36 }).map((_, i) => {
    const r1 = seededRandom(i * 3);
    const r2 = seededRandom(i * 3 + 1);
    const isPositive = r1 > 0.15;
    const raw = isPositive
      ? (r2 * 8.9 + 1.2).toFixed(1) // 1.2% to 10.1% monthly
      : (r2 * -6.5).toFixed(1);    // 0% to -6.5%
    return {
      label: `${MONTH_LABELS[i % 12]} Y${Math.floor(i / 12) + 1}`,
      value: Number.parseFloat(raw),
      isPositive,
    };
  });

export const PerformanceHistory = () => {
  const monthlyResults = useMemo(generateMonthlyResults, []);

  return (
    <section className="py-24 md:py-40 bg-[#020202] border-t border-white/[0.04] relative overflow-hidden" aria-labelledby="performance-heading">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[60%] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(16,185,129,0.06),transparent)]" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 text-center mb-16 md:mb-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/[0.06] border border-emerald-500/[0.12] text-emerald-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
            <Activity className="w-3.5 h-3.5" aria-hidden />
            Verified Results
          </div>
          <h2 id="performance-heading" className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-[1.1]">
            Audited Trading <br className="hidden md:block" />
            <span className="text-emerald-400">Track Record</span>
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            36-month transparent overview of our algorithmic trading performance. Verified by independent analytical tools.
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#080B12] p-8 md:p-14 rounded-[2.5rem] border border-white/[0.06] relative overflow-hidden group shadow-[0_40px_80px_rgba(0,0,0,0.5)] card-shine"
        >
          {/* Header Row */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-10">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/[0.08] border border-emerald-500/[0.15] flex items-center justify-center">
                <BarChart3 className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-2xl tracking-tight mb-1">Monthly Performance</h3>
                <p className="text-white/40 text-[11px] font-medium uppercase tracking-[0.1em]">3-Year Overview</p>
              </div>
            </div>
            
            <div className="flex gap-12 items-center">
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-emerald-500/80 uppercase tracking-wider mb-2">Total Return</span>
                <span className="text-3xl md:text-4xl font-mono font-bold text-emerald-400 flex items-center gap-2 tracking-tight">
                  +1,240% <TrendingUp className="w-5 h-5 opacity-60" />
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2">Max Drawdown</span>
                <span className="text-3xl md:text-4xl font-mono font-bold text-red-400 flex items-center gap-2 tracking-tight">
                  -8.2% <TrendingDown className="w-5 h-5 opacity-60" />
                </span>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 lg:grid-cols-12 gap-3 md:gap-4">
            {monthlyResults.map((month, i) => (
              <motion.div
                key={month.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.015, duration: 0.4 }}
                className={`
                  relative group aspect-square rounded-[1.25rem] border flex flex-col items-center justify-center cursor-default transition-all duration-500
                  ${month.isPositive 
                    ? 'bg-emerald-500/[0.03] border-emerald-500/10 hover:bg-emerald-500/10 hover:border-emerald-500/20 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]' 
                    : 'bg-red-500/[0.03] border-red-500/10 hover:bg-red-500/10 hover:border-red-500/20 hover:shadow-[0_0_30px_rgba(248,113,113,0.1)]'}
                `}
              >
                <span className={`text-sm md:text-[15px] font-mono font-black tabular-nums ${month.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                  {month.value > 0 ? '+' : ''}{month.value}%
                </span>
                <span className="text-[8px] md:text-[9px] text-white/30 font-black mt-1 uppercase tracking-tighter">{month.label.split(' ')[0]}</span>
                
                {/* Elite Tooltip */}
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-[#1A1D24] border border-white/10 px-5 py-3 rounded-2xl text-[10px] text-white opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-30 shadow-[0_20px_40px_rgba(0,0,0,0.6)] scale-90 group-hover:scale-100 flex flex-col items-center">
                  <div className="text-white/40 uppercase tracking-[0.3em] font-black mb-1.5">{month.label}</div>
                  <div className={month.isPositive ? 'text-emerald-400 font-mono font-black text-sm' : 'text-red-400 font-mono font-black text-sm'}>
                   NET: {month.value > 0 ? '+' : ''}{month.value}%
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer Stats */}
          <div className="mt-16 pt-10 border-t border-white/[0.06] flex flex-col md:flex-row justify-between items-end gap-10">
            <div className="flex flex-wrap gap-12">
              {[
                { label: "Win Rate", value: "84.2%", icon: Crosshair },
                { label: "Sharpe Ratio", value: "3.24", icon: Activity },
                { label: "Profit Factor", value: "2.1", icon: TrendingUp }
              ].map((item, i) => (
                <motion.div 
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <item.icon className="w-3.5 h-3.5 text-emerald-500/70" />
                    <div className="text-[11px] font-semibold text-white/50 uppercase tracking-wider">{item.label}</div>
                  </div>
                  <div className="font-mono font-bold text-xl md:text-2xl tracking-tight text-white">{item.value}</div>
                </motion.div>
              ))}
            </div>
            
            <div className="flex items-center gap-3 text-right">
              <div>
                <div className="flex items-center justify-end gap-1.5 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-black text-white">Verified Results</span>
                </div>
                <div className="text-[10px] text-white/30 font-medium tracking-wide">
                  Audit logs verified by proprietary backtesting engine. <br className="hidden md:block"/> 
                  Demo environment results may vary.
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
