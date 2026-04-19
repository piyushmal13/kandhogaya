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
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
              Professional Trading Education
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.55, ease: SNAP }}
            className="text-[3rem] sm:text-[4.5rem] md:text-[5.5rem] lg:text-[6.5rem] font-bold leading-[1.05] tracking-tight mb-8 text-white"
          >
            Trade Like An <br />
            <span
              style={{
                background: "linear-gradient(135deg, #10B981 0%, #00FFA3 55%, #06B6D4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Institution.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.5, ease: SNAP }}
            className="text-base md:text-xl text-white/50 font-normal leading-[1.7] max-w-2xl mb-12"
          >
            Master the markets with our comprehensive academy, algorithmic strategies, and daily live sessions. Join 12,400+ traders scaling their portfolios.
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
                  if (status === 'loading') return 'Processing...';
                  if (status === 'success') return 'Submitted';
                  return 'Start Learning';
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

        {/* RIGHT — Visual card panel (Professional App Mockup) */}
        <div className="flex-1 flex items-center justify-center lg:justify-end w-full max-w-[540px] lg:max-w-none perspective-1000">
          <motion.div
            initial={{ opacity: 0, rotateY: 15, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, rotateY: 0, x: 0, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[500px] bg-[#0A0D14] border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Top Bar Mockup */}
            <div className="h-12 border-b border-white/[0.05] flex items-center px-6 justify-between bg-white/[0.02]">
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <div className="text-[10px] text-white/30 font-medium">IFX TRADES PRO</div>
            </div>

            {/* Content Mockup */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="text-sm text-white/40 mb-1">Portfolio Balance</div>
                  <div className="text-3xl font-semibold text-white">$124,500.00</div>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                  +2.4% Today
                </div>
              </div>

              {/* Chart Mockup (CSS generated) */}
              <div className="relative h-40 w-full flex items-end justify-between gap-1 mb-8">
                {[40, 55, 30, 70, 65, 80, 50, 95, 85, 110, 100, 130].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 0.5 + i * 0.05, duration: 0.8, ease: "easeOut" }}
                    className="w-full bg-emerald-500/20 rounded-t-sm relative group cursor-pointer hover:bg-emerald-500/40 transition-colors"
                  >
                    <div className="absolute -top-1 left-0 right-0 h-1 bg-emerald-500 rounded-t-sm opacity-50 group-hover:opacity-100" />
                  </motion.div>
                ))}
                {/* Overlay gradient for bottom fade */}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0A0D14] to-transparent pointer-events-none" />
              </div>

              {/* Recent Activity */}
              <div>
                <div className="text-xs font-semibold text-white/40 mb-4 uppercase tracking-wider">Recent Signals</div>
                <div className="space-y-3">
                  {[
                    { pair: "XAU/USD", action: "BUY", price: "2,345.10", profit: "+$450.00" },
                    { pair: "EUR/USD", action: "SELL", price: "1.0845", profit: "+$120.00" },
                  ].map((trade, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold ${trade.action === "BUY" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                          {trade.action}
                        </div>
                        <div className="font-medium text-sm text-white">{trade.pair}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-white">{trade.price}</div>
                        <div className="text-[10px] text-emerald-400">{trade.profit}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

    </section>
  );
};
