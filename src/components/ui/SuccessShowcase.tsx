import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchReviews } from "../../services/reviewService";

export const SuccessShowcase = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetchReviews().then(data => {
      if (data && data.length > 0) {
        setReviews(data);
      } else {
        // Fallback robust mock data if DB connection is empty
        setReviews([
          { id: 1, name: "Alexander V.", text: "The execution speed is unmatched. Institutional grade signals that actually hit.", role: "Prop Trader", rating: 5 },
          { id: 2, name: "Sarah K.", text: "Finally, a platform that respects retail traders with elite-level datasets.", role: "Quant Analyst", rating: 5 },
          { id: 3, name: "Marcus L.", text: "Their gold algorithms have completely changed my portfolio ROI.", role: "Private Equities", rating: 5 },
          { id: 4, name: "Chen W.", text: "High-frequency precision delivered with a clean, professional interface.", role: "Hedge Fund Manager", rating: 5 },
          { id: 5, name: "Elena G.", text: "Best Forex signals I've found in 10 years of trading. Pure quality.", role: "Day Trader", rating: 5 }
        ]);
      }
    });
  }, []);

  const nextSlide = () => setIndex((prev) => (prev + 1) % reviews.length);
  const prevSlide = () => setIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

  const onDragEnd = (event: any, info: any) => {
    const shift = info.offset.x;
    if (shift < -50) nextSlide();
    else if (shift > 50) prevSlide();
  };

  if (reviews.length === 0) return null;

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-black/10">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[var(--brand)]/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <div className="mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <span className="text-[var(--brand)] font-bold text-[9px] uppercase tracking-[0.4em] mb-4 inline-block opacity-50">Global Audit</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tighter leading-none">
              Institutional <span className="italic font-serif text-[var(--brand)]">Sentiment</span>
            </h2>
          </motion.div>
        </div>

        <div className="relative group/carousel max-w-5xl mx-auto">
          {/* Truly Swipeable Area */}
          <div className="overflow-visible cursor-grab active:cursor-grabbing">
            <motion.div 
              className="flex gap-4 items-stretch"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={onDragEnd}
              animate={{ 
                x: `calc(-${index} * (100% / (window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1)))` 
              }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            >
              {reviews.map((rev, i) => (
                <motion.div 
                  key={rev.id || i}
                  className="min-w-[100%] sm:min-w-[calc(50%-8px)] lg:min-w-[calc(33.333%-11px)] flex"
                  animate={{ 
                    opacity: i === index || (window.innerWidth >= 1024 && (i === index+1 || i === index+2)) ? 1 : 0.3,
                    scale: i === index ? 1 : 0.95,
                  }}
                >
                  <div className="glass-card p-6 md:p-8 border-white/5 backdrop-blur-2xl h-full flex flex-col justify-between group/card hover:border-[var(--brand)]/20 transition-all duration-700 w-full text-left">
                    <div>
                      <div className="flex gap-1 mb-6">
                        {Array.from({ length: rev.rating || 5 }).map((_, j) => (
                          <Star key={`star-${rev.id || i}-${j}`} className="w-3 h-3 text-[var(--brand)] fill-[var(--brand)]" />
                        ))}
                      </div>
                      <blockquote className="text-white text-sm md:text-base font-medium leading-relaxed mb-8 opacity-80 line-clamp-4 italic">
                        "{rev.text}"
                      </blockquote>
                    </div>

                    <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-[var(--brand)] font-black text-sm border border-white/10">
                        {rev.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <div className="text-white font-bold text-xs tracking-tight">{rev.name}</div>
                        <div className="text-[8px] uppercase tracking-[0.2em] font-medium opacity-30 text-[var(--brand)]">{rev.role || "Trader"}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Optimized Slim Navigation */}
          <div className="mt-8 flex items-center justify-center gap-6">
            <button onClick={prevSlide} className="w-10 h-10 rounded-full border border-white/5 bg-white/5 flex items-center justify-center text-white hover:border-[var(--brand)]/30 transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex gap-1.5">
              {reviews.slice(0, Math.ceil(reviews.length / (window.innerWidth >= 1024 ? 3 : 1))).map((_, i) => (
                <button
                  key={`dot-page-${i}`}
                  onClick={() => setIndex(i * (window.innerWidth >= 1024 ? 3 : 1))}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    Math.floor(index / (window.innerWidth >= 1024 ? 3 : 1)) === i ? "w-8 bg-[var(--brand)]" : "w-1.5 bg-white/10"
                  }`}
                />
              ))}
            </div>

            <button onClick={nextSlide} className="w-10 h-10 rounded-full border border-white/5 bg-white/5 flex items-center justify-center text-white hover:border-[var(--brand)]/30 transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
