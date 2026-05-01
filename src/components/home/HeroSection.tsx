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
        className="relative z-10 w-full max-w-[1000px] mx-auto flex-1 flex flex-col items-center justify-center pt-32 sm:pt-40 pb-20 px-6 text-center"
      >
        {/* Professional Copy & CTA */}
        <div className="flex flex-col items-center relative z-20 w-full">
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
            className="text-4xl sm:text-5xl lg:text-[4rem] leading-[1.1] font-black tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400"
          >
            Master The Markets With <br />
            Institutional Intelligence
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: SNAP }}
            className="mb-10 max-w-2xl mx-auto text-[#8A9AAB] text-lg sm:text-xl font-medium leading-relaxed"
          >
            Gain the ultimate trading edge. Access professional algorithmic execution frameworks, premium macro research, and live trading sessions designed for serious retail and proprietary traders.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: SNAP }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            <Link
              to="/webinars"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-500 text-black hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98] text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
            >
              Explore Webinars <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/[0.05] border border-white/10 text-white hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98] text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2"
            >
              Access Portal
            </Link>
          </motion.div>

          {/* Trust Metrics */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="flex flex-wrap justify-center items-center gap-8 sm:gap-16 mt-16 pt-8 border-t border-white/[0.05] w-full max-w-3xl mx-auto"
          >
            {[
              { icon: Users, label: "Active Professionals", value: "12,000+" },
              { icon: BarChart3, label: "Macro Insights", value: "Daily Analysis" },
              { icon: Trophy, label: "Success Rate", value: "Proven Models" }
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <stat.icon className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex flex-col text-left">
                  <div className="text-lg font-bold text-white leading-tight">{stat.value}</div>
                  <div className="text-[11px] text-[#8A9AAB] font-medium uppercase tracking-wider">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>


      </motion.div>
    </section>
  );
};
