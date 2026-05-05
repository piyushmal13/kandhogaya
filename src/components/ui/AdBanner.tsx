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
        "group relative w-full rounded-[2.5rem] overflow-hidden border shadow-2xl transition-all duration-500",
        isInstitutional ? "border-emerald-500/20 bg-[#020202]" : "border-white/5 bg-[#080B12]"
      )}
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
        <img 
          src={banner.image_url?.startsWith('http') ? banner.image_url : getSupabasePublicUrl('banners', banner.image_url || '')} 
          alt={banner.title} 
          className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#020202] via-[#020202]/90 to-transparent" />
        
        {isInstitutional && (
          <div className="absolute top-0 right-0 p-20 opacity-[0.03] pointer-events-none">
            <Zap className="w-64 h-64 text-emerald-500" />
          </div>
        )}
      </div>

      <div className="relative z-10 p-8 md:p-14 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
        <div className="max-w-2xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em]">
              <Shield className="w-3 h-3" />
              {isInstitutional ? "Institutional Masterclass" : "Sovereign Node"}
            </div>
            {isInstitutional && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                Live Broadcast
              </div>
            )}
          </div>
          
          <h3 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-6 leading-[0.9]">
            {banner.title}
          </h3>
          
          <p className="text-lg text-white/50 leading-relaxed font-medium mb-10 max-w-xl">
            {banner.description}
          </p>

          <div className="flex flex-wrap items-center gap-6">
            {banner.link_url && (
              <a 
                href={banner.link_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-emerald-500 text-black font-black text-[11px] uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-[0_10px_30px_rgba(16,185,129,0.2)]"
              >
                Secure Entry Node <ArrowRight className="w-5 h-5" />
              </a>
            )}
            
            {isInstitutional && (
              <div className="flex items-center gap-6 py-4 px-6 rounded-2xl bg-white/5 border border-white/10">
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">1.2K+ Synchronized</span>
                    <span className="text-[8px] text-white/30 uppercase tracking-widest">Active Intelligence Nodes</span>
                 </div>
                 <div className="w-px h-6 bg-white/10" />
                 <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Verified Intel</span>
                 </div>
              </div>
            )}
          </div>
        </div>

        <div className="hidden xl:flex items-center gap-8">
           <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/20 blur-[60px] rounded-full animate-pulse" />
              <div className="relative p-10 rounded-[3rem] bg-black/40 backdrop-blur-2xl border border-white/10 flex flex-col items-center gap-6 shadow-3xl">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Users className="w-10 h-10 text-emerald-500" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-white tracking-tighter mb-1 uppercase">Institutional</div>
                  <div className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Execution Access</div>
                </div>
              </div>
           </div>
        </div>
      </div>

      {/* Decorative accent pulse */}
      <div 
        className="absolute bottom-0 left-0 h-1.5 transition-all duration-700 group-hover:w-full w-32"
        style={{ backgroundColor: accentColor, boxShadow: `0 0 30px ${accentColor}` }}
      />
    </motion.div>
  );
};

export default AdBanner;

