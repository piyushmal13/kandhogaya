import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { ArrowRight, ChevronDown, Play, ShieldCheck, Zap, Globe, Timer, Lock, Server } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const EASING = [0.4, 0, 0.2, 1] as const;
const ENTRY = [0.16, 1, 0.3, 1] as const;

import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { supabase } from "@/lib/supabase";
import { EliteButton } from "@/components/ui/Button";
import { useLanguage } from "../../contexts/LanguageContext";
import { AnimatedCandlesticks } from "../ui/AnimatedCandlesticks";

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
        className="absolute w-[2px] h-[2px] rounded-full bg-blue-500/20"
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
  { icon: Server, label: "VPS Hosting*" },
  { icon: ShieldCheck, label: "Audit Verified" },
];

export const FortressHero: React.FC<FortressHeroProps> = ({ onRequestSession, onRequestBuild }) => {
  const { t } = useLanguage();
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
      setTimeout(() => {
        document.getElementById('performance')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      document.getElementById('performance')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] overflow-hidden flex flex-col"
      aria-label="IFX Trades — Institutional Trading Education"
      style={{
        backgroundColor: "#010203",
        backgroundImage: "radial-gradient(ellipse 80% 50% at 50% 60%, rgba(59,130,246,0.06) 0%, transparent 70%)",
      }}
    >
      {/* ── CANVAS BACKGROUND ── */}
      <motion.div
        style={{ scale, y: backgroundY, opacity: 0.5, willChange: "transform" }}
        className="absolute inset-0 origin-center flex items-center justify-center pointer-events-none"
      >
        <img
          src="/brain/c68f6654-c41f-4f65-a861-7f7e83c4a21d/institutional_rocket_hero_1777829335535.png"
          alt="IFX Institutional Spacecraft"
          className="w-full h-full object-cover opacity-20"
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
          className="relative z-30 mt-24 sm:mt-28 border-b border-blue-500/10 bg-black/60 backdrop-blur-2xl overflow-hidden flex items-center shrink-0 shadow-sm"
          style={{ height: "1.75rem", minHeight: "1.75rem", contain: "layout paint" }}
        >
          <div className="absolute left-0 z-10 w-16 sm:w-24 h-full bg-gradient-to-r from-[#010203] to-transparent" />
          <div className="absolute right-0 z-10 w-16 sm:w-24 h-full bg-gradient-to-l from-[#010203] to-transparent" />
          
          {/* LIVE indicator */}
          <div className="absolute left-4 z-20 flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500" />
            </span>
            <span className="text-[8px] font-black uppercase tracking-[0.25em] text-blue-400/60 hidden sm:inline">Live</span>
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
                <span className="w-0.5 h-0.5 rounded-full bg-blue-500/50" />
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center text-center px-6 sm:px-8 py-16 md:py-28 max-w-5xl mx-auto w-full">
          
          {/* CENTERED SINGLE COLUMN: CRISP TEXT & RESPONSIVE ACTIONS */}
          <div className="flex flex-col items-center justify-center space-y-8 w-full">
            
            {/* Sovereign Badge (Removed per CEO directive) */}

            {/* Headline */}
            <motion.h1
              style={{ opacity, y: textY }}
              className="font-black text-white tracking-tight leading-[1.05] sm:leading-[0.95] uppercase mb-2 select-none"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: ENTRY }}
            >
              <span className="block text-[clamp(2.0rem,9vw,5.2rem)] tracking-tight whitespace-nowrap break-keep">{t("hero_world_class")}</span>
              <span className="block text-[clamp(1.8rem,8vw,5.2rem)] tracking-tight mt-1">
                <span className="italic font-serif text-shimmer text-[clamp(1.8rem,8vw,5.2rem)]">{t("hero_inst_fx")}</span>
              </span>
              <span className="block text-[clamp(2.0rem,9vw,5.2rem)] tracking-tight mt-1">
                {t("hero_macro")}
              </span>
            </motion.h1>

            {/* Subheading (Dry B2B Content) */}
            <motion.p
              style={{ opacity, y: subTextY }}
              className="text-white/35 leading-relaxed font-medium text-[clamp(0.85rem,1.8vw,1.15rem)] max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7, ease: ENTRY }}
            >
              {t("hero_sub")}
            </motion.p>

            {/* CTAs (Responsive Stacked Column on Mobile, Row on Desktop) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6, ease: EASING }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto z-30"
            >
              <button onClick={handleRequestSessionClick} className="w-full sm:w-auto shrink-0 cursor-pointer">
                <EliteButton variant="gemini" size="lg" fluid rightIcon={<ArrowRight className="w-3.5 h-3.5" />} glowEffect>
                  {t("cta_request")}
                </EliteButton>
              </button>

              <button onClick={handleSeeResults} className="w-full sm:w-auto shrink-0 cursor-pointer">
                <EliteButton variant="secondary" size="lg" fluid leftIcon={<Play className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20" />}>
                  {t("cta_results")}
                </EliteButton>
              </button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6, ease: ENTRY }}
              className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-2 w-full max-w-3xl mx-auto"
            >
              {TRUST_ITEMS.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.06]"
                >
                  <item.icon className="w-3 h-3 text-blue-400/60" />
                  <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">{item.label}</span>
                </div>
              ))}
            </motion.div>

            {/* Smallest Star Footnote */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.08 }}
              whileHover={{ opacity: 0.8 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="text-[5px] sm:text-[6px] text-white/40 tracking-widest uppercase font-mono transition-opacity select-none cursor-help pt-2"
              title="VPS Promotion: Complimentary ultra-low latency VPS server setup is available for all active funded clients. Detailed requirements and conditions are specified in our official Terms of Service."
            >
              *Complimentary partner server programs. Terms apply.
            </motion.div>

          </div>
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
          <span className="text-[9px] font-black uppercase tracking-[0.45em] text-white">{t("cta_explore")}</span>
          <ChevronDown className="w-4 h-4 text-blue-400" />
        </motion.button>
      </div>
    </section>
  );
};
