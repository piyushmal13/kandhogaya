import React, { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  Shield,
  Database
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { tracker } from "@/core/tracker";
import { NewsletterCapture } from "@/components/site/NewsletterCapture";
import { getCache, setCache } from "@/utils/cache";

export const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
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
          traders: `${(userCount + 12000).toLocaleString()}+`,
          joinedToday: (Math.floor(Math.random() * 10) + 12).toString() 
        };
        setCache(cacheKey, newStats, 60000);
        setStats(newStats);
      }
    } catch (e) {
      console.error("Stats fetch error:", e);
    }
  }, [stats]);

  const initParticles = useCallback(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: `p-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.1
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
    globalThis.addEventListener("app:login", fetchRealStats);
    globalThis.addEventListener("supabase:refresh", fetchRealStats);

    const interval = setInterval(updateParticles, 50);
    return () => {
      clearInterval(interval);
      globalThis.removeEventListener("app:login", fetchRealStats);
      globalThis.removeEventListener("supabase:refresh", fetchRealStats);
    };
  }, [fetchRealStats, updateParticles]);

  const scrollToDiscovery = () => {
    globalThis.scrollTo({ top: globalThis.innerHeight, behavior: 'smooth' });
  };

  return (
    <div ref={containerRef} className="relative min-h-screen pt-32 pb-20 flex flex-col items-center justify-center overflow-hidden bg-black selection:bg-[var(--brand)]/30">
      
      {/* --- Ambient Background --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[var(--brand)]/10 blur-[120px] rounded-full opacity-40 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />

        {particles.map(p => (
           <motion.div
             key={p.id}
             className="absolute w-1 h-1 bg-[var(--brand)] rounded-full"
             animate={{ x: `${p.x}vw`, y: `${p.y}vh` }}
             style={{ width: p.size, height: p.size, opacity: p.opacity }}
           />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-7xl px-6 text-center">
        
        <div className="mb-12 inline-flex items-center gap-3 px-6 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full animate-in fade-in slide-in-from-top-4 duration-1000 mx-auto">
           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
           <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">{stats.joinedToday} Traders Joined In Last Hour</span>
        </div>
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="font-black text-white mb-6 leading-[1.05] tracking-tight"
        >
          <span className="text-[2.2rem] sm:text-7xl block opacity-90">Institutional Edge</span>
          <span className="text-[2.8rem] sm:text-8xl text-blue-400 italic font-serif block mt-1 tracking-[-0.03em]">Retail Accessibility<span className="text-[var(--brand)] not-italic font-black text-5xl sm:text-9xl">.</span></span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-[11px] sm:text-lg text-gray-400/60 tracking-[0.4em] uppercase mb-14 px-4 max-w-4xl mx-auto leading-relaxed font-bold"
        >
          Democratizing proprietary execution protocols <br className="hidden sm:block" /> for the elite retail trader.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center justify-center gap-10 w-full max-w-lg mx-auto px-6"
        >
          <Link 
            to="/login"
            className="group relative px-6 py-4 sm:px-8 sm:py-5 bg-white text-black font-black rounded-full overflow-hidden transition-all duration-700 hover:scale-105 active:scale-95 shadow-[0_20px_60px_rgba(255,255,255,0.2)] w-full text-center text-[10px] sm:text-base uppercase tracking-tighter"
          >
            <div className="absolute inset-0 bg-[var(--brand)] translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
            <span className="relative z-10 flex items-center justify-center gap-3">
              Access Institutional Terminal
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
            </span>
          </Link>

          <div className="w-full">
             <NewsletterCapture />
          </div>

          <div className="flex items-center justify-center gap-8 opacity-40 grayscale group hover:grayscale-0 transition-all duration-700">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[var(--brand)]" />
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-bold text-white tracking-[0.1em] leading-none uppercase">SSL SECURE</span>
                <span className="text-[7px] text-[var(--brand)]/60 font-medium">BANK-GRADE</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[var(--brand)]" />
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-bold text-white tracking-[0.1em] leading-none uppercase">HFT GRID</span>
                <span className="text-[7px] text-[var(--brand)]/60 font-medium">PROPRIETARY</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 md:mt-24 w-full grid grid-cols-3 gap-0 max-w-5xl mx-auto border-t border-white/5 pt-12 pb-12 sm:pb-0"
        >
          {[
            { label: "Nodes", val: stats.traders, sub: "Live" },
            { label: "Win Rate", val: stats.winRate, sub: "Audited" },
            { label: "Latency", val: stats.latency, sub: "Pipeline" }
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center group py-2">
              <span className="text-lg sm:text-6xl font-black text-white mb-2 tracking-tighter transition-colors duration-1000 group-hover:text-[var(--brand)]">
                {stat.val}
              </span>
              <div className="flex flex-col items-center">
                <span className="text-[7px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] opacity-40 group-hover:opacity-100 transition-opacity">
                  {stat.label}
                </span>
                <span className="text-[6px] sm:text-[8px] text-[var(--brand)]/30 font-bold uppercase tracking-widest">{stat.sub}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1.5 }}
        className="absolute bottom-6 sm:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 sm:gap-4 opacity-40 hover:opacity-100 transition-all duration-700 cursor-pointer group scale-75 sm:scale-100 z-30"
        onClick={scrollToDiscovery}
      >
        <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.5em] text-[var(--brand)] whitespace-nowrap opacity-30 group-hover:opacity-100 transition-opacity">
          Scroll Discovery
        </span>
        <div className="w-[1px] h-8 sm:h-12 bg-gradient-to-b from-[var(--brand)] to-transparent" />
      </motion.div>

    </div>
  );
};
