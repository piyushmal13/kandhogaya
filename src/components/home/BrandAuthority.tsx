import React from "react";
import { motion } from "motion/react";
import { containerVariants, itemVariants } from "@/lib/motion";

const PARTNERS = [
  { name: "MetaTrader 5", category: "Trading Platform" },
  { name: "TradingView", category: "Charting Terminal" },
  { name: "Vantage Markets", category: "Liquidity Bridge" },
  { name: "VT Markets", category: "Execution Partner" },
  { name: "Markets4you", category: "CFD Provider" },
];

const PRESS = [
  "Bloomberg Terminal", "Reuters Finance", "Financial Times", "Forbes", "Nasdaq Institutional", "Business Insider"
];

export const BrandAuthority = () => {
  return (
    <section className="py-12 md:py-24 bg-[#0A0A0A] border-y border-white/5 overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col gap-8 md:gap-16"
        >
          {/* Logo Matrix */}
          <motion.div variants={itemVariants} className="text-center mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30">
              Institutional Integration Partners
            </span>
          </motion.div>

          <motion.div 
            variants={itemVariants} 
            className="flex flex-wrap justify-center items-center gap-4 md:gap-6"
          >
            {PARTNERS.map((partner) => (
              <div 
                key={partner.name} 
                className="px-6 py-4 rounded-[1.5rem] bg-white/[0.02] border border-white/[0.05] hover:border-emerald-500/20 hover:bg-emerald-500/[0.02] transition-all duration-500 flex items-center gap-3 group shadow-xl hover:scale-105"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover:animate-pulse" />
                <div className="flex flex-col text-left">
                  <span className="text-[11px] font-black uppercase tracking-wider text-white group-hover:text-emerald-400 transition-colors">
                    {partner.name}
                  </span>
                  <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/30">
                    {partner.category}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Media Marquee */}
          <motion.div variants={itemVariants} className="relative mt-8">
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0A0A0A] to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0A0A0A] to-transparent z-10" />
            
            <div className="flex overflow-hidden whitespace-nowrap">
              <div className="animate-ticker flex gap-20 py-4">
                {[...PRESS, ...PRESS].map((press, i) => (
                  <span 
                    key={i} 
                    className="text-sm font-black uppercase tracking-[0.4em] text-white/10 hover:text-[#58F2B6]/40 transition-colors cursor-default"
                  >
                    {press}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
