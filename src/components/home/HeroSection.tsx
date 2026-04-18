import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { InstitutionalBackground } from "../animations/InstitutionalBackground";

export const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  // Parallax fade for content as user scrolls down
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.4], [0, 100]);
  const scale = useTransform(scrollYProgress, [0, 0.4], [1, 0.95]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
      }
    },
  };

  return (
    <section 
      ref={sectionRef} 
      className="relative min-h-[92svh] sm:min-h-screen bg-[#020202] text-[#FAFAFA] flex flex-col justify-between pt-24 sm:pt-40 pb-16 px-6 lg:px-12 font-sans selection:bg-emerald-500 selection:text-black overflow-hidden"
    >
      <InstitutionalBackground />

      {/* 🧱 STRUCTURAL GRID OVERLAY (Stark, Silent) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Left Margin Line */}
        <div className="absolute top-0 left-6 lg:left-12 bottom-0 w-px bg-gradient-to-b from-white/[0.12] via-white/[0.05] to-transparent" />
        {/* Right Margin Line */}
        <div className="absolute top-0 right-6 lg:right-12 bottom-0 w-px bg-gradient-to-b from-white/[0.12] via-white/[0.05] to-transparent" />
        {/* Center Guide Line (Subtle) */}
        <div className="absolute top-0 left-1/2 bottom-0 w-px bg-gradient-to-b from-white/[0.04] to-transparent" />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ opacity, y, scale }} 
        className="relative z-10 w-full max-w-[1440px] mx-auto flex-1 flex flex-col justify-center"
      >
        {/* TOP META ROW */}
        <motion.div 
          variants={itemVariants}
          className="flex justify-between items-center border-b border-white/[0.08] pb-4 mb-16 sm:mb-24 text-[10px] uppercase tracking-[0.3em] font-black text-white/30"
        >
          <div className="flex items-center gap-4">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <span className="text-white">IFX_TRADES // ASIA INSTITUTIONAL DESK</span>
          </div>
          <span className="hidden sm:inline text-right font-mono">v4.0.2 // QUANT_READY</span>
        </motion.div>

        {/* DOMINANT TYPOGRAPHY */}
        <div className="max-w-[1100px]">
          <motion.h1 
            variants={itemVariants}
            className="text-[3.2rem] sm:text-7xl md:text-[7rem] lg:text-[9rem] leading-[0.9] sm:leading-[0.8] font-serif tracking-[-0.05em] mb-12 text-white break-words"
          >
            <span className="block italic text-white/40 mb-4 font-light">Systematic</span>
            <span className="block font-black uppercase tracking-tighter site-title-gradient">Intelligence.</span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-base md:text-xl text-white/50 font-light max-w-2xl leading-[1.8] tracking-tight mb-16"
          >
            Institutional-grade algorithmic execution models and sovereign macro diagnostics. We engineer high-probability methodologies for professional desks. 
            <span className="block mt-4 text-emerald-500/60 font-mono text-sm tracking-widest uppercase">Zero Retail Noise // Pure Alpha.</span>
          </motion.p>

          {/* BRUTALIST ACQUISITION FORM */}
          <motion.form 
            variants={itemVariants}
            onSubmit={async (e) => { 
              e.preventDefault(); 
              if(status !== 'idle') return;
              const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
              if(!email) return;
              setStatus('loading');
              
              if (supabase) {
                await supabase.from("leads").insert([{ email, source: "hero_institutional" }]);
              }
              
              setStatus('success');
              setTimeout(() => setStatus('idle'), 5000);
            }} 
            className="flex flex-col sm:flex-row items-stretch sm:items-end gap-10 sm:gap-8 max-w-xl"
          >
            <div className="flex-1 relative group">
              <span className="absolute -top-7 left-0 text-[9px] uppercase tracking-[0.3em] text-white/20 font-black group-focus-within:text-emerald-500/50 transition-colors">Encrypted Intake Node</span>
              <input 
                name="email"
                type="email" 
                required
                disabled={status !== 'idle'}
                placeholder="PROSPECTIVE CLIENT EMAIL" 
                className="bg-transparent border-b border-white/10 text-white pb-4 w-full focus:outline-none focus:border-emerald-500 transition-all text-sm font-mono tracking-[0.15em] placeholder:text-white/5 disabled:opacity-40"
              />
            </div>
            <button 
              disabled={status !== 'idle'}
              className="shrink-0 pb-4 text-xs uppercase font-black tracking-[0.25em] text-white/40 hover:text-white transition-all border-b border-transparent hover:border-emerald-500 flex items-center justify-between sm:justify-start gap-3 group disabled:opacity-50"
            >
              <span className="sm:hidden text-white/20 text-[9px] font-mono">Action // </span>
              {status === 'success' ? 'Connection Verified' : 'Access Sovereign Desk'}
              {status === 'success' ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform text-emerald-500" />
              )}
            </button>
          </motion.form>
        </div>
      </motion.div>

      {/* KPI FOOTER (Raw, text-driven data) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        style={{ opacity }}
        className="relative z-10 w-full max-w-[1440px] mx-auto flex flex-wrap gap-x-16 gap-y-8 border-t border-white/[0.08] pt-10 text-[10px] uppercase font-black tracking-[0.2em]"
      >
        <div className="flex flex-col gap-2 group cursor-default">
          <span className="text-white/20 group-hover:text-emerald-500/30 transition-colors">Curriculum Framework</span>
          <span className="text-white group-hover:translate-x-1 transition-transform">Quantitative Mastery v4</span>
        </div>
        <div className="flex flex-col gap-2 group cursor-default">
          <span className="text-white/20 group-hover:text-emerald-500/30 transition-colors">Analytics Protocol</span>
          <span className="text-white group-hover:translate-x-1 transition-transform">Macro Edge Diagnostics</span>
        </div>
        <div className="flex flex-col gap-2 group cursor-default">
          <span className="text-white/20 group-hover:text-emerald-500/30 transition-colors">Target Vector</span>
          <span className="text-white group-hover:translate-x-1 transition-transform">XAUUSD Institutional Logic</span>
        </div>
        <div className="flex flex-col gap-2 ml-auto">
          <span className="text-white/20 text-right">Network Status</span>
          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-3 justify-end">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Sovereign_Active
          </span>
        </div>
      </motion.div>
    </section>
  );
};

