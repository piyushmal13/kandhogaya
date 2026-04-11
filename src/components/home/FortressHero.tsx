import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Shield,
  Activity,
  Globe,
  Lock,
  Zap,
  CheckCircle2
} from "lucide-react";
import { SovereignButton } from "../ui/Button";
import { supabase } from "../../lib/supabase";
import { tracker } from "@/core/tracker";

const STATS = [
  { label: "Assets Under Intelligence", value: "$4.2B+" },
  { label: "Institutional Proxies", value: "148" },
  { label: "Execution Latency", value: "2.4ms" },
  { label: "Alpha Signal Accuracy", value: "84.2%" }
];

export const FortressHero = () => {
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [email, setEmail] = useState("");

  const handleLeadCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || formState !== 'idle') return;

    setFormState('loading');
    try {
      const { error } = await supabase.from("leads").insert([
        { email, source: "fortress_hero_v10", crm_metadata: { segment: "high_intent_retail" } }
      ]);
      
      if (error) throw error;
      
      tracker.track("lead_capture_success", { surface: "fortress_hero" });
      setFormState('success');
      setTimeout(() => {
        setFormState('idle');
        setEmail("");
      }, 4000);
    } catch (err) {
      console.error(err);
      setFormState('idle');
    }
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden bg-[#10131a]">
      {/* ── BACKGROUND ARCHITECTURE ── */}
      <div className="absolute inset-0 z-0">
        {/* Film Grain & Pulse */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        {/* Mathematical Grid */}
        <div className="absolute inset-0 opacity-[0.15] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100px_100px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />
        </div>

        {/* Cinematic Orbs */}
        <div className="absolute top-[20%] -left-[10%] w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full mix-blend-screen animate-pulse" />
        <div className="absolute bottom-[10%] -right-[5%] w-[400px] h-[400px] bg-emerald-500/10 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-5xl mx-auto text-center">
          
          {/* ── STATUS BAR ── */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-xl mb-12"
          >
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">
               Institutional Terminal <span className="text-white/40 ml-2">v6.1.0 // Mainframe Active</span>
            </span>
          </motion.div>

          {/* ── THE HEADLINE ── */}
          <motion.h1 
            initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-[0.85] uppercase mb-8"
          >
            Engineering <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 via-white to-emerald-400">
              Sovereign Alpha
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Asia's #1 institutional intelligence node. We engineer algorithmic 
            liquidity and macroeconomic education for the top 1% of traders.
          </motion.p>

          {/* ── THE ACCESS TERMINAL ── */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-2xl mx-auto"
          >
            <div className="relative w-full group">
              <div className="absolute inset-0 bg-cyan-500/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-cyan-500/50">
                <Lock className="w-5 h-5" />
              </div>
              <input 
                type="email" 
                placeholder="Institutional Email Access"
                className="w-full bg-[#1a1f29] border border-white/5 px-16 py-6 rounded-3xl text-white outline-none focus:border-cyan-500/50 transition-all font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <SovereignButton 
              variant="sovereign"
              size="sovereign-hero"
              glowEffect
              onClick={handleLeadCapture}
              isLoading={formState === 'loading'}
              rightIcon={formState === 'success' ? <CheckCircle2 /> : <ArrowRight />}
            >
              {formState === 'success' ? 'AUTHORIZED' : 'Request Access'}
            </SovereignButton>
          </motion.div>

          {/* ── INSTITUTIONAL TRUST BAR ── */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/5 pt-12"
          >
            {STATS.map((stat, i) => (
              <div key={i} className="text-left group">
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 group-hover:text-cyan-500 transition-colors">
                  {stat.label}
                </div>
                <div className="text-3xl font-black text-white tracking-tight">
                  {stat.value}
                </div>
              </div>
            ))}
          </motion.div>

        </div>
      </div>

      {/* ── DECORATIVE ELEMENTS ── */}
      <div className="absolute bottom-10 left-10 hidden lg:flex items-center gap-4">
        <div className="w-10 h-[1px] bg-white/10" />
        <div className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">
          Mainframe Stability: 100%
        </div>
      </div>
      
      <div className="absolute bottom-10 right-10 hidden lg:flex items-center gap-4">
        <div className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">
          Pulse Synchronization Active
        </div>
        <div className="w-10 h-[1px] bg-white/10" />
      </div>
    </section>
  );
};
