import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "../../lib/supabase";
import { ArrowRight, ShieldCheck, Lock, Fingerprint } from "lucide-react";

export const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setStatus('loading');
    
    const { error } = await supabase.auth.signInWithOtp({ 
        email,
        options: { emailRedirectTo: window.location.origin + '/dashboard' }
    });

    if (error) {
      console.error(error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    } else {
      setStatus('success');
      setEmail("");
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section className="relative overflow-hidden pt-24 pb-40">
      {/* Immersive Dark Background mimicking an OS unlock screen */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-[radial-gradient(circle,rgba(255,255,255,0.03)_0%,transparent_70%)] blur-[100px]" />
      </div>

      <div className="max-w-3xl mx-auto px-4 z-10 relative flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full rounded-[3rem] bg-[#050505] border border-white/[0.08] p-8 sm:p-16 text-center shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col items-center backdrop-blur-3xl"
        >
          {/* Top Edge Highlight */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Biometric/Lock Icon */}
          <div className="w-20 h-20 mx-auto rounded-full bg-white/[0.02] border border-white/[0.05] flex items-center justify-center mb-8 relative group cursor-default">
            <div className="absolute inset-0 rounded-full border border-white/[0.1] scale-110 group-hover:scale-125 group-hover:border-white/[0.05] transition-all duration-700" />
            <Fingerprint className="w-8 h-8 text-white/40 group-hover:text-emerald-400 transition-colors duration-500" aria-hidden />
          </div>

          <h2 className="text-3xl md:text-5xl font-serif font-black text-white mb-4 tracking-[-0.04em] leading-tight">
            Authenticate Device
          </h2>
          <p className="text-gray-500 text-sm md:text-base mb-12 max-w-sm mx-auto tracking-wide font-light">
            Enter your trusted corporate email to access the sovereign intelligence dashboard.
          </p>

          <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto mb-8 relative">
            <div className="relative group">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-emerald-400 transition-colors duration-300" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Institutional E-Mail Address"
                className="w-full h-16 pl-14 pr-32 bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 rounded-full text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all text-sm font-medium tracking-wide"
                required
                disabled={status === 'loading'}
              />
              <button 
                type="submit" 
                disabled={status === 'loading' || !email}
                className="absolute right-2 top-2 bottom-2 rounded-full px-6 bg-white text-black font-black text-[11px] uppercase tracking-[0.2em] hover:bg-gray-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:pointer-events-none"
              >
                {status === 'loading' ? 'Verifying' : 'Unlock'}
              </button>
            </div>
          </form>

          <div className="h-6 flex flex-col items-center justify-center w-full">
             <AnimatePresence mode="wait">
              {status === 'success' && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-black text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" /> Magic link deployed to inbox.
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-black text-red-400">
                  Authentication Rejected.
                </motion.div>
              )}
             </AnimatePresence>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/[0.04] w-full flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-[9px] uppercase tracking-[0.3em] font-black text-white/20">
            <span className="flex items-center gap-2"><ShieldCheck className="w-3 h-3 text-white/10" /> End-to-End Encrypted</span>
            <span className="flex items-center gap-2"><ShieldCheck className="w-3 h-3 text-white/10" /> Zero Storage Protocol</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
