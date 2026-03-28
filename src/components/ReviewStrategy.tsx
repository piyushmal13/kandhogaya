import React from "react";
import { useReviews } from "../hooks/useReviews";
import { Star, Quote, ChevronRight } from "lucide-react";
import { cn } from "../utils/cn";

/**
 * Institutional Perspective Layouts
 * Conversion-engineered rendering based on page intent.
 */

// 1. Hero Strategy: High-Density Social Proof
export const HeroSentimentGrid = () => {
  const { reviews } = useReviews('approved');
  const topReviews = reviews.slice(0, 3); // Top 3 by priority

  return (
    <div className="flex flex-col md:flex-row gap-6 mt-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {topReviews.map((r, i) => (
        <div key={r.id} className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl group hover:border-amber-500/30 transition-all flex-1">
           <div className="flex gap-0.5 mb-3">
             {new Array(r.rating).fill(0).map((_, i) => <Star key={i} className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />)}
           </div>
           <p className="text-gray-400 text-[10px] font-black uppercase tracking-tight italic leading-relaxed mb-4 line-clamp-2">"{r.text}"</p>
           <span className="text-white text-[9px] font-black uppercase tracking-widest">— {r.name}</span>
        </div>
      ))}
    </div>
  );
};

// 2. Pricing Strategy: Reassurance & Trust Signals
export const PricingReviewTape = () => {
  const { reviews } = useReviews('approved');
  // Logic: Only 5-star reviews with high priority
  const conversionReviews = reviews.filter(r => r.rating === 5).slice(0, 5);

  return (
    <div className="space-y-4">
      <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-6 text-center italic font-bold">Verified Institution Trust Signals</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {conversionReviews.map(r => (
          <div key={r.id} className="bg-black/40 border border-white/5 p-4 rounded-2xl flex items-start gap-4 hover:border-emerald-500/20 transition-all">
             <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-500 shrink-0">
                <Quote className="w-5 h-5" />
             </div>
             <div>
                <p className="text-gray-400 text-[11px] italic font-medium leading-tight mb-2">"{r.text}"</p>
                <span className="text-[9px] font-black text-white italic uppercase tracking-widest">{r.name}</span>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 3. Schema Markup: SEO Intelligence
export const ReviewSchema = () => {
  const { reviews, metrics } = useReviews('approved');
  
  if (!metrics || reviews.length === 0) return null;

  const schema = {
    "@context": "https://schema.org/",
    "@type": "AggregateRating",
    "itemReviewed": {
      "@type": "SoftwareApplication",
      "name": "IFX Trades",
      "applicationCategory": "Fintech"
    },
    "ratingValue": metrics.avg_rating,
    "reviewCount": metrics.total_signals,
    "bestRating": "5",
    "worstRating": "1"
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
};
