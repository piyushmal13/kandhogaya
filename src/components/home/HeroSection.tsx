import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Check, ShieldCheck, Users, Star, Globe } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { InstitutionalBackground } from "../animations/InstitutionalBackground";

// ─── LOCKED: DO NOT MODIFY BELOW ─────────────────────────────────────────────
// Supabase: leads.insert({ email, source }) — business acquisition logic
// useScroll/useTransform: parallax fade — scroll-driven opacity/y/scale
// Form state machine: idle → loading → success → idle (5s timeout)
// ─────────────────────────────────────────────────────────────────────────────

const SNAP = [0.4, 0, 0.2, 1] as const;

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "100% Education Platform" },
  { icon: Users, label: "12,400+ Elite Alumni" },
  { icon: Star, label: "Asia's #1 Algo Desk" },
  { icon: Globe, label: "India · Dubai · Singapore" },
];

// Animated number counter
const useCounter = (target: number, trigger: boolean, duration = 1600) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, trigger, duration]);
  return value;
};

const StatPill = ({ value, suffix, label, trigger }: { value: number; suffix: string; label: string; trigger: boolean }) => {
  const count = useCounter(value, trigger);
  return (
    <div className="flex flex-col items-center sm:items-start gap-0.5 px-6 py-4 border-r border-white/[0.06] last:border-r-0">
      <span
        className="text-2xl sm:text-3xl font-black text-white tabular-nums tracking-tight"
        style={{ fontFamily: "IBM Plex Mono, monospace" }}
      >
        {count.toLocaleString()}{suffix}
      </span>
      <span className="text-[10px] font-semibold text-white/35 uppercase tracking-[0.2em]">{label}</span>
    </div>
  );
};

