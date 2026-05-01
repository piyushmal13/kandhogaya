import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "../../lib/supabase";
import { ArrowRight, ShieldCheck, Lock, Cpu, Globe } from "lucide-react";

export const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!supabase) return;
    setStatus('loading');
    
    try {
      const urlParams = new URLSearchParams(globalThis.location.search);
      const refCode = urlParams.get('ref') || null;

      await supabase.from('leads').upsert({
        email: email.toLowerCase(),
        source: 'Landing Page OTP',
        referred_by_code: refCode,
        stage: 'NEW',
        last_action_at: new Date().toISOString()
      }, { onConflict: 'email' });

      const { error: authError } = await supabase.auth.signInWithOtp({ 
          email,
          options: { emailRedirectTo: globalThis.location.origin + '/dashboard' }
      });

      if (authError) throw authError;

      setStatus('success');
      setEmail("");
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error("[Institutional CRM]: Lead Acquisition Failure.", error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <section className="relative overflow-hidden pt-32 pb-48">
      {/* Immersive Institutional Background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] max-w-[1000px] max-h-[1000px] bg-[radial-gradient(circle,rgba(16,185,129,0.03)_0%,transparent_70%)] blur-[120px]" />
         <div className="dot-grid absolute inset-0 opacity-[0.03]" />
      </div>

      <div className="max-w-4xl mx-auto px-6 z-10 relative">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full rounded-[3rem] bg-[#05060B] border border-white/[0.06] p-10 sm:p-20 text-center shadow-[0_80px_160px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col items-center backdrop-blur-3xl"
        >
          {/* Security Badge */}
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center mb-8 relative group cursor-default">
            <Lock className="w-6 h-6 text-white/40 group-hover:text-emerald-400 transition-colors duration-500" />
            <div className="absolute inset-0 rounded-2xl bg-emerald-500/0 group-hover:bg-emerald-500/5 transition-colors duration-500" />
          </div>

          <h2 className="text-3xl md:text-5xl font-semibold text-white mb-4 tracking-tight">
            Client Access Portal
          </h2>
          
          <p className="text-white/40 text-sm md:text-base mb-12 max-w-md mx-auto leading-relaxed">
            Register your email to access the professional trading academy, algorithmic strategies, and live daily market analysis.
          </p>

          <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto mb-8 relative z-10">
            <div className="relative group">
              <div className="relative flex items-center">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full h-16 pl-6 pr-36 bg-[#0A0D14] border border-white/[0.08] hover:border-white/[0.15] focus:border-emerald-500/50 rounded-xl text-white placeholder:text-white/30 focus:outline-none transition-all text-sm"
                  required
                  disabled={status === 'loading'}
                />
                <button 
                  type="submit" 
                  disabled={status === 'loading' || !email}
                  className="absolute right-2 top-2 bottom-2 rounded-lg px-6 bg-emerald-500 text-black font-semibold text-sm hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {status === 'loading' ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                      <Cpu className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <>
                      Unlock <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          <div className="h-8 flex flex-col items-center justify-center w-full relative z-10">
             <AnimatePresence mode="wait">
              {status === 'success' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }} 
                  className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-black text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20"
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> Registration Link Sent to Email
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }} 
                  className="flex items-center gap-2 text-xs font-medium text-red-400 bg-red-500/10 px-4 py-2 rounded-full border border-red-500/20"
                >
                  Registration Failed. Please try again.
                </motion.div>
              )}
             </AnimatePresence>
          </div>
          
          {/* Global Trust Footer */}
          <div className="mt-16 pt-8 border-t border-white/[0.04] w-full flex flex-wrap items-center justify-center gap-8 text-xs font-medium text-white/40">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> 
              Bank-Grade Encryption
            </span>
            <span className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-500" /> 
              Global Access
            </span>
            <span className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-500" /> 
              Secure Client Portal
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
