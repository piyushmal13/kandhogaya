import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
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

  const onDragEnd = (event: any, info: any) => {
    const shift = info.offset.x;
    if (shift < -50) {
      setIndex(prev => Math.min(prev + 1, reviews.length - 1));
    } else if (shift > 50) {
      setIndex(prev => Math.max(prev - 1, 0));
    }
  };

  const nextSlide = () => setIndex((prev) => (prev + 1) % reviews.length);
  const prevSlide = () => setIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

  if (reviews.length === 0) return null;

  return (
    <section className="py-24 md:py-40 relative overflow-hidden bg-black/20">
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[var(--brand)]/5 rounded-full blur-[140px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <div className="mb-16 md:mb-24">
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

        <div className="relative group/carousel">
          <div className="flex items-center justify-between mb-8 px-4">
             <div className="flex gap-4">
               <button onClick={prevSlide} className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/5 bg-white/5 flex items-center justify-center text-white hover:border-[var(--brand)]/30 transition-all focus:outline-none">
                 <ChevronLeft className="w-5 h-5" />
               </button>
               <button onClick={nextSlide} className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/5 bg-white/5 flex items-center justify-center text-white hover:border-[var(--brand)]/30 transition-all focus:outline-none">
                 <ChevronRight className="w-5 h-5" />
               </button>
             </div>
          </div>

          <div className="overflow-visible cursor-grab active:cursor-grabbing">
            <motion.div 
              className="flex gap-4 md:gap-6"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={onDragEnd}
              animate={{ x: `calc(-${index} * (100% / (window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1.15)))` }}
              transition={{ type: "spring", stiffness: 300, damping: 35 }}
            >
              {reviews.map((rev, i) => (
                <motion.div 
                  key={rev.id || i}
                  className="min-w-[85%] sm:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)]"
                  animate={{ opacity: Math.abs(index - i) < 3 ? 1 : 0.2, scale: index === i ? 1 : 0.95 }}
                >
                  <div className="glass-card p-6 md:p-10 border-white/5 backdrop-blur-3xl h-full flex flex-col justify-between group/card hover:border-[var(--brand)]/20 transition-all duration-700">
                    <div>
                      <div className="flex gap-1 mb-6">
                        {Array.from({ length: rev.rating || 5 }).map((_, j) => (
                          <Star key={`star-${rev.id || i}-${j}`} className="w-3.5 h-3.5 text-[var(--brand)] fill-[var(--brand)]" />
                        ))}
                      </div>
                      <blockquote className="text-white text-sm md:text-lg font-medium leading-relaxed mb-8 opacity-80 text-left line-clamp-4">
                        "{rev.text}"
                      </blockquote>
                    </div>

                    <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                      <div className="w-10 h-10 rounded-full bg-[var(--brand)]/10 flex items-center justify-center text-[var(--brand)] font-black text-sm border border-[var(--brand)]/20 shadow-[0_0_15px_var(--brand-glow-subtle)]">
                        {rev.name?.charAt(0) || "U"}
                      </div>
                      <div className="text-left">
                        <div className="text-white font-bold text-xs md:text-sm">{rev.name}</div>
                        <div className="text-[8px] uppercase tracking-[0.2em] font-medium opacity-30">{rev.role || "Elite Trader"}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="mt-12 flex justify-center flex-wrap gap-1.5 px-4">
            {reviews.map((rev, i) => (
              <button
                key={`dot-nav-${rev.id || i}`}
                onClick={() => setIndex(i)}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === index ? "w-8 bg-[var(--brand)]" : "w-1.5 bg-white/10 hover:bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
