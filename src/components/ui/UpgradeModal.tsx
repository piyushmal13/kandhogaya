import React from "react";
import { X, ShieldCheck, Zap, Star, LayoutGrid, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredPlan?: 'pro' | 'elite';
  title?: string;
  description?: string;
}

/**
 * Institutional Upgrade Modal (Phase 3)
 * 
 * Conversion engine for elite surfaces (AlgoTerminal, Premium Webinars).
 * Provides a highly structural breakdown of platform entitlements.
 */

export const UpgradeModal = ({ isOpen, onClose, requiredPlan = 'pro', title, description }: UpgradeModalProps) => {
  if (!isOpen) return null;

  const features = [
    { icon: Zap, text: "Institutional-Grade Intelligence Logic", sub: "Exact entry, SL, and TP for all setups." },
    { icon: LayoutGrid, text: "Algo Terminal Discovery", sub: "Explore proprietary systematic trading bots." },
    { icon: ShieldCheck, text: "Validated Performance", sub: "Equity growth tranches updated in real-time." },
    { icon: Star, text: "Elite Execution Masterclasses", sub: "Live institutional analysis with the research desk." },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl bg-zinc-950 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)]"
        >
          {/* Top Banner */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500" />

          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 text-gray-400 transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-10 md:p-14 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] uppercase font-mono tracking-widest mb-6">
              Platform Entitlements
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-[-0.03em]">
              {title || `Unlock ${requiredPlan.toUpperCase()} Power`}
            </h2>
            <p className="text-base text-gray-500 mb-10 max-w-sm mx-auto">
              {description || "Join 12,000+ traders moving toward institutional-grade execution surface intelligence."}
            </p>

            <div className="grid gap-6 text-left mb-12">
              {features.map((f, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-3xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                    <f.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm md:text-base mb-1">{f.text}</h4>
                    <p className="text-xs md:text-sm text-gray-500 leading-tight">{f.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link 
              to="/marketplace" 
              className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(16,185,129,0.2)] hover:shadow-[0_0_60px_rgba(16,185,129,0.3)] text-base md:text-lg mb-4"
            >
              <span>Explore The Marketplace</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <p className="text-[10px] text-gray-600 font-mono tracking-widest uppercase">
              7-Day Institutional Refund Policy Active
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
