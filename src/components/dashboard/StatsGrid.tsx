import React from "react";
import { motion } from "motion/react";
import { Activity, Target, Zap, Clock } from "lucide-react";
import { cn } from "@/utils/cn";

interface StatsGridProps {
  licenseCount: number;
  winRate: string;
  signalCount: number;
  totalPips: number;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ licenseCount, winRate, signalCount, totalPips }) => {
  const statsConfig = [
    { label: "Active Engines", value: licenseCount, icon: Activity, color: "text-emerald-500", helper: "ALGO CLEARANCE" },
    { label: "Alpha Win Rate", value: winRate, icon: Target, color: "text-cyan-500", helper: "PROBABILISTIC" },
    { label: "Signal Velocity", value: signalCount, icon: Zap, color: "text-emerald-500", helper: "DAILY PULSE" },
    { label: "Systemic Pips", value: totalPips.toLocaleString(), icon: Clock, color: "text-emerald-500", helper: "NET ACCRUAL" }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
      {statsConfig.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05 }}
          className="p-8 rounded-[40px] bg-black/40 border border-white/5 backdrop-blur-3xl hover:border-emerald-500/30 transition-all group relative overflow-hidden"
        >
          {/* Subtle Glow */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent group-hover:via-emerald-500/30 transition-all duration-700" />
          
          <div className="flex justify-between items-start mb-6">
            <div className={cn("p-2 rounded-xl bg-white/5 border border-white/5", stat.color)}>
              <stat.icon className="w-4 h-4" />
            </div>
            <span className="text-[7px] font-black tracking-[0.3em] text-gray-600 uppercase font-mono">{stat.helper}</span>
          </div>

          <div className="text-4xl font-black text-white mb-2 tracking-tighter tabular-nums italic">
             {stat.value}
          </div>
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 font-mono group-hover:text-emerald-500 transition-colors">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
