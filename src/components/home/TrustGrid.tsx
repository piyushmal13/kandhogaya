import React from "react";
import { motion } from "motion/react";
import { ShieldCheck, Target, Zap, TrendingUp, Globe, Award, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// ─── NO BUSINESS LOGIC — Pure UI component ───────────────────────────────────

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "100% Education. Zero Broker Affiliation.",
    desc: "We do not accept deposits, execute client trades, or hold funds. Rigorously verified by regulatory compliance standards across India and UAE.",
    color: "#10B981",
    num: "01",
  },
  {
    icon: Target,
    title: "Precision Execution Architecture",
    desc: "High-performance MT5 Expert Advisor systems designed to execute at institutional liquidity pools, not retail market orders.",
    color: "#06B6D4",
    num: "02",
  },
  {
    icon: TrendingUp,
    title: "Performance Independently Audited",
    desc: "Every signal is archived with timestamped entries and exits. Our 36-month audit log is transparent and independently verified.",
    color: "#8B5CF6",
    num: "03",
  },
  {
    icon: Zap,
    title: "XAUUSD Macro Intelligence",
    desc: "Proprietary gold macro research built on institutional order flow, COT data, and macro catalysts — not retail chart patterns.",
    color: "#D4AF37",
    num: "04",
  },
  {
    icon: Globe,
    title: "India · Dubai · Singapore",
    desc: "Operationally compliant across three jurisdictions. Our education desk is trusted by traders in 40+ countries worldwide.",
    color: "#3B82F6",
    num: "05",
  },
  {
    icon: Award,
    title: "Asia's Top Intelligence Award 2025",
    desc: "Recognised as Asia's leading institutional forex education platform for quantitative curriculum and outcomes excellence.",
    color: "#F43F5E",
    num: "06",
  },
];

const SNAP = [0.4, 0, 0.2, 1] as const;

export const TrustGrid = () => {
  return (
    <section
      className="py-24 md:py-36 bg-[#020202] relative overflow-hidden"
      aria-labelledby="trust-heading"
    >
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[40%] bg-[radial-gradient(ellipse_70%_45%_at_50%_0%,rgba(16,185,129,0.04),transparent)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Header */}
        <div className="mb-16 md:mb-20 flex flex-col md:flex-row md:items-end gap-8 justify-between">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: SNAP }}
              className="flex items-center gap-3 mb-7"
            >
              <div className="h-px w-8 bg-emerald-500" />
              <span
                className="text-[9px] uppercase text-emerald-500 font-black"
                style={{ fontFamily: "IBM Plex Mono, monospace", letterSpacing: "0.35em" }}
              >
                Why IFX Trades
              </span>
            </motion.div>

            <motion.h2
              id="trust-heading"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.06, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] max-w-2xl"
            >
              Built on a{" "}
              <span
                className="italic font-serif"
                style={{
                  background: "linear-gradient(135deg, #10B981, #00FFA3)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                different
              </span>{" "}
              standard.
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.14, duration: 0.5 }}
            className="text-white/35 max-w-sm text-[15px] leading-relaxed md:text-right md:pb-2"
          >
            Designed by quants. Trusted by thousands of professional traders across Asia since 2022.
          </motion.p>
        </div>

        {/* Pillar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.05] rounded-[2rem] overflow-hidden border border-white/[0.06]">
          {PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.06, duration: 0.55, ease: SNAP }}
              className="group relative p-8 md:p-10 bg-[#020202] hover:bg-[#080B12] transition-colors duration-300 overflow-hidden"
            >
              {/* Number watermark */}
              <div
                className="absolute top-5 right-6 text-7xl font-black text-white/[0.025] select-none leading-none"
                aria-hidden="true"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
              >
                {pillar.num}
              </div>

              {/* Hover accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, transparent, ${pillar.color}40, transparent)` }}
              />

              {/* Icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-7 group-hover:scale-110 transition-transform duration-200"
                style={{
                  background: `${pillar.color}12`,
                  border: `1px solid ${pillar.color}22`,
                }}
              >
                <pillar.icon className="w-5 h-5" style={{ color: pillar.color }} aria-hidden="true" />
              </div>

              <h3 className="text-[15px] font-black text-white mb-3 tracking-tight leading-tight">{pillar.title}</h3>
              <p className="text-[13px] text-white/35 leading-[1.85]">{pillar.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.5, ease: SNAP }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6 p-8 md:p-10 rounded-[1.75rem] border border-white/[0.07] bg-gradient-to-br from-emerald-500/[0.04] to-transparent"
        >
          <div>
            <div className="text-white font-black text-xl md:text-2xl tracking-tight mb-2">
              Ready to trade with institutional precision?
            </div>
            <div
              className="text-white/30 text-[11px] uppercase tracking-wider"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              12,400+ professional traders · Zero broker conflict · Pure education
            </div>
          </div>
          <Link
            to="/academy"
            className="shrink-0 inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-emerald-500 text-black font-black text-[11px] uppercase tracking-[0.15em] hover:bg-emerald-400 transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(16,185,129,0.25)] hover:shadow-[0_0_50px_rgba(16,185,129,0.35)] whitespace-nowrap"
          >
            Join the Academy <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
