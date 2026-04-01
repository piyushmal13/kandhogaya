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
    { label: "Active Algos", value: licenseCount, icon: Activity, color: "text-emerald-500" },
    { label: "Win Rate", value: winRate, icon: Target, color: "text-cyan-500" },
    { label: "Signals Today", value: signalCount, icon: Zap, color: "text-yellow-500" },
    { label: "Total Pips", value: totalPips.toLocaleString(), icon: Clock, color: "text-emerald-500" }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
      {statsConfig.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="p-6 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors"
        >
          <stat.icon className={cn("w-5 h-5 mb-4", stat.color)} />
          <div className="text-3xl font-bold text-white mb-1 tracking-tight tabular-nums">{stat.value}</div>
          <div className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
};
