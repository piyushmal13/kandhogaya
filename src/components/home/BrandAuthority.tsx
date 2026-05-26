import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { containerVariants, itemVariants } from "@/lib/motion";
import { supabase } from "@/lib/supabase";

interface Partner {
  name: string;
  category: string;
  logo_url?: string;
  logo_svg?: React.ReactNode;
}

const FALLBACK_PARTNERS: Partner[] = [
  { 
    name: "MetaTrader 5", 
    category: "Trading Platform",
    logo_svg: (
      <svg className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    )
  },
  { 
    name: "TradingView", 
    category: "Charting Terminal",
    logo_svg: (
      <svg className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300 transition-colors" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  { 
    name: "Vantage Markets", 
    category: "Liquidity Bridge",
    logo_svg: (
      <svg className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  { 
    name: "VT Markets", 
    category: "Execution Partner",
    logo_svg: (
      <svg className="w-5 h-5 text-amber-400 group-hover:text-amber-300 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    )
  },
  { 
    name: "Markets4you", 
    category: "CFD Provider",
    logo_svg: (
      <svg className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
      </svg>
    )
  },
];

const PRESS = [
  "Bloomberg Terminal", "Reuters Finance", "Financial Times", "Forbes", "Nasdaq Institutional", "Business Insider"
];

export const BrandAuthority = () => {
  const [partners, setPartners] = useState<Partner[]>(FALLBACK_PARTNERS);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const { data, error } = await supabase
          .from("banners")
          .select("title, description, image_url")
          .eq("placement", "partner")
          .eq("is_active", true)
          .order("priority", { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          const mapped: Partner[] = data.map(b => ({
            name: b.title || "Integration Partner",
            category: b.description || "Integration Partner",
            logo_url: b.image_url || undefined
          }));
          setPartners(mapped);
        }
      } catch (err) {
        console.warn("[CRM] Failed to fetch dynamic brand authority partners:", err);
      }
    };

    fetchPartners();
  }, []);

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
            className="flex flex-wrap justify-center items-center gap-2.5 sm:gap-4 md:gap-6"
          >
            {partners.map((partner) => (
              <div 
                key={partner.name} 
                className="px-4 py-2.5 sm:px-6 sm:py-4 rounded-xl sm:rounded-[1.5rem] bg-white/[0.02] border border-white/[0.05] hover:border-emerald-500/20 hover:bg-emerald-500/[0.02] transition-all duration-500 flex items-center gap-2 sm:gap-3 group shadow-xl hover:scale-105"
              >
                {partner.logo_url ? (
                  <img src={partner.logo_url} alt={partner.name} className="h-4 w-auto object-contain opacity-40 group-hover:opacity-100 transition-opacity" />
                ) : partner.logo_svg ? (
                  <div className="w-5 h-5 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    {partner.logo_svg}
                  </div>
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover:animate-pulse" />
                )}
                <div className="flex flex-col text-left">
                  <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-white group-hover:text-emerald-400 transition-colors">
                    {partner.name}
                  </span>
                  <span className="text-[7px] sm:text-[8px] font-bold uppercase tracking-[0.2em] text-white/30 hidden sm:block">
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
              <div className="animate-ticker flex gap-12 sm:gap-20 py-4">
                {[...PRESS, ...PRESS, ...PRESS].map((press, i) => (
                  <span 
                    key={i} 
                    className="text-xs sm:text-sm font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-white/15 hover:text-emerald-400/40 transition-colors duration-500 cursor-default"
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

