import React from "react";
import { motion } from "motion/react";
import { Check, ShieldCheck, Zap, Activity, TrendingUp, BarChart3 } from "lucide-react";

interface AlgoCardProps {
  algo: any;
  onSelect: (algo: any) => void;
}

export const AlgoCard = ({ algo, onSelect }: AlgoCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden group hover:border-emerald-500/30 transition-all flex flex-col h-full relative"
    >
      {/* Top Gradient */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="p-8 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono tracking-widest uppercase mb-3">
              <Zap className="w-3 h-3" />
              {algo.strategy_type || algo.metadata?.strategy_type || "Algorithm"}
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">{algo.name}</h3>
            <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">{algo.description}</p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Win Rate</div>
            <div className="text-lg font-bold text-emerald-400 font-mono">{algo.win_rate || algo.metadata?.win_rate || "N/A"}%</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Risk Level</div>
            <div className={`text-lg font-bold font-mono ${
              (algo.risk_level || algo.metadata?.risk_level) === 'High' ? 'text-red-400' : 
              (algo.risk_level || algo.metadata?.risk_level) === 'Medium' ? 'text-yellow-400' : 'text-emerald-400'
            }`}>
              {algo.risk_level || algo.metadata?.risk_level || "Standard"}
            </div>
          </div>
        </div>

        {/* Supported Assets */}
        <div className="mb-8">
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Supported Assets</div>
          <div className="flex flex-wrap gap-2">
            {(algo.supported_assets || algo.metadata?.supported_assets || ['Forex', 'Crypto']).map((asset: string, i: number) => (
              <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-gray-300 font-mono">
                {asset}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-500">Starting at</span>
            <div className="text-xl font-bold text-white">${algo.monthly_price || algo.metadata?.monthly_price || algo.price || 99}<span className="text-sm text-gray-500 font-normal">/mo</span></div>
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
