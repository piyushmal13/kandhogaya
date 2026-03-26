import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Star, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchReviews } from "../../services/reviewService";

export const SuccessShowcase = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetchReviews().then(data => {
      if (data && data.length > 0) {
        setReviews(data);
      }
    });
  }, []);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % Math.max(1, reviews.length - 2));
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + Math.max(1, reviews.length - 2)) % Math.max(1, reviews.length - 2));
  };

  if (reviews.length === 0) return null;

  return (
    <section className="py-24 md:py-40 relative overflow-hidden bg-black/20">
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[var(--brand)]/5 rounded-full blur-[140px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[var(--brand)] font-bold text-[10px] md:text-xs uppercase tracking-[0.5em] mb-6 inline-block opacity-60">Success Audit</span>
            <h2 className="text-4xl md:text-7xl font-bold text-white mb-8 tracking-tighter leading-none">
              Institutional <span className="italic font-serif text-[var(--brand)]">Feedback</span>
            </h2>
            <p className="max-w-xl mx-auto text-xs md:text-sm font-medium tracking-widest opacity-30 uppercase">
              Real-time sentiment from 12,000+ active trading nodes.
            </p>
          </motion.div>
        </div>

        {/* Multi-Review Horizontal Scroll - Institutional Grade */}
        <div className="relative">
          <div className="flex items-center justify-between mb-12">
             <div className="flex gap-4">
               <button 
                 onClick={prevSlide}
                 className="w-12 h-12 rounded-full border border-white/5 bg-white/5 flex items-center justify-center text-white hover:bg-white/10 hover:border-[var(--brand)]/30 transition-all"
               >
                 <ChevronLeft className="w-5 h-5" />
               </button>
               <button 
                 onClick={nextSlide}
                 className="w-12 h-12 rounded-full border border-white/5 bg-white/5 flex items-center justify-center text-white hover:bg-white/10 hover:border-[var(--brand)]/30 transition-all"
               >
                 <ChevronRight className="w-5 h-5" />
               </button>
             </div>
             <div className="hidden md:flex items-center gap-4">
                <div className="h-px w-24 bg-gradient-to-r from-[var(--brand)]/50 to-transparent" />
                <span className="text-[10px] font-bold text-white/20 tracking-widest uppercase">Live Transmission</span>
             </div>
          </div>

          <div className="overflow-hidden">
            <motion.div 
              className="flex gap-6"
              animate={{ x: `calc(-${index * 100}% / 3)` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {reviews.map((rev, i) => (
                <div 
                  key={rev.id || i}
                  className="min-w-full sm:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)]"
                >
                  <div className="glass-card p-8 md:p-10 border-white/5 backdrop-blur-2xl h-full flex flex-col justify-between group hover:border-[var(--brand)]/20 transition-all duration-700">
                    <div>
                      <div className="flex gap-1 mb-6">
                        {Array.from({ length: rev.rating || 5 }).map((_, j) => (
                          <Star key={`star-${rev.id || i}-${j}`} className="w-3.5 h-3.5 text-[var(--brand)] fill-[var(--brand)]" />
                        ))}
                      </div>
                      <blockquote className="text-white text-base md:text-lg font-medium leading-relaxed mb-8 opacity-80 line-clamp-4">
                        "{rev.text}"
                      </blockquote>
                    </div>

                    <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-[var(--brand)]/10 flex items-center justify-center text-[var(--brand)] font-black text-sm border border-[var(--brand)]/20">
                          {rev.name?.charAt(0) || "U"}
                        </div>
                        {rev.is_verified !== false && (
                          <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-0.5 border border-white/10">
                            <CheckCircle2 className="w-3 h-3 text-[var(--brand)]" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-white font-bold text-xs md:text-sm flex items-center gap-2">
                          {rev.name}
                        </div>
                        <div className="text-[8px] uppercase tracking-[0.2em] font-medium opacity-30">{rev.role || "Elite Trader"}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="mt-16 flex justify-center gap-2">
          {Array.from({ length: Math.ceil(reviews.length / 3) }).map((_, i) => {
            const firstReviewOnPage = reviews[i * 3];
            return (
              <button
                key={`nav-dot-${firstReviewOnPage?.id || i}`}
              onClick={() => setIndex(i)}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === index ? "w-10 bg-[var(--brand)]" : "w-2 bg-white/10"
              }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
