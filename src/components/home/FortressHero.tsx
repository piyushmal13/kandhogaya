import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "motion/react";
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
        className="absolute w-[3px] h-[3px] rounded-full bg-cyan-400/35"
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
  { icon: Lock, title: "SECURE NODE", desc: "Direct ECN tunnel" },
  { icon: Timer, title: "LATENCY TARGET", desc: "Sub-50ms execution" },
  { icon: Globe, title: "GLOBAL GRID", desc: "40+ Sovereignty pools" },
  { icon: Server, title: "CO-LOCATION", desc: "NY4/LD4 cross-connects" },
  { icon: ShieldCheck, title: "AUDIT VERIFIED", desc: "Third-party logs" },
];

export const FortressHero: React.FC<FortressHeroProps> = ({ onRequestSession, onRequestBuild }) => {
  const { t } = useLanguage();
  const { isEnabled: isTickerActive } = useFeatureFlag('market_ticker_active', true);
  const [tickers, setTickers] = useState<string[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(1);
  const [jitter, setJitter] = useState({ ny4: 0.81, ld4: 1.15, sg1: 4.58, db: 8.18 });
  const [sessionKey, setSessionKey] = useState("ECN-NODE::ROTATE_INIT");

  useEffect(() => {
    const timer = setInterval(() => {
      setJitter({
        ny4: +(0.78 + Math.random() * 0.07).toFixed(2),
        ld4: +(1.12 + Math.random() * 0.10).toFixed(2),
        sg1: +(4.50 + Math.random() * 0.15).toFixed(2),
        db: +(8.05 + Math.random() * 0.20).toFixed(2)
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const generateKey = () => {
      const chars = "ABCDEF0123456789";
      let key = "ECN-NODE::";
      for (let i = 0; i < 16; i++) {
        key += chars[Math.floor(Math.random() * 16)];
      }
      setSessionKey(key);
    };
    generateKey();
    const timer = setInterval(generateKey, 4000);
    return () => clearInterval(timer);
  }, []);

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
      {/* ── CODES & CYBERNETIC BACKGROUND (No AI Images) ── */}
      <div className="absolute inset-0 origin-center pointer-events-none overflow-hidden select-none opacity-20 z-0">
        {/* Animated Cyber Grid */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 163, 255, 0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 163, 255, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(circle at 50% 50%, black 20%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(circle at 50% 50%, black 20%, transparent 80%)",
          }}
        />

        {/* Coded Dynamic ECN Nodes & Fiber Paths (SVG lines & glowing pulses) */}
        <svg className="absolute inset-0 w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
          {/* NY4 to LD4 path */}
          <path d="M 150,150 L 500,250" stroke="rgba(0,163,255,0.2)" strokeWidth="1" strokeDasharray="5,5" />
          <circle cx="150" cy="150" r="3" fill="#00A3FF" className="animate-pulse" />
          <circle cx="500" cy="250" r="3" fill="#00A3FF" />
          <circle r="4" fill="#00A3FF" opacity="0.8">
            <animateMotion dur="6s" repeatCount="indefinite" path="M 150,150 L 500,250" />
          </circle>

          {/* LD4 to SG1 path */}
          <path d="M 500,250 L 800,450" stroke="rgba(16,185,129,0.2)" strokeWidth="1" strokeDasharray="4,4" />
          <circle cx="800" cy="450" r="3" fill="#10B981" />
          <circle r="4" fill="#10B981" opacity="0.8">
            <animateMotion dur="8s" repeatCount="indefinite" path="M 500,250 L 800,450" />
          </circle>

          {/* LD4 to Dubai path */}
          <path d="M 500,250 L 650,180" stroke="rgba(0,163,255,0.25)" strokeWidth="1" />
          <circle cx="650" cy="180" r="3" fill="#00A3FF" className="animate-pulse" />
          <circle r="4" fill="#00A3FF" opacity="0.8">
            <animateMotion dur="5s" repeatCount="indefinite" path="M 500,250 L 650,180" />
          </circle>
        </svg>

        {/* Telemetric server log watermark */}
        <div className="absolute top-1/4 left-10 text-[9px] font-mono text-white/5 uppercase tracking-[0.3em] hidden lg:block leading-relaxed">
          NODE: NY4.EQUINIX.US<br />
          PORT: 10G-A ACTIVE<br />
          ECN STATE: ESTABLISHED<br />
          JITTER: &lt; 0.02ms
        </div>
        <div className="absolute bottom-1/4 right-10 text-[9px] font-mono text-white/5 uppercase tracking-[0.3em] text-right hidden lg:block leading-relaxed">
          NODE: LD4.EQUINIX.UK<br />
          AUDIT HASH: SHA-256 SYNCED<br />
          PROTOCOL: SECURE ECN<br />
          PACKET: 0% LOSS
        </div>
      </div>

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

            {/* Interactive ECN Telemetry Status Panel */}
            <div className="w-full max-w-4xl mx-auto pt-8 border-t border-white/[0.04] z-30 select-none">
              {/* Tab headers */}
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2.5 mb-5">
                {TRUST_ITEMS.map((item, idx) => {
                  const isActive = activeTab === idx;
                  return (
                    <button
                      key={item.title}
                      onClick={() => setActiveTab(idx)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-mono tracking-wider transition-all cursor-pointer ${
                        isActive
                          ? "bg-blue-500/10 border-blue-500/30 text-white shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                          : "bg-transparent border-transparent text-white/45 hover:text-white/80 hover:border-white/5"
                      }`}
                    >
                      <item.icon className={`w-3.5 h-3.5 ${isActive ? "text-blue-400" : "text-blue-500/40"}`} />
                      <span className="font-bold">{item.title}</span>
                    </button>
                  );
                })}
              </div>

              {/* Live Telemetry Display */}
              <div className="bg-[#04060A]/85 border border-white/[0.04] rounded-2xl p-5 min-h-[90px] flex items-center justify-center text-left backdrop-blur-md relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/[0.01] via-transparent to-transparent pointer-events-none" />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="w-full grid grid-cols-2 md:grid-cols-4 gap-4"
                  >
                    {activeTab === 0 && ( // SECURE NODE
                      <>
                        <div className="space-y-1">
                          <div className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Protocol Standard</div>
                          <div className="text-white font-mono text-xs font-black">Direct ECN Protocol</div>
                        </div>
                        <div className="space-y-1 col-span-2">
                          <div className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Rotating Session Key</div>
                          <div className="text-blue-400 font-mono text-[10px] sm:text-xs font-black tracking-tight">{sessionKey}</div>
                        </div>
                        <div className="space-y-1 text-right">
                          <div className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Enclave Shield</div>
                          <div className="text-emerald-400 font-mono text-xs font-black flex items-center justify-end gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                            SECURE
                          </div>
                        </div>
                      </>
                    )}
                    {activeTab === 1 && ( // LATENCY TARGET
                      <>
                        <div className="space-y-1">
                          <div className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Equinix NY4</div>
                          <div className="text-white font-mono text-xs font-black">{jitter.ny4} ms</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Equinix LD4</div>
                          <div className="text-white font-mono text-xs font-black">{jitter.ld4} ms</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Equinix SG1</div>
                          <div className="text-white font-mono text-xs font-black">{jitter.sg1} ms</div>
                        </div>
                        <div className="space-y-1 text-right">
                          <div className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Telemetric Flow</div>
                          <div className="text-blue-400 font-mono text-xs font-black uppercase tracking-wider">Sub-50ms Peak</div>
                        </div>
                      </>
                    )}
                    {activeTab === 2 && ( // GLOBAL GRID
                      <>
                        <div className="space-y-1">
                          <div className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Active Paths</div>
                          <div className="text-white font-mono text-xs font-black">40+ Sovereignty Pools</div>
                        </div>
                        <div className="space-y-1 col-span-2">
                          <div className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Dynamic Routing Nodes</div>
                          <div className="text-white font-mono text-xs font-black tracking-wide">Dubai · Mumbai · London · NY</div>
                        </div>
                        <div className="space-y-1 text-right">
                          <div className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Core Status</div>
                          <div className="text-emerald-400 font-mono text-xs font-black">SYNCHRONIZED</div>
                        </div>
                      </>
                    )}
                    {activeTab === 3 && ( // CO-LOCATION
                      <>
                        <div className="space-y-1">
                          <div className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Bandwidth Pool</div>
                          <div className="text-white font-mono text-xs font-black">10 Gbps Fiber Link</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Port Telemetry</div>
                          <div className="text-emerald-400 font-mono text-xs font-black">PORT 10G-A: UP</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Signal Jitter</div>
                          <div className="text-white font-mono text-xs font-black">&lt; 0.02 ms</div>
                        </div>
                        <div className="space-y-1 text-right">
                          <div className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Slippage Protection</div>
                          <div className="text-blue-400 font-mono text-xs font-black">ACTIVE</div>
                        </div>
                      </>
                    )}
                    {activeTab === 4 && ( // AUDIT VERIFIED
                      <>
                        <div className="space-y-1 col-span-2">
                          <div className="text-[8px] font-mono text-white/30 uppercase tracking-widest">SHA-256 Ledger Validation Hash</div>
                          <div className="text-white font-mono text-xs font-black tracking-tighter">98fa83a938c82eb4b711e3df9c0e21a28a50</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Audit Registry</div>
                          <div className="text-blue-400 font-mono text-xs font-black">3RD PARTY COMPLIANT</div>
                        </div>
                        <div className="space-y-1 text-right">
                          <div className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Telemetry Log</div>
                          <div className="text-emerald-400 font-mono text-xs font-black flex items-center justify-end gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            VERIFIED
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

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
