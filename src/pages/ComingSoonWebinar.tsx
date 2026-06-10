import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Clock, Building, Globe, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/contexts/ToastContext';

export const ComingSoonWebinar = () => {
  const { success, error: toastError } = useToast();

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regEmail.trim() || !regName.trim()) return;
    setRegistering(true);

    try {
      // Basic lead capture for the webinar subscription
      const { data: lead } = await supabase
        .from('leads')
        .select('id, score')
        .eq('email', regEmail)
        .maybeSingle();

      if (!lead) {
        await supabase.from('leads').insert({
          email: regEmail,
          source: 'webinar_waitlist',
          score: 5,
          stage: 'INTERESTED',
          last_action_at: new Date().toISOString(),
          crm_metadata: { name: regName, webinar_waitlist: true }
        });
      } else {
        await supabase.from('leads').update({
          score: (lead.score || 0) + 5,
          last_action_at: new Date().toISOString(),
          crm_metadata: { name: regName, webinar_waitlist: true }
        }).eq('id', lead.id);
      }

      setIsRegistered(true);
      success("You have successfully subscribed to notifications!");
    } catch (err: any) {
      console.error(err);
      toastError("Failed to subscribe. Please try again.");
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#030508] overflow-hidden flex flex-col items-center justify-center pt-24 pb-12 sm:py-24 px-4 sm:px-8">
      {/* Ambient Background Glows */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[150%] sm:w-[120%] h-[70%] bg-[radial-gradient(ellipse_at_top,rgba(0,113,227,0.08)_0%,transparent_60%)] blur-[100px] opacity-100" />
        <div className="absolute bottom-0 right-[-20%] w-[80%] sm:w-[60%] h-[50%] bg-[radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.05)_0%,transparent_60%)] blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.015]" />
      </div>

      <div className="w-full max-w-5xl mx-auto z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* Left Column: Hero Typography & Info */}
        <div className="space-y-8 sm:space-y-10 text-center lg:text-left flex flex-col items-center lg:items-start mt-8 lg:mt-0">
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-[4.5rem] font-black tracking-tight uppercase leading-[0.95] text-white"
          >
            Institutional <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-[#60CDFF] to-emerald-400">Webinar Series</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg text-zinc-400 leading-relaxed font-medium max-w-xl mx-auto lg:mx-0"
          >
            Our upcoming IFX Trades Institutional Webinar Series is launching soon. Stay tuned as we prepare to share our latest macro research and systematic trading insights.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-4 w-full pt-4 max-w-md mx-auto lg:mx-0"
          >
            <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-4 text-left">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shrink-0">
                <Globe className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Global Perspectives</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">Gain insights into global currency markets and algorithmic execution strategies directly from our specialists.</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Clean Subscription Form */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full bg-[#0A0C10]/80 border border-zinc-800 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 backdrop-blur-2xl relative shadow-2xl overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
            <Building className="w-48 h-48 text-blue-500" />
          </div>
          
          {!isRegistered ? (
            <div className="space-y-8 relative z-10">
              <div className="space-y-3 text-center sm:text-left">
                <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">Stay Updated</h3>
                <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                  Subscribe to receive notifications so you don't miss out when we launch our webinar series.
                </p>
              </div>

              <form onSubmit={handleSubscribe} className="space-y-5">
                <div className="space-y-2 text-left">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Full Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Enter your name"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full bg-black/50 border border-zinc-800 rounded-2xl py-4 px-5 text-sm text-white outline-none focus:border-zinc-600 focus:bg-black/80 transition-all placeholder:text-zinc-700 font-medium"
                  />
                </div>

                <div className="space-y-2 text-left">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Email Address</label>
                  <input 
                    type="email" 
                    required
                    placeholder="Enter your email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full bg-black/50 border border-zinc-800 rounded-2xl py-4 px-5 text-sm text-white outline-none focus:border-zinc-600 focus:bg-black/80 transition-all placeholder:text-zinc-700 font-medium"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={registering}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2 group cursor-pointer mt-4"
                >
                  {registering ? "Subscribing..." : "Subscribe for Updates"}
                  <Mail className="w-4 h-4 ml-2" />
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-6 text-center py-10 relative z-10">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4 shadow-[0_0_40px_rgba(16,185,129,0.15)]">
                <Clock className="w-10 h-10 text-emerald-400" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">You're on the list!</h3>
                <p className="text-sm text-zinc-400 leading-relaxed max-w-sm mx-auto font-medium">
                  Thank you, {regName}. We will notify you directly via email as soon as our webinar schedule is announced. Stay tuned!
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

