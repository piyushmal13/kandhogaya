import React from "react";
import { motion } from "motion/react";
import { containerVariants, itemVariants } from "@/lib/motion";

const PARTNERS = [
  { name: "Binance", logo: "https://cryptologos.cc/logos/binance-coin-bnb-logo.svg" },
  { name: "MetaTrader 5", logo: "https://upload.wikimedia.org/wikipedia/commons/2/23/MetaTrader_4_logo.png" },
  { name: "Amazon Web Services", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" },
  { name: "TradingView", logo: "https://images.crunchbase.com/image/upload/c_pad,h_256,w_256,f_auto,q_auto:eco,dpr:1/v1481103649/k4c5p4t2gqjymnld10c9.png" },
  { name: "Stripe", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/1024px-Stripe_Logo%2C_revised_2016.svg.png" },
];

const PRESS = [
  "Bloomberg Terminal", "Reuters Finance", "Financial Times", "Forbes", "Nasdaq Institutional", "Business Insider"
];

export const BrandAuthority = () => {
  return (
    <section className="py-24 bg-[#0A0A0A] border-y border-white/5 overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col gap-16"
        >
          {/* Logo Matrix */}
          <motion.div variants={itemVariants} className="text-center mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30">
              Institutional Integration Partners
            </span>
          </motion.div>

          <motion.div 
            variants={itemVariants} 
            className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-700"
          >
            {PARTNERS.map((partner) => (
              <img 
                key={partner.name} 
                src={partner.logo} 
                alt={partner.name}
                className="h-8 md:h-10 w-auto object-contain hover:scale-110 transition-transform"
              />
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
