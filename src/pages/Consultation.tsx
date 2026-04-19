import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Shield, 
  Clock, 
  MessageSquare, 
  BarChart, 
  CheckCircle2, 
  ArrowRight,
  User,
  Mail,
  Phone,
  Briefcase
} from "lucide-react";
import { SovereignButton } from "../components/ui/Button";
import { PageMeta } from "../components/site/PageMeta";
import { supabase } from "../lib/supabase";
import { tracker } from "@/core/tracker";

const BENEFITS = [
  { icon: BarChart, title: "Macro Alignment", desc: "Sync your portfolio with global liquidity shifts." },
  { icon: Shield, title: "Risk Hardening", desc: "Enterprise-grade hedging and exposure limits." },
  { icon: MessageSquare, title: "Direct Access", desc: "1-on-1 session with our proprietary desk lead." }
];

export const Consultation = () => {
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    strategy: "Algo Trading",
    notes: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('loading');

    try {
      const { error } = await supabase.from("consultations").insert([
        { 
          ...formData, 
          status: "pending",
          crm_metadata: { source: "consultation_page_v10" }
        }
      ]);

      if (error) throw error;

      tracker.track("consultation_requested", { strategy: formData.strategy });
      setFormState('success');
      
      // Auto-redirect or reset after success is handled in UI
    } catch (err) {
      console.error(err);
      setFormState('idle');
    }
  };

  if (formState === 'success') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-8 border border-emerald-500/30"
        >
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
        </motion.div>
        <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-4">
          Request Authorized
        </h2>
        <p className="text-gray-400 max-w-md mx-auto mb-12">
          Your institutional consultation request has been logged. A senior desk analyst will reach out to verify your credentials within 24 business hours.
        </p>
        <SovereignButton variant="secondary" onClick={() => window.location.href = "/"}>
          Return to Terminal
        </SovereignButton>
      </div>
    );
  }

  return (
    <div className="py-32 md:py-64 relative overflow-hidden bg-[#020202]">
      {/* Dynamic Ambient Background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.05)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
      </div>

      <PageMeta 
        title="Institutional Consultation | Sovereign Boardroom"
        description="Book a strategic session with the IFX Trades proprietary desk leads. Elite quantitative architecture and risk governance."
        path="/consultation"
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 md:gap-32 items-center">
          
          {/* ── LEFT: REPUTATION & VALUE ── */}
          <div className="space-y-16">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-10"
            >
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-emerald-500/[0.04] border border-emerald-500/[0.15] text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em]">
                Executive Access Tier
              </div>
              <h1 className="text-shimmer leading-[0.9]">
                Strategic <br />
                <span className="italic font-serif text-gradient-emerald">Boardroom.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-xl font-light">
                Elevate beyond retail methodologies. Engage in a deep-dive analysis 
                of your execution engine with IFX Trades' senior quantitative architects.
              </p>
            </motion.div>

            <div className="space-y-6">
              {BENEFITS.map((benefit, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-8 p-8 rounded-[2.5rem] border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/[0.05] border border-emerald-500/[0.1] flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-all shrink-0">
                    <benefit.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-[13px] font-black text-white uppercase tracking-[0.2em] mb-2">{benefit.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed font-light">{benefit.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center gap-4 text-emerald-500/60">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em]">3 Open Slots This Week</span>
            </div>
          </div>

          {/* ── RIGHT: THE FORM ── */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="absolute -inset-1 blur-3xl opacity-20 bg-emerald-500 -z-10" />
            <div className="bg-[#080B12] border border-white/[0.08] p-10 md:p-16 rounded-[3.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input 
                          required
                          type="text" 
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-black/40 border border-white/[0.08] px-14 py-5 rounded-2xl text-white outline-none focus:border-emerald-500/50 transition-all font-medium text-sm"
                          placeholder="Johnathan Doe"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Institutional Email</label>
                      <div className="relative">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input 
                          required
                          type="email" 
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full bg-black/40 border border-white/[0.08] px-14 py-5 rounded-2xl text-white outline-none focus:border-emerald-500/50 transition-all font-medium text-sm"
                          placeholder="j.doe@institution.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Mobile / Telegram</label>
                      <div className="relative">
                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input 
                          required
                          type="tel" 
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full bg-black/40 border border-white/[0.08] px-14 py-5 rounded-2xl text-white outline-none focus:border-emerald-500/50 transition-all font-medium text-sm"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Strategy Focus</label>
                      <div className="relative">
                        <select 
                          value={formData.strategy}
                          onChange={(e) => setFormData({...formData, strategy: e.target.value})}
                          className="w-full bg-black/40 border border-white/[0.08] px-6 py-5 rounded-2xl text-white outline-none focus:border-emerald-500/50 transition-all font-black uppercase tracking-[0.2em] text-[10px] appearance-none"
                        >
                          <option value="Algo Trading">Algo Trading Masterclass</option>
                          <option value="Macro Research">Macro Intelligence Hub</option>
                          <option value="Hybrid">Hybrid (Retail to Institutional)</option>
                        </select>
                        <ArrowRight className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 rotate-90" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Additional Intel</label>
                    <textarea 
                      rows={4}
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="Tell us about your current desk setup or trading history..."
                      className="w-full bg-black/40 border border-white/[0.08] px-6 py-5 rounded-2xl text-white outline-none focus:border-emerald-500/50 transition-all font-medium text-sm resize-none"
                    />
                  </div>
                </div>

                <button 
                  disabled={formState === 'loading'}
                  type="submit"
                  className="w-full group relative px-12 py-6 bg-white text-black font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(255,255,255,0.1)] active:scale-95 flex items-center justify-center gap-4"
                >
                  {formState === 'loading' ? (
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Confirm Strategic Request
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
