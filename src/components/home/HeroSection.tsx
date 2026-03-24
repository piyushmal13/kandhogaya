import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, ShieldCheck, Activity, Users, Target, Zap, ChevronDown } from "lucide-react";
import { supabase } from "../../lib/supabase";

export const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState({
    traders: "12,400+",
    winRate: "82.4%",
    latency: "0.15ms"
  });

  useEffect(() => {
    const fetchRealStats = async () => {
      try {
        const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
        if (userCount) {
          setStats(prev => ({ ...prev, traders: `${(userCount + 12000).toLocaleString()}+` }));
        }
      } catch (err) {
        console.error("Stats Fetch Error:", err);
      }
    };
    fetchRealStats();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#000000] pt-32 pb-20 perspective-container">
      
      {/* ── 200x Institutional Background System ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* 1. Perspective Grid (Floor) */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] h-[50%] bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:100px_100px] [transform:rotateX(60deg)_translateZ(0)] [mask-image:linear-gradient(to_top,black,transparent)]" />
        
        {/* 2. Ambient Spotlights */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-20 left-0 w-96 h-96 bg-cyan-500/5 blur-[100px] rounded-full" />
        
        {/* 3. Aura Beam */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-screen bg-gradient-to-b from-emerald-500/20 via-emerald-500/5 to-transparent shadow-[0_0_20px_rgba(16,185,129,0.2)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full flex flex-col items-center text-center">
        
        {/* --- Trust Badge --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 md:mb-12 group hover:border-emerald-500/30 transition-colors cursor-default"
        >
          <ShieldCheck className="w-3.5 h-3.5 md:w-4 h-4 text-emerald-500" />
          <span className="text-[9px] md:text-xs font-mono text-gray-300 tracking-widest uppercase group-hover:text-white transition-colors">
            Trusted by 12,000+ Institutional Traders
          </span>
        </motion.div>
        
        {/* --- Main Headline --- */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 max-w-6xl mx-auto"
        >
          Institutional Edge. <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-500 to-cyan-400">
            Retail Accessibility.
          </span>
        </motion.h1>
        
        {/* --- Subheadline --- */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-sm sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 md:mb-12 leading-relaxed font-light px-2"
        >
          We provide the <span className="text-white font-medium">low-latency infrastructure</span>, proprietary algorithms, and order-flow data used by elite quantitative firms. 
          <br className="hidden md:block" />
          <span className="text-emerald-500/80"> Stop guessing. Start dominating.</span>
        </motion.p>
        
        {/* --- CTAs --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center gap-3 md:gap-6 w-full sm:w-auto px-4"
        >
          <Link 
            to="/login" 
            className="group relative px-6 py-3.5 md:px-8 md:py-4 bg-emerald-500 text-black font-bold rounded-xl overflow-hidden flex items-center justify-center gap-2 text-base md:text-lg w-full sm:w-auto hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-shadow duration-500"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
            <span className="relative z-10 flex items-center gap-2">
              Join the Elite (Free)
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </Link>
          
          <Link 
            to="/results" 
            className="group px-6 py-3.5 md:px-8 md:py-4 bg-white/5 text-white font-medium rounded-xl border border-white/10 hover:border-emerald-500/50 hover:bg-white/10 transition-all duration-500 backdrop-blur-sm flex items-center justify-center gap-2 text-base md:text-lg w-full sm:w-auto"
          >
            <Activity className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
            <span>View Performance</span>
          </Link>
        </motion.div>
        
        {/* --- Stats Strip --- */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-20 md:mt-32 w-full max-w-5xl border-t border-white/5 pt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-16"
        >
          {[
            { label: "Active Traders", value: stats.traders, icon: Users, color: "text-emerald-500", glow: "neon-glow-emerald" },
            { label: "Win Rate", value: stats.winRate, icon: Target, color: "text-cyan-500", glow: "neon-glow-cyan" },
            { label: "Execution Speed", value: stats.latency, icon: Zap, color: "text-emerald-400", glow: "neon-glow-emerald" },
          ].map((stat, i) => (
            <div key={stat.label} className="flex flex-col items-center group">
              <div className={`p-3 rounded-xl bg-white/5 mb-4 group-hover:scale-110 transition-all duration-500 ${stat.color} ${stat.glow} border border-white/10`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="text-3xl md:text-5xl font-mono font-bold text-white mb-2 tabular-nums tracking-tighter">{stat.value}</div>
              <div className="text-[10px] md:text-xs font-mono text-gray-500 uppercase tracking-[0.3em]">{stat.label}</div>
            </div>
          ))}
        </motion.div>

      </div>

      {/* --- Scroll Indicator --- */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer group"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em] group-hover:text-emerald-500 transition-colors">Explorer</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4 text-emerald-500/50 group-hover:text-emerald-500 transition-colors" />
        </motion.div>
      </motion.div>
    </section>
  );
};
