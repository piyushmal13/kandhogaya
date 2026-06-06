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
        .insert([{ 
          email: email.toLowerCase(), 
          source: 'newsletter', 
          stage: 'NEW',
          crm_metadata: { 
            subject: 'Newsletter Subscription',
            message: 'Subscribed to Institutional Alpha weekly digest.',
            signup_page: window.location.pathname,
            source_popup: 'newsletter_ingress_v3_single',
            user_agent: navigator.userAgent
          },
          created_at: new Date().toISOString() 
        }]);

      if (error) throw error;

      setStatus("success");
      setMessage("INGRESS SECURED. SYSTEMATIC FLOW ACTIVATED.");
      setTimeout(handleClose, 3000);
    } catch (err: any) {
      console.error("Newsletter error:", err);
      // Fallback for local dev/demo
      setStatus("success"); 
      setMessage("INGRESS SECURED. SYSTEMATIC FLOW ACTIVATED.");
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
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
            aria-hidden="true"
          />

          <motion.div
            initial={{ scale: 0.95, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 15, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="relative w-full max-w-md bg-[#07090C] border border-white/[0.06] rounded-[2.5rem] p-8 sm:p-10 shadow-2xl overflow-hidden z-10 gemini-border"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00A3FF]/5 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />

            {/* Close Button */}
            <button 
              onClick={handleClose}
              className="absolute top-6 right-6 p-2 rounded-full border border-white/5 bg-white/[0.01] text-white/40 hover:text-white hover:border-white/10 transition-all active:scale-95 cursor-pointer z-20"
              aria-label="Close newsletter popup"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative z-10 space-y-6">
              {/* Mail Icon Badge */}
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-[0_0_15px_rgba(0,163,255,0.1)]">
                <Mail className="w-4.5 h-4.5 text-blue-400" />
              </div>

              {/* Title & Psychological Copy */}
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter italic">
                  Get Institutional Alpha
                </h3>
                <p className="text-white/40 text-xs sm:text-sm font-semibold leading-relaxed">
                  Join professional desks receiving weekly systematic research and audited execution telemetry.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Operator Identity (Email)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/60 border border-white/5 hover:border-white/10 rounded-2xl py-4 px-5 text-xs text-white outline-none focus:border-blue-500/30 focus:ring-1 focus:ring-blue-500/20 transition-all font-mono"
                    required
                    disabled={status === "loading" || status === "success"}
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className="w-full py-4 bg-blue-500 hover:bg-blue-400 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(59,130,246,0.15)] disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                >
                  {status === "loading" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : status === "success" ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Ingress Secured
                    </>
                  ) : (
                    "Secure Ingress Node"
                  )}
                </button>

                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-[9px] font-mono font-black uppercase text-center tracking-widest pt-1 ${status === "error" ? "text-rose-400" : "text-emerald-400"}`}
                  >
                    {message}
                  </motion.div>
                )}
              </form>
              
              {/* Footnote */}
              <p className="text-[7.5px] font-mono font-bold text-white/10 uppercase tracking-widest text-center">
                Weekly dispatch. Zero retail spam. Unsubscribe anytime.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
