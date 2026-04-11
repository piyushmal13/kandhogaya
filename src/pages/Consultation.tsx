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
    <div className="py-20 md:py-32">
      <PageMeta 
        title="Institutional Consultation"
        description="Book a strategic session with the IFX Trades proprietary desk leads."
        path="/consultation"
      />

      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          
          {/* ── LEFT: REPUTATION & VALUE ── */}
          <div className="space-y-12">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.85] uppercase tracking-tighter italic">
                Strategic <br />
                <span className="text-cyan-500">Boardroom</span>
              </h1>
              <p className="text-xl text-gray-400 leading-relaxed max-w-xl">
                Elevate beyond retail methodologies. Engage in a deep-dive analysis 
                of your execution engine with IFX Trades' senior quantitative architects.
              </p>
            </div>

            <div className="grid sm:grid-cols-1 gap-6">
              {BENEFITS.map((benefit, i) => (
                <div key={i} className="flex items-start gap-6 p-6 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 group-hover:bg-cyan-500/20 transition-all shrink-0">
                    <benefit.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tight mb-1">{benefit.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 text-emerald-500">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-xs font-black uppercase tracking-[0.3em]">3 Open Slots This Week</span>
            </div>
          </div>

          {/* ── RIGHT: THE FORM ── */}
          <div className="relative">
            <div className="absolute -inset-1 blur-3xl opacity-20 bg-cyan-500 -z-10" />
            <div className="bg-[#1a1f29] border border-white/5 p-8 md:p-12 rounded-[3rem] shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input 
                        required
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-black/40 border border-white/5 px-12 py-4 rounded-2xl text-white outline-none focus:border-cyan-500/50 transition-all font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Institutional Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input 
                        required
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-black/40 border border-white/5 px-12 py-4 rounded-2xl text-white outline-none focus:border-cyan-500/50 transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Mobile / Telegram</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input 
                        required
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-black/40 border border-white/5 px-12 py-4 rounded-2xl text-white outline-none focus:border-cyan-500/50 transition-all font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Strategy Interest</label>
                    <select 
                      value={formData.strategy}
                      onChange={(e) => setFormData({...formData, strategy: e.target.value})}
                      className="w-full bg-black/40 border border-white/5 px-6 py-4 rounded-2xl text-white outline-none focus:border-cyan-500/50 transition-all font-medium appearance-none"
                    >
                      <option value="Algo Trading">Algo Trading Masterclass</option>
                      <option value="Macro Research">Macro Intelligence Hub</option>
                      <option value="Hybrid">Hybrid (Retail to Institutional)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Additional Intel</label>
                  <textarea 
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Tell us about your current desk setup or trading history..."
                    className="w-full bg-black/40 border border-white/5 px-6 py-4 rounded-2xl text-white outline-none focus:border-cyan-500/50 transition-all font-medium resize-none"
                  />
                </div>

                <SovereignButton 
                  fluid
                  variant="sovereign"
                  size="lg"
                  glowEffect
                  isLoading={formState === 'loading'}
                  type="submit"
                  rightIcon={<ArrowRight />}
                >
                  Confirm Strategic Request
                </SovereignButton>
                
                <p className="text-[9px] text-center font-black uppercase tracking-widest text-white/20">
                  Data Encrypted via Sovereign SSL // Zero Broker Leakage Policy
                </p>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
