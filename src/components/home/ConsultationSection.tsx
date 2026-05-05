import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, CheckCircle2, ShieldCheck, Mail, User, Briefcase } from "lucide-react";
import { EliteButton } from "../ui/Button";
import { containerVariants, itemVariants } from "@/lib/motion";
import { supabase } from "@/lib/supabase";
import { tracker } from "@/core/tracker";

export const ConsultationSection = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    account_size: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || status !== 'idle') return;

    setStatus('loading');
    try {
      const { error } = await supabase
        .from("consultations")
        .insert([{
          ...formData,
          status: 'pending',
          metadata: { surface: "premium_home_consultation" }
        }]);

      if (error) throw error;

      tracker.track("consultation_request", { account_size: formData.account_size });
      setStatus('success');
      setFormData({ full_name: "", email: "", account_size: "", message: "" });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <section className="py-32 bg-[#020202] relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#58F2B6]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Context Intelligence */}
            <motion.div variants={itemVariants}>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#58F2B6] mb-4 block text-center lg:text-left">
                Get In Touch
              </span>
              <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter mb-8 text-center lg:text-left">
                Speak With Our <br />
                <span className="text-white/20">Trading Experts.</span>
              </h2>
              <p className="text-[rgba(248,250,252,0.8)] text-xl leading-relaxed mb-12 text-center lg:text-left">
                Ready to take your trading to the next level? Our quants and macro specialists are here to help you build a winning strategy.
              </p>

              <div className="space-y-6 hidden lg:block">
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-[#58F2B6] group-hover:border-[#58F2B6]/40 transition-colors">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-white/40">Secure End-to-End Encryption</span>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-[#58F2B6] group-hover:border-[#58F2B6]/40 transition-colors">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-white/40">Wholesale execution credentials</span>
                </div>
              </div>
            </motion.div>

            {/* Execution Form */}
            <motion.div 
              variants={itemVariants}
              className="p-8 md:p-12 rounded-[3.5rem] bg-[#0A0A0A] border border-white/5 shadow-2xl relative"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Operator Name</label>
                    <div className="relative">
                      <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10" />
                      <input 
                        required
                        type="text" 
                        placeholder="e.g. Satoshi Nakamoto"
                        className="w-full bg-[#020202] border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white outline-none focus:border-[#58F2B6]/40 transition-all font-mono text-sm"
                        value={formData.full_name}
                        onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Signal Email</label>
                    <div className="relative">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10" />
                      <input 
                        required
                        type="email" 
                        placeholder="satoshi@bitcoin.org"
                        className="w-full bg-[#020202] border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white outline-none focus:border-[#58F2B6]/40 transition-all font-mono text-sm"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Deployment Capital ($)</label>
                  <select 
                    required
                    className="w-full bg-[#020202] border border-white/5 rounded-2xl py-5 px-6 text-white outline-none focus:border-[#58F2B6]/40 transition-all font-mono text-sm appearance-none"
                    value={formData.account_size}
                    onChange={(e) => setFormData({...formData, account_size: e.target.value})}
                  >
                    <option value="" disabled>Select Tier</option>
                    <option value="1k-10k">$1,000 - $10,000 (Emergent)</option>
                    <option value="10k-100k">$10,000 - $100,000 (Institutional)</option>
                    <option value="100k+">$100,000+ (Elite)</option>
                    <option value="custom_algo">Custom Algorithmic Development Request</option>
                  </select>

                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Objective Protocol</label>
                  <textarea 
                    rows={4}
                    placeholder="Briefly describe your algorithmic or liquidity engineering requirements..."
                    className="w-full bg-[#020202] border border-white/5 rounded-2xl py-5 px-6 text-white outline-none focus:border-[#58F2B6]/40 transition-all font-mono text-sm resize-none"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  />
                </div>

                <EliteButton 
                  type="submit"
                  variant="elite" 
                  size="lg" 
                  className="w-full mt-4"
                  isLoading={status === 'loading'}
                >
                  <AnimatePresence mode="wait">
                    {status === 'success' ? (
                      <motion.div 
                        key="success"
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Message Received</span>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="idle"
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Send className="w-5 h-5" />
                        <span>Send Message</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </EliteButton>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
