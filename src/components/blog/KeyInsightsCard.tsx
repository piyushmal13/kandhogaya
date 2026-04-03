import React from "react";
import { motion } from "motion/react";
import { Zap, Target, BookOpen, Clock, Activity } from "lucide-react";

interface KeyInsightsProps {
  insights: string[];
}

export const KeyInsightsCard: React.FC<KeyInsightsProps> = ({ insights }) => {
  if (!insights || insights.length === 0) {
    // Default fallback insights for institutional feel
    insights = [
      "Institutional order flow analysis.",
      "Macroeconomic impact assessment.",
      "Risk management protocols."
    ];
  }

  const icons = [Zap, Target, Activity, BookOpen, Clock];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="bg-zinc-900/50 backdrop-blur-xl p-8 rounded-[40px] border border-white/5 relative overflow-hidden group shadow-2xl h-full"
    >
      {/* Decorative gradient */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 blur-[80px] group-hover:scale-150 transition-transform duration-[3s]" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-inner group-hover:scale-110 transition-transform duration-500">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white uppercase tracking-tighter">
              Institutional Takeaways
            </h3>
            <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.3em] mt-1">
              Core Execution Summary
            </p>
          </div>
        </div>

        <ul className="space-y-6">
          {insights.map((insight, idx) => {
            const Icon = icons[idx % icons.length];
            const keyId = `insight-${idx}-${insight.substring(0, 10)}`;
            return (
              <motion.li
                key={keyId}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.07] transition-all group/item"
              >
                <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-emerald-400 group-hover/item:text-emerald-300 transition-colors">
                  <Icon className="w-4 h-4 shadow-2xl" />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">
                    0{idx + 1} Insight
                  </div>
                  <p className="text-gray-300 text-[13px] leading-relaxed font-medium">
                    {insight}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </ul>
        
        <div className="mt-12 p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/10 text-center">
            <p className="text-[10px] text-emerald-500/70 font-black uppercase tracking-[0.2em]">
                Verified Analysis Signal
            </p>
        </div>
      </div>
    </motion.div>
  );
};
