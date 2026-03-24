import React, { useMemo } from "react";
import { motion } from "motion/react";
import { Activity } from "lucide-react";

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
      ? (r2 * 89 + 1).toFixed(1)
      : (r2 * -15).toFixed(1);
    return {
      label: `${MONTH_LABELS[i % 12]} Y${Math.floor(i / 12) + 1}`,
      value: Number.parseFloat(raw),
      isPositive,
    };
  });

export const PerformanceHistory = () => {
  const monthlyResults = useMemo(generateMonthlyResults, []);

  return (
    <section className="py-12 bg-[#020202] border-t border-white/5 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#050505] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <h3 className="text-white font-bold text-xl flex items-center gap-2">
              <Activity className="w-6 h-6 text-emerald-500" />
              Monthly Performance (3 Years)
            </h3>
            <div className="flex gap-4 text-xs font-mono text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Positive
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm bg-red-500" /> Negative
              </div>
            </div>
          </div>

          <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-12 gap-1.5 md:gap-3">
            {monthlyResults.map((month, i) => (
              <motion.div
                key={month.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.02 }}
                className={`
                  relative group aspect-square rounded-md md:rounded-lg border flex items-center justify-center cursor-default
                  ${month.isPositive 
                    ? 'bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20' 
                    : 'bg-red-500/10 border-red-500/20 hover:bg-red-500/20'}
                `}
              >
                <span className={`text-[8px] sm:text-[10px] md:text-xs font-mono font-bold ${month.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                  {month.value}%
                </span>
                
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black border border-white/10 px-3 py-1.5 rounded-lg text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-xl">
                  {month.label}: <span className={month.isPositive ? 'text-emerald-400' : 'text-red-400'}>{month.value > 0 ? '+' : ''}{month.value}%</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500 font-mono">
            <div className="flex items-center gap-6">
              <div>TOTAL RETURN: <span className="text-emerald-400 font-bold text-base">+1,240%</span></div>
              <div>MAX DRAWDOWN: <span className="text-red-400 font-bold text-base">-8.2%</span></div>
            </div>
            <div className="text-xs text-gray-600">
              *Past performance is not indicative of future results
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  );
};