export const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [statsVisible, setStatsVisible] = useState(false);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.45], [0, 70]);

  useEffect(() => {
    const timer = setTimeout(() => setStatsVisible(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] bg-[#020202] text-white flex flex-col overflow-hidden"
    >
      <InstitutionalBackground />

      {/* Structural rule lines */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-0 left-6 lg:left-14 bottom-0 w-px bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-transparent" />
        <div className="absolute top-0 right-6 lg:right-14 bottom-0 w-px bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-transparent" />
      </div>

      {/* === HERO BODY === */}
      <motion.div
        style={{ opacity, y }}
        className="relative z-10 w-full max-w-[1440px] mx-auto flex-1 flex flex-col lg:flex-row items-center gap-12 lg:gap-0 pt-32 sm:pt-40 pb-20 px-6 lg:px-14"
      >
        {/* LEFT — Copy & CTA */}
        <div className="flex-1 flex flex-col items-start max-w-[700px]">
          {/* Live status badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: SNAP }}
            className="inline-flex items-center gap-2.5 mb-8 px-4 py-2 rounded-full bg-emerald-500/[0.07] border border-emerald-500/[0.18] text-emerald-400"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.35em]" style={{ fontFamily: "IBM Plex Mono, monospace" }}>
              Desk Active · Asia Quant Network
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.55, ease: SNAP }}
            className="text-[3rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[7rem] font-black leading-[0.9] tracking-[-0.05em] mb-10 text-white"
          >
            Institutional <br />
            <span className="italic font-serif"
              style={{
                background: "linear-gradient(135deg, #10B981 0%, #00FFA3 55%, #D4AF37 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Capital Intelligence.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.5, ease: SNAP }}
            className="text-base md:text-xl text-white/40 font-light leading-[1.7] max-w-2xl mb-12 tracking-tight"
          >
            Access the same systematic architecture and macro diagnostics used by the world's most advanced proprietary desks. Precise execution, verified results.
          </motion.p>

          {/* CTA Row */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.45, ease: SNAP }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-12 w-full sm:w-auto"
          >
            {/* Email form */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (status !== "idle") return;
                const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value;
                if (!email) return;
                setStatus("loading");
                if (supabase) {
                  await supabase.from("leads").insert([{ email, source: "hero_institutional" }]);
                }
                setStatus("success");
                setTimeout(() => setStatus("idle"), 5000);
              }}
              className="flex items-center gap-0 flex-1 min-w-0 sm:min-w-[340px] bg-white/[0.04] border border-white/[0.08] rounded-xl overflow-hidden focus-within:border-emerald-500/40 transition-colors duration-200"
            >
              <input
                name="email"
                type="email"
                required
                disabled={status !== "idle"}
                placeholder="Enter your email address"
                className="bg-transparent flex-1 px-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none disabled:opacity-40 min-w-0"
              />
              <button
                type="submit"
                disabled={status !== "idle"}
                className="shrink-0 px-5 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-150 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "success" ? <Check className="w-4 h-4" /> : null}
                {(() => {
                  if (status === 'loading') return '…';
                  if (status === 'success') return 'Done';
                  return 'Get Access';
                })()}
              </button>
            </form>

            <a
              href="/academy"
              className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-white/[0.1] text-white text-sm font-semibold hover:border-white/25 hover:bg-white/[0.04] transition-all duration-200 whitespace-nowrap"
            >
              View Programmes
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-150" />
            </a>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.38, duration: 0.4 }}
            className="flex flex-wrap gap-3"
          >
            {TRUST_BADGES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.07] text-white/45 text-[11px] font-medium tracking-wide"
              >
                <Icon className="w-3 h-3 text-emerald-400 shrink-0" />
                {label}
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT — Visual card panel */}
        <div className="flex-1 flex items-center justify-center lg:justify-end w-full max-w-[540px] lg:max-w-none">
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[480px]"
          >
            {/* Glow halo */}
            <div className="absolute inset-[-20%] bg-emerald-500/[0.07] blur-[80px] rounded-full pointer-events-none" />

            {/* Main card */}
            <div className="relative bg-[#080B12] border border-white/[0.07] rounded-[2rem] p-8 overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.7)]">
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-emerald-500/[0.06] to-transparent rounded-[2rem] pointer-events-none" />

              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="text-[9px] font-black uppercase tracking-[0.35em] text-white/25 mb-1" style={{ fontFamily: "IBM Plex Mono, monospace" }}>
                    GOLD ALGO MASTERCLASS
                  </div>
                  <div className="text-white font-black text-lg tracking-tight">XAUUSD Intelligence</div>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                </div>
              </div>

              {/* Algo performance bars */}
              <div className="space-y-4 mb-8">
                {[
                  { label: "Macro Alpha Model", pct: 84, color: "#10B981" },
                  { label: "Risk Calibration", pct: 96, color: "#00FFA3" },
                  { label: "Signal Precision", pct: 78, color: "#D4AF37" },
                  { label: "Drawdown Control", pct: 91, color: "#06B6D4" },
                ].map(({ label, pct, color }, i) => (
                  <div key={label}>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] mb-1.5">
                      <span className="text-white/40">{label}</span>
                      <span style={{ color }}>{pct}%</span>
                    </div>
                    <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.6 + i * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full rounded-full"
                        style={{ background: color }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Signal feed */}
              <div className="border-t border-white/[0.06] pt-6">
                <div className="text-[9px] font-black uppercase tracking-[0.35em] text-white/20 mb-4" style={{ fontFamily: "IBM Plex Mono, monospace" }}>
                  Latest Signal · XAU/USD
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-black text-white font-mono tracking-tight">2,338.40</div>
                    <div className="text-emerald-400 text-xs font-black mt-0.5">+1.24% · BUY ZONE ACTIVE</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-white/20 mb-1" style={{ fontFamily: "IBM Plex Mono, monospace" }}>TP1 / TP2</div>
                    <div className="text-sm font-black text-white/60 font-mono">2,355 / 2,380</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.4 }}
              className="absolute -bottom-5 -left-4 bg-[#0C0F18] border border-white/[0.08] rounded-2xl px-4 py-3 shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <Star className="w-3.5 h-3.5 text-yellow-400" />
                </div>
                <div>
                  <div className="text-white text-xs font-black">Asia's #1 Rated</div>
                  <div className="text-white/30 text-[9px]">Algo Trading Education</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* === STATS BAR === */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4, ease: SNAP }}
        className="relative z-10 w-full border-t border-white/[0.06] bg-black/60 backdrop-blur-xl"
      >
        <div className="max-w-[1440px] mx-auto flex flex-wrap justify-center sm:justify-start divide-x divide-white/[0.06]">
          <StatPill value={12400} suffix="+" label="Elite Alumni" trigger={statsVisible} />
          <StatPill value={280} suffix="+" label="Webinars Hosted" trigger={statsVisible} />
          <StatPill value={94} suffix="%" label="Course Completion" trigger={statsVisible} />
          <StatPill value={40} suffix="+" label="Countries Reached" trigger={statsVisible} />
        </div>
      </motion.div>
    </section>
  );
};
