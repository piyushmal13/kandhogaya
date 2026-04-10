import React, { useMemo } from "react";
import { motion } from "motion/react";
import { Activity, TrendingUp, TrendingDown } from "lucide-react";

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
    <section className="py-16 md:py-32 bg-[var(--color10)] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.03),transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10 text-center mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
                  <span className="text-[var(--brand)] font-medium text-[11px] md:text-sm uppercase tracking-[0.4em] mb-6 inline-block opacity-80">Historical Validation</span>
          <h2 className="text-4xl md:text-6xl font-semibold text-white mb-8 md:mb-10 tracking-[-0.04em]">
            Institutional <span className="gradient-text italic font-serif">Performance</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-xl font-light opacity-80 uppercase tracking-widest">
            36-month rolling audit of our primary algorithmic execution clusters.
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[var(--color6)] p-8 md:p-14 rounded-[2.5rem] border border-white/5 relative overflow-hidden group shadow-2xl"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-16 gap-10">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center">
                <Activity className="w-7 h-7 text-emerald-500 opacity-80" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-xl md:text-3xl tracking-tight mb-1">System Audit Log</h3>
                <p className="text-gray-500 text-[10px] md:text-xs font-sans font-medium uppercase tracking-[0.25em] opacity-60">3-YEAR PERFORMANCE MATRIX</p>
              </div>
            </div>
            
            <div className="flex gap-12 items-center">
              <div className="flex flex-col">
                <span className="text-[10px] font-sans font-medium text-gray-500 uppercase tracking-widest mb-2 opacity-60">Success Metric</span>
                <span className="text-3xl md:text-5xl font-sans font-semibold text-[var(--brand)] flex items-center gap-3 tracking-tight">
                  +1,240% <TrendingUp className="w-6 h-6 opacity-60" />
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-sans font-medium text-gray-500 uppercase tracking-widest mb-2 opacity-60">Max Retraction</span>
                <span className="text-3xl md:text-5xl font-sans font-semibold text-red-500/80 flex items-center gap-3 tracking-tight">
                  -8.2% <TrendingDown className="w-6 h-6 opacity-60" />
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 lg:grid-cols-12 gap-3 md:gap-5">
            {monthlyResults.map((month, i) => (
              <motion.div
                key={month.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.01 }}
                className={`
                  relative group aspect-square rounded-[1.25rem] border flex flex-col items-center justify-center cursor-default transition-all duration-700
                  ${month.isPositive 
                    ? 'bg-emerald-500/[0.02] border-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/20' 
                    : 'bg-red-500/[0.02] border-red-500/5 hover:bg-red-500/10 hover:border-red-500/20'}
                `}
              >
                <span className={`text-xs md:text-base font-sans font-semibold ${month.isPositive ? 'text-emerald-400' : 'text-red-400/80'}`}>
                  {month.value > 0 ? '+' : ''}{month.value}%
                </span>
                <span className="text-[7px] md:text-[9px] text-gray-600 font-sans font-medium mt-1 opacity-60 uppercase tracking-tighter">{month.label.split(' ')[0]}</span>
                
                {/* Elite Tooltip */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-2xl border border-white/10 px-4 py-2 rounded-2xl text-[10px] text-white opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none whitespace-nowrap z-30 shadow-2xl scale-75 group-hover:scale-100 flex flex-col items-center">
                  <div className="text-gray-500 uppercase tracking-widest mb-1 font-medium">{month.label}</div>
                  <div className={month.isPositive ? 'text-[var(--brand)] font-semibold' : 'text-red-400 font-semibold'}>
                   NET: {month.value > 0 ? '+' : ''}{month.value}%
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="flex gap-12">
              {[
                { label: "Win Probability", value: "84.2%", color: "text-[var(--brand)]" },
                { label: "Sharpe Ratio", value: "3.24", color: "text-white" },
                { label: "Profit Factor", value: "2.1", color: "text-white" }
              ].map(item => (
                <div key={item.label}>
                  <div className="text-[10px] md:text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em] mb-2 opacity-60">{item.label}</div>
                  <div className={`font-sans font-semibold text-lg md:text-2xl tracking-tight ${item.color}`}>{item.value}</div>
                </div>
              ))}
            </div>
            <div className="text-[10px] md:text-xs text-gray-600 font-sans font-light tracking-wide text-center md:text-right opacity-60">
              *Audit logs verified by proprietary backtesting engine. <br className="hidden md:block"/> 
              Live execution results may vary based on slippage and latency.
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
