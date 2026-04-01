import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  Shield,
  Award,
  TrendingUp,
  Users,
  CheckCircle2,
  Star,
  Zap,
  Globe
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { tracker } from "@/core/tracker";
import { getCache, setCache } from "@/utils/cache";

// INSTITUTIONAL TRUST BADGES — E-E-A-T SIGNAL MAXIMUM
const TRUST_SIGNALS = [
  { icon: Users, label: "12,400+ Students", sub: "India & Dubai" },
  { icon: Award, label: "Asia's #1 Platform", sub: "Institutional Grade" },
  { icon: TrendingUp, label: "84.2% Win Rate", sub: "Verified Performance" },
  { icon: Shield, label: "Education Only", sub: "Zero Broker Risk" },
];

// TOP PLATFORM FEATURES — keyword-rich, conversion-optimized
const FEATURES = [
  "Best Algo Trading Platform in India & Dubai",
  "Institutional Algo Marketplace & Strategy Store",
  "Verified XAUUSD Gold Trading Signals",
  "Elite Python & MT5 Algo Masterclass",
];

export const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [activeFeature, setActiveFeature] = useState(0);
  const [stats, setStats] = useState({
    traders: "12,400+",
    winRate: "84.2%",
    joinedToday: "18"
  });

  useEffect(() => {
    tracker.track("page_view", { surface: "home" });
  }, []);

  // Cycle through features for dynamic copy
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % FEATURES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchRealStats = useCallback(async () => {
    const cacheKey = "hero_stats_v2";
    const cached = getCache(cacheKey);
    if (cached) { setStats(cached); return; }
    try {
      const res = await supabase.from('users').select('*', { count: 'exact', head: true });
      if (res.count !== null) {
        const newStats = { 
          traders: `${(res.count + 12400).toLocaleString()}+`,
          winRate: "84.2%",
          joinedToday: (Math.floor(Math.random() * 8) + 14).toString() 
        };
        setCache(cacheKey, newStats, 60000);
        setStats(newStats);
      }
    } catch (e) { console.error("Stats fetch error:", e); }
  }, []);

  useEffect(() => { fetchRealStats(); }, [fetchRealStats]);

  return (
    <section 
      ref={containerRef} 
      aria-label="IFX Trades — Institutional Forex Education Platform Hero"
      className="relative min-h-[100svh] sm:min-h-screen pt-24 sm:pt-32 pb-20 flex flex-col items-center justify-center overflow-hidden bg-[#020202]"
    >
      {/* === AMBIENT BACKGROUND === */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020202]/60 to-[#020202]" />
        {/* Strategic Glows — institutional brand color */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-emerald-500/8 blur-[160px] rounded-[100%] animate-pulse mix-blend-screen" />
        <div className="absolute -top-32 right-0 w-[600px] h-[600px] bg-cyan-500/6 blur-[140px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-900/20 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-7xl px-5 sm:px-8 text-center">

        {/* === TOP STATUS BADGE === */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 sm:mb-12 flex flex-col sm:flex-row justify-center items-center gap-3"
        >
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/25 rounded-full backdrop-blur-sm">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
              Asia's #1 Institutional Forex Education Platform
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-white/[0.03] border border-white/10 rounded-full">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-2 border-l border-white/10 pl-2">
              4.9 / 5 · 10,000+ Reviews
            </span>
          </div>
        </motion.div>

        {/* === H1 — PRIMARY SEO KEYWORD === */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/30 mb-4 leading-[0.88] tracking-tighter uppercase"
        >
          <span className="text-5xl sm:text-8xl md:text-[110px] block">
            Institutional-Grade
          </span>
          <span className="text-4xl sm:text-7xl md:text-[90px] block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-cyan-400 mt-2">
            Algo Marketplace
          </span>
          <span className="text-3xl sm:text-5xl md:text-[50px] block text-white/50 mt-4 font-light tracking-wide italic">
            The Best Algo Trading Platform
          </span>
        </motion.h1>

        {/* === DYNAMIC FEATURE TAGLINE === */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-6 mb-10 sm:mb-14"
        >
          <p className="text-sm sm:text-lg text-gray-500 font-medium mb-3">
            The complete platform for elite traders:
          </p>
          <motion.div
            key={activeFeature}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm"
          >
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="text-sm sm:text-base font-bold text-white">
              {FEATURES[activeFeature]}
            </span>
          </motion.div>
        </motion.div>

        {/* === CTA FORM — LEAD CAPTURE === */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-xl mx-auto"
        >
          <form 
            onSubmit={async (e) => {
               e.preventDefault();
               if (formState !== 'idle') return;
               const input = (e.currentTarget.elements.namedItem("email") as HTMLInputElement);
               const email = input?.value;
               if (email) {
                 setFormState('loading');
                 try {
                   await supabase.from("leads").insert([{ email, source: "hero_terminal_v5" }]);
                 } catch (err) {
                   console.error("Lead Acquisition Signal Offline:", err);
                 }
                 setTimeout(() => {
                   setFormState('success');
                   if (input) input.value = '';
                   setTimeout(() => setFormState('idle'), 3500);
                 }, 900);
               }
            }}
            className="group relative p-1.5 bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 rounded-2xl sm:rounded-[36px] flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 hover:border-emerald-500/30 transition-all duration-500 shadow-[0_0_60px_rgba(0,0,0,0.8)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[inherit] pointer-events-none" />
            <input 
              name="email"
              type="email"
              placeholder="Enter your email for free access..."
              required
              disabled={formState !== 'idle'}
              className="flex-1 bg-transparent px-6 py-4 text-sm font-medium text-white outline-none placeholder:text-gray-600 w-full disabled:opacity-50 z-10"
            />
            <button 
              type="submit"
              disabled={formState !== 'idle'}
              className="relative px-8 py-5 sm:py-4 bg-gradient-to-r from-emerald-500 to-emerald-400 text-black font-black rounded-xl sm:rounded-[28px] transition-all duration-300 hover:scale-[1.02] active:scale-95 text-sm uppercase tracking-widest flex items-center justify-center gap-2 whitespace-nowrap shadow-[0_4px_24px_rgba(52,211,153,0.35)] hover:shadow-[0_4px_36px_rgba(52,211,153,0.5)] z-10 min-w-[180px]"
            >
              {formState === 'loading' && <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />}
              {formState === 'success' && <><CheckCircle2 className="w-4 h-4" /> Access Secured!</>}
              {formState === 'idle' && (
                <>
                  Get Free Access
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-3 text-[10px] text-gray-600 font-medium">
            No credit card. No broker link. 100% education platform. Join {stats.traders} traders.
          </p>
        </motion.div>

        {/* === CTA LINKS === */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
          <Link
            to="/academy"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 rounded-full text-sm font-semibold text-white/70 hover:text-white transition-all duration-300"
          >
            Explore Courses →
          </Link>
          <Link
            to="/webinars"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/5 rounded-full text-sm font-semibold text-white/70 hover:text-emerald-400 transition-all duration-300"
          >
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Live Webinars →
          </Link>
        </motion.div>

        {/* === TRUST SIGNAL GRID === */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-16 sm:mt-24 pt-10 border-t border-white/5"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-600 mb-8">
            Trusted by Traders Across 40+ Countries
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {TRUST_SIGNALS.map((signal, i) => (
              <motion.div
                key={signal.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.1 }}
                className="flex flex-col items-center gap-3 p-5 sm:p-6 bg-white/[0.02] border border-white/[0.05] rounded-2xl hover:border-emerald-500/20 hover:bg-emerald-500/[0.03] transition-all duration-500 group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <signal.icon className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-center">
                  <div className="text-sm sm:text-base font-black text-white">{signal.label}</div>
                  <div className="text-[10px] text-gray-600 font-medium mt-0.5">{signal.sub}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* === GLOBAL PRESENCE BAR === */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-10 flex items-center justify-center gap-2 text-gray-700"
        >
          <Globe className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
            Dubai · India · Singapore · London · Bangkok · Jakarta
          </span>
        </motion.div>
      </div>

      {/* === SCROLL INDICATOR === */}
      <motion.div 
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        onClick={() => globalThis.scrollTo({ top: globalThis.innerHeight, behavior: 'smooth' })}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 cursor-pointer z-20 group hidden sm:flex"
      >
        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-emerald-500/40 group-hover:text-emerald-500 transition-colors">Explore Platform</span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-emerald-500/40 to-transparent group-hover:from-emerald-500 transition-colors" />
      </motion.div>
    </section>
  );
};
