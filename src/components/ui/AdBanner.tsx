import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, ShieldCheck, Zap, Users, Shield } from "lucide-react";
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

  const meta = banner.metadata || {};
  const accentColor = meta.accent_color || "#10B981";
  const isInstitutional = meta.type === "institutional_broadcast" || banner.title.includes("Institutional");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "group relative w-full rounded-3xl md:rounded-[2.5rem] overflow-hidden border shadow-2xl transition-all duration-500 my-4",
        isInstitutional ? "border-emerald-500/20 bg-[#020202]" : "border-white/5 bg-[#080B12]"
      )}
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
        <img 
          src={banner.image_url?.startsWith('http') ? banner.image_url : getSupabasePublicUrl('banners', banner.image_url || '')} 
          alt={banner.title} 
          className="w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#020202] via-[#020202]/95 to-transparent" />
      </div>

      <div className="relative z-10 p-5 md:p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-4 mb-3 lg:mb-4">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em]">
              <Shield className="w-2.5 h-2.5" />
              {isInstitutional ? "Institutional Broadcast" : "Sovereign Node"}
            </div>
          </div>
          
          <h3 className="text-xl md:text-3xl lg:text-4xl font-black text-white uppercase tracking-tighter mb-2 leading-[0.95]">
            {banner.title}
          </h3>
          
          <p className="text-xs md:text-sm lg:text-base text-white/50 leading-relaxed font-medium mb-4 lg:mb-6 max-w-xl">
            {banner.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 lg:gap-6">
            {banner.link_url && (
              <a 
                href={banner.link_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-emerald-500 text-black font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-[0_10px_20px_rgba(16,185,129,0.1)] active:scale-95"
              >
                Secure Entry <ArrowRight className="w-4 h-4" />
              </a>
            )}
            
            {isInstitutional && (
              <div className="flex items-center gap-4 py-2.5 px-4 rounded-xl bg-white/5 border border-white/10">
                 <div className="flex flex-col">
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest leading-none mb-1">1.2K+ Connected</span>
                    <span className="text-[7px] text-white/30 uppercase tracking-widest">Active Nodes</span>
                 </div>
                 <div className="w-px h-4 bg-white/10" />
                 <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[9px] font-black text-white uppercase tracking-widest">Audited</span>
                 </div>
              </div>
            )}
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-8 shrink-0">
           <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/10 blur-[40px] rounded-full animate-pulse" />
              <div className="relative p-6 lg:p-8 rounded-[2.5rem] bg-black/40 backdrop-blur-2xl border border-white/10 flex flex-col items-center gap-4 shadow-2xl">
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Users className="w-6 h-6 lg:w-8 lg:h-8 text-emerald-500" />
                </div>
                <div className="text-center">
                  <div className="text-lg lg:text-xl font-black text-white tracking-tighter uppercase">Vault Access</div>
                  <div className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em]">Verified Tier</div>
                </div>
              </div>
           </div>
        </div>
      </div>

      {/* Decorative accent pulse */}
      <div 
        className="absolute bottom-0 left-0 h-1 transition-all duration-700 group-hover:w-full w-20"
        style={{ backgroundColor: accentColor, boxShadow: `0 0 20px ${accentColor}` }}
      />
    </motion.div>
  );
};


