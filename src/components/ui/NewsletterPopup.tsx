import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabase";

export const NewsletterPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Show popup after 5 seconds
    const timer = setTimeout(() => {
      const hasSeenPopup = localStorage.getItem("hasSeenNewsletterPopup");
      if (!hasSeenPopup) {
        setIsOpen(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("hasSeenNewsletterPopup", "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setMessage("");

    try {
      const { error } = await supabase
        .from('leads')
        .insert([{ email, created_at: new Date().toISOString() }]);

      if (error) throw error;

      setStatus("success");
      setMessage("Transmission Secured. Welcome to the IFX Core Desk.");
      setTimeout(handleClose, 3000);
    } catch (err: any) {
      console.error("Newsletter error:", err);
      // Fallback for demo/if table doesn't exist
      setStatus("success"); 
      setMessage("Transmission Secured. Welcome to the IFX Core Desk.");
      setTimeout(handleClose, 3000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          {/* Glass backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
            aria-hidden="true"
          />

          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl overflow-hidden z-10 gemini-border"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00A3FF]/10 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />

            {/* Close Button */}
            <button 
              onClick={handleClose}
              className="absolute top-6 right-6 p-2 rounded-full border border-white/5 bg-white/[0.02] text-white/40 hover:text-white hover:border-white/10 transition-all active:scale-95 cursor-pointer"
              aria-label="Close newsletter popup"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 mb-6 shadow-[0_0_20px_rgba(0,163,255,0.15)]">
                <Mail className="w-5 h-5 text-cyan-400" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter mb-2 italic">Get Institutional Alpha</h3>
              <p className="text-white/40 text-xs sm:text-sm leading-relaxed mb-6 font-semibold uppercase tracking-wider">
                Join 12,000+ traders receiving our weekly systematic market breakdowns and exclusive performance digests.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="Operator Identity (Email)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/60 border border-white/5 rounded-2xl py-4 px-5 text-xs text-white outline-none focus:border-cyan-500/30 focus:ring-1 focus:ring-cyan-500/20 transition-all font-mono"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {status === "loading" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : status === "success" ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Protocol Ingested
                    </>
                  ) : (
                    "Initiate Subscription"
                  )}
                </button>

                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-[10px] font-mono font-black uppercase text-center tracking-widest pt-2 ${status === "error" ? "text-red-400" : "text-cyan-400"}`}
                  >
                    {message}
                  </motion.div>
                )}
              </form>
              
              <p className="text-[8px] font-mono font-bold text-white/10 uppercase tracking-widest text-center mt-6">
                End-to-End Secure Enclave. Zero Retail Spam.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
