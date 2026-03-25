import React, { useState, useEffect, useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Star, CheckCircle2, Quote } from "lucide-react";
import { fetchReviews } from "../../services/reviewService";

export const SuccessShowcase = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    fetchReviews().then(data => {
      if (data && data.length > 0) {
        setReviews(data);
      }
    });
  }, []);

  // Triple the items for a seamless loop
  const scrollItems = useMemo(() => {
    if (reviews.length === 0) return [];
    return [...reviews, ...reviews, ...reviews];
  }, [reviews]);

  if (reviews.length === 0) return null;

  return (
    <section className="py-24 md:py-48 relative overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10 mb-16 md:mb-24 text-center">
        <motion.div
  initial = {{ opacity: 0, y: 20 }}
  whileInView = {{ opacity: 1, y: 0 }}
  viewport = {{ once: true }}
>
          <span className="text-emerald-500 font-bold text-[10px] md:text-xs uppercase tracking-[0.4em] mb-4 inline-block">Validation</span>
          <h2 className="text-4xl md:text-8xl font-bold text-white mb-8 tracking-tighter leading-[0.95]">
            Trusted by <span className="institutional-title italic font-serif text-emerald-400">Professionals</span>
          </h2>
          <p className="max-w-2xl mx-auto text-base md:text-2xl font-mono leading-relaxed opacity-60" style={{ color: 'var(--text-muted)' }}>
            Institutional-grade performance verified by quant traders across the globe.
          </p>
        </motion.div>
      </div>

      <div className="relative">
        {/* Institutional Grade Gradient Masks */}
        <div className="absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-[#050816] to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 md:w-64 bg-gradient-to-l from-[#050816] to-transparent z-20 pointer-events-none" />

        <motion.div 
          className="flex gap-4 md:gap-8"
          animate={prefersReducedMotion ? {} : { x: ["0%", "-33.333333%"] }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {scrollItems.map((rev, i) => (
            <div 
              key={`${rev.id || i}-${i}`}
              className="glass-card group relative p-8 md:p-12 border-white/5 backdrop-blur-3xl transition-all duration-700 hover:border-emerald-500/30 min-w-[320px] md:min-w-[560px] flex flex-col"
            >
              <div className="absolute top-6 right-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-12 h-12 text-emerald-500" />
              </div>

              <div className="flex gap-1 mb-6 md:mb-8">
                {Array.from({ length: rev.rating || 5 }).map((_, j) => (
                  <Star key={`${rev.id}-${i}-star-${j}`} className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                ))}
              </div>

              <p className="text-gray-300 text-base md:text-xl leading-relaxed mb-8 md:mb-12 flex-1 font-medium italic">
                "{rev.text}"
              </p>

              <div className="flex items-center gap-4 pt-6 md:pt-8 border-t border-white/5 mt-auto">
                <div className="relative">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold text-lg border border-emerald-500/30">
                    {rev.name?.charAt(0) || "U"}
                  </div>
                  {rev.is_verified !== false && (
                    <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-0.5 border border-white/10">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-white font-bold text-sm md:text-base flex items-center gap-2">
                    {rev.name}
                    {rev.is_verified !== false && <span className="text-[10px] md:text-xs text-emerald-500/70 font-mono tracking-widest uppercase">Verified</span>}
                  </div>
                  <div className="text-[10px] md:text-xs uppercase tracking-widest font-mono opacity-50" style={{ color: 'var(--text-muted)' }}>{rev.role || "Trader"}</div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
