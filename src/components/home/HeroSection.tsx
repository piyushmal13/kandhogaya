import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import { supabase } from "../../lib/supabase";

export const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  // Parallax fade for content as user scrolls down
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.4], [0, 50]);

  return (
    <section 
      ref={sectionRef} 
      className="relative min-h-[92svh] sm:min-h-[95svh] bg-[#020202] text-[#FAFAFA] flex flex-col justify-between pt-24 sm:pt-36 pb-12 px-6 lg:px-12 font-sans selection:bg-white selection:text-black overflow-hidden"
    >
      {/* 🧱 STRUCTURAL GRID OVERLAY (Stark, Silent) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Left Margin Line */}
        <div className="absolute top-0 left-6 lg:left-12 bottom-0 w-px bg-gradient-to-b from-white/[0.08] to-transparent" />
        {/* Right Margin Line */}
        <div className="absolute top-0 right-6 lg:right-12 bottom-0 w-px bg-gradient-to-b from-white/[0.08] to-transparent" />
        {/* Center Guide Line (Subtle) */}
        <div className="absolute top-0 left-1/2 bottom-0 w-px bg-gradient-to-b from-white/[0.02] to-transparent" />
      </div>

      <motion.div 
        style={{ opacity, y }} 
        className="relative z-10 w-full max-w-[1440px] mx-auto flex-1 flex flex-col justify-center"
      >
        {/* TOP META ROW */}
        <div className="flex justify-between items-center border-b border-white/[0.08] pb-4 mb-12 sm:mb-20 text-[9px] uppercase tracking-[0.25em] font-bold text-white/40">
          <span className="text-white">IFX_TRADES // ASIA DESK</span>
          <span className="hidden sm:inline text-right">Macro Research & Algorithmic Education</span>
        </div>

        {/* DOMINANT TYPOGRAPHY */}
        <div className="max-w-[1000px]">
          <h1 className="text-[2.8rem] sm:text-6xl md:text-[6rem] lg:text-[8rem] leading-[0.95] sm:leading-[0.85] font-serif tracking-[-0.04em] mb-10 text-white break-words">
            <span className="block italic text-white/60 mb-2">Systematic</span>
            <span className="block font-black uppercase tracking-tight">Intelligence.</span>
          </h1>
          
          <p className="text-sm md:text-base text-white/50 font-light max-w-xl leading-[1.8] tracking-wide mb-14">
            Institutional-grade algorithmic execution training and macroeconomic diagnostics. We engineer precision methodologies for sovereign markets. No retail noise.
          </p>

          {/* BRUTALIST ACQUISITION FORM */}
          <form 
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
            className="flex flex-col sm:flex-row items-stretch sm:items-end gap-8 sm:gap-6 max-w-lg"
          >
            <div className="flex-1 relative">
              <span className="absolute -top-6 left-0 text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">Encrypted Intake</span>
              <input 
                name="email"
                type="email" 
                required
                disabled={status !== 'idle'}
                placeholder="PROSPECTIVE CLIENT EMAIL" 
                className="bg-transparent border-b border-white/20 text-white pb-3 w-full focus:outline-none focus:border-white transition-colors text-xs font-mono tracking-[0.1em] placeholder:text-white/10 disabled:opacity-40"
              />
            </div>
            <button 
              disabled={status !== 'idle'}
              className="shrink-0 pb-3 text-xs uppercase font-bold tracking-[0.2em] text-white/60 hover:text-white transition-colors border-b border-transparent hover:border-white flex items-center justify-between sm:justify-start gap-2 group disabled:opacity-50"
            >
              <span className="sm:hidden text-white/30 text-[9px] font-mono">Action // </span>
              {status === 'success' ? 'Verified' : 'Access Desk'}
              {status === 'success' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              )}
            </button>
          </form>
        </div>
      </motion.div>

      {/* KPI FOOTER (Raw, text-driven data) */}
      <motion.div 
        style={{ opacity }}
        className="relative z-10 w-full max-w-[1440px] mx-auto flex flex-wrap gap-x-16 gap-y-8 border-t border-white/[0.08] pt-6 text-[10px] uppercase font-bold tracking-[0.15em]"
      >
        <div className="flex flex-col gap-1.5">
          <span className="text-white/30">Architecture</span>
          <span className="text-white">Deterministic Execution</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-white/30">Latency Theory</span>
          <span className="text-white">Sub-Millisecond Design</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-white/30">Market Scope</span>
          <span className="text-white">XAUUSD Macro Logic</span>
        </div>
        <div className="flex flex-col gap-1.5 ml-auto">
          <span className="text-white/30 text-right">System Status</span>
          <span className="text-emerald-400 flex items-center gap-2 justify-end">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Operational
          </span>
        </div>
      </motion.div>
    </section>
  );
};
