import React, { useMemo } from "react";
import { motion } from "motion/react";
import { Activity, TrendingUp, TrendingDown } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const generateCumulativeData = () => {
  let balance = 1000;
  return Array.from({ length: 12 }).map((_, i) => {
    const monthlyReturn = 3 + Math.random() * 8; // 3% to 11% monthly
    balance = balance * (1 + monthlyReturn / 100);
    return {
      name: MONTH_LABELS[i],
      growth: Number.parseFloat(balance.toFixed(2)),
      roi: Number.parseFloat(((balance - 1000) / 10).toFixed(1))
    };
  });
};

export const PerformanceHistory = () => {
  const data = useMemo(generateCumulativeData, []);

  return (
    <section className="py-16 md:py-24 bg-[#010101] relative overflow-hidden flex flex-col items-center">
      <div className="max-w-7xl mx-auto px-4 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-6 md:p-10 border-white/5 relative overflow-hidden group"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
            <div>
              <div className="flex items-center gap-3 text-emerald-500 font-mono text-xs tracking-[0.3em] mb-3 uppercase">
                <Activity className="w-4 h-4 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                Institutional Performance
              </div>
              <h2 className="text-white text-3xl md:text-5xl font-bold tracking-tighter">
                Compound <span className="text-emerald-500">Growth</span> Analysis
              </h2>
            </div>
            
            <div className="flex gap-10">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Annual Yield</span>
                <span className="text-2xl md:text-3xl font-mono font-bold text-white flex items-center gap-2">
                  1,240% <TrendingUp className="w-5 h-5 text-emerald-500" />
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Max Drawdown</span>
                <span className="text-2xl md:text-3xl font-mono font-bold text-rose-500 flex items-center gap-2">
                  -8.2% <TrendingDown className="w-5 h-5" />
                </span>
              </div>
            </div>
          </div>

          <div className="h-[300px] md:h-[450px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#4b5563', fontSize: 12, fontFamily: 'IBM Plex Mono' }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0a0a0a', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontFamily: 'IBM Plex Mono',
                    fontSize: '12px'
                  }}
                  itemStyle={{ color: '#10b981' }}
                  cursor={{ stroke: 'rgba(16,185,129,0.2)', strokeWidth: 2 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="growth" 
                  stroke="#10b981" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorGrowth)" 
                  animationDuration={2500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Win Probability", value: "84.2%" },
              { label: "Sharp Ratio", value: "3.42" },
              { label: "Profit Factor", value: "2.1" },
              { label: "Recovery Factor", value: "12.4" }
            ].map(metric => (
              <div key={metric.label}>
                <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">{metric.label}</div>
                <div className="text-white font-bold font-mono">{metric.value}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
