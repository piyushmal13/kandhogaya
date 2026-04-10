import { useState } from 'react';
import { motion } from 'framer-motion';
import { institutionalVariants } from '@/lib/motion';
import { institutionalSpacing } from '@/config/spacing';
import { Mail, Phone, Calendar, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { tracker } from '@/core/tracker';

export function ConsultationSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    strategy: '',
    platform: 'MT5',
    budget: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const { error } = await supabase.from("leads").insert([{ 
        ...formData, 
        source: "consultation_form_v7",
        type: 'consultation'
      }]);

      if (error) {
        console.error("Consultation submit error:", error);
        tracker.track("consultation_failed", { error: error.message });
        setStatus('idle');
        return;
      }

      tracker.track("consultation_requested", { platform: formData.platform });
      setStatus('success');
    } catch (err: any) {
      console.error("Consultation exception:", err);
      tracker.track("consultation_exception", { error: err.message });
      setStatus('idle');
    }
  };

  return (
    <section id="consult" className={cn(institutionalSpacing.section, "bg-background relative overflow-hidden")}>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className={cn(institutionalSpacing.container, "max-w-5xl mx-auto relative z-10")}>
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-4 font-mono">Precision Engineering</p>
          <h2 className="text-4xl lg:text-6xl font-black text-white uppercase italic tracking-tighter leading-none mb-6">
            Let's Build Your <span className="text-emerald-400">Edge</span>
          </h2>
          <p className="text-xl text-white/40 max-w-2xl mx-auto font-medium leading-relaxed">
            Free 30-minute consultation. No commitment. Just expert guidance from institutional engineers.
          </p>
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          {status === 'success' ? (
            // Success State
            <div className="p-16 rounded-[2.5rem] bg-emerald-500/10 border border-emerald-500/20 text-center backdrop-blur-xl animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/30">
                <CheckCircle className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="text-3xl font-black text-white uppercase italic mb-4 tracking-tighter">Transmission Successful</h3>
              <p className="text-lg text-white/50 max-w-md mx-auto leading-relaxed">
                Our lead engineer will review your requirements and contact you within 24 hours to schedule your session.
              </p>
              <button 
                onClick={() => setStatus('idle')}
                className="mt-10 text-xs font-black text-emerald-400 uppercase tracking-widest border-b border-emerald-400/30 pb-1 hover:border-emerald-400 transition-all"
              >
                Submit another request
              </button>
            </div>
          ) : (
            // Form State
            <form onSubmit={handleSubmit} className="p-10 lg:p-14 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-md space-y-8 shadow-[0_40px_100px_rgba(0,0,0,0.4)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-4">Full Identity</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-emerald-500/50 transition-all placeholder:text-white/10"
                    placeholder="Enter full name"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-4">Access Node (Email)</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-emerald-500/50 transition-all placeholder:text-white/10"
                    placeholder="name@domain.com"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-4">Direct Link (Phone)</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-emerald-500/50 transition-all placeholder:text-white/10"
                    placeholder="+1 000 000 000"
                  />
                </div>

                {/* Platform */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-4">Target Environment</label>
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-emerald-500/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="MT4">MetaTrader 4</option>
                    <option value="MT5">MetaTrader 5</option>
                    <option value="cTrader">cTrader</option>
                    <option value="Other">Custom API / Other</option>
                  </select>
                </div>
              </div>

              {/* Strategy Description */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-4">Logic Parameters</label>
                <textarea
                  required
                  value={formData.strategy}
                  onChange={(e) => setFormData({ ...formData, strategy: e.target.value })}
                  rows={4}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-emerald-500/50 transition-all resize-none placeholder:text-white/10"
                  placeholder="Describe your execution rules, risk metrics, and preferred symbols..."
                />
              </div>

              {/* Budget */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-4">Capital Allocation (Project Budget)</label>
                <select
                  required
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-emerald-500/50 transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select range...</option>
                  <option value="1000-2500">$1,000 — $2,500</option>
                  <option value="2500-5000">$2,500 — $5,000</option>
                  <option value="5000-10000">$5,000 — $10,000</option>
                  <option value="10000+">$10,000+</option>
                </select>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                variant="sovereign"
                size="sovereign-hero"
                glowEffect={true}
                className="w-full"
                isLoading={status === 'loading'}
                disabled={status !== 'idle'}
                trackingEvent="consultation_request"
                rightIcon={<Calendar className="w-5 h-5" />}
              >
                Initialize Consultation
              </Button>

              <div className="flex items-center justify-center gap-6 pt-4 text-[9px] font-black text-white/20 uppercase tracking-[0.25em]">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-emerald-500" /> SECURE HANDSHAKE
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-emerald-500" /> NDA COMPLIANT
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-emerald-500" /> ZERO VENDOR LOCK-IN
                </div>
              </div>
            </form>
          )}
        </motion.div>

        {/* Global Access Linkage */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 flex flex-wrap justify-center gap-12 text-center border-t border-white/5 pt-16"
        >
          <div className="space-y-2">
            <Mail className="w-6 h-6 text-emerald-400 mx-auto opacity-50" />
            <div className="text-[10px] font-black text-white/30 uppercase tracking-widest">Global Desk</div>
            <a href="mailto:engineer@ifxtrades.com" className="text-sm font-black text-white hover:text-emerald-400 transition-colors">
              engineer@ifxtrades.com
            </a>
          </div>
          <div className="space-y-2">
            <Phone className="w-6 h-6 text-emerald-400 mx-auto opacity-50" />
            <div className="text-[10px] font-black text-white/30 uppercase tracking-widest">Direct Pulse</div>
            <a href="tel:+971500000000" className="text-sm font-black text-white hover:text-emerald-400 transition-colors">
              +971 50 000 0000
            </a>
          </div>
          <div className="space-y-2">
            <Calendar className="w-6 h-6 text-emerald-400 mx-auto opacity-50" />
            <div className="text-[10px] font-black text-white/30 uppercase tracking-widest">SLA Status</div>
            <div className="text-sm font-black text-emerald-400 italic">Within 24 Hours</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
