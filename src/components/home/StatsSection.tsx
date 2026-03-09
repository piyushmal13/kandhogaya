import React from "react";
import { motion } from "motion/react";

const stats = [
  { 
    label: "AUM Managed", 
    value: "$42.8M", 
    sub: "+12.4% YTD",
    color: "text-emerald-400"
  },
  { 
    label: "Daily Volume", 
    value: "$1.2B", 
    sub: "Tier-1 Liquidity",
    color: "text-cyan-400"
  },
  { 
    label: "Active Algos", 
    value: "14,205", 
    sub: "99.99% Uptime",
    color: "text-white"
  },
  { 
    label: "Avg Execution", 
    value: "12ms", 
    sub: "Direct Market Access",
    color: "text-emerald-400"
  },
];

export const StatsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-[#020202] relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative p-5 md:p-8 bg-[#050505] hover:bg-white/[0.02] transition-colors duration-500 flex flex-col justify-center"
            >
              <div className="text-[9px] md:text-[10px] text-gray-500 font-mono uppercase tracking-[0.15em] md:tracking-[0.2em] mb-2 md:mb-4">
                {stat.label}
              </div>
              
              <div className={`text-2xl sm:text-3xl md:text-5xl font-mono font-bold tracking-tighter mb-1 md:mb-2 ${stat.color}`}>
                {stat.value}
              </div>
              
              <div className="text-[9px] md:text-xs text-gray-400 font-mono flex items-center gap-1.5 md:gap-2">
                <div className={`w-1 h-1 rounded-full ${stat.color.replace('text-', 'bg-')}`} />
                {stat.sub}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
