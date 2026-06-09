import React from "react";
import { motion } from "motion/react";
import { containerVariants, itemVariants } from "@/lib/motion";

const INTEGRATION_PARTNERS = [
  {
    name: "MetaTrader 5",
    logo_url: "/metatrader5.svg",
    className: "h-8 sm:h-9 md:h-10"
  },
  {
    name: "MetaTrader 4",
    logo_url: "/metatrader4.svg",
    className: "h-8 sm:h-9 md:h-10"
  },
  {
    name: "TradingView",
    logo_url: "/tradingview.svg",
    className: "h-6 sm:h-7 md:h-8"
  },
  {
    name: "cTrader",
    logo_url: "https://help.ctrader.com/ctrader-web/img/logo.png",
    className: "h-7 sm:h-8 md:h-9"
  },
  {
    name: "Binance",
    logo_url: "/binance.svg",
    className: "h-6 sm:h-7 md:h-8"
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
   
            {/* Ultra-Premium Flat Logo Row (No Boxes, Original Brand Colors) */}
            <motion.div 
              variants={itemVariants} 
              className="w-full max-w-5xl mx-auto flex flex-wrap justify-center items-center gap-10 sm:gap-14 md:gap-16"
            >
              {INTEGRATION_PARTNERS.map((partner) => (
                <div 
                  key={partner.name} 
                  className="group relative flex items-center justify-center transition-all duration-500 ease-out"
                >
                  {/* Subtle Glow on Hover */}
                  <div className="absolute inset-0 bg-white/[0.01] blur-[30px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none scale-150" />
                  
                  {/* Logo Image */}
                  <img 
                    src={partner.logo_url} 
                    alt={partner.name} 
                    draggable={false}
                    loading="lazy"
                    className={`${partner.className} w-auto object-contain transition-all duration-500 ease-out transform group-hover:scale-[1.08]`}
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

