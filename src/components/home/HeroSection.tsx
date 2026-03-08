import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, ShieldCheck, Activity, BarChart3, Zap } from "lucide-react";
import { homeContent } from "../../config/homeContent";

export const HeroSection = () => {
  const { hero } = homeContent;

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden pt-32 lg:pt-40 pb-20 bg-[#020202]">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-500/15 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-1/4 -right-1/4 w-[500px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none z-0" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgwVjB6bTM5IDM5VjFoLTM4djM4aDM4eiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')] z-0 opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full flex flex-col items-center text-center">
        
        {/* Trust Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 md:mb-10"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span className="text-xs md:text-sm font-mono text-gray-300 tracking-widest uppercase">Trusted by 12,000+ Institutional & Retail Traders</span>
        </motion.div>
        
        {/* Massive Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-[100px] font-bold text-white tracking-tighter leading-[1.05] md:leading-[0.95] mb-6 md:mb-8 max-w-5xl mx-auto drop-shadow-2xl"
        >
          Institutional Edge. <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-500 to-cyan-500">
            Retail Accessibility.
          </span>
        </motion.h1>
        
        {/* Subheadline */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="text-base sm:text-lg md:text-2xl text-gray-400 max-w-3xl mx-auto mb-10 md:mb-12 leading-relaxed font-normal"
        >
          We provide the low-latency infrastructure, proprietary algorithms, and order-flow data used by elite quantitative firms. Stop guessing. Start dominating.
        </motion.p>
        
        {/* CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto mb-16 md:mb-24"
        >
          <Link 
            to="/login" 
            className="group relative px-8 py-4 md:py-5 bg-emerald-500 text-black font-bold rounded-xl hover:scale-[1.02] transition-all duration-500 overflow-hidden flex items-center justify-center gap-2 text-lg shadow-[0_0_40px_rgba(16,185,129,0.3)] w-full sm:w-auto"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
            <span className="relative z-10 flex items-center gap-2">
              Join the Elite (Free)
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
            </span>
          </Link>
          <Link 
            to="/results" 
            className="group px-8 py-4 md:py-5 bg-[#0a0a0a] text-white font-medium rounded-xl border border-white/10 hover:border-emerald-500/50 hover:bg-white/5 transition-all duration-500 ease-[0.16,1,0.3,1] backdrop-blur-xl flex items-center justify-center gap-2 text-lg w-full sm:w-auto"
          >
            <Activity className="w-5 h-5 text-emerald-500" />
            <span>View Live Performance</span>
          </Link>
        </motion.div>

        {/* Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="w-full max-w-6xl mx-auto relative"
        >
          {/* Mockup Container */}
          <div className="relative rounded-2xl md:rounded-[2rem] bg-[#050505] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden aspect-video md:aspect-[21/9] flex flex-col">
            
            {/* Mockup Header */}
            <div className="h-10 md:h-12 border-b border-white/5 bg-[#0a0a0a] flex items-center px-4 md:px-6 gap-4">
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded bg-black border border-white/5 text-[10px] md:text-xs font-mono text-gray-500 flex items-center gap-2">
                  <Zap className="w-3 h-3 text-emerald-500" />
                  LIVE ALGO TERMINAL
                </div>
              </div>
            </div>

            {/* Mockup Body */}
            <div className="flex-1 p-4 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGgyMHYyMEgwVjB6bTE5IDE5VjFoLTE4djE4aDE4eiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')]">
              
              {/* Left Column - Stats */}
              <div className="hidden md:flex flex-col gap-4">
                <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-5 flex-1 flex flex-col justify-center">
                  <div className="text-gray-500 text-xs font-mono mb-2">WIN RATE (30D)</div>
                  <div className="text-4xl font-bold text-emerald-400">84.2%</div>
                  <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[84.2%]" />
                  </div>
                </div>
                <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-5 flex-1 flex flex-col justify-center">
                  <div className="text-gray-500 text-xs font-mono mb-2">PROFIT FACTOR</div>
                  <div className="text-4xl font-bold text-white">2.8x</div>
                  <div className="text-emerald-500 text-xs font-mono mt-2">+0.4 from last month</div>
                </div>
              </div>

              {/* Center/Right Column - Chart/Signals */}
              <div className="md:col-span-2 bg-[#0a0a0a] border border-white/5 rounded-xl p-4 md:p-6 flex flex-col relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-emerald-500/10 flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm md:text-base">XAUUSD.PRO</div>
                      <div className="text-gray-500 text-[10px] md:text-xs font-mono">HFT ALGORITHM</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-400 font-mono text-sm md:text-base font-bold">ACTIVE</div>
                    <div className="text-gray-500 text-[10px] md:text-xs font-mono">LATENCY: 4ms</div>
                  </div>
                </div>

                {/* Abstract Chart Lines */}
                <div className="flex-1 relative w-full flex items-end justify-between gap-1 md:gap-2 pt-10">
                  {Array.from({ length: 30 }).map((_, i) => {
                    const height = 20 + Math.random() * 80;
                    const isUp = Math.random() > 0.3;
                    return (
                      <div key={i} className="w-full flex flex-col justify-end items-center group">
                        <div 
                          className={`w-full rounded-t-sm transition-all duration-500 ${isUp ? 'bg-emerald-500/80' : 'bg-red-500/80'} group-hover:opacity-100 opacity-60`} 
                          style={{ height: `${height}%` }}
                        />
                      </div>
                    );
                  })}
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
