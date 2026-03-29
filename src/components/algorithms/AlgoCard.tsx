import React from "react";
import { motion } from "motion/react";
import { Activity, TrendingUp, BarChart3, ShieldCheck, ArrowRight } from "lucide-react";
import { Product } from "../../types";
import { ResizedImage } from "../ui/ResizedImage";
import { Sparkline } from "../ui/Sparkline";
import { cn } from "../../utils/cn";

interface AlgoCardProps {
  algo: Product;
  onSelect: (algo: Product) => void;
}

export const AlgoCard = ({ algo, onSelect }: AlgoCardProps) => {
  const performance = algo.performance || {
    win_rate: 0,
    monthly_return: 0,
    drawdown: 0,
    total_trades: 0,
    is_live: false,
    equity_curve: [0, 0, 0, 0, 0]
  };

  const isPositive = performance.monthly_return >= 0;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-emerald-500/40 transition-all duration-500 flex flex-col h-full relative shadow-2xl hover:shadow-emerald-500/10"
    >
      {/* Top Intelligence Gradient */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 opacity-20 group-hover:opacity-100 transition-opacity duration-700" />

      <div className="relative h-56 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent z-10" />
        <ResizedImage 
          src={algo.image_url || `https://picsum.photos/seed/${algo.id}/800/450`} 
          alt={algo.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-40 group-hover:opacity-60"
        />
        
        {/* Verification Badge */}
        <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black tracking-[0.2em] uppercase backdrop-blur-md">
            <ShieldCheck className="w-3 h-3" />
            VIRTUALIZED TRADING
          </div>
          {performance.is_live && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] font-black tracking-[0.2em] uppercase backdrop-blur-md animate-pulse">
              <Activity className="w-3 h-3" />
              LIVE FEED ACTIVE
            </div>
          )}
        </div>

        {/* Mini Sparkline Overlay */}
        <div className="absolute top-6 right-6 z-20 opacity-40 group-hover:opacity-100 transition-all duration-700 bg-black/40 backdrop-blur-xl p-3 rounded-2xl border border-white/10">
          <Sparkline 
            data={performance.equity_curve} 
            color={isPositive ? "#10b981" : "#ef4444"} 
            width={80} 
            height={30} 
          />
        </div>
      </div>

      <div className="p-8 flex-1 flex flex-col relative">
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-2">
            <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] font-mono">
              {algo.category || "Institutional Grade"}
            </div>
            <h3 className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors uppercase italic tracking-tighter">
              {algo.name}
            </h3>
          </div>
        </div>

        {/* Institutional Metrics Terminal */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-white/[0.02] rounded-2xl p-4 border border-white/5 group-hover:border-emerald-500/10 transition-colors">
            <div className="flex items-center gap-2 text-[8px] text-gray-500 uppercase font-black tracking-widest mb-1.5">
              <TrendingUp className="w-3 h-3 text-emerald-500" />
              Monthly Return
            </div>
            <div className={cn(
              "text-lg font-black font-mono",
              isPositive ? "text-emerald-400" : "text-red-400"
            )}>
              {isPositive ? "+" : ""}{performance.monthly_return}%
            </div>
          </div>
          <div className="bg-white/[0.02] rounded-2xl p-4 border border-white/5 group-hover:border-emerald-500/10 transition-colors">
            <div className="flex items-center gap-2 text-[8px] text-gray-500 uppercase font-black tracking-widest mb-1.5">
              <BarChart3 className="w-3 h-3 text-emerald-500" />
              Win Probability
            </div>
            <div className="text-lg font-black font-mono text-white">
              {performance.win_rate}%
            </div>
          </div>
        </div>

        <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Pricing Structure</span>
            <div className="text-2xl font-black text-white tracking-tighter">
              ${algo.price}
              <span className="text-[10px] text-gray-500 uppercase tracking-widest ml-1 font-black">/ Quarter</span>
            </div>
          </div>
          <button 
            onClick={() => onSelect(algo)}
            className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all duration-500"
          >
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
