import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Zap, ArrowRight, Bell } from "lucide-react";

interface ExitIntentPopupProps {
  onRegister: () => void;
  webinarTitle?: string;
}

export const ExitIntentPopup = ({ onRegister, webinarTitle }: ExitIntentPopupProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
        // Store in session storage so it doesn't annoy the user repeatedly in the same session
        sessionStorage.setItem("exit_intent_shown", "true");
      }
    };

    // Check if already shown in this session
    const shown = sessionStorage.getItem("exit_intent_shown");
    if (shown) {
      setHasShown(true);
    } else {
      document.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasShown]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleAction = () => {
    setIsVisible(false);
    onRegister();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-[#0a0a0a] border border-emerald-500/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.2)]"
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.1),transparent_70%)]" />
            
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 md:p-10 relative z-10">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-6 border border-emerald-500/20">
                <Bell className="w-8 h-8" />
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
                Wait! Don't miss out.
              </h2>
              
              <p className="text-gray-400 mb-8 leading-relaxed">
                Don't miss the upcoming <span className="text-emerald-400 font-bold">IFXTrades market outlook webinar</span>. 
                {webinarTitle && <span> Join us for: <strong className="text-white">{webinarTitle}</strong></span>}
                Join 1,200+ elite traders for institutional-grade insights.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAction}
                  className="flex-1 py-4 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 group"
                >
                  Secure My Spot
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 py-4 bg-white/5 text-white font-bold rounded-xl border border-white/10 hover:bg-white/10 transition-all"
                >
                  Maybe Later
                </button>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <img 
                      key={i}
                      src={`https://i.pravatar.cc/100?u=${i}`}
                      alt="User"
                      className="w-6 h-6 rounded-full border-2 border-[#0a0a0a]"
                    />
                  ))}
                </div>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                  +124 traders registered in the last hour
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
