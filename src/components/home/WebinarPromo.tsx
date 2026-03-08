import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Calendar, Clock, Users, ArrowRight, ShieldCheck } from "lucide-react";

export const WebinarPromo = () => {
  // Countdown logic
  const [timeLeft, setTimeLeft] = useState({ h: 48, m: 15, s: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const format = (n: number) => n.toString().padStart(2, '0');

  return (
    <section className="py-24 bg-[#020202] relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-[2rem] border border-white/10 bg-[#050505] overflow-hidden shadow-2xl"
        >
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 p-6 md:p-16 relative z-10">
            {/* Left: Info */}
            <div className="flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-3 mb-6 md:mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono tracking-widest">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  LIVE WEBINAR
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-white/5 border border-white/10 text-gray-400 text-xs font-mono tracking-widest">
                  <ShieldCheck className="w-3 h-3 text-cyan-500" />
                  SPONSORED BY APEX LIQUIDITY
                </div>
              </div>

              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 tracking-tighter leading-tight">
                Institutional Order Flow & Liquidity Voids
              </h2>
              
              <p className="text-gray-400 text-base md:text-lg mb-8 md:mb-10 leading-relaxed">
                Join our Head of Quantitative Analysis for an exclusive, free masterclass on identifying institutional footprints in real-time order books.
              </p>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                    <img 
                      src="https://picsum.photos/seed/quant/100/100" 
                      alt="Speaker" 
                      className="w-full h-full object-cover opacity-80 mix-blend-luminosity" 
                      referrerPolicy="no-referrer" 
                    />
                  </div>
                  <div>
                    <div className="text-white font-medium text-base md:text-lg">Alexander Wright</div>
                    <div className="text-emerald-400 text-[10px] md:text-xs font-mono tracking-widest mt-1">EX-INSTITUTIONAL QUANT</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Timer & CTA */}
            <div className="flex flex-col justify-center items-center lg:items-end w-full">
              <div className="w-full max-w-md bg-black/50 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <div className="flex items-center justify-between mb-6 md:mb-8 text-gray-400 text-xs md:text-sm font-mono">
                  <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-emerald-500" /> OCT 24, 2026</div>
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-emerald-500" /> 14:00 EST</div>
                </div>

                <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6 md:mb-8">
                  <div className="flex flex-col items-center justify-center bg-[#020202] border border-white/5 rounded-xl py-3 md:py-5 shadow-inner">
                    <span className="text-3xl md:text-4xl font-mono font-bold text-white tracking-tighter">{format(timeLeft.h)}</span>
                    <span className="text-[9px] md:text-[10px] text-gray-500 font-mono tracking-widest mt-1 md:mt-2">HOURS</span>
                  </div>
                  <div className="flex flex-col items-center justify-center bg-[#020202] border border-white/5 rounded-xl py-3 md:py-5 shadow-inner">
                    <span className="text-3xl md:text-4xl font-mono font-bold text-white tracking-tighter">{format(timeLeft.m)}</span>
                    <span className="text-[9px] md:text-[10px] text-gray-500 font-mono tracking-widest mt-1 md:mt-2">MINS</span>
                  </div>
                  <div className="flex flex-col items-center justify-center bg-[#020202] border border-white/5 rounded-xl py-3 md:py-5 shadow-inner">
                    <span className="text-3xl md:text-4xl font-mono font-bold text-emerald-400 tracking-tighter">{format(timeLeft.s)}</span>
                    <span className="text-[9px] md:text-[10px] text-gray-500 font-mono tracking-widest mt-1 md:mt-2">SECS</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6 md:mb-8 px-1 md:px-2">
                  <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs font-mono text-gray-400">
                    <Users className="w-3 h-3 md:w-4 md:h-4 text-emerald-500" />
                    <span>1,248 REGISTERED</span>
                  </div>
                  <div className="text-[10px] md:text-xs font-mono text-cyan-400 font-bold border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 rounded">
                    FREE ENTRY
                  </div>
                </div>

                <button className="w-full group relative px-6 md:px-8 py-3 md:py-4 bg-emerald-500 text-black font-semibold rounded-xl hover:scale-[1.02] transition-all duration-500 overflow-hidden flex items-center justify-center gap-2 text-base md:text-lg shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
                  <span className="relative z-10 flex items-center gap-2">
                    Reserve Free Seat
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
