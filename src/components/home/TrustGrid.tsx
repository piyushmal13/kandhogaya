import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Target, Zap, TrendingUp, Globe, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Institutional Integrity",
    desc: "Rigorous quantitative models verified through exchange tick-data backtesting. Zero retail manipulation.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/[0.07]",
    border: "border-emerald-500/[0.1]",
    glow: "group-hover:shadow-[0_0_40px_rgba(16,185,129,0.1)]",
    num: "01",
  },
  {
    icon: Target,
    title: "Precision Execution",
    desc: "High-performance algorithmic execution systems designed for MT5 and institutional liquidity pools.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/[0.07]",
    border: "border-cyan-500/[0.1]",
    glow: "group-hover:shadow-[0_0_40px_rgba(6,182,212,0.1)]",
    num: "02",
  },
  {
    icon: TrendingUp,
    title: "Performance Audited",
    desc: "Every signal is archived for transparency. Institutional-grade win-rates, independently verified.",
    color: "text-violet-400",
    bg: "bg-violet-500/[0.07]",
    border: "border-violet-500/[0.1]",
    glow: "group-hover:shadow-[0_0_40px_rgba(139,92,246,0.1)]",
    num: "03",
  },
  {
    icon: Zap,
    title: "Market Intelligence",
    desc: "Proprietary XAUUSD macro research and precision signals delivered via the Sovereign Terminal.",
    color: "text-amber-400",
    bg: "bg-amber-500/[0.07]",
    border: "border-amber-500/[0.1]",
    glow: "group-hover:shadow-[0_0_40px_rgba(245,158,11,0.1)]",
    num: "04",
  },
  {
    icon: Globe,
    title: "Global Compliance",
    desc: "Operational across India, Dubai, and Singapore. Adhering to the highest educational standards.",
    color: "text-blue-400",
    bg: "bg-blue-500/[0.07]",
    border: "border-blue-500/[0.1]",
    glow: "group-hover:shadow-[0_0_40px_rgba(59,130,246,0.1)]",
    num: "05",
  },
  {
    icon: Award,
    title: "Certified Excellence",
    desc: "Recipient of Asia's Top Forex Intelligence Award 2025. Leading the algorithmic revolution.",
    color: "text-rose-400",
    bg: "bg-rose-500/[0.07]",
    border: "border-rose-500/[0.1]",
    glow: "group-hover:shadow-[0_0_40px_rgba(244,63,94,0.1)]",
    num: "06",
  },
];

export const TrustGrid = () => {
  return (
    <section className="py-24 md:py-40 bg-[#020202] border-t border-white/[0.04] relative overflow-hidden" aria-labelledby="trust-heading">
      {/* Ambient bg */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[50%] bg-[radial-gradient(ellipse_80%_50%_at_center,rgba(16,185,129,0.04),transparent)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-8"
          >
            Institutional Blueprint
          </motion.div>

          <motion.h2
            id="trust-heading"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-6"
          >
            The{" "}
            <span className="italic font-serif text-gradient-emerald">Corporate</span>
            {" "}Ecosystem
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.16 }}
            className="text-gray-500 max-w-2xl mx-auto text-base md:text-lg leading-relaxed"
          >
            Designed by quants. Executed by machines. Trusted by thousands of elite traders across Asia.
          </motion.p>
        </div>

        {/* Pillar grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className={`group relative p-8 md:p-10 rounded-[2rem] bg-[#080B12] border ${pillar.border} ${pillar.glow} hover:border-white/10 transition-all duration-500 overflow-hidden card-shine`}
            >
              {/* Number watermark */}
              <div className="absolute top-6 right-7 text-6xl font-black text-white/[0.025] select-none font-mono leading-none" aria-hidden>
                {pillar.num}
              </div>

              <div className={`w-12 h-12 rounded-2xl ${pillar.bg} border ${pillar.border} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 ${pillar.color}`}>
                <pillar.icon className="w-6 h-6" aria-hidden />
              </div>

              <h3 className={`text-lg font-black text-white mb-3 tracking-tight group-hover:${pillar.color} transition-colors duration-300`}>
                {pillar.title}
              </h3>
              <p className="text-sm text-gray-500 leading-[1.75]">
                {pillar.desc}
              </p>

              <div className="mt-6 pt-6 border-t border-white/[0.04] flex items-center justify-between opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400">
                <span className={`text-[9px] font-black uppercase tracking-widest ${pillar.color}`}>Protocol Verified</span>
                <div className={`h-px w-8 ${pillar.bg} rounded-full`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="mt-16 md:mt-24 flex flex-col sm:flex-row items-center justify-between gap-6 p-8 md:p-10 rounded-[2rem] bg-white/[0.015] border border-white/[0.06]"
        >
          <div>
            <div className="text-white font-black text-xl md:text-2xl tracking-tight mb-2">
              Ready to elevate your trading?
            </div>
            <div className="text-gray-500 text-sm">
              Join 12,400+ institutional traders. No broker affiliation. Pure education.
            </div>
          </div>
          <Link
            to="/academy"
            data-cursor="START"
            className="shrink-0 inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-emerald-500 text-black font-black text-sm uppercase tracking-[0.15em] hover:bg-emerald-400 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:shadow-[0_0_50px_rgba(16,185,129,0.35)] whitespace-nowrap"
          >
            Get Started <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
