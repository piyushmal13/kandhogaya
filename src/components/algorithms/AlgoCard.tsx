import React from "react";
import { motion } from "motion/react";
import { Zap, BarChart3 } from "lucide-react";
import { Product } from "../../types";

interface AlgoCardProps {
  algo: Product;
  onSelect: (algo: Product) => void;
}

export const AlgoCard = ({ algo, onSelect }: AlgoCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden group hover:border-emerald-500/30 transition-all flex flex-col h-full relative"
    >
      {/* Top Gradient */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
        <img 
          src={algo.image_url || `https://picsum.photos/seed/${algo.id}/800/450`} 
          alt={algo.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-70 group-hover:opacity-100"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 z-20">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono tracking-widest uppercase">
            <Zap className="w-3 h-3" />
            {algo.category || "Algorithm"}
          </div>
        </div>
      </div>

      <div className="p-8 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">{algo.name}</h3>
            <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">{algo.description}</p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Strategy</div>
            <div className="text-sm font-bold text-emerald-400 font-mono truncate">{algo.category || "Quantitative"}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Risk Profile</div>
            <div className="text-sm font-bold font-mono text-emerald-400">Standard</div>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-500">Starting at</span>
            <div className="text-xl font-bold text-white">${algo.price}<span className="text-sm text-gray-500 font-normal">/mo</span></div>
          </div>
          <button 
            onClick={() => onSelect(algo)}
            className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-emerald-500 transition-colors text-sm"
          >
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};
