import React from "react";
import { motion } from "motion/react";
import { Activity, Target, Zap, Clock } from "lucide-react";
import { cn } from "@/utils/cn";

interface StatsGridProps {
  licenseCount: number;
  fidelityRate: string;
  signalCount: number;
  totalPoints: number;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ licenseCount, fidelityRate, signalCount, totalPoints }) => {
  const statsConfig = [
    { label: "Active Engines", value: licenseCount, icon: Activity, color: "text-emerald-500", helper: "ALGO CLEARANCE" },
    { label: "Alpha Fidelity", value: fidelityRate, icon: Target, color: "text-cyan-500", helper: "PROBABILISTIC" },
    { label: "Signal Velocity", value: signalCount, icon: Zap, color: "text-emerald-500", helper: "DAILY PULSE" },
    { label: "Yield Points", value: totalPoints.toLocaleString(), icon: Clock, color: "text-emerald-500", helper: "NET ACCRUAL" }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
      {statsConfig.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.8 }}
          className="p-10 rounded-[48px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl hover:border-emerald-500/30 transition-all group relative overflow-hidden shadow-royale"
        >
          {/* Subtle Royal Rim */}
          <div className="absolute inset-0 border border-white/5 rounded-[48px] group-hover:border-emerald-500/20 transition-colors pointer-events-none" />
          
          <div className="flex justify-between items-start mb-10">
            <div className={cn("p-4 rounded-2xl bg-white/5 border border-white/5", stat.color)}>
              <stat.icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black tracking-[0.4em] text-gray-600 uppercase font-mono group-hover:text-gold transition-colors">{stat.helper}</span>
          </div>

          <div className="text-5xl font-black text-white mb-3 tracking-tighter tabular-nums italic">
             {stat.value}
          </div>
          <div className="text-[12px] font-black uppercase tracking-[0.3em] text-gray-500 font-mono group-hover:text-emerald-400 transition-colors">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
