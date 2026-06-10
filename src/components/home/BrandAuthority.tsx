import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { containerVariants, itemVariants } from "@/lib/motion";
import { supabase } from "@/lib/supabase";

const INTEGRATION_PARTNERS_BACKUP = [
  {
    name: "MetaTrader 5",
    logo_url: "/metatrader5.svg"
  },
  {
    name: "MetaTrader 4",
    logo_url: "/metatrader4.svg"
  },
  {
    name: "TradingView",
    logo_url: "/tradingview.svg"
  },
  {
    name: "cTrader",
    logo_url: "/ctrader.png"
  },
  {
    name: "Binance",
    logo_url: "/binance.svg"
  }
];

const PRESS = [
  "Bloomberg Terminal", "Reuters Finance", "Financial Times", "Nasdaq Institutional", "Business Insider"
];

export const BrandAuthority = () => {
  const [partners, setPartners] = useState<any[]>([]);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const { data, error } = await supabase
          .from("banners")
          .select("id, title, image_url, description")
          .eq("placement", "partner")
          .eq("is_active", true)
          .order("priority", { ascending: true });

        if (error) throw error;
        if (data && data.length > 0) {
          const mapped = data.map((item) => ({
            name: item.title,
            logo_url: item.image_url
          }));
          setPartners(mapped);
        } else {
          setPartners(INTEGRATION_PARTNERS_BACKUP);
        }
      } catch (err) {
        console.error("Error fetching homepage partner logos:", err);
        setPartners(INTEGRATION_PARTNERS_BACKUP);
      }
    };
    fetchPartners();
  }, []);
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
   
            {/* Ultra-Premium Flat Logo Row (Standardized square bounding boxes, centered, uniform size) */}
            <motion.div 
              variants={itemVariants} 
              className="w-full max-w-5xl mx-auto flex flex-wrap justify-center items-center gap-6 sm:gap-10 md:gap-12"
            >
              {partners.map((partner) => (
                <div 
                  key={partner.name} 
                  className="group relative flex flex-col items-center gap-2 transition-all duration-500 ease-out"
                >
                  {/* Clean, borderless floating logo */}
                  <div className="w-24 h-12 sm:w-32 sm:h-16 flex items-center justify-center relative">
                    
                    {/* Logo Image */}
                    <img 
                      src={partner.logo_url} 
                      alt={partner.name} 
                      draggable={false}
                      loading="lazy"
                      className="max-w-full max-h-full object-contain drop-shadow-md"
                    />
                  </div>
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

