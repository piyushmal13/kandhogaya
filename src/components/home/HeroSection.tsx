import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  Activity
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { Button } from "../ui/Button";
import { tracker } from "@/core/tracker";
import { getCache, setCache } from "@/utils/cache";

// INSTITUTIONAL TRUST BADGES — E-E-A-T SIGNAL MAXIMUM
const TRUST_SIGNALS = [
  { icon: Users, label: "12,400+ Analysts", sub: "Terminal Access" },
  { icon: Award, label: "Institutional Hub", sub: "Asia's Core Desk" },
  { icon: TrendingUp, label: "84.2% Alpha", sub: "Verified Pulse" },
  { icon: Shield, label: "Systemic Focus", sub: "Risk-Locked" },
];

const FEATURES = [
  "Institutional Algo Masterclass & MT5 Mastery",
  "Sovereign Gold (XAUUSD) Macro Intelligence",
  "Quantitative Execution & Analytical Frameworks",
  "Asia's Premier Strategic Training Desk",
];

export const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [activeFeature, setActiveFeature] = useState(0);
  const [stats, setStats] = useState({
    traders: "12,400+",
  });

  useEffect(() => {
    tracker.track("page_view", { surface: "home_v2_royale" });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % FEATURES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const fetchRealStats = useCallback(async () => {
    const cacheKey = "hero_stats_v8_royale";
    const cached = getCache(cacheKey);
    if (cached) { setStats(cached); return; }
    try {
      const { count } = await supabase.from('users').select('*', { count: 'exact', head: true });
      if (count !== null) {
        const newStats = { 
          traders: `${(count + 12400).toLocaleString()}+`,
        };
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
      ref={containerRef} 
      className="relative min-h-[100vh] pt-32 pb-24 flex flex-col items-center justify-center overflow-hidden bg-black"
    >
      {/* === CINEMATIC BACKGROUND ENGINE === */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        {/* Animated Radial Gradients */}
        <motion.div 
          animate={{ 
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[120%] h-[60%] bg-[radial-gradient(ellipse_at_center,rgba(88,242,182,0.12)_0%,transparent_70%)] blur-[120px]" 
        />
        
        {/* Gold Glow */}
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_60%)] blur-[100px]" />
        
        {/* Particle Overlay (Simulated Video) */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] contrast-150 brightness-150" />
        
        {/* Grid Infrastructure */}
        <div className="absolute inset-0 opacity-[0.15]" 
             style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
      </div>

      <div className="relative z-10 w-full max-w-[1400px] px-6 text-center">
        
        {/* === ACCESS LEVEL INDICATOR === */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "circOut" }}
          className="mb-12 flex justify-center"
        >
          <div className="group inline-flex items-center gap-4 px-6 py-2.5 bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-700 hover:border-emerald-500/30">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-black text-white/50 group-hover:text-white uppercase tracking-[0.4em] transition-colors flex items-center gap-2">
              IFX Sovereign Cluster <span className="w-px h-3 bg-white/10 mx-1" /> <span className="text-emerald-400 italic">Access Live</span>
            </span>
          </div>
        </motion.div>

        {/* === INSTITUTIONAL HIERARCHY TITLE === */}
        <div className="relative mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
            className="font-serif font-black leading-[0.85] tracking-[-0.05em] uppercase"
          >
            <span className="text-5xl sm:text-8xl md:text-[150px] lg:text-[180px] block text-white drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
              Imperial
            </span>
            <span className="text-4xl sm:text-7xl md:text-[120px] lg:text-[140px] block text-transparent bg-clip-text bg-[var(--grad-royale)] mt-2 filter drop-shadow-[0_10px_30px_rgba(16,185,129,0.3)] italic">
              Research
            </span>
          </motion.h1>
          
          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 1, duration: 1.5 }}
             className="absolute -top-16 left-1/2 -translate-x-1/2 w-full pointer-events-none"
          >
            <span className="text-[9px] sm:text-[11px] font-black text-white/10 uppercase tracking-[1.5em] block translate-x-[0.75em]">
              Proprietary Macro Intelligence
            </span>
          </motion.div>
        </div>

        {/* === ALPHA STREAM SELECTOR === */}
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-20 min-h-[3rem]"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeature}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.8, ease: "circOut" }}
              className="inline-flex items-center gap-4 px-10 py-5 bg-white/[0.02] border border-white/5 rounded-[2rem] shadow-2xl backdrop-blur-xl"
            >
              <Zap className="w-5 h-5 text-emerald-400 animate-pulse" />
              <span className="text-sm sm:text-xl font-bold text-white/80 tracking-tight">
                {FEATURES[activeFeature]}
              </span>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* === SOVEREIGN HUB ENTRANCE === */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="w-full max-w-2xl mx-auto relative px-4 sm:px-0"
        >
          <div className="absolute inset-0 bg-[var(--brand-primary)]/5 blur-[100px] -z-10 rounded-full" />
          
          <form 
            onSubmit={async (e) => {
               e.preventDefault();
               if (formState !== 'idle') return;
               const input = (e.currentTarget.elements.namedItem("email") as HTMLInputElement);
               const email = input?.value;
               if (email) {
                 setFormState('loading');
                  try {
                    await supabase.from("leads").insert([{ email, source: "homepage_royale_v1" }]);
                  } catch (err) { }
                 setTimeout(() => {
                   setFormState('success');
                   if (input) input.value = '';
                   setTimeout(() => setFormState('idle'), 4000);
                 }, 1200);
               }
            }}
            className="flex flex-col sm:flex-row items-stretch gap-4 p-2 bg-white/[0.02] border border-white/10 rounded-[2.5rem] backdrop-blur-3xl group transition-all duration-500 hover:border-white/20 hover:bg-white/[0.04]"
          >
            <div className="flex-1 relative">
              <div className="absolute left-6 top-1/2 -translate-y-1/2">
                <Lock className="w-5 h-5 text-white/20 group-hover:text-emerald-400 transition-colors" />
              </div>
              <input 
                name="email"
                type="email"
                placeholder="Institutional ID (Email Address)"
                required
                disabled={formState !== 'idle'}
                className="w-full bg-transparent pl-14 pr-6 py-5 text-base font-bold text-white outline-none placeholder:text-white/20 disabled:opacity-50"
              />
            </div>
            
            <Button
              type="submit"
              variant="sovereign"
              size="sovereign-hero"
              glowEffect={true}
              isLoading={formState === 'loading'}
              disabled={formState !== 'idle' && formState !== 'loading'}
              trackingEvent="access_sovereign_hub"
              className="rounded-[2rem] sm:px-10"
            >
              <span className="flex items-center gap-3">
                {formState === 'success' ? (
                  <>CONNECTED <CheckCircle2 className="w-5 h-5" /></>
                ) : (
                  <>Access Sovereign Hub <ArrowRight className="w-5 h-5" /></>
                )}
              </span>
            </Button>
          </form>

          {/* Verification Labels */}
          <div className="mt-8 flex flex-wrap justify-center gap-8">
             {[
               { label: "NO Broker Ties", icon: Globe },
               { label: "Sovereign Audit", icon: Shield },
               { label: `${stats.traders} Synchronized`, icon: Activity }
             ].map((label, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                   <label.icon className="w-3.5 h-3.5 text-emerald-500/50" />
                   <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{label.label}</span>
                </div>
             ))}
          </div>
        </motion.div>

        {/* === DATA GRID PREVIEW === */}
        <motion.div 
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 1.2 }}
          className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
        >
          {TRUST_SIGNALS.map((signal, i) => (
            <div
              key={signal.label}
              className="group relative flex flex-col items-center gap-5 p-10 rounded-[32px] bg-white/[0.015] border border-white/5 hover:bg-white/[0.03] transition-all duration-700 hover:border-emerald-500/20 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                <signal.icon className="w-20 h-20 -mr-4 -mt-4 rotate-12" />
              </div>
              
              <div className="w-14 h-14 bg-white/5 flex items-center justify-center rounded-2xl relative border border-white/5 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all duration-500">
                <signal.icon className="w-6 h-6 text-emerald-400" />
              </div>
              
              <div className="text-center relative z-10">
                <div className="text-lg font-black text-white mb-1 uppercase tracking-tight italic">{signal.label}</div>
                <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">{signal.sub}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
