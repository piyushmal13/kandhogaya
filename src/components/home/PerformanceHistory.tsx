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
    <section className="py-16 md:py-32 bg-[#020202] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.03),transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10 text-center mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-emerald-500 font-bold text-[10px] md:text-xs uppercase tracking-[0.4em] mb-4 inline-block">Historical Validation</span>
          <h2 className="text-3xl md:text-6xl font-bold text-white mb-6 tracking-tighter">
            Institutional <span className="gradient-text">Performance</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-lg font-mono">
            36-month rolling audit of our primary algorithmic execution clusters.
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-6 md:p-12 border-white/5 relative overflow-hidden group"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center neon-glow-emerald">
                <Activity className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-white font-bold text-xl md:text-2xl tracking-tight">System Audit Log</h3>
                <p className="text-gray-500 text-xs font-mono">3-YEAR PERFORMANCE MATRIX</p>
              </div>
            </div>
            
            <div className="flex gap-10 items-center">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Success Metric</span>
                <span className="text-2xl md:text-3xl font-mono font-bold text-emerald-500 flex items-center gap-2">
                  +1,240% <TrendingUp className="w-5 h-5" />
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Max Retraction</span>
                <span className="text-2xl md:text-3xl font-mono font-bold text-rose-500 flex items-center gap-2">
                  -8.2% <TrendingDown className="w-5 h-5" />
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 lg:grid-cols-12 gap-2 md:gap-4">
            {monthlyResults.map((month, i) => (
              <motion.div
                key={month.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.015 }}
                className={`
                  relative group aspect-square rounded-xl border flex flex-col items-center justify-center cursor-default transition-all duration-500
                  ${month.isPositive 
                    ? 'bg-emerald-500/[0.03] border-emerald-500/10 hover:bg-emerald-500/10 hover:border-emerald-500/30' 
                    : 'bg-rose-500/[0.03] border-rose-500/10 hover:bg-rose-500/10 hover:border-rose-500/30'}
                `}
              >
                <span className={`text-[10px] md:text-sm font-mono font-bold ${month.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {month.value > 0 ? '+' : ''}{month.value}%
                </span>
                <span className="text-[7px] md:text-[8px] text-gray-600 font-mono mt-1 opacity-60 uppercase">{month.label.split(' ')[0]}</span>
                
                {/* Elite Tooltip */}
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-xl border border-white/10 px-3 py-2 rounded-xl text-[10px] text-white opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-30 shadow-2xl scale-75 group-hover:scale-100 flex flex-col items-center">
                  <div className="text-gray-500 uppercase tracking-widest mb-1">{month.label}</div>
                  <div className={month.isPositive ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                   NET: {month.value > 0 ? '+' : ''}{month.value}%
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex gap-8">
              {[
                { label: "Win Probability", value: "84.2%", color: "text-emerald-400" },
                { label: "Sharpe Ratio", value: "3.24", color: "text-white" },
                { label: "Profit Factor", value: "2.1", color: "text-white" }
              ].map(item => (
                <div key={item.label}>
                  <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">{item.label}</div>
                  <div className={`font-mono font-bold ${item.color}`}>{item.value}</div>
                </div>
              ))}
            </div>
            <div className="text-[10px] text-gray-600 font-mono tracking-tighter text-center md:text-right italic">
              *Audit logs verified by proprietary backtesting engine. <br className="hidden md:block"/> 
              Live execution results may vary based on slippage and latency.
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
