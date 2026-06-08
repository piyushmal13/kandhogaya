import React, { useEffect, useRef, useState, useCallback, Suspense, lazy } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { ArrowRight, ChevronDown, Play } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const EASING = [0.4, 0, 0.2, 1] as const;
const ENTRY = [0.16, 1, 0.3, 1] as const;

import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "../../contexts/LanguageContext";
import { MatrixButton } from "@/components/ui/MatrixButton";

// Lazy-load the heavy WebGL canvas — never blocks initial paint
const AntiGravityMatrix = lazy(() =>
  import('./AntiGravityMatrix').then(m => ({ default: m.AntiGravityMatrix }))
);

interface FortressHeroProps {
  onRequestSession: () => void;
  onRequestBuild: () => void;
}



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
      style={{ backgroundColor: '#020305' }}
    >
      {/* ── ANTI-GRAVITY LIQUIDITY MATRIX (WebGL) ── */}
      <div className="absolute inset-0 z-0" aria-hidden>
        <Suspense fallback={
          <div className="w-full h-full" style={{ background: '#020305' }} />
        }>
          <AntiGravityMatrix className="w-full h-full" />
        </Suspense>
      </div>

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

            {/* CTAs — Institutional Gold MatrixButton System */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6, ease: EASING }}
              className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 w-full sm:w-auto z-30"
            >
              <MatrixButton
                id="hero-cta-primary"
                variant="primary"
                onClick={handleRequestSessionClick}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />}
              >
                {t('cta_request')}
              </MatrixButton>

              <MatrixButton
                id="hero-cta-secondary"
                variant="secondary"
                onClick={handleSeeResults}
                leftIcon={<Play className="w-3 h-3 fill-current opacity-70" />}
              >
                {t('cta_results')}
              </MatrixButton>
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
