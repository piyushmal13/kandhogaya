import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Calendar, Clock, Users, ArrowRight, ShieldCheck, Mic2, Star, Activity } from "lucide-react";

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
    <section className="py-16 md:py-24 bg-[#020202] relative overflow-hidden border-t border-white/5">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[800px] h-[300px] md:h-[800px] bg-emerald-500/5 blur-[80px] md:blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 items-center">
          
          {/* Left: Content */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] md:text-xs font-mono tracking-widest mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              LIVE MASTERCLASS
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-6 tracking-tighter leading-[1.1]"
            >
              Institutional Order Flow <br />
              <span className="text-gray-500">& Liquidity Voids</span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-base md:text-lg mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Join our Head of Quantitative Analysis for an exclusive, free masterclass on identifying institutional footprints in real-time order books. Stop trading retail patterns.
            </motion.p>

            {/* Speakers */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center lg:justify-start gap-6 md:gap-8 mb-12"
            >
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-emerald-500/30 p-0.5">
                  <img src="https://picsum.photos/seed/speaker1/200/200" alt="Speaker" className="w-full h-full rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-500" referrerPolicy="no-referrer" />
                </div>
                <div className="text-left">
                  <div className="text-white font-bold text-xs md:text-sm">Alex Wright</div>
                  <div className="text-emerald-500 text-[9px] md:text-[10px] font-mono tracking-wider uppercase">Head Quant</div>
                </div>
              </div>
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-white/10 p-0.5">
                  <img src="https://picsum.photos/seed/speaker2/200/200" alt="Speaker" className="w-full h-full rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-500" referrerPolicy="no-referrer" />
                </div>
                <div className="text-left">
                  <div className="text-white font-bold text-xs md:text-sm">Sarah Chen</div>
                  <div className="text-gray-500 text-[9px] md:text-[10px] font-mono tracking-wider uppercase">Risk Manager</div>
                </div>
              </div>
            </motion.div>

            {/* Sponsors */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center lg:justify-start gap-4 md:gap-6 pt-8 border-t border-white/5"
            >
              <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">Sponsored By:</span>
              <div className="flex gap-4 md:gap-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  <span className="text-white font-bold tracking-tight text-[10px] md:text-xs">APEX LIQUIDITY</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2">
                  <Activity className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  <span className="text-white font-bold tracking-tight text-[10px] md:text-xs">QUANT.AI</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Registration Card */}
          <div className="lg:col-span-5">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#0a0a0a] border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 relative overflow-hidden group shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <div className="flex items-center gap-2 text-emerald-500 font-mono text-[10px] md:text-xs tracking-widest">
                  <Calendar className="w-3.5 h-3.5 md:w-4 h-4" />
                  <span>OCT 24, 2026</span>
                </div>
                <div className="px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-white/5 border border-white/10 text-[9px] md:text-[10px] font-bold text-white uppercase tracking-wider">
                  Limited Seats
                </div>
              </div>

              {/* Countdown */}
              <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
                {[
                  { label: "HOURS", value: timeLeft.h },
                  { label: "MINS", value: timeLeft.m },
                  { label: "SECS", value: timeLeft.s }
                ].map((item, i) => (
                  <div key={i} className="bg-black border border-white/10 rounded-lg md:rounded-xl py-3 md:py-4 flex flex-col items-center justify-center">
                    <span className="text-2xl md:text-3xl font-bold text-white font-mono tracking-tighter">{format(item.value)}</span>
                    <span className="text-[8px] md:text-[10px] text-gray-500 font-mono mt-1">{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                <div className="flex items-center gap-3 text-xs md:text-sm text-gray-400">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Mic2 className="w-3.5 h-3.5 md:w-4 h-4" />
                  </div>
                  <span>Live Q&A Session Included</span>
                </div>
                <div className="flex items-center gap-3 text-xs md:text-sm text-gray-400">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Star className="w-3.5 h-3.5 md:w-4 h-4" />
                  </div>
                  <span>Exclusive Strategy PDF for Attendees</span>
                </div>
              </div>

              <button className="w-full py-3.5 md:py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] text-sm md:text-base">
                Reserve Free Seat
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
              
              <div className="text-center mt-4 text-[9px] md:text-[10px] text-gray-600 font-mono">
                NO CREDIT CARD REQUIRED • INSTANT ACCESS
              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
