import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { InstitutionalBackground } from "../animations/InstitutionalBackground";

// ─── LOCKED: DO NOT MODIFY BELOW ─────────────────────────────────────────────
// Supabase: leads.insert({ email, source }) — business acquisition logic
// useScroll/useTransform: parallax fade — scroll-driven opacity/y/scale
// Form state machine: idle → loading → success → idle (5s timeout)
// ─────────────────────────────────────────────────────────────────────────────

/** Precision Snapping bezier — SOP for all hero interactions */
const SNAP = [0.4, 0, 0.2, 1] as const;

/** Institutional snap entrance — 180ms max, no bounce */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: SNAP },
  },
};

export const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  // LOCKED — parallax transforms
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.4], [0, 80]);
  const scale = useTransform(scrollYProgress, [0, 0.4], [1, 0.97]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[92svh] sm:min-h-screen bg-[#020202] text-[#FAFAFA] flex flex-col justify-between pt-24 sm:pt-40 pb-16 px-6 lg:px-12 font-sans selection:bg-emerald-500 selection:text-black overflow-hidden"
    >
      <InstitutionalBackground />

      {/* ── STRUCTURAL RULE GRID ── */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-0 left-6 lg:left-12 bottom-0 w-px bg-gradient-to-b from-white/[0.10] via-white/[0.04] to-transparent" />
        <div className="absolute top-0 right-6 lg:right-12 bottom-0 w-px bg-gradient-to-b from-white/[0.10] via-white/[0.04] to-transparent" />
        <div className="absolute top-0 left-1/2 bottom-0 w-px bg-gradient-to-b from-white/[0.03] to-transparent" />
        {/* Horizontal rule — below nav */}
        <div className="absolute top-[var(--nav-h)] left-0 right-0 h-px bg-white/[0.05]" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ opacity, y, scale }}
        className="relative z-10 w-full max-w-[1440px] mx-auto flex-1 flex flex-col justify-center"
      >
        {/* ── TOP SYSTEM STATUS ROW ── */}
        <motion.div
          variants={itemVariants}
          className="flex justify-between items-center border-b border-white/[0.07] pb-4 mb-16 sm:mb-24 text-[10px] uppercase tracking-[0.3em] font-black text-white/25"
        >
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            </span>
            <span className="text-white font-mono" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
              IFX_TRADES // ASIA_QUANT_DESK
            </span>
          </div>
          <span
            className="hidden sm:inline text-right text-white/30"
            style={{ fontFamily: 'IBM Plex Mono, monospace' }}
          >
            v4.0.2 // SYS_OPERATIONAL
          </span>
        </motion.div>

        {/* ── DOMINANT HEADLINE ── */}
        <div className="max-w-[1100px]">
          <motion.h1
            variants={itemVariants}
            className="text-[3.2rem] sm:text-7xl md:text-[7rem] lg:text-[9rem] leading-[0.88] font-serif tracking-[-0.05em] mb-10 text-white break-words"
          >
            <span className="block italic text-white/30 mb-3 font-light">Systematic</span>
            <span className="block font-black uppercase tracking-tighter site-title-gradient">Intelligence.</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-base md:text-xl text-white/45 font-light max-w-2xl leading-[1.85] tracking-tight mb-14"
          >
            Institutional-grade algorithmic execution models and sovereign macro diagnostics. We engineer high-probability methodologies for professional desks.
            <span
              className="block mt-5 text-[var(--brand-accent)] font-medium text-sm tracking-[0.25em] uppercase"
              style={{ fontFamily: 'IBM Plex Mono, monospace' }}
            >
              Zero Retail Noise // Pure Alpha.
            </span>
          </motion.p>

          {/* ── ACQUISITION FORM — BUSINESS LOGIC LOCKED ── */}
          <motion.form
            variants={itemVariants}
            onSubmit={async (e) => {
              e.preventDefault();
              if (status !== 'idle') return;
              const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
              if (!email) return;
              setStatus('loading');
              if (supabase) {
                await supabase.from("leads").insert([{ email, source: "hero_institutional" }]);
              }
              setStatus('success');
              setTimeout(() => setStatus('idle'), 5000);
            }}
            className="flex flex-col sm:flex-row items-stretch sm:items-end gap-10 sm:gap-8 max-w-xl"
          >
            <div className="flex-1 relative group">
              <span
                className="absolute -top-7 left-0 text-[9px] uppercase tracking-[0.3em] text-white/15 font-black group-focus-within:text-[var(--brand-accent)] transition-colors duration-150"
                style={{ fontFamily: 'IBM Plex Mono, monospace' }}
              >
                Encrypted Intake Node
              </span>
              <input
                name="email"
                type="email"
                required
                disabled={status !== 'idle'}
                placeholder="PROSPECTIVE_CLIENT@EMAIL.COM"
                className="bg-transparent border-b border-white/[0.08] text-white pb-4 w-full focus:outline-none focus:border-[var(--brand-accent)] transition-colors duration-150 text-sm tracking-[0.15em] placeholder:text-white/[0.06] disabled:opacity-40"
                style={{ fontFamily: 'IBM Plex Mono, monospace' }}
              />
            </div>
            <button
              type="submit"
              disabled={status !== 'idle'}
              className="shrink-0 pb-4 text-xs uppercase font-black tracking-[0.25em] text-white/35 hover:text-white transition-all duration-150 border-b border-transparent hover:border-[var(--brand-accent)] flex items-center gap-3 group disabled:opacity-40"
            >
              {status === 'success' ? 'Connection Verified' : 'Access Sovereign Desk'}
              {status === 'success' ? (
                <Check className="w-4 h-4 text-[var(--brand-accent)]" />
              ) : (
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-150 text-[var(--brand-accent)]" />
              )}
            </button>
          </motion.form>
        </div>
      </motion.div>

      {/* ── KPI FOOTER ROW — Data-dense, terminal-native ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.35, ease: SNAP }}
        style={{ opacity }}
        className="relative z-10 w-full max-w-[1440px] mx-auto flex flex-wrap gap-x-16 gap-y-6 border-t border-white/[0.07] pt-8 text-[10px] uppercase font-black tracking-[0.2em]"
      >
        {[
          { label: 'Curriculum Framework', value: 'Quantitative Mastery v4' },
          { label: 'Analytics Protocol',   value: 'Macro Edge Diagnostics' },
          { label: 'Target Vector',        value: 'XAUUSD Institutional Logic' },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-1.5 group cursor-default">
            <span className="text-white/20 group-hover:text-[var(--brand-accent)]/40 transition-colors duration-150">{label}</span>
            <span
              className="text-white group-hover:text-[var(--brand-accent)] transition-colors duration-150"
              style={{ fontFamily: 'IBM Plex Mono, monospace' }}
            >
              {value}
            </span>
          </div>
        ))}
        {/* System Status Indicator */}
        <div className="flex flex-col gap-1.5 ml-auto text-right">
          <span className="text-white/20">System Status</span>
          <span
            className="text-[10px] text-emerald-400 flex items-center gap-2.5 justify-end"
            style={{ fontFamily: 'IBM Plex Mono, monospace' }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            OPERATIONAL
          </span>
        </div>
      </motion.div>
    </section>
  );
};
