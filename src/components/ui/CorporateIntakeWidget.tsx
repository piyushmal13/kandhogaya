import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, X, Send, ShieldCheck, Mail, UserCheck } from "lucide-react";
import { leadService } from "../../services/crm/leadService";

export const CorporateIntakeWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [clientId, setClientId] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;

    setIsSubmitting(true);
    try {
      // Ingest the operational inquiry directly into Supabase via the leadService
      const result = await leadService.createLead({
        email: email.trim(),
        source: "desk_intake",
        stage: "HIGH_INTENT",
        referred_by_code: clientId.trim() || undefined,
        crm_metadata: {
          chat_inquiry: message.trim(),
          client_id: clientId.trim(),
          recipient_routing: "info@ifxtrades.com",
          system_telemetry: {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            language: navigator.language
          }
        }
      });

      if (result.success) {
        // Log telemetry transmission to info@ifxtrades.com
        console.log(`[EMAIL DISPATCH]: Inquiry safely routed to info@ifxtrades.com for client: ${email}`);
        setIsSuccess(true);
        setEmail("");
        setClientId("");
        setMessage("");
      } else {
        alert("Transmission pipeline interrupted. Please verify your connection.");
      }
    } catch (err) {
      console.error("Operational Ingestion Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Intake Trigger Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-50 bg-[#0A0D12] text-emerald-400 border border-emerald-500/30 p-3.5 sm:p-4 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:scale-110 active:scale-95 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center group"
        aria-label="Toggle Operations Intake"
      >
        <HelpCircle className="w-5.5 h-5.5 sm:w-6.5 sm:h-6.5" />
        <span className="absolute right-full mr-4 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">
          Desk Intake
        </span>
      </button>

      {/* Intake Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-36 right-4 sm:bottom-40 sm:right-6 z-50 w-[320px] sm:w-[380px] rounded-[2rem] bg-[#020304]/90 border border-white/10 backdrop-blur-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-emerald-500/10 via-cyan-500/5 to-transparent border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <div className="absolute inset-0 rounded-full bg-emerald-500 opacity-70 animate-ping" />
                </div>
                <div>
                  <h4 className="text-white font-black text-xs uppercase tracking-widest leading-none">IFX Operations Desk</h4>
                  <p className="text-[7.5px] text-gray-500 font-bold uppercase tracking-widest mt-1">Operational Bridge Active</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setIsOpen(false);
                  setIsSuccess(false);
                }} 
                className="p-1 rounded-lg bg-white/5 border border-white/5 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6">
              {!isSuccess ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="text-[10px] leading-relaxed text-gray-400 font-medium">
                    Submit your quantitative development request, ECN integration, or general inquiry. Our desk will route it directly to our central operational node.
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase tracking-widest text-emerald-400/80">Client Node Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="client@node.com"
                        className="w-full bg-[#070A0F] border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white outline-none focus:border-emerald-500/30 transition-all font-mono"
                      />
                    </div>
                  </div>

                  {/* Client ID / Referral Code */}
                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase tracking-widest text-emerald-400/80">Client ID / Referral Code (Optional)</label>
                    <div className="relative">
                      <UserCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                      <input
                        type="text"
                        value={clientId}
                        onChange={(e) => setClientId(e.target.value)}
                        placeholder="IFX-XXXX-XXXX"
                        className="w-full bg-[#070A0F] border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white outline-none focus:border-emerald-500/30 transition-all font-mono"
                      />
                    </div>
                  </div>

                  {/* Inquiry */}
                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase tracking-widest text-emerald-400/80">Operational Inquiry</label>
                    <textarea
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your system inquiry or custom algo request in detail..."
                      rows={3}
                      className="w-full bg-[#070A0F] border border-white/5 rounded-xl p-3 text-xs text-white outline-none focus:border-emerald-500/30 transition-all leading-relaxed"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                  >
                    {isSubmitting ? (
                      <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        Transmit Inquiry
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-6 text-center space-y-4"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h5 className="text-white font-black text-sm uppercase tracking-tighter">Transmission Secured</h5>
                  <p className="text-gray-400 text-[11px] leading-relaxed px-4">
                    Your inquiry has been successfully logged and routed to our central operational node.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="px-6 py-2 border border-white/5 bg-white/[0.02] hover:bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all"
                  >
                    Submit New Inquiry
                  </button>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-black/40 border-t border-white/5 text-center flex items-center justify-center gap-2 text-[8px] font-bold text-gray-500 uppercase tracking-widest">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              End-to-End Cryptographic Enclave
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
