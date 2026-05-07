import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { ArrowRight, ChevronDown, Play, ShieldCheck, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { EliteButton } from "../ui/Button";

// ─── PERFORMANCE CONSTANTS ────────────────────────────────────────────────────
const EASING = [0.4, 0, 0.2, 1] as const;
const ENTRY   = [0.16, 1, 0.3, 1] as const;

import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { supabase } from "@/lib/supabase";

// ─── HERO COMPONENT ────────────────────────────────────────────────────────────
export const FortressHero = () => {
  const { isEnabled: isTickerActive } = useFeatureFlag('market_ticker_active', true);
  const [tickers, setTickers] = useState<string[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isTickerActive) return;
    const fetchTickers = async () => {
      const { data } = await supabase.from('market_data').select('symbol, change');
      if (data) {
        setTickers(data.map(t => `${t.symbol} · ${t.change}`));
      }
    };
    fetchTickers();
  }, []);
  
  const displayTickers = tickers.length > 0 ? tickers : [
    "XAUUSD · +2.4%", "EURUSD · +0.8%", "GBPUSD · -0.3%", "NASDAQ · +1.2%"
  ];

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Scroll-triggered scale zoom on background (GPU only — no layout)
  const rawScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const scale     = useSpring(rawScale, { stiffness: 80, damping: 20, mass: 0.5 });
  // Parallax layers
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  const subTextY = useTransform(scrollYProgress, [0, 0.5], [0, 140]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 200]);

  const [tickerOffset, setTickerOffset] = useState(0);
  const tickerRef = useRef(0);

  // Ramp ticker via rAF (no setInterval)
  useEffect(() => {
    let id: number;
    const tick = () => {
      // Add slight noise to ticker speed to feel "alive"
      const noise = (Math.sin(Date.now() * 0.001) * 0.1);
      tickerRef.current -= (0.4 + noise);
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
      className="relative min-h-[100svh] overflow-hidden flex flex-col perspective-elite"
      aria-label="IFX Trades — Institutional Trading Education"
      style={{
        backgroundColor: "#010203",
        backgroundImage: "radial-gradient(ellipse 80% 50% at 50% 60%, rgba(16,185,129,0.12) 0%, transparent 70%)",
      }}
    >
      {/* ── CANVAS BACKGROUND (Parallax Layer) ── */}
      <motion.div
        style={{ scale, y: backgroundY, opacity: 0.7, willChange: "transform" }}
        className="absolute inset-0 origin-center flex items-center justify-center"
      >
        <img 
          src="/brain/c68f6654-c41f-4f65-a861-7f7e83c4a21d/institutional_rocket_hero_1777829335535.png" 
          alt="IFX Institutional Spacecraft" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>

      {/* ── GRADIENT OVERLAY (Depth & Readability) ── */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, transparent 0%, rgba(1,2,3,0.4) 50%, rgba(1,2,3,0.8) 100%), linear-gradient(to bottom, rgba(1,2,3,0.2) 0%, transparent 30%, rgba(1,2,3,1) 100%)",
        }}
        aria-hidden="true"
      />

      {/* ── LIVE MARKET TICKER (Institutional Pulse) ── */}
      {isTickerActive && (
        <div
          className="relative z-20 border-b border-white/5 bg-black/40 backdrop-blur-xl overflow-hidden flex items-center shadow-2xl"
          style={{ height: "2.5rem", minHeight: "2.5rem", contain: "layout" }}
        >
          <div className="absolute left-0 z-10 w-24 h-full bg-gradient-to-r from-black to-transparent" />
          <div className="absolute right-0 z-10 w-24 h-full bg-gradient-to-l from-black to-transparent" />
          <div
            className="flex gap-20 whitespace-nowrap"
            style={{ transform: `translateX(${tickerOffset % (displayTickers.length * 200)}px)` }}
          >
            {[...displayTickers, ...displayTickers, ...displayTickers].map((t, i) => (
              <span
                key={`${t}-${i}`}
                className="text-[9px] font-mono font-black uppercase tracking-[0.4em] text-white/30 flex items-center gap-4"
              >
                <span className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse" />
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT (Triple Parallax Stack) ── */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-6 pt-12 pb-12 md:pb-24 text-center">
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 md:mb-12 group cursor-default"
        >
          <div className="site-pill">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-sm animate-pulse" />
              Institutional Research Operations
            </span>
          </div>
        </motion.div>

        {/* Headline (Imperial Typography) */}
        <motion.h1
          style={{ opacity, y: textY, fontSize: "clamp(2rem, 8vw, 8rem)" }}
          className="font-black text-white tracking-[-0.05em] leading-[0.9] uppercase max-w-6xl mx-auto mb-8 preserve-3d px-4"
        >
          World-Class <br />
          <span className="italic font-serif text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">CFD & Forex</span>
          <br />Intelligence.
        </motion.h1>

        {/* Subheading with Operational Focus */}
        <motion.p
          style={{ opacity, y: subTextY, fontSize: "clamp(1.1rem, 2vw, 1.3rem)" }}
          className="max-w-2xl mx-auto text-white/40 leading-relaxed mb-10 font-medium"
        >
          Senior-led quantitative execution and market architecture. 
          Direct connectivity to Asia's most sophisticated institutional engineering desk.
        </motion.p>

        {/* Live Operational Telemetry */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-8 mb-8 md:mb-12 py-6 sm:py-4 px-6 sm:px-8 rounded-3xl sm:rounded-full bg-white/[0.02] border border-white/5 backdrop-blur-md"
        >
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10B981]" />
             <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">1,248 Active Partners</span>
          </div>
          <div className="hidden sm:block w-px h-3 bg-white/10" />
          <div className="flex items-center gap-3">
             <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/50" />
             <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">Audited Research: Verified</span>
          </div>
          <div className="hidden sm:block w-px h-3 bg-white/10" />
          <div className="flex items-center gap-3">
             <Zap className="w-3.5 h-3.5 text-cyan-500/50" />
             <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">Sync Delay: 0.12ms</span>
          </div>
        </motion.div>


        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.6, ease: EASING }}
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-center w-full max-w-lg sm:max-w-none px-4"
        >
          <Link to="/marketplace" className="w-full sm:w-auto">
            <EliteButton variant="premium-gold" size="md" fluid>
              Request Session Access
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform duration-300" />
            </EliteButton>
          </Link>

          <Link to="/quantx" className="w-full sm:w-auto">
            <EliteButton variant="secondary" size="md" fluid>
              <Play className="w-3.5 h-3.5 mr-2 text-emerald-400 fill-emerald-400/20" />
              See QuantX Results
            </EliteButton>
          </Link>
        </motion.div>

        {/* Social proof strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.8 }}
          className="grid grid-cols-2 md:flex md:flex-wrap justify-center items-center gap-x-10 gap-y-6 mt-8 md:mt-14 pt-10 border-t border-white/[0.06] w-full max-w-3xl mx-auto"
        >
          {[
            { value: "Institutional", label: "Quantitative Desk" },
            { value: "Multi-Asset", label: "Execution Logic" },
            { value: "High-Fidelity", label: "Research Terminal" },
            { value: "Proprietary", label: "Risk Governance" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1.5 px-4 md:px-6 md:border-r last:border-0 border-white/5 text-center">
              <span className="text-sm md:text-xl font-black text-white tracking-tight uppercase italic">{s.value}</span>
              <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-white/35 whitespace-nowrap">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

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
