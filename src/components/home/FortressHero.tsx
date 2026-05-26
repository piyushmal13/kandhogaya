import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { ArrowRight, ChevronDown, Play, ShieldCheck, Zap, Globe, Timer, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const EASING = [0.4, 0, 0.2, 1] as const;
const ENTRY = [0.16, 1, 0.3, 1] as const;

import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { supabase } from "@/lib/supabase";
import { EliteButton } from "@/components/ui/Button";

// ── FLOATING PARTICLES ──
const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
    {Array.from({ length: 30 }).map((_, i) => (
      <div
        key={i}
        className="absolute w-[2px] h-[2px] rounded-full bg-emerald-400/20"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `float ${6 + Math.random() * 8}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 5}s`,
        }}
      />
    ))}
  </div>
);

// ── TRUST BADGES ──
const TRUST_ITEMS = [
  { icon: Lock, label: "256-bit Encrypted" },
  { icon: Timer, label: "<50ms Execution" },
  { icon: Globe, label: "40+ Countries" },
  { icon: ShieldCheck, label: "Audit Verified" },
];

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
    "XAUUSD · +2.4%", "EURUSD · +0.8%", "GBPUSD · -0.3%", "NASDAQ · +1.2%",
    "USDJPY · +0.5%", "BTCUSD · +3.1%", "US30 · +0.9%", "GBPJPY · -0.2%"
  ];

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const rawScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const scale = useSpring(rawScale, { stiffness: 80, damping: 20, mass: 0.5 });
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  const subTextY = useTransform(scrollYProgress, [0, 0.5], [0, 140]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 200]);

  const [tickerOffset, setTickerOffset] = useState(0);
  const tickerRef = useRef(0);

  useEffect(() => {
    let id: number;
    const tick = () => {
      const noise = (Math.sin(Date.now() * 0.001) * 0.1);
      tickerRef.current -= (0.5 + noise);
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
        backgroundColor: "#010203",
        backgroundImage: "radial-gradient(ellipse 80% 50% at 50% 60%, rgba(16,185,129,0.10) 0%, transparent 70%)",
      }}
    >
      {/* ── CANVAS BACKGROUND ── */}
      <motion.div
        style={{ scale, y: backgroundY, opacity: 0.7, willChange: "transform" }}
        className="absolute inset-0 origin-center flex items-center justify-center"
      >
        <img
          src="/brain/c68f6654-c41f-4f65-a861-7f7e83c4a21d/institutional_rocket_hero_1777829335535.png"
          alt="IFX Institutional Spacecraft"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-black/50" />
      </motion.div>

      {/* ── FLOATING PARTICLES ── */}
      <FloatingParticles />

      {/* ── GRADIENT OVERLAY ── */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, transparent 0%, rgba(1,2,3,0.4) 50%, rgba(1,2,3,0.85) 100%), linear-gradient(to bottom, rgba(1,2,3,0.3) 0%, transparent 30%, rgba(1,2,3,1) 100%)",
        }}
        aria-hidden="true"
      />

      {/* ── LIVE MARKET TICKER ── */}
      {isTickerActive && (
        <div
          className="relative z-30 mt-20 border-b border-emerald-500/10 bg-black/60 backdrop-blur-2xl overflow-hidden flex items-center"
          style={{ height: "2.75rem", minHeight: "2.75rem", contain: "layout paint" }}
        >
          <div className="absolute left-0 z-10 w-28 h-full bg-gradient-to-r from-[#010203] to-transparent" />
          <div className="absolute right-0 z-10 w-28 h-full bg-gradient-to-l from-[#010203] to-transparent" />
          
          {/* LIVE indicator */}
          <div className="absolute left-4 z-20 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-400/60 hidden sm:inline">Live</span>
          </div>

          <div
            className="flex gap-16 sm:gap-20 whitespace-nowrap pl-20"
            style={{ transform: `translateX(${tickerOffset % (displayTickers.length * 200)}px)` }}
          >
            {[...displayTickers, ...displayTickers, ...displayTickers].map((t, i) => (
              <span
                key={`${t}-${i}`}
                className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-[0.3em] text-white/40 flex items-center gap-3"
              >
                <span className="w-1 h-1 rounded-full bg-emerald-500/50" />
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pt-8 sm:pt-16 pb-12 md:pb-24 text-center">
        
        {/* Institutional Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: ENTRY }}
          className="mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Institutional Research Desk</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          style={{ opacity, y: textY }}
          className="font-black text-white tracking-[-0.05em] leading-[0.85] uppercase max-w-5xl mx-auto mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: ENTRY }}
        >
          <span className="block text-[clamp(2rem,8vw,7rem)]">World-Class</span>
          <span className="block text-[clamp(2.2rem,9vw,8rem)] italic font-serif text-shimmer">Institutional FX</span>
          <span className="block text-[clamp(2rem,8vw,7rem)]">&amp; Macro.</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          style={{ opacity, y: subTextY }}
          className="max-w-2xl mx-auto text-white/35 leading-relaxed mb-8 sm:mb-12 font-medium text-[clamp(0.85rem,1.8vw,1.15rem)] px-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7, ease: ENTRY }}
        >
          We provide professional proprietary trading algorithms at the best cost. If you have a specific trading strategy, our quantitative desk will build it for you with high precision and institutional-grade reliability.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6, ease: EASING }}
          className="flex flex-row items-center gap-3 sm:gap-4 justify-center w-full px-2 max-w-md mx-auto"
        >
          <Link to="/webinars" className="shrink-0">
            <EliteButton variant="premium-gold" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Request Session
            </EliteButton>
          </Link>

          <Link to="/quantx" className="shrink-0">
            <EliteButton variant="secondary" size="sm" leftIcon={<Play className="w-3 h-3 text-emerald-400 fill-emerald-400/20" />}>
              See Results
            </EliteButton>
          </Link>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6, ease: ENTRY }}
          className="mt-10 sm:mt-14 flex flex-wrap items-center justify-center gap-3 sm:gap-6"
        >
          {TRUST_ITEMS.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.06]"
            >
              <item.icon className="w-3 h-3 text-emerald-400/60" />
              <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── SCROLL INDICATOR ── */}
      <motion.button
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        onClick={scrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 hidden sm:flex flex-col items-center gap-2 opacity-40 hover:opacity-90 transition-opacity duration-300 cursor-pointer"
        aria-label="Scroll down to explore"
      >
        <span className="text-[9px] font-black uppercase tracking-[0.45em] text-white">Explore</span>
        <ChevronDown className="w-4 h-4 text-emerald-400" />
      </motion.button>
    </section>
  );
};
