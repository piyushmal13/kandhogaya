import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { ArrowRight, ChevronDown, Play } from "lucide-react";
import { Link } from "react-router-dom";

// ─── PERFORMANCE CONSTANTS ────────────────────────────────────────────────────
const EASING = [0.4, 0, 0.2, 1] as const;
const ENTRY   = [0.16, 1, 0.3, 1] as const;

import { CinematicRocket } from "../animations/CinematicRocket";

// ─── SCROLL TICKER ─────────────────────────────────────────────────────────────
const TICKERS = [
  "XAUUSD · +2.4%",
  "EURUSD · +0.8%",
  "GBPUSD · -0.3%",
  "NASDAQ · +1.2%",
  "BTCUSD · +5.1%",
  "USDJPY · -0.6%",
  "OIL WTI · +1.8%",
];

// ─── HERO COMPONENT ────────────────────────────────────────────────────────────
export const FortressHero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Scroll-triggered scale zoom on background (GPU only — no layout)
  const rawScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const scale     = useSpring(rawScale, { stiffness: 80, damping: 20, mass: 0.5 });
  const opacity   = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const textY     = useTransform(scrollYProgress, [0, 0.5], [0, 60]);

  const [tickerOffset, setTickerOffset] = useState(0);
  const tickerRef = useRef(0);

  // Ramp ticker via rAF (no setInterval)
  useEffect(() => {
    let id: number;
    const tick = () => {
      tickerRef.current -= 0.4;
      setTickerOffset(tickerRef.current);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);

  const scrollDown = useCallback(() => {
    window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] overflow-hidden flex flex-col"
      aria-label="IFX Trades — Institutional Trading Education"
      style={{
        /* LCP OPTIMIZATION: instant background color = no white flash
           This CSS paint is synchronous — user sees dark instantly before JS loads */
        backgroundColor: "#010203",
        /* Subtle gradient blur-hash placeholder — paints before canvas loads */
        backgroundImage: "radial-gradient(ellipse 80% 50% at 50% 60%, rgba(16,185,129,0.08) 0%, transparent 70%)",
      }}
    >
      {/* ── CANVAS BACKGROUND (GPU layer) ── */}
      <motion.div
        style={{ scale, willChange: "transform" }}
        className="absolute inset-0 origin-center"
      >
        <CinematicRocket />
      </motion.div>

      {/* ── GRADIENT OVERLAY (text readability) ── */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(1,2,3,0.35) 0%, rgba(1,2,3,0.15) 30%, rgba(1,2,3,0.55) 70%, rgba(1,2,3,1) 100%)",
        }}
        aria-hidden="true"
      />

      {/* ── LIVE MARKET TICKER ── */}
      <div
        className="relative z-20 border-b border-emerald-500/10 bg-black/30 backdrop-blur-sm overflow-hidden flex items-center"
        aria-label="Live market data ticker"
        style={{
          height: "2.25rem", // EXPLICIT height = zero CLS (no layout shift while JS loads)
          minHeight: "2.25rem",
          contain: "layout", // CSS containment — prevents ticker from affecting surrounding layout
        }}
      >
        <div className="absolute left-0 z-10 w-16 h-full bg-gradient-to-r from-black/80 to-transparent" />
        <div className="absolute right-0 z-10 w-16 h-full bg-gradient-to-l from-black/80 to-transparent" />
        <div
          className="flex gap-14 whitespace-nowrap"
          style={{ transform: `translateX(${tickerOffset % (TICKERS.length * 180)}px)` }}
          aria-hidden="true"
        >
          {[...TICKERS, ...TICKERS, ...TICKERS].map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-emerald-400/70"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <motion.div
        style={{ opacity, y: textY }}
        className="relative z-20 flex-1 flex flex-col items-center justify-center px-6 pt-8 pb-16 md:pt-12 md:pb-28 text-center"
      >
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASING }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] backdrop-blur-md mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.35em] text-emerald-400">
            Asia's #1 Institutional Trading Education
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.85, ease: ENTRY }}
          className="font-black text-white tracking-[-0.04em] leading-[0.88] uppercase max-w-5xl mx-auto mb-6 px-2"
          style={{ fontSize: "clamp(2.4rem, 10vw, 9rem)" }}
        >
          Trade Like{" "}
          <span
            className="italic font-serif"
            style={{
              background: "linear-gradient(135deg, #10B981 0%, #00FFA3 50%, #06B6D4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Institutions
          </span>
          <br />Do.
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.7, ease: EASING }}
          className="max-w-2xl mx-auto text-white/65 leading-relaxed mb-12"
          style={{ fontSize: "clamp(1rem, 1.8vw, 1.2rem)" }}
        >
          Stop gambling with retail strategies. Get inside access to professional
          algorithmic frameworks, live macro analysis, and execution intelligence
          used by Asia's top quant traders.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.6, ease: EASING }}
          className="flex flex-col sm:flex-row items-center gap-4 justify-center w-full"
        >
          <Link
            to="/webinars"
            className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-emerald-500 text-black font-black text-sm uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] shadow-[0_0_40px_rgba(16,185,129,0.35)] hover:shadow-[0_0_60px_rgba(16,185,129,0.5)]"
            style={{ willChange: "transform" }}
          >
            Start Learning Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>

          <Link
            to="/quantx"
            className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/[0.05] border border-white/10 text-white font-black text-sm uppercase tracking-[0.2em] hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.97] backdrop-blur-md"
            style={{ willChange: "transform" }}
          >
            <Play className="w-4 h-4 text-emerald-400" />
            See QuantX Results
          </Link>
        </motion.div>

        {/* Social proof strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.8 }}
          className="flex flex-wrap justify-center items-center gap-x-10 gap-y-3 mt-14 pt-10 border-t border-white/[0.06] w-full max-w-3xl mx-auto"
        >
          {[
            { value: "12,000+",     label: "Active Traders" },
            { value: "Institutional",   label: "Grade Research" },
            { value: "3-Year",      label: "Verified Alpha" },
            { value: "India · UAE", label: "Compliance Verified" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1">
              <span className="text-xl font-black text-white tracking-tight">{s.value}</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── SCROLL INDICATOR ── */}
      <motion.button
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        onClick={scrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 opacity-40 hover:opacity-90 transition-opacity duration-300 cursor-pointer"
        aria-label="Scroll down to explore"
      >
        <span className="text-[9px] font-black uppercase tracking-[0.45em] text-white">Explore</span>
        <ChevronDown className="w-4 h-4 text-emerald-400" />
      </motion.button>
    </section>
  );
};
