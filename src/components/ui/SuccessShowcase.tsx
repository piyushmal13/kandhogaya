import React, { useState, useEffect, useRef } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchReviews } from "../../services/reviewService";

export const SuccessShowcase = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchReviews().then(data => {
      if (data && data.length > 0) {
        setReviews(data);
      } else {
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

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (reviews.length === 0) return null;

  return (
    <section className="py-20 md:py-32 relative overflow-hidden bg-black/40">
      {/* Institutional Glow Backdrop */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[var(--brand)]/10 blur-[130px] rounded-full pointer-events-none opacity-40" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <div className="mb-12 md:mb-20">
            <span className="text-[var(--brand)] font-bold text-[10px] uppercase tracking-[0.5em] mb-4 inline-block opacity-60">Global Success Audit</span>
            <h2 className="text-4xl md:text-7xl font-bold text-white mb-6 tracking-tighter leading-none">
              Institutional <span className="italic font-serif text-[var(--brand)]">Sentiment</span>
            </h2>
            <p className="max-w-2xl mx-auto text-[10px] md:text-sm font-medium tracking-[0.2em] opacity-30 uppercase">
              Real-time intelligence from 12,000+ active quantitative nodes.
            </p>
        </div>

        {/* --- High-Fidelity Native Swipe Carousel --- */}
        <div className="relative group">
          {/* Custom Navigation */}
          <div className="absolute top-1/2 -left-4 -translate-y-1/2 z-20 hidden md:block">
            <button onClick={() => scroll('left')} className="w-14 h-14 rounded-full border border-white/5 bg-black/50 backdrop-blur-3xl flex items-center justify-center text-white hover:border-[var(--brand)]/40 transition-all shadow-2xl">
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
          <div className="absolute top-1/2 -right-4 -translate-y-1/2 z-20 hidden md:block">
            <button onClick={() => scroll('right')} className="w-14 h-14 rounded-full border border-white/5 bg-black/50 backdrop-blur-3xl flex items-center justify-center text-white hover:border-[var(--brand)]/40 transition-all shadow-2xl">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Swipeable Container using Native CSS Snapping */}
          <div 
            ref={scrollRef}
            className="flex gap-4 md:gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-12 px-2 mask-linear-edges"
            style={{ 
              msOverflowStyle: 'none', 
              scrollbarWidth: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {reviews.map((rev, i) => (
              <div 
                key={rev.id || i}
                className="min-w-[85%] sm:min-w-[400px] lg:min-w-[450px] snap-center flex-shrink-0"
              >
                <div className="glass-card p-8 md:p-12 border-white/5 backdrop-blur-3xl h-full flex flex-col justify-between group/card hover:border-[var(--brand)]/20 transition-all duration-1000 bg-white/[0.02] rounded-3xl">
                  <div>
                    <div className="flex gap-1.5 mb-8">
                      {Array.from({ length: rev.rating || 5 }).map((_, j) => (
                        <Star key={`star-${rev.id || i}-${j}`} className="w-3.5 h-3.5 text-[var(--brand)] fill-[var(--brand)]" />
                      ))}
                    </div>
                    <blockquote className="text-white text-base md:text-2xl font-medium leading-relaxed mb-12 opacity-90 text-left italic font-serif tracking-tight">
                      "{rev.text}"
                    </blockquote>
                  </div>

                  <div className="flex items-center gap-5 pt-10 border-t border-white/5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center text-[var(--brand)] font-black text-2xl border border-white/10 shadow-inner">
                      {rev.name?.charAt(0) || "U"}
                    </div>
                    <div className="text-left">
                      <div className="text-white font-bold text-base md:text-xl tracking-tighter">{rev.name}</div>
                      <div className="text-[10px] uppercase tracking-[0.25em] font-bold opacity-30 text-[var(--brand)]">{rev.role || "Elite Trader"}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Institutional Scroll Progress Visualizer */}
          <div className="mt-8 h-1 w-full max-w-[200px] mx-auto bg-white/5 rounded-full overflow-hidden relative">
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--brand)] to-transparent w-1/3 animate-shimmer" />
          </div>
        </div>
      </div>

      <style>{`
        .mask-linear-edges {
          mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }
        @keyframes shimmer {
          from { transform: translateX(-100%); }
          to { transform: translateX(300%); }
        }
        .animate-shimmer {
          animation: shimmer 5s infinite linear;
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};
