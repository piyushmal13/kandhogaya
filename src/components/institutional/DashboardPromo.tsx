import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Cpu, ShieldAlert, Key, MessageSquare, Terminal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EliteButton } from '@/components/ui/Button';

/**
 * DashboardPromo — Elite Conversion & Algorithmic Onboarding Banner
 * Drives active interest to deploy systematic licenses or commission custom code.
 */
export function DashboardPromo() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="relative p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-br from-zinc-900/60 via-[#040609]/95 to-black border border-white/10 backdrop-blur-3xl overflow-hidden group shadow-2xl"
    >
      {/* Decorative Shimmer & Glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-emerald-500/10 via-cyan-500/[0.02] to-transparent blur-[80px] pointer-events-none group-hover:scale-110 transition-all duration-[1500ms]" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 md:gap-12">
        <div className="flex-1 space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-[0.25em]">
            <Terminal className="w-3.5 h-3.5" />
            Quantitative Infrastructure
          </div>

          <h3 className="text-3xl md:text-4xl font-black text-white uppercase italic leading-[1.05] tracking-tighter">
            Acquire Systematic <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 font-serif">Algorithmic Licenses.</span>
          </h3>

          <p className="text-xs md:text-sm text-gray-400 leading-relaxed uppercase tracking-wider max-w-xl">
            Bridge the execution gap with institutional-grade automation. Whether you seek to deploy our high-performance prop algorithms or translate a custom discretionary strategy into strict, lock-proof code, our platform provides complete execution integrity.
          </p>

          {/* Quick Core Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-3">
              <Key className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">100% Client-Owned Binaries</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Pre-Packaged Drawdown Shields</span>
            </div>
          </div>
        </div>

        {/* CTA Stack */}
        <div className="flex flex-col gap-3 w-full xl:w-auto shrink-0 md:max-w-xs xl:max-w-none">
          <EliteButton
            variant="gemini"
            glowEffect={true}
            size="lg"
            className="w-full justify-center text-center uppercase tracking-widest font-black"
            onClick={() => navigate('/marketplace')}
            trackingEvent="dash_promo_marketplace"
          >
            Acquire License
            <ArrowRight className="w-4 h-4 ml-1" />
          </EliteButton>

          <EliteButton
            variant="institutional-outline"
            size="lg"
            className="w-full justify-center border-white/10 hover:border-emerald-500/20 text-white/70 hover:text-white uppercase tracking-widest font-black"
            onClick={() => navigate('/consultation')}
            trackingEvent="dash_promo_custom"
          >
            <MessageSquare className="w-4 h-4 mr-2 text-emerald-500" />
            Custom Strategy Desk
          </EliteButton>
        </div>
      </div>
    </motion.div>
  );
}
