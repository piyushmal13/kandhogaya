import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { ArrowRight, ChevronDown, Play, ShieldCheck, Zap, Globe, Timer, Lock } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const EASING = [0.4, 0, 0.2, 1] as const;
const ENTRY = [0.16, 1, 0.3, 1] as const;

import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { supabase } from "@/lib/supabase";
import { EliteButton } from "@/components/ui/Button";

interface FortressHeroProps {
  onRequestSession: () => void;
  onRequestBuild: () => void;
}

// ── FLOATING PARTICLES ──
const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
    {Array.from({ length: 30 }).map((_, i) => (
      <div
        key={i}
        className="absolute w-[2px] h-[2px] rounded-full bg-emerald-500/20"
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

export const FortressHero: React.FC<FortressHeroProps> = ({ onRequestSession, onRequestBuild }) => {
  const { isEnabled: isTickerActive } = useFeatureFlag('market_ticker_active', true);
  const [tickers, setTickers] = useState<string[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleRequestSessionClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onRequestSession();
  };

  const handleSeeResults = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/?results=true');
      return;
    }
    const el = document.getElementById('algo-heading') || document.getElementById('performance');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] overflow-hidden flex flex-col justify-between"
      aria-label="IFX Trades — Institutional Trading Education"
      style={{
        backgroundColor: "#010203",
        backgroundImage: "radial-gradient(circle at 50% 50%, rgba(16,185,129,0.06) 0%, #030509 50%, #010203 100%)",
      }}
    >
      {/* ── CANVAS BACKGROUND DECOR ── */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-emerald-500/[0.03] blur-[150px] rounded-full" />
        <div className="absolute -top-40 right-10 w-[300px] h-[300px] bg-blue-500/[0.02] blur-[100px] rounded-full" />
      </div>

      {/* ── FLOATING PARTICLES ── */}
      <FloatingParticles />

      {/* ── LIVE MARKET TICKER ── */}
      {isTickerActive && (
        <div
          className="relative z-30 mt-16 sm:mt-20 border-b border-emerald-500/10 bg-black/60 backdrop-blur-2xl overflow-hidden flex items-center shrink-0 shadow-sm"
          style={{ height: "1.75rem", minHeight: "1.75rem", contain: "layout paint" }}
        >
          <div className="absolute left-0 z-10 w-16 sm:w-24 h-full bg-gradient-to-r from-[#010203] to-transparent" />
          <div className="absolute right-0 z-10 w-16 sm:w-24 h-full bg-gradient-to-l from-[#010203] to-transparent" />
          
          {/* LIVE indicator */}
          <div className="absolute left-4 z-20 flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span className="text-[8px] font-black uppercase tracking-[0.25em] text-emerald-400/60 hidden sm:inline">Live</span>
          </div>

          <div
            className="flex gap-12 sm:gap-16 whitespace-nowrap pl-16"
            style={{ transform: `translateX(${tickerOffset % (displayTickers.length * 160)}px)` }}
          >
            {[...displayTickers, ...displayTickers, ...displayTickers].map((t, i) => (
              <span
                key={`${t}-${i}`}
                className="text-[8px] sm:text-[9px] font-mono font-bold uppercase tracking-[0.25em] text-white/35 flex items-center gap-2"
              >
                <span className="w-0.5 h-0.5 rounded-full bg-emerald-500/50" />
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 md:py-24 text-center max-w-5xl mx-auto w-full">
        
        {/* Headline */}
        <motion.h1
          style={{ opacity, y: textY }}
          className="font-black text-white tracking-[-0.03em] leading-[1] uppercase max-w-5xl mx-auto mb-6 sm:mb-8 select-none px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: ENTRY }}
        >
          <span className="block text-5xl md:text-7xl lg:text-[5.5rem] tracking-tight">World-Class</span>
          <span className="block text-5xl md:text-7xl lg:text-[5.5rem] tracking-tight mt-1 sm:mt-2">
            <span className="italic font-serif text-shimmer pr-2 sm:pr-3">Institutional FX</span> <br className="md:hidden" /> &amp; Macro.
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          style={{ opacity, y: subTextY }}
          className="max-w-2xl mx-auto text-white/35 leading-relaxed mb-10 sm:mb-14 font-medium text-[clamp(0.85rem,1.8vw,1.15rem)] px-4"
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
          className="flex flex-row flex-wrap items-center gap-3.5 sm:gap-5 justify-center w-full px-2 max-w-md mx-auto z-30"
        >
          <button onClick={handleRequestSessionClick} className="shrink-0">
            <EliteButton variant="gemini" size="lg" rightIcon={<ArrowRight className="w-3.5 h-3.5" />} glowEffect>
              Request Session
            </EliteButton>
          </button>

          <button onClick={handleSeeResults} className="shrink-0">
            <EliteButton variant="secondary" size="lg" leftIcon={<Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />}>
              See Results
            </EliteButton>
          </button>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6, ease: ENTRY }}
          className="mt-12 sm:mt-16 flex flex-wrap items-center justify-center gap-3 sm:gap-6"
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
      <div className="relative h-12 w-full flex justify-center items-center shrink-0 pb-6">
        <motion.button
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          onClick={scrollDown}
          className="z-30 hidden sm:flex flex-col items-center gap-2 opacity-40 hover:opacity-90 transition-opacity duration-300 cursor-pointer"
          aria-label="Scroll down to explore"
        >
          <span className="text-[9px] font-black uppercase tracking-[0.45em] text-white">Explore</span>
          <ChevronDown className="w-4 h-4 text-emerald-400" />
        </motion.button>
      </div>
    </section>
  );
};
