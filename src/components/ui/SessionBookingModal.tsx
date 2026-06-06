import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, CheckCircle2, User, Phone, Briefcase } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { tracker } from "@/core/tracker";
import { useAuth } from "../../contexts/AuthContext";
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
  const { user, userProfile } = useAuth();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    capital_tier: ""
  });

  // Automatically pre-select Bespoke Custom Build if defaultObjective contains build keywords
  useEffect(() => {
    if (defaultObjective && (defaultObjective.includes("Bespoke") || defaultObjective.includes("Build"))) {
      setFormData(prev => ({ ...prev, capital_tier: "Bespoke Custom Build" }));
    } else {
      setFormData(prev => ({ ...prev, capital_tier: "" }));
    }
  }, [defaultObjective, isOpen]);

  // Pre-fill name if user is logged in
  useEffect(() => {
    if (user && userProfile) {
      setFormData(prev => ({
        ...prev,
        name: userProfile.full_name || ""
      }));
    }
  }, [user, userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.capital_tier || status !== 'idle') return;

    setStatus('loading');
    try {
      // Clean phone number for placeholder email structure
      const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
      const userEmail = user?.email || `lead_${cleanPhone || Math.random().toString(36).substring(7)}@whatsapp-leads.ifxtrades.com`;

      // 1. Record Lead in CRM
      const { error } = await supabase
        .from("leads")
        .upsert({
          email: userEmail.toLowerCase(),
          source: "Session Booking WhatsApp Form",
          stage: "HIGH_INTENT",
          crm_metadata: {
            name: formData.name,
            phone: formData.phone,
            capital_tier: formData.capital_tier,
            submission_page: window.location.pathname,
            user_agent: navigator.userAgent
          },
          last_action_at: new Date().toISOString()
        }, { onConflict: 'email' });

      if (error) throw error;

      tracker.track("session_booking_whatsapp", { capital_tier: formData.capital_tier });

      // 2. Open WhatsApp link with pre-filled message
      const msg = `Hello IFX Trades, I would like to request a strategy session.\n\n*Name:* ${formData.name}\n*Phone:* ${formData.phone}\n*Capital Allocation Tier:* ${formData.capital_tier}`;
      const whatsappUrl = `https://wa.me/917709583224?text=${encodeURIComponent(msg)}`;
      window.open(whatsappUrl, "_blank");

      setStatus('success');
      setFormData({ name: "", phone: "", capital_tier: "" });
      setTimeout(() => {
        setStatus('idle');
        onClose();
      }, 2000);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2500);
    }
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(
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

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md max-h-[95svh] sm:max-h-[90vh] overflow-y-auto scrollbar-thin rounded-2xl sm:rounded-[2.5rem] bg-[#07090C] p-6 sm:p-8 shadow-2xl z-10 gemini-border border border-white/5"
            role="dialog"
            aria-modal="true"
          >
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 gemini-shading opacity-30" />

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
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-3">Protocol Redirected</h3>
                <p className="text-white/40 text-[10px] leading-relaxed uppercase tracking-wider font-bold">
                  Connection established. WhatsApp session is launched in a new secure window.
                </p>
              </motion.div>
            ) : (
              <div>
                <div className="mb-6">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">
                    Request Strategy <br />
                    <span className="text-white/20">Session or Build.</span>
                  </h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="operator_name" className="text-[8px] font-black uppercase tracking-widest text-white/30 ml-1">Operator Name</label>
                    <div className="relative">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10" />
                      <input
                        required
                        id="operator_name"
                        type="text"
                        placeholder="Sender Identity (Name)"
                        className="w-full bg-black/60 border border-white/5 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 rounded-2xl py-3.5 pl-12 pr-4 text-white outline-none transition-all font-mono text-xs"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="phone_number" className="text-[8px] font-black uppercase tracking-widest text-white/30 ml-1">WhatsApp Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10" />
                      <input
                        required
                        id="phone_number"
                        type="tel"
                        placeholder="e.g. +91 77095 83224"
                        className="w-full bg-black/60 border border-white/5 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 rounded-2xl py-3.5 pl-12 pr-4 text-white outline-none transition-all font-mono text-xs"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="account_size_select" className="text-[8px] font-black uppercase tracking-widest text-white/30 ml-1">Target Allocation capital ($)</label>
                    <div className="relative">
                      <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10 pointer-events-none" />
                      <select
                        required
                        id="account_size_select"
                        className="w-full bg-black/60 border border-white/5 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 rounded-2xl py-3.5 pl-12 pr-5 text-white outline-none transition-all font-mono text-xs appearance-none cursor-pointer"
                        value={formData.capital_tier}
                        onChange={(e) => setFormData({ ...formData, capital_tier: e.target.value })}
                      >
                        <option value="" disabled>Select Capital Tier</option>
                        <option value="$500 - $1,000">$500 - $1,000 (Emergent Tier 1)</option>
                        <option value="$1,000 - $10,000">$1,000 - $10,000 (Emergent Tier 2)</option>
                        <option value="$10,000 - $100,000">$10,000 - $100,000 (Institutional Tier)</option>
                        <option value="$100,000+">$100,000+ (Elite Tier)</option>
                        <option value="Bespoke Custom Build">Bespoke Algorithmic Custom Build Request</option>
                      </select>
                    </div>
                  </div>

                  <EliteButton
                    type="submit"
                    variant="gemini"
                    size="lg"
                    className="w-full mt-4"
                    isLoading={status === 'loading'}
                    glowEffect
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Send className="w-4 h-4" />
                      <span>Initiate Protocol via WhatsApp</span>
                    </div>
                  </EliteButton>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
