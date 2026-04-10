import React from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Shield, Award, ExternalLink } from "lucide-react";

interface BrokerAdProps {
  name: string;
  logoUrl: string;
  referralUrl: string;
  tagline?: string;
  description?: string;
}

export const BrokerAdBanner: React.FC<BrokerAdProps> = ({ 
  name, 
  logoUrl, 
  referralUrl, 
  tagline = "Official Institutional Partner",
  description = "Access deep liquidity and institutional-grade spreads through our vetted partner."
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="my-12 p-[1px] rounded-3xl bg-gradient-to-br from-emerald-500/30 via-white/5 to-cyan-500/30 border border-white/10 group overflow-hidden"
    >
      <div className="bg-[var(--color7)] rounded-[23px] p-6 md:p-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform duration-[3s]">
          <Shield className="w-56 h-56 text-emerald-500" />
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          {/* Logo */}
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white flex items-center justify-center p-4 shadow-2xl shrink-0 group-hover:scale-105 transition-transform duration-500">
            <img 
              src={logoUrl || "https://upload.wikimedia.org/wikipedia/commons/4/4c/Binance_Logo.png"} 
              alt={name} 
              className="w-full h-full object-contain"
            />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-3 mb-2 justify-center md:justify-start">
              <span className="px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em]">
                {tagline}
              </span>
              <div className="flex items-center gap-1 text-amber-500 text-[10px] font-black uppercase tracking-widest">
                <Award className="w-3 h-3" />
                Vetted Liquidity
              </div>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter mb-3 leading-none">
              Trade with <span className="text-emerald-400">{name}</span>
            </h3>
            
            <p className="text-gray-400 text-sm leading-relaxed max-w-xl group-hover:text-gray-300 transition-colors">
              {description}
            </p>
          </div>
          
          <div className="shrink-0 flex flex-col gap-3 w-full md:w-auto">
            <a 
              href={referralUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-[11px] uppercase tracking-[0.15em] rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
            >
              Open Live Account
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <div className="flex items-center justify-center gap-2 text-[10px] text-gray-600 font-mono">
              <ExternalLink className="w-3 h-3 text-emerald-500/50" />
              <span>Institutional Referral Program</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
