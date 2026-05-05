import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { bannerService, Banner } from "../../services/bannerService";
import { getSupabasePublicUrl } from "../../lib/supabase";
import { cn } from "../../lib/utils";

export const AdBanner: React.FC<{ placement?: string }> = ({ placement = "webinar" }) => {
  const [banner, setBanner] = useState<Banner | null>(null);

  useEffect(() => {
    const fetchBanner = async () => {
      const data = await bannerService.getBanners(placement);
      if (data && data.length) setBanner(data[0]);
    };
    fetchBanner();
  }, [placement]);

  if (!banner) return null;

  const accentColor = banner.metadata?.accent_color || "#10B981";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative w-full rounded-[2rem] overflow-hidden border border-white/5 bg-[#080B12] shadow-2xl"
    >
      <div className="absolute inset-0 z-0">
        <img 
          src={banner.image_url?.startsWith('http') ? banner.image_url : getSupabasePublicUrl('banners', banner.image_url || '')} 
          alt={banner.title} 
          className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080B12] via-[#080B12]/80 to-transparent" />
      </div>

      <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="max-w-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8" style={{ backgroundColor: accentColor }} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: accentColor }}>
              Sovereign Node
            </span>
          </div>
          
          <h3 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter mb-4">
            {banner.title}
          </h3>
          
          <p className="text-sm text-white/40 leading-relaxed font-medium mb-8">
            {banner.description}
          </p>

          {banner.link_url && (
            <a 
              href={banner.link_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              Initialize Intelligence <ArrowRight className="w-4 h-4" />
            </a>
          )}
        </div>

        <div className="hidden lg:flex items-center gap-4">
           <div className="p-6 rounded-[2rem] bg-black/40 backdrop-blur-xl border border-white/5 flex flex-col items-center gap-3">
              <ShieldCheck className="w-8 h-8" style={{ color: accentColor }} />
              <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] text-center">
                Audit <br /> Verified
              </span>
           </div>
        </div>
      </div>

      {/* Decorative accent pulse */}
      <div 
        className="absolute bottom-0 left-0 h-1 transition-all duration-500 group-hover:w-full w-24"
        style={{ backgroundColor: accentColor, boxShadow: `0 0 20px ${accentColor}` }}
      />
    </motion.div>
  );
};

export default AdBanner;
