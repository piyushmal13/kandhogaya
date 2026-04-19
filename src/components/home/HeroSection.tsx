import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, ShieldCheck, Trophy, BarChart3, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { InstitutionalBackground } from "../animations/InstitutionalBackground";

const SNAP = [0.16, 1, 0.3, 1] as const;

export const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[90svh] bg-[#010203] text-white flex flex-col overflow-hidden"
    >
      <InstitutionalBackground />

      <motion.div
        style={{ opacity, y, scale }}
        className="relative z-10 w-full max-w-[1440px] mx-auto flex-1 flex flex-col lg:flex-row items-center gap-12 lg:gap-8 pt-32 sm:pt-40 pb-20 px-6 lg:px-20"
      >
        {/* LEFT — Professional Copy & CTA */}
        <div className="flex-1 flex flex-col items-start max-w-[760px] relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: SNAP }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8 backdrop-blur-md"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-emerald-400">
              Asia's Premier Education Desk
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.9, ease: SNAP }}
            className="text-4xl sm:text-5xl lg:text-[4rem] leading-[1.1] font-black text-white tracking-tight mb-6"
          >
            Master The Markets With <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Institutional Intelligence
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: SNAP }}
            className="mb-10 max-w-2xl text-[#8A9AAB] text-lg sm:text-xl font-medium leading-relaxed"
          >
            Gain the ultimate trading edge. Access professional algorithmic execution frameworks, premium macro research, and live trading sessions designed for serious retail and proprietary traders.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: SNAP }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link
              to="/academy"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-500 text-black hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98] text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
            >
              Explore Academy <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/[0.05] border border-white/10 text-white hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98] text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2"
            >
              Access Portal
            </Link>
          </motion.div>

          {/* Trust Metrics - Vantage/VT style credibility markers */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="flex flex-wrap items-center gap-6 sm:gap-12 mt-12 pt-8 border-t border-white/[0.05] w-full"
          >
            {[
              { icon: Users, label: "Active Students", value: "12,000+" },
              { icon: BarChart3, label: "Live Signals", value: "Daily Analysis" },
              { icon: Trophy, label: "Success Rate", value: "Proven Models" }
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <stat.icon className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex flex-col">
                  <div className="text-lg font-bold text-white leading-tight">{stat.value}</div>
                  <div className="text-[11px] text-[#8A9AAB] font-medium uppercase tracking-wider">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT — Clean Visuals */}
        <div className="flex-1 w-full flex justify-center lg:justify-end mt-10 lg:mt-0 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 1.2, ease: SNAP }}
            className="relative w-full max-w-[600px] aspect-[4/3] rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#040608] to-[#010203] shadow-2xl overflow-hidden"
          >
            {/* Minimalist Dashboard Graphic representation */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-luminosity" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#010203] via-[#010203]/80 to-transparent" />
            
            {/* Floating Element - realistic chart mockup */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="absolute bottom-8 left-8 right-8 p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl"
            >
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/[0.05]">
                <div>
                  <div className="text-white font-bold text-lg">XAUUSD</div>
                  <div className="text-[#8A9AAB] text-xs">Gold vs US Dollar</div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-400 font-bold text-lg flex items-center gap-1 justify-end">
                    <ArrowRight className="w-4 h-4 -rotate-45" /> +1.24%
                  </div>
                  <div className="text-white/50 text-xs">Strong Buy Setup</div>
                </div>
              </div>
              
              <div className="flex items-end gap-2 h-16 w-full">
                {/* Clean Bar Chart Mockup */}
                {[30, 45, 25, 60, 80, 50, 95].map((h, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 1 + i * 0.1, duration: 0.5 }}
                    className={`flex-1 rounded-sm ${i === 6 ? 'bg-emerald-400' : 'bg-white/10'}`}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Ambient Inner Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none" />
        </div>
      </motion.div>
    </section>
  );
};
