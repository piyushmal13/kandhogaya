import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "motion/react";
import {
  ArrowRight,
  Shield,
  Award,
  TrendingUp,
  Users,
  CheckCircle2,
  Zap,
  Globe,
  Lock,
  Activity,
  ChevronDown,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { Button } from "../ui/Button";
import { tracker } from "@/core/tracker";
import { getCache, setCache } from "@/utils/cache";
import { AnimatedCandlesticks } from "../ui/AnimatedCandlesticks";

const TRUST_SIGNALS = [
  { icon: Users, label: "Institutional", sub: "Grade Access" },
  { icon: Award, label: "Deterministic", sub: "Data Models" },
  { icon: TrendingUp, label: "Quantitative", sub: "Execution" },
  { icon: Shield, label: "Risk Assessed", sub: "Zero Breach" },
];

const FEATURES = [
  "Institutional Algo Masterclass & MT5 Mastery",
  "Sovereign Gold (XAUUSD) Macro Intelligence",
  "Quantitative Execution & Analytical Frameworks",
  "Asia's Premier Strategic Training Desk",
];

const TICKER_ITEMS = [
  { pair: "XAU/USD", price: "2,341.80", change: "+1.24%", up: true },
  { pair: "EUR/USD", price: "1.0842", change: "+0.31%", up: true },
  { pair: "GBP/USD", price: "1.2718", change: "-0.18%", up: false },
  { pair: "USD/JPY", price: "153.42", change: "+0.44%", up: true },
  { pair: "BTC/USD", price: "67,421", change: "+2.11%", up: true },
  { pair: "BTC/USD", price: "67,421", change: "+2.11%", up: true },
];

export const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [formState, setFormState] = useState<"idle" | "loading" | "success">("idle");
  const [activeFeature, setActiveFeature] = useState(0);
  const [stats, setStats] = useState({ traders: "12,400+" });
  const [isMounted, setIsMounted] = useState(false);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.6], [0, 80]);
  const heroScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.96]);

  useEffect(() => {
    setIsMounted(true);
    tracker.track("page_view", { surface: "home_v3_elite" });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % FEATURES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const fetchRealStats = useCallback(async () => {
    const cacheKey = "hero_stats_v9_elite";
    const cached = getCache(cacheKey);
    if (cached) { setStats(cached); return; }
    try {
      const { count } = await supabase.from("users").select("*", { count: "exact", head: true });
      if (count !== null) {
        const newStats = { traders: `${(count + 12400).toLocaleString()}+` };
        setCache(cacheKey, newStats, 60000);
        setStats(newStats);
      }
    } catch (e) {
      console.error("Stats fetch error:", e);
    }
  }, []);

  useEffect(() => { fetchRealStats(); }, [fetchRealStats]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden bg-[#020202]"
      aria-label="IFX Trades — Asia's #1 Institutional Forex Education Platform"
    >
      {/* ===== CINEMATIC BACKGROUND ===== */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none" aria-hidden>
        {/* Primary radial glow */}
        <motion.div
          animate={{ opacity: [0.25, 0.45, 0.25], scale: [1, 1.08, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[140%] h-[70%] bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.13)_0%,transparent_65%)] blur-[80px]"
        />
        {/* Gold accent right */}
        <div className="absolute top-[15%] right-[-5%] w-[45%] h-[55%] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.07)_0%,transparent_60%)] blur-[90px]" />
        {/* Blue accent left */}
        <div className="absolute bottom-[10%] left-[-5%] w-[35%] h-[45%] bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.05)_0%,transparent_60%)] blur-[100px]" />

        {/* Dot-grid infrastructure */}
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, black, transparent)",
          }}
        />

        {/* Scanline subtle */}
        <motion.div
          className="absolute inset-0"
          style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)" }}
        />
      </div>

      {/* ===== SCROLLED PARALLAX WRAPPER ===== */}
      <motion.div
        style={{ opacity: heroOpacity, y: heroY, scale: heroScale }}
        className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 pt-28 pb-16 flex flex-col items-center"
      >
        {/* ===== LIVE SIGNAL BADGE ===== */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 md:mb-12"
        >
          <div className="group inline-flex items-center gap-3 px-5 py-2.5 bg-white/[0.02] border border-white/[0.05] rounded-full backdrop-blur-xl transition-all duration-500 cursor-default">
            <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-[0.35em] text-white/40 group-hover:text-white/70 transition-colors">
              IFX Sovereign Culture
              <span className="mx-2 w-px h-3 inline-block bg-white/10 align-middle" />
              <span className="text-white/50 italic">Intelligence Hub</span>
            </span>
          </div>
        </motion.div>

        {/* ===== HERO HEADLINE ===== */}
        <div className="relative text-center mb-8 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 60, filter: "blur(20px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <h1 className="font-serif font-black leading-[0.83] tracking-[-0.04em] uppercase text-center">
              <span
                className="block text-white"
                style={{ fontSize: "clamp(3rem, 12vw, 11rem)", letterSpacing: "-0.05em" }}
              >
                Imperial
              </span>
              <span
                className="block italic"
                style={{
                  fontSize: "clamp(2.5rem, 10vw, 9rem)",
                  letterSpacing: "-0.04em",
                  background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                Research
              </span>
            </h1>
          </motion.div>

          {/* Watermark */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 2 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
            aria-hidden
          >
            <span className="text-[9px] font-black text-white/[0.06] uppercase tracking-[2em] block translate-x-[1em]">
              Proprietary Macro Intelligence
            </span>
          </motion.div>
        </div>

        {/* ===== ROTATING FEATURE STRIP ===== */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-12 h-14 flex items-center"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeature}
              initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="inline-flex items-center gap-3 px-7 py-3.5 bg-white/[0.025] border border-white/[0.07] rounded-2xl backdrop-blur-xl shadow-xl"
            >
              <Zap className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden />
              <span className="text-sm sm:text-base font-semibold text-white/75 tracking-tight">
                {FEATURES[activeFeature]}
              </span>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* ===== MAIN CONTENT GRID ===== */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center max-w-7xl mx-auto">

          {/* Left — CTA Column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-10 max-w-md font-light">
              The premier institutional platform for algorithmic execution frameworks and macroeconomic intelligence.
            </p>

            {/* Email CTA */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (formState !== "idle") return;
                const input = (e.currentTarget.elements.namedItem("email") as HTMLInputElement);
                const email = input?.value;
                if (email) {
                  setFormState("loading");
                  try {
                    await supabase.from("leads").insert([{ email, source: "homepage_elite_v3" }]);
                  } catch {}
                  setTimeout(() => {
                    setFormState("success");
                    if (input) input.value = "";
                    setTimeout(() => setFormState("idle"), 5000);
                  }, 1200);
                }
              }}
              className="w-full max-w-lg flex flex-col sm:flex-row gap-3 p-2 bg-white/[0.03] border border-white/[0.08] rounded-2xl backdrop-blur-xl group hover:border-white/[0.15] hover:bg-white/[0.05] transition-all duration-500 shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
            >
              <div className="flex-1 relative flex items-center">
                <Lock className="w-4 h-4 text-white/20 group-hover:text-emerald-400 absolute left-4 transition-colors duration-400" aria-hidden />
                <input
                  id="hero-email"
                  name="email"
                  type="email"
                  placeholder="Your institutional email"
                  required
                  disabled={formState !== "idle"}
                  aria-label="Email address"
                  className="w-full bg-transparent pl-12 pr-4 py-3.5 text-sm font-medium text-white placeholder:text-white/25 outline-none disabled:opacity-40"
                />
              </div>
              <Button
                type="submit"
                variant="sovereign"
                size="md"
                glowEffect
                isLoading={formState === "loading"}
                disabled={formState !== "idle" && formState !== "loading"}
                trackingEvent="hero_cta_email"
                className="rounded-xl px-7 py-3.5 shrink-0 text-sm"
              >
                <span className="flex items-center gap-2">
                  {formState === "success" ? (
                    <><CheckCircle2 className="w-4 h-4" /> Connected</>
                  ) : (
                    <>Access Hub <ArrowRight className="w-4 h-4" /></>
                  )}
                </span>
              </Button>
            </form>

            <div className="mt-5 flex flex-wrap justify-center lg:justify-start gap-6">
              {[
                { label: "No Broker Ties", icon: Globe },
                { label: "Sovereign Verified", icon: Shield },
                { label: `${stats.traders} Members`, icon: Activity },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <item.icon className="w-3.5 h-3.5 text-emerald-500/50" aria-hidden />
                  <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Algo Terminal */}
          <motion.div
            initial={{ opacity: 0, x: 40, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1.2, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Terminal Window */}
            <div className="relative rounded-[2rem] border border-white/[0.07] overflow-hidden bg-[#080A0F] shadow-[0_60px_120px_rgba(0,0,0,0.8)] group">
              {/* Window chrome */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">ALGO ENGINE VISUALIZER</span>
                </div>
                <div className="text-[9px] font-mono text-white/20">IFX_SOVEREIGN_v4</div>
              </div>

              {/* Chart Area */}
              <div className="relative p-2 sm:p-4 h-[200px] sm:h-[300px]">
                <AnimatedCandlesticks className="absolute inset-2 sm:inset-4" />
              </div>

              {/* Bottom bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-white/5 gap-2">
                <div className="flex items-center gap-4 w-full overflow-x-auto no-scrollbar justify-center sm:justify-start">
                  {TICKER_ITEMS.slice(0, 3).map((t, i) => (
                    <div key={i} className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[9px] text-white/30 font-mono">{t.pair}</span>
                      <span className={`text-[9px] font-black font-mono ${t.up ? "text-emerald-400" : "text-red-400"}`}>{t.change}</span>
                    </div>
                  ))}
                </div>
                <span className="text-[8px] sm:text-[9px] font-mono text-white/20 uppercase tracking-widest text-center">Educational Demo Feed</span>
              </div>

              {/* Ambient glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2rem]" />
            </div>

            {/* Floating KPI badges removed to reduce clutter and fake live elements */}
          </motion.div>
        </div>

        {/* ===== STATS ROW ===== */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.0 }}
          className="w-full max-w-5xl mx-auto mt-20 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {TRUST_SIGNALS.map((signal, i) => (
            <motion.div
              key={signal.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 + i * 0.1, duration: 0.6 }}
              className="group flex flex-col items-center gap-3 py-6 px-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-emerald-500/20 transition-all duration-500 cursor-default"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-500/[0.08] border border-emerald-500/[0.12] group-hover:bg-emerald-500/[0.15] transition-all">
                <signal.icon className="w-5 h-5 text-emerald-400" aria-hidden />
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-black text-white font-mono tracking-tighter">{signal.label}</div>
                <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mt-0.5">{signal.sub}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="mt-16 flex flex-col items-center gap-2 text-white/20 cursor-default"
        >
          <span className="text-[9px] font-black uppercase tracking-[0.4em]">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};
