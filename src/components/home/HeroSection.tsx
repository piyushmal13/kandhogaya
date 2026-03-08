import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, ShieldCheck, Activity } from "lucide-react";

export const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  // Parallax effects
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-[#020202] pt-20">
      
      {/* --- Elite Background --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] z-0" />
        
        {/* Deep Atmospheric Glows - Animated */}
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-900/20 blur-[120px] rounded-full z-0" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-cyan-900/10 blur-[150px] rounded-full z-0" 
        />
        
        {/* Shooting Star Animation */}
        <motion.div
          initial={{ x: -100, y: -100, opacity: 0 }}
          animate={{ x: "120vw", y: "120vh", opacity: [0, 1, 0] }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            repeatDelay: 5,
            ease: "linear"
          }}
          className="absolute top-0 left-0 w-[2px] h-[100px] bg-gradient-to-b from-transparent via-white to-transparent rotate-45 z-0"
        />
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
