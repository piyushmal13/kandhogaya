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

  if (!banner) {
    if (placement === "webinar") {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="group relative w-full rounded-3xl md:rounded-[2.5rem] overflow-hidden border border-white/5 bg-[#010203] shadow-2xl transition-all duration-500 my-4"
        >
          {/* Background Ambience */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/webinar_masterclass.png" 
              alt="Sponsorship Open" 
              className="w-full h-full object-cover opacity-15 group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#010203] via-[#010203]/95 to-transparent" />
          </div>

          <div className="relative z-10 p-6 md:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 md:gap-10">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[8px] font-black uppercase tracking-[0.2em] font-mono">
                  <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                  Systematic Broadcast
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[8px] font-black uppercase tracking-[0.2em] font-mono">
                  Hosting Soon
                </div>
              </div>
              
              <h3 className="text-xl md:text-4xl font-black text-white uppercase tracking-tighter mb-3 leading-none italic">
                Sponsorship <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 font-serif">Currently Open.</span>
              </h3>
              
              <p className="text-xs md:text-sm lg:text-base text-white/45 leading-relaxed font-medium mb-6 max-w-xl">
                Our strategy desk is compiling the next systematic gold & order flow volatility models. Partner with the leading systematic EA desk to broadcast to 1.2K+ active B2B nodes.
              </p>

              <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                <a 
                  href="/consultation?source=webinar_sponsor_banner"
                  className="inline-flex items-center gap-3 px-6 py-3.5 rounded-xl bg-blue-500 text-white font-black text-[10px] uppercase tracking-widest hover:bg-blue-400 transition-all shadow-[0_10px_20px_rgba(59,130,246,0.15)] active:scale-95 duration-300"
                >
                  Request Sponsor Slot <ArrowRight className="w-4 h-4" />
                </a>

                {/* Latency Stats */}
                <div className="flex items-center gap-4 py-2 px-4 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest leading-none mb-1 font-mono">NY4 / LD4 Co-located</span>
                      <span className="text-[7px] text-white/30 uppercase tracking-widest font-mono">Latency &lt;1.2ms</span>
                   </div>
                </div>
              </div>
            </div>

            {/* Glowing Graphic Container */}
            <div className="hidden lg:flex items-center gap-8 shrink-0 relative">
               <div className="absolute inset-0 bg-blue-500/10 blur-[40px] rounded-full animate-pulse" />
               <div className="relative p-6 lg:p-8 rounded-[2rem] bg-black/40 backdrop-blur-2xl border border-white/5 flex flex-col items-center gap-4 shadow-2xl">
                 <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                   <svg className="w-6 h-6 lg:w-8 lg:h-8 text-blue-500 animate-spin" style={{ animationDuration: '6s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                     <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                   </svg>
                 </div>
                 <div className="text-center">
                   <div className="text-sm font-black text-white tracking-tighter uppercase font-mono">Sponsor Vault</div>
                   <div className="text-[7px] font-black text-white/30 uppercase tracking-[0.3em] mt-0.5">Integration Ingress</div>
                 </div>
               </div>
            </div>
          </div>

          {/* Shifting decorative border bottom */}
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500" />
        </motion.div>
      );
    }
    return null;
  }

  const meta = banner.metadata || {};
  const accentColor = meta.accent_color || "#3B82F6";
  const isInstitutional = meta.type === "institutional_broadcast" || banner.title.includes("Institutional");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "group relative w-full rounded-3xl md:rounded-[2.5rem] overflow-hidden border shadow-2xl transition-all duration-500 my-4",
        isInstitutional ? "border-blue-500/20 bg-[#020202]" : "border-white/5 bg-[#080B12]"
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
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em]">
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
              banner.link_url.startsWith('#') ? (
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(banner.link_url.substring(1))?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-blue-500 text-white font-black text-[10px] uppercase tracking-widest hover:bg-blue-400 transition-all shadow-[0_10px_20px_rgba(59,130,246,0.1)] active:scale-95"
                >
                  Secure Entry <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <a 
                  href={banner.link_url}
                  target={banner.link_url.startsWith('http') ? "_blank" : undefined}
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-blue-500 text-white font-black text-[10px] uppercase tracking-widest hover:bg-blue-400 transition-all shadow-[0_10px_20px_rgba(59,130,246,0.1)] active:scale-95"
                >
                  Secure Entry <ArrowRight className="w-4 h-4" />
                </a>
              )
            )}
            
            {isInstitutional && (
              <div className="flex items-center gap-4 py-2.5 px-4 rounded-xl bg-white/5 border border-white/10">
                 <div className="flex flex-col">
                    <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest leading-none mb-1">1.2K+ Connected</span>
                    <span className="text-[7px] text-white/30 uppercase tracking-widest">Active Nodes</span>
                 </div>
                 <div className="w-px h-4 bg-white/10" />
                 <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-[9px] font-black text-white uppercase tracking-widest">Audited</span>
                 </div>
              </div>
            )}
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-8 shrink-0">
           <div className="relative">
              <div className="absolute inset-0 bg-blue-500/10 blur-[40px] rounded-full animate-pulse" />
              <div className="relative p-6 lg:p-8 rounded-[2.5rem] bg-black/40 backdrop-blur-2xl border border-white/10 flex flex-col items-center gap-4 shadow-2xl">
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Users className="w-6 h-6 lg:w-8 lg:h-8 text-blue-500" />
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
