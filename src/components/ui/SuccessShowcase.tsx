import React, { useState, useEffect } from "react";
import { motion, useMotionValue } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchReviews } from "../../services/reviewService";

export const SuccessShowcase = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const x = useMotionValue(0);

  useEffect(() => {
    fetchReviews().then(data => {
      if (data && data.length > 0) {
        setReviews(data);
      }
    });
  }, []);

  const nextSlide = () => setIndex((prev) => (prev + 1) % reviews.length);
  const prevSlide = () => setIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

  const onDragEnd = (event: any, info: any) => {
    const shift = info.offset.x;
    if (shift < -50) {
       nextSlide();
    } else if (shift > 50) {
       prevSlide();
    }
  };

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

        <div className="relative group/carousel px-4">
          {/* Main Display Area */}
          <div className="overflow-visible cursor-grab active:cursor-grabbing">
            <motion.div 
              className="flex gap-4 md:gap-8 items-stretch"
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
                  className="min-w-[100%] sm:min-w-[calc(50%-16px)] lg:min-w-[calc(33.333%-22px)] flex"
                  initial={false}
                  animate={{ 
                    opacity: 1,
                    scale: i === index ? 1 : 0.95,
                    filter: i === index ? "blur(0px)" : "blur(1px)"
                  }}
                >
                  <div className="glass-card p-8 md:p-12 border-white/5 backdrop-blur-3xl h-full flex flex-col justify-between group/card hover:border-[var(--brand)]/20 transition-all duration-700 w-full text-left">
                    <div>
                      <div className="flex gap-1 mb-8">
                        {Array.from({ length: rev.rating || 5 }).map((_, j) => (
                          <Star key={`star-${rev.id || i}-${j}`} className="w-4 h-4 text-[var(--brand)] fill-[var(--brand)]" />
                        ))}
                      </div>
                      <blockquote className="text-white text-base md:text-xl font-medium leading-relaxed mb-12 opacity-80 line-clamp-6 italic font-serif">
                        "{rev.text}"
                      </blockquote>
                    </div>

                    <div className="flex items-center gap-5 pt-8 border-t border-white/5">
                      <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center text-[var(--brand)] font-black text-xl border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                        {rev.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <div className="text-white font-bold text-sm md:text-lg tracking-tight">{rev.name}</div>
                        <div className="text-[10px] uppercase tracking-[0.2em] font-medium opacity-30 text-[var(--brand)]">{rev.role || "Elite Trader"}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Navigation Controls */}
          <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-12">
            <div className="flex gap-4">
               <button onClick={prevSlide} className="w-14 h-14 rounded-full border border-white/5 bg-white/10 flex items-center justify-center text-white hover:border-[var(--brand)]/30 hover:bg-white/15 transition-all shadow-xl backdrop-blur-md">
                 <ChevronLeft className="w-6 h-6" />
               </button>
               <button onClick={nextSlide} className="w-14 h-14 rounded-full border border-white/5 bg-white/10 flex items-center justify-center text-white hover:border-[var(--brand)]/30 hover:bg-white/15 transition-all shadow-xl backdrop-blur-md">
                 <ChevronRight className="w-6 h-6" />
               </button>
            </div>

            <div className="flex flex-wrap justify-center gap-2 max-w-xl">
              {reviews.map((rev, i) => (
                <button
                  key={`dot-nav-${rev.id || i}`}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-700 ${
                    i === index ? "w-12 bg-[var(--brand)] shadow-[0_0_15px_var(--brand-glow)]" : "w-1.5 bg-white/10 hover:bg-white/30"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
