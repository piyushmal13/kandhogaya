import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Cpu, Server, Play, Send, CheckCircle, Flame, ShieldAlert } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/contexts/ToastContext";

export const WebinarHypeSection = () => {
  const { success, error: toastError } = useToast();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [key, setKey] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) return;
    setIsSubmitting(true);

    try {
      const generatedKey = "IFX-SEC-" + Math.floor(100000 + Math.random() * 900000);

      // Check if lead exists
      const { data: lead } = await supabase
        .from('leads')
        .select('id, score, crm_metadata')
        .eq('email', email)
        .maybeSingle();

      if (!lead) {
        await supabase.from('leads').insert({
          email,
          source: 'homepage_hype_waitlist',
          score: 20,
          stage: 'INTERESTED',
          last_action_at: new Date().toISOString(),
          crm_metadata: { name, homepage_hype: true, clearance_key: generatedKey }
        });
      } else {
        await supabase.from('leads').update({
          score: (lead.score || 0) + 20,
          stage: 'HIGH_INTENT',
          last_action_at: new Date().toISOString(),
          crm_metadata: { 
            ...(lead.crm_metadata || {}), 
            name, 
            homepage_hype: true, 
            clearance_key: generatedKey 
          }
        }).eq('id', lead.id);
      }

      // Queue welcome email
      await supabase.from('notification_queue').insert({
        recipient: email,
        channel: 'EMAIL',
        priority: 'HIGH',
        payload: {
          message: `Priority pass verified for the IFX Trades Institutional Masterclass Series. Clearance Code: ${generatedKey}.`,
          user_name: name,
          action_link: '/webinars'
        },
        status: 'PENDING'
      });

      setKey(generatedKey);
      setSubmitted(true);
      success("Priority waitlist registered! Clearance code generated.");
    } catch (err: any) {
      console.error(err);
      toastError("Waitlist registry offline. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative py-20 md:py-32 bg-[#030508] border-t border-white/[0.03] overflow-hidden">
      {/* Premium Neon Ambient Elements */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.01)_0%,transparent_100%)]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Intense Copywriting Pitch */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8 text-center lg:text-left flex flex-col items-center lg:items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.25em]">
              <Flame className="w-3.5 h-3.5 animate-pulse text-emerald-500" />
              Institutional Pipeline
            </div>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter uppercase leading-[0.9] italic font-serif">
              Decode the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500">Matching Engine.</span>
            </h2>
            
            <p className="text-sm md:text-base text-zinc-400 font-medium leading-relaxed max-w-2xl">
              Access the exclusive strategy briefings where institutional logic is laid bare. Learn how to emulate tick-level order book depth, construct adaptive ATR-regime volatility filters, and deploy secure MT5 compiled binaries directly to your server architecture.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full text-left max-w-lg">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/15 shrink-0">
                  <Cpu className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-[11px] font-mono font-black text-white uppercase tracking-wider mb-1">Latency Telemetry</h4>
                  <p className="text-[10px] text-zinc-500 leading-normal font-bold uppercase">Emulate cross-connected matching execution under 1.2ms latency thresholds.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/15 shrink-0">
                  <Server className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-[11px] font-mono font-black text-white uppercase tracking-wider mb-1">Binary Handover</h4>
                  <p className="text-[10px] text-zinc-500 leading-normal font-bold uppercase">Direct download keys for secure compiled MT5 Expert Advisors and custom bridge plugins.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Waitlist Capture Box */}
          <div className="lg:col-span-5 w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="bg-black/60 border border-white/10 rounded-[2.5rem] p-8 sm:p-10 backdrop-blur-3xl relative shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.div
                    key="hype-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2 text-center lg:text-left">
                      <span className="text-[9px] font-mono font-black text-emerald-400 uppercase tracking-widest">Masterclass Waiting list</span>
                      <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">Request Access Key</h3>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 leading-normal">
                        Submit credentials to verify your server allocation priority pass.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-1 text-left">
                        <label className="text-[8px] font-black text-zinc-400 uppercase tracking-widest block font-mono">Full Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Richard Hendricks"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-3.5 px-4 text-xs sm:text-sm text-white outline-none focus:border-emerald-500/30 focus:bg-white/[0.04] transition-all placeholder:text-zinc-700 font-medium"
                        />
                      </div>

                      <div className="space-y-1 text-left">
                        <label className="text-[8px] font-black text-zinc-400 uppercase tracking-widest block font-mono">Professional Email</label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. r.hendricks@brokerage.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-3.5 px-4 text-xs sm:text-sm text-white outline-none focus:border-emerald-500/30 focus:bg-white/[0.04] transition-all placeholder:text-zinc-700 font-medium"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center justify-center gap-2 group cursor-pointer shadow-[0_0_30px_rgba(16,185,129,0.15)] active:scale-95 mt-2"
                      >
                        {isSubmitting ? "Generating Clearance..." : "Request Priority Access"}
                        <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="hype-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-4 space-y-6"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto animate-pulse">
                      <CheckCircle className="w-8 h-8 text-emerald-400" />
                    </div>

                    <div className="space-y-2">
                      <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full uppercase tracking-[0.2em] inline-block font-mono">
                        Clearance Verified
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">Access Code Queued</h3>
                      <p className="text-[10px] text-zinc-400 leading-relaxed max-w-sm mx-auto font-bold uppercase tracking-wider">
                        Welcome {name}, your institutional waitlist clearance key has been generated.
                      </p>
                    </div>

                    <div className="p-5 bg-black/40 border border-white/5 rounded-3xl text-left space-y-2.5 text-[11px] font-mono">
                      <div className="text-zinc-500 font-black uppercase tracking-[0.2em] text-[8px] pb-1.5 border-b border-white/5">Access Ticket</div>
                      <div className="text-zinc-400 flex justify-between items-center">
                        <span className="text-zinc-500 font-bold uppercase">Name</span>
                        <span className="font-bold text-white uppercase">{name}</span>
                      </div>
                      <div className="text-zinc-400 flex justify-between items-center">
                        <span className="text-zinc-500 font-bold uppercase">Secret Key</span>
                        <span className="font-mono text-emerald-400 font-black bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/15">{key}</span>
                      </div>
                      <div className="text-zinc-400 flex justify-between items-center">
                        <span className="text-zinc-500 font-bold uppercase">Queue State</span>
                        <span className="text-emerald-500 font-black flex items-center gap-1.5 text-[9px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          IN PROCESSING PIPELINE
                        </span>
                      </div>
                    </div>

                    <p className="text-[9px] text-zinc-500 uppercase tracking-wider font-bold max-w-xs mx-auto leading-normal">
                      Co-sponsor allocation desk will route masterclass materials to your verified email index.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
