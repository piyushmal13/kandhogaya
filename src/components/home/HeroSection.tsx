import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, ShieldCheck, Activity } from "lucide-react";

export const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={containerRef} className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-[#000000] pt-20">
      
      {/* --- Institutional Background System --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* 1. Ambient Spotlight (Top Center) - Gives depth without motion */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.15),transparent_70%)] opacity-60" />

        {/* 2. Large Structural Grid - Static & Stable */}
        {/* Larger 120px cells feel more "enterprise" than tight meshes */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:120px_120px] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)]" />

        {/* 3. Subtle Horizon Glow (Bottom) - Grounds the design */}
        <div className="absolute bottom-0 left-0 right-0 h-[300px] bg-gradient-to-t from-emerald-900/10 to-transparent opacity-40" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full flex flex-col items-center text-center">
        
        {/* --- Trust Badge --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-md mb-12 group hover:border-emerald-500/30 transition-colors cursor-default"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-mono text-gray-400 tracking-widest uppercase group-hover:text-gray-300 transition-colors">
            Trusted by 12,000+ Institutional Traders
          </span>
        </motion.div>
        
        {/* --- Main Headline --- */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-[100px] font-bold text-white tracking-tight leading-[1.1] md:leading-[1.1] mb-8 max-w-5xl mx-auto"
        >
          Institutional Edge. <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-500 to-cyan-500 pb-2">
            Retail Accessibility.
          </span>
        </motion.h1>
        
        {/* --- Subheadline --- */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light"
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
          className="flex flex-col sm:flex-row justify-center gap-6 w-full sm:w-auto"
        >
          <Link 
            to="/login" 
            className="group relative px-8 py-4 bg-emerald-500 text-black font-bold rounded-xl overflow-hidden flex items-center justify-center gap-2 text-lg w-full sm:w-auto hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-shadow duration-500"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
            <span className="relative z-10 flex items-center gap-2">
              Join the Elite (Free)
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </Link>
          
          <Link 
            to="/results" 
            className="group px-8 py-4 bg-white/5 text-white font-medium rounded-xl border border-white/10 hover:border-emerald-500/50 hover:bg-white/10 transition-all duration-500 backdrop-blur-sm flex items-center justify-center gap-2 text-lg w-full sm:w-auto"
          >
            <Activity className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
            <span>View Live Performance</span>
          </Link>
        </motion.div>

      </div>
    </section>
  );
};
