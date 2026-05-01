import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Zap, Flame, X } from "lucide-react";
import { publicSupabase } from "../../lib/supabase";
import { useFlag } from "../../hooks/useFlags";

/**
 * Institutional Urgency Engine (v1.24)
 * Contextual behavioral hooks for High-Intent prospects.
 */

export const UrgencyBanner = ({ leadId }: { leadId?: string }) => {
  const bannerEnabled = useFlag('urgency_banner_active');
  const [message, setMessage] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run logic if enabled
    if (!bannerEnabled) return;

    const generateContextualUrgency = async () => {
      // 1. Audit active signal volatility
      const { data: signal } = await publicSupabase
        .from('signals')
        .select('id, pair, created_at')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (signal) {
         // Fake dynamic social proof or movement logic
         const rando = Math.floor(Math.random() * 5) + 2;
         const messages = [
            `Institutional alert: ${signal.pair} setup is active right now.`,
            `High Volatility: ${signal.pair} just moved +${Math.floor(Math.random() * 50) + 20} points.`,
            `Social Pulse: ${rando} accounts synchronized with the ${signal.pair} setup in the last 15 mins.`,
            `Yield Logic: Your last audited pair is hitting TP1.`,
            `Priority Access: Expert Masterclass starting in 45 minutes.`
         ];
         setMessage(messages[Math.floor(Math.random() * messages.length)]);
         setIsVisible(true);
      }
    };

    generateContextualUrgency();
    const timer = setTimeout(() => setIsVisible(false), 8000); // 8s visibility
    return () => clearTimeout(timer);
  }, [bannerEnabled]);

  if (!bannerEnabled) return null;

  return (
    <AnimatePresence>
      {isVisible && message && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-xl px-4"
        >
          <div className="relative p-6 rounded-[2rem] bg-black/80 backdrop-blur-3xl border border-emerald-500/30 shadow-[0_20px_60px_rgba(16,185,129,0.2)] overflow-hidden group">
            {/* Ambient Pulse */}
            <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors" />
            
            <div className="relative flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-black shadow-lg animate-pulse shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Institutional Alert</span>
                  <Flame className="w-3 h-3 text-emerald-500" />
                </div>
                <p className="text-white text-sm font-bold uppercase tracking-tight leading-snug">
                  {message}
                </p>
              </div>

              <button 
                onClick={() => setIsVisible(false)}
                className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-gray-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Expiring Progress bar */}
            <motion.div 
              initial={{ width: "100%" }}
              animate={{ width: 0 }}
              transition={{ duration: 8, ease: "linear" }}
              className="absolute bottom-0 left-0 h-1 bg-emerald-500"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
