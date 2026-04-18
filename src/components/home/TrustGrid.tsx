import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Target, Zap, TrendingUp, Globe, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// ─── NO BUSINESS LOGIC — Pure UI component ───────────────────────────────────
// All data is static config. No Supabase. No state. Safe to fully refactor JSX.
// ─────────────────────────────────────────────────────────────────────────────

const SNAP = [0.4, 0, 0.2, 1] as const;

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Institutional Integrity",
    desc: "Rigorous quantitative models verified through exchange tick-data backtesting. Zero retail manipulation.",
    color: "text-emerald-400",
    borderColor: "border-emerald-500/[0.12]",
    glowClass: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.08)]",
    barColor: "bg-emerald-500",
    num: "01",
  },
  {
    icon: Target,
    title: "Precision Execution",
    desc: "High-performance algorithmic execution systems designed for MT5 and institutional liquidity pools.",
    color: "text-cyan-400",
    borderColor: "border-cyan-500/[0.12]",
    glowClass: "group-hover:shadow-[0_0_30px_rgba(6,182,212,0.08)]",
    barColor: "bg-cyan-400",
    num: "02",
  },
  {
    icon: TrendingUp,
    title: "Performance Audited",
    desc: "Every signal is archived for transparency. Institutional-grade win-rates, independently verified.",
    color: "text-violet-400",
    borderColor: "border-violet-500/[0.12]",
    glowClass: "group-hover:shadow-[0_0_30px_rgba(139,92,246,0.08)]",
    barColor: "bg-violet-400",
    num: "03",
  },
  {
    icon: Zap,
    title: "Market Intelligence",
    desc: "Proprietary XAUUSD macro research and precision signals delivered via the Sovereign Terminal.",
    color: "text-[var(--brand-secondary)]",
    borderColor: "border-yellow-600/[0.12]",
    glowClass: "group-hover:shadow-[0_0_30px_rgba(212,175,55,0.08)]",
    barColor: "bg-[var(--brand-secondary)]",
    num: "04",
  },
  {
    icon: Globe,
    title: "Global Compliance",
    desc: "Operational across India, Dubai, and Singapore. Adhering to the highest educational standards.",
    color: "text-blue-400",
    borderColor: "border-blue-500/[0.12]",
    glowClass: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.08)]",
    barColor: "bg-blue-400",
    num: "05",
  },
  {
    icon: Award,
    title: "Certified Excellence",
    desc: "Recipient of Asia's Top Forex Intelligence Award 2025. Leading the algorithmic revolution.",
    color: "text-rose-400",
    borderColor: "border-rose-500/[0.12]",
    glowClass: "group-hover:shadow-[0_0_30px_rgba(244,63,94,0.08)]",
    barColor: "bg-rose-400",
    num: "06",
  },
];

export const TrustGrid = () => {
  return (
    <section
      className="py-24 md:py-40 bg-[#020202] border-t border-white/[0.04] relative overflow-hidden"
      aria-labelledby="trust-heading"
    >
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[50%] bg-[radial-gradient(ellipse_80%_50%_at_center,rgba(16,185,129,0.03),transparent)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* ── Section Header ── */}
        <div className="mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.28, ease: SNAP }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="h-px w-8 bg-[var(--brand-primary)]" />
            <span
              className="text-[9px] uppercase text-[var(--brand-primary)] font-black"
              style={{ fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.35em' }}
            >
              INSTITUTIONAL_BLUEPRINT
            </span>
          </motion.div>

          <motion.h2
            id="trust-heading"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.06, duration: 0.35, ease: SNAP }}
            className="text-4xl sm:text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.88] mb-5"
          >
            The{" "}
            <span className="italic font-serif text-gradient-emerald">Corporate</span>
            {" "}Ecosystem
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12, duration: 0.3, ease: SNAP }}
            className="text-white/40 max-w-2xl text-base md:text-lg leading-relaxed"
          >
            Designed by quants. Executed by machines. Trusted by thousands of elite traders across Asia.
          </motion.p>
        </div>

        {/* ── Pillar Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.06, duration: 0.3, ease: SNAP }}
              className={`group relative p-8 md:p-10 rounded-[1.75rem] bg-[#080B12] border ${pillar.borderColor} ${pillar.glowClass} hover:border-white/[0.09] transition-all duration-150 overflow-hidden`}
            >
              {/* Number watermark */}
              <div
                className="absolute top-6 right-7 text-6xl font-black text-white/[0.02] select-none leading-none"
                aria-hidden="true"
                style={{ fontFamily: 'IBM Plex Mono, monospace' }}
              >
                {pillar.num}
              </div>

              {/* Icon */}
              <div className={`w-11 h-11 rounded-xl border ${pillar.borderColor} flex items-center justify-center mb-8 group-hover:scale-105 transition-transform duration-150 ${pillar.color}`}>
                <pillar.icon className="w-5 h-5" aria-hidden="true" />
              </div>

              <h3 className="text-[15px] font-black text-white mb-3 tracking-tight group-hover:text-white transition-colors duration-150">
                {pillar.title}
              </h3>
              <p className="text-[13px] text-white/35 leading-[1.8]">{pillar.desc}</p>

              {/* Hover reveal footer */}
              <div className="mt-6 pt-5 border-t border-white/[0.04] flex items-center justify-between opacity-0 group-hover:opacity-100 translate-y-1.5 group-hover:translate-y-0 transition-all duration-150">
                <span
                  className={`text-[9px] font-black uppercase ${pillar.color}`}
                  style={{ fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.3em' }}
                >
                  PROTOCOL_VERIFIED
                </span>
                <div className={`h-px w-6 ${pillar.barColor} rounded-full opacity-50`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Bottom CTA — Institutional Gold accent ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.3, ease: SNAP }}
          className="mt-16 md:mt-24 flex flex-col sm:flex-row items-center justify-between gap-6 p-8 md:p-10 rounded-[1.75rem] bg-white/[0.012] border border-white/[0.06]"
        >
          <div>
            <div className="text-white font-black text-xl md:text-2xl tracking-tight mb-2">
              Ready to elevate your trading?
            </div>
            <div
              className="text-white/35 text-[12px] uppercase tracking-wider"
              style={{ fontFamily: 'IBM Plex Mono, monospace' }}
            >
              12,400+ institutional traders // Zero broker affiliation // Pure education
            </div>
          </div>
          <Link
            to="/academy"
            data-cursor="START"
            className="shrink-0 inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[var(--brand-primary)] text-black font-black text-[11px] uppercase tracking-[0.15em] hover:bg-[var(--color-primary-400)] transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_24px_rgba(16,185,129,0.2)] hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] whitespace-nowrap"
          >
            Get Started <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
