import React, { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  Shield,
  Database
} from "lucide-react";
import { supabase } from "../../lib/supabase";

export const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState({
    traders: "12,400+",
    winRate: "82.4%",
    latency: "0.15ms"
  });
  const [particles, setParticles] = useState<Array<{id: string; x: number; y: number; vx: number; vy: number; size: number; opacity: number}>>([]);

  const fetchRealStats = useCallback(async () => {
    try {
      const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
      if (userCount) {
        setStats(prev => ({ ...prev, traders: `${(userCount + 12000).toLocaleString()}+` }));
      }
    } catch (e) {
      console.error("Stats fetch error:", e);
    }
  }, []);

  const initParticles = useCallback(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: `p-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.05,
      vy: (Math.random() - 0.5) * 0.05,
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
    fetchRealStats();
    setParticles(initParticles());
    const interval = setInterval(updateParticles, 50);
    return () => clearInterval(interval);
  }, [fetchRealStats, initParticles, updateParticles]);

  const scrollToDiscovery = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <div ref={containerRef} className="relative min-h-screen pt-32 pb-20 flex flex-col items-center justify-center overflow-hidden bg-black selection:bg-emerald-500/30">
      
      {/* --- Ambient Background --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full opacity-40 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />

        {/* Floating Particles */}
        {particles.map(p => (
           <motion.div
             key={p.id}
             className="absolute w-1 h-1 bg-emerald-500 rounded-full"
             animate={{ x: `${p.x}vw`, y: `${p.y}vh` }}
             style={{ width: p.size, height: p.size, opacity: p.opacity }}
           />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-7xl px-6 text-center">
        
        {/* --- Main Headline --- */}
        <motion.h1 
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-7xl md:text-8xl font-black text-white mb-6 leading-tight tracking-[-0.05em]"
        >
          Institutional <span className="italic font-serif text-emerald-500">Edge</span>. <br className="hidden lg:block" />
          <span className="opacity-40">Retail</span> <span className="italic font-serif opacity-40">Accessibility</span>.
        </motion.h1>
        
        {/* --- Subheadline --- */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-[11px] sm:text-lg md:text-xl text-gray-500 tracking-widest uppercase mb-12 px-8 max-w-3xl mx-auto leading-relaxed"
        >
          Access the multi-layered execution protocols, proprietary HFT logic, and global market-flow datasets utilized by elite quantitative funds.
        </motion.p>

        {/* --- CTA Unit --- */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center justify-center gap-6 w-full max-w-md mx-auto px-6"
        >
          <Link 
            to="/login"
            className="group relative px-8 py-5 bg-white text-black font-black rounded-full overflow-hidden transition-all duration-700 hover:scale-105 active:scale-95 shadow-[0_20px_60px_rgba(255,255,255,0.2)] w-full text-center text-base uppercase tracking-tighter"
          >
            <div className="absolute inset-0 bg-emerald-500 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
            <span className="relative z-10 flex items-center justify-center gap-3">
              Access Institutional Terminal
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
            </span>
          </Link>

          <div className="flex items-center justify-center gap-8 opacity-40 grayscale group hover:grayscale-0 transition-all duration-700">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-bold text-white tracking-[0.1em] leading-none uppercase">SSL SECURE</span>
                <span className="text-[7px] text-emerald-500/60 font-medium">BANK-GRADE</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-500" />
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-bold text-white tracking-[0.1em] leading-none uppercase">HFT GRID</span>
                <span className="text-[7px] text-emerald-500/60 font-medium">PROPRIETARY</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* --- One-Part Dashboard --- */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 md:mt-24 w-full grid grid-cols-3 gap-2 sm:gap-20 max-w-5xl mx-auto px-2 border-t border-white/5 pt-12"
        >
          {[
            { label: "Nodes", val: stats.traders, sub: "Live" },
            { label: "Win Rate", val: stats.winRate, sub: "Audited" },
            { label: "Latency", val: stats.latency, sub: "Pipeline" }
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center group border-x border-white/5 py-2">
              <span className="text-xl sm:text-5xl md:text-7xl font-bold text-white mb-1 sm:mb-4 tracking-tighter group-hover:text-emerald-500 transition-colors duration-700">
                {stat.val}
              </span>
              <span className="text-[8px] sm:text-[12px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-0.5 opacity-60 text-center">
                {stat.label}
              </span>
              <span className="text-[7px] text-emerald-500/40 font-medium uppercase tracking-[0.1em]">{stat.sub}</span>
            </div>
          ))}
        </motion.div>

      </div>

      {/* --- Scroll Indicator --- */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-20 hover:opacity-100 transition-opacity cursor-pointer md:block hidden"
        onClick={scrollToDiscovery}
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-white rotate-90 mb-8 whitespace-nowrap">Scroll Discovery</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-emerald-500 to-transparent" />
      </motion.div>

    </div>
  );
};
