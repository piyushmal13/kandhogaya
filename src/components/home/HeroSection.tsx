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
    <section ref={containerRef} className="relative min-h-[110vh] flex flex-col items-center justify-center overflow-hidden bg-[#000000] pt-48 pb-40 perspective-container">
      
      {/* ── 200x Institutional Background System ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* 1. Perspective Grid (Floor) */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[220%] h-[60%] bg-[linear-gradient(rgba(131,255,200,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(131,255,200,0.05)_1px,transparent_1px)] bg-[size:120px_120px] [transform:rotateX(65deg)_translateZ(0)] [mask-image:linear-gradient(to_top,black,transparent)]" />
        
        {/* 2. Ambient Spotlights */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[800px] bg-[#83ffc8]/5 blur-[160px] rounded-full opacity-60" />
        <div className="absolute -bottom-40 left-0 w-[600px] h-[600px] bg-cyan-500/5 blur-[120px] rounded-full" />
        <div className="absolute -bottom-40 right-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full" />
        
        {/* 3. Aura Beam (Centric) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-screen bg-gradient-to-b from-[#83ffc8]/30 via-[#83ffc8]/5 to-transparent shadow-[0_0_30px_rgba(131,255,200,0.3)] opacity-80" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full flex flex-col items-center text-center">
        
        {/* --- Trust Badge --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-2xl mb-12 md:mb-16 group hover:border-[#83ffc8]/20 transition-all cursor-default"
        >
          <ShieldCheck className="w-4 h-4 text-[#83ffc8] opacity-80" />
          <span className="text-[10px] md:text-[11px] font-sans font-medium text-gray-400 tracking-[0.3em] uppercase group-hover:text-white transition-colors">
            Institutional Infrastructure for Sophisticated Investors
          </span>
        </motion.div>
        
        {/* --- Main Headline --- */}
        <motion.h1 
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-7xl md:text-9xl font-semibold text-white mb-12 max-w-7xl mx-auto tracking-[-0.05em] leading-[0.9]"
        >
          Institutional <span className="italic font-serif text-[#83ffc8]">Edge</span>. <br className="hidden lg:block" />
          <span className="opacity-40">Retail</span> <span className="italic font-serif opacity-40">Accessibility</span>.
        </motion.h1>
        
        {/* --- Subheadline --- */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg sm:text-2xl md:text-3xl text-gray-400 max-w-4xl mx-auto mb-16 md:mb-20 leading-relaxed font-light px-4 opacity-80 uppercase tracking-widest"
        >
          Access the <span className="text-white font-medium">multi-layered execution protocols</span>, proprietary HFT logic, and global market-flow datasets utilized by elite quantitative funds.
        </motion.p>
        
        {/* --- CTAs --- */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row justify-center gap-8 w-full sm:w-auto px-6"
        >
          <Link 
            to="/login" 
            className="group relative px-12 py-6 bg-white text-black font-semibold rounded-full overflow-hidden flex items-center justify-center gap-3 text-xl w-full sm:w-auto hover:shadow-[0_0_80px_rgba(255,255,255,0.2)] transition-all duration-700"
          >
            <div className="absolute inset-0 bg-[#83ffc8] translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[0.16,1,0.2,1]" />
            <span className="relative z-10 flex items-center gap-3 tracking-tight">
              Access Institutional Terminal
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-500" />
            </span>
          </Link>
          
          <Link 
            to="/results" 
            className="group px-12 py-6 bg-white/[0.01] text-white font-medium rounded-full border border-white/5 hover:border-[#83ffc8]/30 hover:bg-white/[0.03] transition-all duration-700 backdrop-blur-3xl flex items-center justify-center gap-3 text-xl w-full sm:w-auto"
          >
            <Activity className="w-6 h-6 text-[#83ffc8] opacity-60 group-hover:scale-110 transition-transform" />
            <span className="tracking-tight opacity-80 group-hover:opacity-100">Global Performance</span>
          </Link>
        </motion.div>
        
        {/* --- Stats Strip --- */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-24 md:mt-40 w-full max-w-6xl border-t border-white/5 pt-16 grid grid-cols-1 sm:grid-cols-3 gap-12 md:gap-24"
        >
          {[
            { label: "Active Deployments", value: stats.traders, icon: Users, color: "text-[#83ffc8]" },
            { label: "Institutional Win Rate", value: stats.winRate, icon: Target, color: "text-cyan-400" },
            { label: "Execution Pipeline", value: stats.latency, icon: Zap, color: "text-emerald-400" },
          ].map((stat, i) => (
            <div key={stat.label} className="flex flex-col items-center group">
              <div className={`p-4 rounded-2xl bg-white/[0.02] mb-6 group-hover:scale-110 transition-all duration-700 ${stat.color} border border-white/5 group-hover:border-current/20 shadow-2xl`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-4xl md:text-7xl font-sans font-semibold text-white mb-3 tabular-nums tracking-[-0.05em]">{stat.value}</div>
              <div className="text-[10px] md:text-xs font-sans font-medium text-gray-500 uppercase tracking-[0.4em] opacity-60 group-hover:opacity-100 transition-opacity">{stat.label}</div>
            </div>
          ))}
        </motion.div>

      </div>

      {/* --- Scroll Indicator --- */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 cursor-pointer group"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <span className="text-[10px] font-sans font-medium text-gray-500 uppercase tracking-[0.3em] group-hover:text-[#83ffc8] transition-colors opacity-60">Architectural Core</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-[#83ffc8]/40 group-hover:text-[#83ffc8] transition-colors" />
        </motion.div>
      </motion.div>
    </section>
  );
};
