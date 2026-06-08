import React from "react";
import { motion } from "motion/react";
import { containerVariants, itemVariants } from "@/lib/motion";

const INTEGRATION_PARTNERS = [
  {
    name: "MetaTrader 5",
    logo_url: "https://www.metatrader5.com/i/metatrader-5-logo_2x.png",
    className: "h-7 sm:h-8 md:h-9",
    filter: "brightness(0) invert(1) opacity(0.85)"
  },
  {
    name: "MetaTrader 4",
    logo_url: "https://www.metatrader4.com/i/metatrader-4-logo_2x.png",
    className: "h-7 sm:h-8 md:h-9",
    filter: "brightness(0) invert(1) opacity(0.85)"
  },
  {
    name: "TradingView",
    logo_url: "/tradingview.svg",
    className: "h-5 sm:h-6 md:h-7",
    filter: "brightness(0) invert(1) opacity(0.85)"
  },
  {
    name: "cTrader",
    logo_url: "https://help.ctrader.com/ctrader-web/img/logo.png",
    className: "h-7 sm:h-8 md:h-9",
    filter: "brightness(1.3) saturate(0.9)"
  },
  {
    name: "Binance",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Binance_Logo.svg",
    className: "h-5 sm:h-6 md:h-7",
    filter: "brightness(0) invert(1) opacity(0.85)"
  }
];

const PRESS = [
  "Bloomberg Terminal", "Reuters Finance", "Financial Times", "Forbes", "Nasdaq Institutional", "Business Insider"
];

export const BrandAuthority = () => {
  return (
    <section className="py-16 md:py-24 bg-[#020305] relative overflow-hidden border-y border-white/[0.03]">
      {/* Premium Ambient Backgrounds */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.015)_0%,transparent_100%)] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col gap-14 md:gap-20"
        >
          <div className="flex flex-col items-center justify-center space-y-10 sm:space-y-14">
            <motion.div variants={itemVariants} className="text-center space-y-2">
              <h3 className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500/80">
                Seamless Infrastructure
              </h3>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-white">
                Institutional Integration Partners
              </p>
            </motion.div>
   
            {/* Ultra-Premium Uniform Logo Layout */}
            <motion.div 
              variants={itemVariants} 
              className="w-full max-w-5xl mx-auto flex flex-wrap justify-center items-center gap-6 sm:gap-8 md:gap-10"
            >
              {INTEGRATION_PARTNERS.map((partner) => (
                <div 
                  key={partner.name} 
                  className="group relative flex items-center justify-center px-6 sm:px-8 md:px-10 py-5 sm:py-6 rounded-2xl sm:rounded-3xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-500 ease-out"
                >
                  {/* Subtle Glow on Hover */}
                  <div className="absolute inset-0 bg-white/[0.03] blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  
                  {/* Logo Image */}
                  <img 
                    src={partner.logo_url} 
                    alt={partner.name} 
                    draggable={false}
                    loading="lazy"
                    style={{ filter: partner.filter }}
                    className={`${partner.className} w-auto object-contain group-hover:opacity-100 transition-all duration-500 ease-out transform group-hover:scale-[1.06]`}
                  />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Media Marquee */}
          <motion.div variants={itemVariants} className="relative mt-4 pt-12 border-t border-white/[0.03]">
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#020305] to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#020305] to-transparent z-10 pointer-events-none" />
            
            <div className="flex overflow-hidden whitespace-nowrap">
              <div className="animate-ticker flex gap-16 sm:gap-32 py-4">
                {[...PRESS, ...PRESS, ...PRESS].map((press, i) => (
                  <span 
                    key={i} 
                    className="text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] text-white/10 hover:text-white/30 transition-colors duration-500 cursor-default select-none"
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

