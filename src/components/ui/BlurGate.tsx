import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, TrendingUp, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useAccess } from "../../hooks/useAccess";

interface BlurGateProps {
  children: React.ReactNode;
  requiredPlan: 'pro' | 'elite';
  title?: string;
  description?: string;
}

/**
 * Institutional Blur Gate (Phase 3)
 * 
 * High-fidelity glassmorphic mask for platform discovery layers. 
 * Allows users to see the presence of institutional data (transparency)
 * but masks specifics (SL/TP/Parameters) behind an elite-blur layer.
 */

export const BlurGate = ({ children, requiredPlan, title, description }: BlurGateProps) => {
  const { plan } = useAccess();
  
  // Logical entitlement check: elite satisfies pro, etc.
  const hasAccess = (requiredPlan === 'pro' && (plan === 'pro' || plan === 'elite')) || 
                   (requiredPlan === 'elite' && plan === 'elite');

  if (hasAccess) return <>{children}</>;

  return (
    <div className="relative group overflow-hidden rounded-2xl md:rounded-3xl border border-white/5 bg-zinc-950/20">
      {/* Underlying Discovery Layer (Transparent Data) */}
      <div className="blur-xl pointer-events-none opacity-20 select-none transform scale-[1.02]">
        {children}
      </div>

      {/* Institutional Gating Layer */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 md:p-12 text-center bg-black/40 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
              <ShieldAlert className="w-8 h-8" />
            </div>
          </div>

          <h3 className="text-xl md:text-3xl font-bold text-white mb-3 tracking-tight">
            {title || `${requiredPlan.toUpperCase()} Entitlement Required`}
          </h3>
          
          <p className="text-sm md:text-base text-gray-400 mb-8 leading-relaxed">
            {description || `Institutional ${requiredPlan === 'pro' ? 'Signals' : 'Algorithmic'} discovery is reserved for active platform licensees. Upgrade currently to unlock real-time execution parameters.`}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/marketplace" 
              className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(16,185,129,0.15)] group-hover:shadow-[0_0_60px_rgba(16,185,129,0.25)]"
            >
              <span>Explore Plans</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Bottom Intent Pulse */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent pointer-events-none" />
    </div>
  );
};
