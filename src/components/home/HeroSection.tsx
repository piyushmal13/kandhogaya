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
  "Quantitative Execution & HFT Frameworks",
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
    tracker.track("page_view", { surface: "home" });
  }, []);

  // Cycle through features for dynamic copy
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % FEATURES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const fetchRealStats = useCallback(async () => {
    const cacheKey = "hero_stats_v7_sovereign";
    const cached = getCache(cacheKey);
    if (cached) { setStats(cached); return; }
    try {
      const res = await supabase.from('users').select('*', { count: 'exact', head: true });
      if (res && res.count !== null) {
        const newStats = { 
          traders: `${(res.count + 12400).toLocaleString()}+`,
        };
        setCache(cacheKey, newStats, 60000);
        setStats(newStats);
      }
    } catch (e) { 
        console.error("Stats fetch error:", e); 
        // Silent fallback - no fluctuations in UI
    }
  }, []);

  useEffect(() => { fetchRealStats(); }, [fetchRealStats]);

  return (
    <section 
      ref={containerRef} 
      aria-label="IFX Trades — Institutional Forex Education Platform Hero"
      className="relative min-h-[100vh] pt-24 sm:pt-32 pb-20 flex flex-col items-center justify-center overflow-hidden bg-[var(--color13)]"
    >
      {/* === SOVEREIGN TERMINAL AMBIENT BACKGROUND === */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--color13)_80%)]" />
        
        {/* Strategic Glows — primary cyan & secondary gold */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--color14)]/5 blur-[120px] rounded-[100%] mix-blend-screen" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[var(--color15)]/5 blur-[140px] rounded-full mix-blend-screen" />
      </div>

      <div className="relative z-10 w-full max-w-[1400px] px-6 text-center">

        {/* === DOCTORAL STATUS BADGE === */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          className="mb-12 flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          <div className="group inline-flex items-center gap-3 px-6 py-2.5 bg-[var(--color16)] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-500 hover:bg-[var(--color17)]">
            <div className="relative">
              <div className="w-2 h-2 bg-[var(--color14)] rounded-full animate-ping absolute inset-0" />
              <div className="w-2.5 h-2.5 bg-[var(--color14)] rounded-full relative z-10 shadow-[0_0_15px_rgba(0,229,255,0.8)]" />
            </div>
            <span className="text-[10px] font-black text-[var(--color18)] group-hover:text-white uppercase tracking-[0.4em] transition-colors">
              Sovereign Intelligence Node <span className="text-[var(--color14)] italic ml-1">Active</span>
            </span>
          </div>
          
          <div className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-[var(--color19)]/80 backdrop-blur-md rounded-2xl">
            <Activity className="w-3 h-3 text-[var(--color15)]/80" />
            <span className="text-[9px] font-black text-[var(--color20)] uppercase tracking-[0.25em]">
              Terminal v4.0.0 · Core Sync Ready
            </span>
          </div>
        </motion.div>

        {/* === PRIMARY BLOCK === */}
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
           className="relative"
        >
          <h1 className="font-black mb-8 leading-[0.85] tracking-[-0.04em] uppercase font-['Manrope']">
            <span className="text-5xl sm:text-8xl md:text-[130px] block text-white drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              Institutional
            </span>
            <span className="text-4xl sm:text-7xl md:text-[100px] block text-transparent bg-clip-text bg-gradient-to-r from-[var(--color21)] to-[var(--color14)] mt-2 filter drop-shadow-[0_10px_20px_rgba(0,229,255,0.15)]">
              Elite Academy
            </span>
          </h1>
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[9px] font-black text-[var(--color14)]/20 uppercase tracking-[1em] pointer-events-none select-none">
             TRADED BY SOVEREIGN DESKS
          </div>
        </motion.div>

        {/* === DYNAMIC SYSTEM INTELLIGENCE === */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-12 mb-16"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeature}
              initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              exit={{ opacity: 0, filter: "blur(4px)", y: -10 }}
              transition={{ duration: 0.6, ease: "circOut" }}
              className="inline-flex items-center gap-4 px-8 py-4 bg-[var(--color22)]/40 backdrop-blur-[16px] rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
            >
              <Zap className="w-5 h-5 text-[var(--color15)]" />
              <span className="text-sm sm:text-lg font-bold text-[var(--color23)] tracking-tight">
                {FEATURES[activeFeature]}
              </span>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* === LEAD ACQUISITION TERMINAL === */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="w-full max-w-2xl mx-auto relative group"
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
                    const { error } = await supabase.from("leads").insert([{ email, source: "sovereign_terminal_v7" }]);
                    if (error) tracker.track("lead_capture_failed", { error: error.message });
                  } catch (err: any) {
                    tracker.track("lead_capture_exception", { error: err.message });
                  }
                 setTimeout(() => {
                   setFormState('success');
                   if (input) input.value = '';
                   setTimeout(() => setFormState('idle'), 3500);
                 }, 800);
               }
            }}
            className="flex flex-col sm:flex-row items-stretch gap-4"
          >
            <div className="flex-1 relative group/input">
              <div className="absolute left-6 top-1/2 -translate-y-1/2">
                <Globe className="w-5 h-5 text-[var(--color20)]" />
              </div>
              <input 
                name="email"
                type="email"
                placeholder="Secure Access Node (Email)"
                required
                disabled={formState !== 'idle'}
                className="w-full bg-[var(--color19)] border-b-2 border-[var(--color24)] px-14 py-5 text-base font-medium text-[var(--color23)] outline-none placeholder:text-[var(--color20)] transition-colors focus:border-[var(--color14)] disabled:opacity-50"
              />
            </div>
            
            <Button
              type="submit"
              variant="sovereign"
              size="sovereign-hero"
              glowEffect={true}
              isLoading={formState === 'loading'}
              disabled={formState !== 'idle' && formState !== 'loading'}
              trackingEvent="deploy_terminal"
              leftIcon={formState === 'success' ? <CheckCircle2 className="w-5 h-5" /> : undefined}
              rightIcon={formState === 'idle' ? <ArrowRight className="w-5 h-5" /> : undefined}
            >
              {formState === 'success' ? 'AUTHORIZED' : 'Deploy Terminal'}
            </Button>
          </form>

          <div className="mt-6 flex flex-wrap justify-center gap-4 sm:gap-8 text-[9px] text-[var(--color18)] font-black uppercase tracking-[0.2em]">
             <div className="flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-[var(--color15)]" /> NO BROKER LOCKS
             </div>
             <div className="flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-[var(--color15)]" /> INSTITUTIONAL CORE
             </div>
             <div className="flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-[var(--color14)]" /> {stats.traders} SYNCED
             </div>
          </div>
        </motion.div>

        {/* === REFINED TRUST GRID === */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-24 w-full grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {TRUST_SIGNALS.map((signal, i) => (
            <div
              key={signal.label}
              className="group flex flex-col items-center gap-4 p-8 bg-[var(--color16)] rounded-xl hover:bg-[var(--color17)] transition-colors"
            >
              <div className="w-12 h-12 bg-[var(--color25)] flex items-center justify-center rounded-lg relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color15)]" />
                <signal.icon className="w-5 h-5 text-[var(--color23)] group-hover:text-[var(--color14)] transition-colors" />
              </div>
              <div className="text-center">
                <div className="text-sm font-bold text-[var(--color23)] mb-1">{signal.label}</div>
                <div className="text-[10px] uppercase tracking-wider text-[var(--color20)]">{signal.sub}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

