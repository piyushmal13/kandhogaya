import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, CheckCircle2, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchReviews } from "../../services/reviewService";

export const SuccessShowcase = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    fetchReviews().then(data => {
      if (data && data.length > 0) {
        setReviews(data);
      }
    });
  }, []);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
      filter: "blur(10px)",
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
      filter: "blur(10px)",
    }),
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setIndex((prev) => (prev + newDirection + reviews.length) % reviews.length);
  };

  if (reviews.length === 0) return null;

  const currentReview = reviews[index];

  return (
    <section className="py-24 md:py-48 relative overflow-hidden bg-black/40">
      {/* Dynamic Background Effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[var(--brand)]/5 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 md:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[var(--brand)] font-bold text-[10px] md:text-xs uppercase tracking-[0.5em] mb-6 inline-block opacity-80">Institutional Validation</span>
            <h2 className="text-4xl md:text-8xl font-black text-white mb-10 tracking-tighter leading-[0.9] uppercase">
              The Protocol <br/> <span className="italic font-serif text-[var(--brand)] opacity-80">Verified</span>
            </h2>
            <p className="max-w-2xl mx-auto text-sm md:text-xl font-medium tracking-tight opacity-40 uppercase" style={{ color: 'var(--text-muted)' }}>
              Cross-referenced performance audits and real-time execution feedback from our elite global user base.
            </p>
          </motion.div>
        </div>

        {/* Main Slider Area */}
        <div className="relative max-w-5xl mx-auto min-h-[450px] md:min-h-[550px] flex items-center justify-center">
          
          {/* Navigation Controls */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between z-30 px-2 md:-mx-20">
            <button 
              onClick={() => paginate(-1)}
              className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/10 bg-white/5 backdrop-blur-3xl flex items-center justify-center text-white hover:bg-white/10 hover:border-[var(--brand)]/30 hover:scale-110 transition-all duration-500 group"
            >
              <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 group-hover:-translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => paginate(1)}
              className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/10 bg-white/5 backdrop-blur-3xl flex items-center justify-center text-white hover:bg-white/10 hover:border-[var(--brand)]/30 hover:scale-110 transition-all duration-500 group"
            >
              <ChevronRight className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={index}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.6 },
                scale: { duration: 0.6 },
                filter: { duration: 0.6 }
              }}
              className="w-full absolute"
            >
              <div className="glass-card relative p-10 md:p-20 border-white/5 backdrop-blur-3xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)] group">
                {/* Visual Motif */}
                <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Quote className="w-40 h-40 md:w-60 md:h-60 text-[var(--brand)]" />
                </div>

                <div className="relative z-10">
                  <div className="flex gap-2 mb-10 md:mb-14 justify-center md:justify-start">
                    {Array.from({ length: currentReview.rating || 5 }).map((_, j) => (
                      <Star key={`star-${currentReview.id || currentReview.name}-${j}`} className="w-5 h-5 md:w-7 md:h-7 text-[var(--brand)] fill-[var(--brand)] shadow-[0_0_20px_var(--brand-glow)]" />
                    ))}
                  </div>

                  <blockquote className="text-white text-2xl md:text-5xl font-medium leading-[1.2] mb-12 md:mb-20 tracking-tight italic text-center md:text-left">
                    "{currentReview.text}"
                  </blockquote>

                  <div className="flex flex-col md:flex-row items-center gap-6 pt-10 md:pt-12 border-t border-white/5">
                    <div className="relative">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[var(--brand)]/10 flex items-center justify-center text-[var(--brand)] font-black text-2xl md:text-3xl border border-[var(--brand)]/30 shadow-[0_0_30px_var(--brand-glow-subtle)]">
                        {currentReview.name?.charAt(0) || "U"}
                      </div>
                      {currentReview.is_verified !== false && (
                        <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-1 border border-white/10">
                          <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-[var(--brand)]" />
                        </div>
                      )}
                    </div>
                    <div className="text-center md:text-left">
                      <div className="text-white font-black text-lg md:text-2xl flex items-center gap-3 justify-center md:justify-start uppercase tracking-widest leading-none mb-2">
                        {currentReview.name}
                        {currentReview.is_verified !== false && (
                          <span className="text-[10px] md:text-xs text-[var(--brand)]/80 font-black tracking-[0.3em] bg-[var(--brand)]/10 px-3 py-1 rounded-full">CORE VERIFIED</span>
                        )}
                      </div>
                      <div className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold opacity-40 text-[var(--text-muted)]">{currentReview.role || "INSTITUTIONAL TRADER"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress Dots */}
        <div className="mt-16 md:mt-24 flex justify-center gap-3">
          {reviews.slice(0, 8).map((rev, i) => (
            <button
              key={`dot-${rev.id || i}`}
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              className={`h-1.5 md:h-2 rounded-full transition-all duration-700 ${
                i === index ? "w-8 md:w-16 bg-[var(--brand)] shadow-[0_0_15px_var(--brand-glow)]" : "w-1.5 md:w-2 bg-white/10 hover:bg-white/30"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
