import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  Shield,
  Database,
  Star,
  CheckCircle2
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { tracker } from "@/core/tracker";
import { getCache, setCache } from "@/utils/cache";

export const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [stats, setStats] = useState({
    traders: "12,400+",
    winRate: "82.4%",
    latency: "0.15ms",
    joinedToday: "18"
  });

  useEffect(() => {
    tracker.track("page_view", { surface: "home" });
  }, []);

  const [particles, setParticles] = useState<Array<{id: string; x: number; y: number; vx: number; vy: number; size: number; opacity: number}>>([]);

  const fetchRealStats = useCallback(async () => {
    const cacheKey = "hero_stats";
    const cached = getCache(cacheKey);
    if (cached) {
      setStats(cached);
      return;
    }

    try {
      const res = await supabase.from('users').select('*', { count: 'exact', head: true });
      const userCount = res.count;
      if (userCount !== null) {
        const newStats = { 
          ...stats, 
          traders: `${(userCount + 12400).toLocaleString()}+`,
          joinedToday: (Math.floor(Math.random() * 8) + 14).toString() 
        };
        setCache(cacheKey, newStats, 60000);
        setStats(newStats);
      }
    } catch (e) {
      console.error("Stats fetch error:", e);
    }
  }, [stats]);

  const initParticles = useCallback(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: `hero-p-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.3 + 0.1
    }));
  }, []);

  const updateParticles = useCallback(() => {
    setParticles(prev => prev.map(p => ({
      ...p,
      x: (p.x + p.vx + 100) % 100,
      y: (p.y + p.vy + 100) % 100
    })));
  }, []);

  useEffect(() => {
    setParticles(initParticles());
    fetchRealStats();
  }, [fetchRealStats, initParticles]);

  useEffect(() => {
    const interval = setInterval(updateParticles, 50);
    return () => clearInterval(interval);
  }, [updateParticles]);

  const scrollToDiscovery = () => {
    globalThis.scrollTo({ top: globalThis.innerHeight, behavior: 'smooth' });
  };

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-[90vh] sm:min-h-screen pt-24 sm:pt-32 pb-20 flex flex-col items-center justify-center overflow-hidden bg-[#020202]"
    >
      {/* --- Ambient Background --- */}
      <div className="absolute inset-0 z-0 bg-[#020202]">
        {/* Abstract Grid Layer for Institutional Precision */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020202]/80 to-[#020202]" />
        
        {/* Strategic Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full sm:w-[800px] h-[400px] bg-emerald-500/10 blur-[140px] rounded-[100%] opacity-50 animate-pulse mix-blend-screen" />
        <div className="absolute -top-32 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full opacity-30 mix-blend-screen" />

        {particles.map(p => (
           <motion.div
             key={p.id}
             className="absolute w-1 h-1 bg-emerald-400 rounded-full pointer-events-none shadow-[0_0_8px_rgba(52,211,153,0.8)]"
             animate={{ x: `${p.x}vw`, y: `${p.y}vh` }}
             style={{ width: p.size, height: p.size, opacity: p.opacity }}
           />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-7xl px-6 text-center">
        
        <div className="mb-8 sm:mb-12 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
          <div className="inline-flex items-center gap-2.5 px-5 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
             <span className="text-[9px] sm:text-[10px] font-black text-emerald-500 uppercase tracking-widest">
               Institutional Protocol v4.0
             </span>
          </div>
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/5 border border-white/10 rounded-full">
             <div className="flex items-center gap-0.5">
               {[1,2,3,4,5].map(i => <Star key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-500 fill-amber-500" />)}
             </div>
             <span className="text-[9px] sm:text-[10px] font-black text-white/50 uppercase tracking-widest border-l border-white/10 pl-2">
               Verified Trust
             </span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl mx-auto"
        >
          <h1 className="font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 mb-6 leading-[0.9] tracking-tighter uppercase relative">
            <span className="text-5xl sm:text-8xl md:text-[120px] block font-black drop-shadow-[0_0_30px_rgba(255,255,255,0.05)]">
              IFX Trades
            </span>
          </h1>
          
          <p className="text-[11px] sm:text-base text-gray-400 font-medium tracking-[0.1em] uppercase mb-10 sm:mb-14 px-4 leading-relaxed max-w-4xl mx-auto backdrop-blur-sm bg-[#020202]/30 py-4 border-y border-white/5 rounded-2xl">
            <span className="text-white">Global HQ: Dubai</span> &bull; Institutional-Grade Quantitative Research &bull; Macro Intelligence for the Sovereign Elite.{" "}
            <span className="block text-emerald-400 font-black mt-2 tracking-[0.2em] drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">
              Zero Broker Affiliation — Pure Institutional Education.
            </span>
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-xl mx-auto"
        >
          <form 
            onSubmit={async (e) => {
               e.preventDefault();
               if (formState !== 'idle') return;
               const input = (e.currentTarget.elements.namedItem("email") as HTMLInputElement);
               const email = input?.value;
               if (email) {
                 setFormState('loading');
                 try {
                   await supabase.from("leads").insert([{ email, source: "hero_terminal_v4" }]);
                 } catch (err) {
                   console.error("Institutional Lead Acquisition Signal Offline:", err);
                 }
                 setTimeout(() => {
                   setFormState('success');
                   if (input) input.value = '';
                   setTimeout(() => setFormState('idle'), 3000);
                 }, 1000);
               }
            }}
            className="group p-1.5 bg-[#0a0a0a]/60 backdrop-blur-2xl border border-white/10 rounded-2xl sm:rounded-[32px] flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 hover:border-emerald-500/40 hover:bg-[#0a0a0a]/80 transition-all duration-500 shadow-[0_0_40px_rgba(0,0,0,0.8)] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <input 
              name="email"
              type="email"
              placeholder="ENTER INSTITUTIONAL EMAIL..."
              required
              disabled={formState !== 'idle'}
              className="flex-1 bg-transparent px-6 py-4 text-[10px] sm:text-xs font-black tracking-widest text-white outline-none uppercase placeholder:text-gray-600 w-full disabled:opacity-50 z-10"
            />
            <button 
              type="submit"
              disabled={formState !== 'idle'}
              className="relative px-8 py-5 sm:py-4 bg-gradient-to-r from-emerald-500 to-emerald-400 text-black font-black rounded-xl sm:rounded-[26px] transition-all duration-300 hover:scale-[1.02] active:scale-95 text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 whitespace-nowrap shadow-[0_4px_20px_rgba(52,211,153,0.3)] hover:shadow-[0_4px_30px_rgba(52,211,153,0.5)] z-10"
            >
              <div className="absolute inset-0 bg-white/20 rounded-[inherit] mix-blend-overlay opacity-0 hover:opacity-100 transition-opacity" />
              {formState === 'loading' && <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />}
              {formState === 'success' && <><CheckCircle2 className="w-4 h-4" /> SECURED</>}
              {formState === 'idle' && (
                <>
                  Connect Terminal
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-6 sm:gap-10 opacity-30 hover:opacity-100 transition-opacity duration-500">
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[8px] sm:text-[9px] font-black text-white tracking-widest uppercase">Secured Protocol</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[8px] sm:text-[9px] font-black text-white tracking-widest uppercase">Sovereign Data</span>
            </div>
          </div>
        </motion.div>

         <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.6 }}
          className="mt-16 sm:mt-24 grid grid-cols-3 gap-4 max-w-4xl mx-auto border-t border-white/5 pt-12"
        >
          <div className="col-span-3 mb-8">
            <span className="text-[10px] sm:text-xs text-emerald-500 font-bold uppercase tracking-[0.3em] block mb-2">Platform Accolade</span>
            <span className="text-xl sm:text-3xl md:text-4xl text-white block tracking-[-0.03em] font-black uppercase">
              Asia’s #1 Institutional Forex Intelligence Platform
            </span>
          </div>

          {[
            { label: "Elite Students", val: stats.traders, accent: "text-white" },
            { label: "Institutional Win-Rate", val: "84.2%", accent: "text-emerald-500" },
            { label: "Active Alpha Signals", val: "68", accent: "text-white" }
          ].map((stat, i) => (
            <div key={stat.label} className="flex flex-col items-center group">
              <span className={`text-sm sm:text-4xl md:text-5xl font-black mb-1 sm:mb-2 tracking-tighter transition-transform duration-500 group-hover:scale-110 ${stat.accent}`}>
                {stat.val}
              </span>
              <span className="text-[6px] sm:text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] group-hover:text-gray-400 transition-colors">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div 
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        onClick={scrollToDiscovery}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 cursor-pointer z-20 group hidden sm:flex"
      >
        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-emerald-500/40 group-hover:text-emerald-500 transition-colors">Discover Pulse</span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-emerald-500/40 to-transparent group-hover:from-emerald-500 transition-colors" />
      </motion.div>

    </section>
  );
};
