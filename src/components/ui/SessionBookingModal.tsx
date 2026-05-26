import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, CheckCircle2, ShieldCheck, Mail, User, Briefcase, Lock, Cpu, Globe } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { tracker } from "@/core/tracker";
import { EliteButton } from "./Button";

interface SessionBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultObjective?: string;
}

export const SessionBookingModal: React.FC<SessionBookingModalProps> = ({
  isOpen,
  onClose,
  defaultObjective = ""
}) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    account_size: "",
    message: defaultObjective
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
          metadata: { surface: "premium_session_booking_modal" }
        }]);

      if (error) throw error;

      tracker.track("consultation_request_modal", { account_size: formData.account_size });
      setStatus('success');
      setFormData({ full_name: "", email: "", account_size: "", message: "" });
      setTimeout(() => {
        setStatus('idle');
        onClose();
      }, 3000);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0A0A0A] p-6 sm:p-10 shadow-2xl z-10"
            role="dialog"
            aria-modal="true"
          >
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-6 top-6 p-2 rounded-full border border-white/5 bg-white/[0.02] text-white/40 hover:text-white hover:border-white/10 transition-all active:scale-95"
              aria-label="Close booking modal"
            >
              <X className="h-4 w-4" />
            </button>

            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 flex flex-col items-center justify-center"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-3">Transmission Secured</h3>
                <p className="text-white/40 text-sm max-w-sm leading-relaxed uppercase tracking-wider font-semibold">
                  Protocol initiated. Our lead quantitative desk engineer will review your objective and establish direct contact within 24 hours.
                </p>
              </motion.div>
            ) : (
              <div>
                <div className="mb-8">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-[0.25em] mb-4">
                    <Lock className="w-2.5 h-2.5" /> SECURED ONBOARDING PROTOCOL
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter leading-none">
                    Request Strategy <br />
                    <span className="text-white/20">Session or Build.</span>
                  </h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Operator Name</label>
                      <div className="relative">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10" />
                        <input
                          required
                          type="text"
                          placeholder="Sender Identity"
                          className="w-full bg-black/60 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-emerald-500/40 transition-all font-mono text-xs"
                          value={formData.full_name}
                          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Signal Email</label>
                      <div className="relative">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10" />
                        <input
                          required
                          type="email"
                          placeholder="Contact Protocol"
                          className="w-full bg-black/60 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-emerald-500/40 transition-all font-mono text-xs"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Target Allocation capital ($)</label>
                    <select
                      required
                      className="w-full bg-black/60 border border-white/5 rounded-2xl py-4 px-5 text-white outline-none focus:border-emerald-500/40 transition-all font-mono text-xs appearance-none"
                      value={formData.account_size}
                      onChange={(e) => setFormData({ ...formData, account_size: e.target.value })}
                    >
                      <option value="" disabled>Select Capital Tier</option>
                      <option value="1k-10k">$1,000 - $10,000 (Emergent)</option>
                      <option value="10k-100k">$10,000 - $100,000 (Institutional)</option>
                      <option value="100k+">$100,000+ (Elite)</option>
                      <option value="custom_algo">Bespoke Algorithmic Custom Build Request</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Objective Protocol Specification</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Outline your algorithmic execution objective or macro briefing request..."
                      className="w-full bg-black/60 border border-white/5 rounded-2xl py-4 px-5 text-white outline-none focus:border-emerald-500/40 transition-all font-mono text-xs resize-none"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <EliteButton
                    type="submit"
                    variant="elite"
                    size="lg"
                    className="w-full mt-2"
                    isLoading={status === 'loading'}
                  >
                    <div className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      <span>Initiate Protocol</span>
                    </div>
                  </EliteButton>

                  {/* Encryption Notice */}
                  <div className="flex items-center justify-center gap-2 pt-2 text-[9px] font-mono text-white/20 uppercase tracking-widest">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/50" />
                    <span>SECURE END-TO-END 256-BIT ENCRYPTION</span>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
