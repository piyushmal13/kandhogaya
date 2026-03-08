import React from "react";
import { motion } from "motion/react";
import { Activity } from "lucide-react";

// Generate 36 months of random data (mostly positive)
const monthlyResults = Array.from({ length: 36 }).map((_, i) => {
  const isPositive = Math.random() > 0.15; // 85% positive months
  const value = isPositive 
    ? (Math.random() * 89 + 1).toFixed(1) // 1% to 90%
    : (Math.random() * -15).toFixed(1); // -0% to -15%
  
  return {
    month: `M${i + 1}`,
    value: parseFloat(value),
    isPositive
  };
});

export const PerformanceHistory = () => {
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

          <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-12 gap-3">
            {monthlyResults.map((month, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.02 }}
                className={`
                  relative group aspect-square rounded-lg border flex items-center justify-center cursor-default
                  ${month.isPositive 
                    ? 'bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20' 
                    : 'bg-red-500/10 border-red-500/20 hover:bg-red-500/20'}
                `}
              >
                <span className={`text-[10px] sm:text-xs font-mono font-bold ${month.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                  {month.value}%
                </span>
                
                {/* Tooltip */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black border border-white/10 px-3 py-1.5 rounded-lg text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-xl">
                  Month {i + 1}: <span className={month.isPositive ? 'text-emerald-400' : 'text-red-400'}>{month.value}%</span>
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
