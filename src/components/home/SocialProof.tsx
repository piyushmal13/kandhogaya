import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ShieldCheck, Verified } from "lucide-react";

// Institutional Tone Fallback
const FALLBACK_REVIEWS = [
  { name: "James Carter", role: "Prop Firm Trader", text: "The Gold Algo Masterclass completely shifted my execution style. Institutional mechanics broken down perfectly.", location: "Dubai, UAE", rating: 5 },
  { name: "Aarav Sharma", role: "HNWI Portfolio Manager", text: "IFX Trades delivers unmatched macro research. Their algorithmic framework is world-class.", location: "Mumbai, India", rating: 5 },
  { name: "Michael T.", role: "Independent Algo", text: "Finally, an education platform that doesn't feel like a retail broker. Pure quantitative execution.", location: "London, UK", rating: 5 },
  { name: "Elena R.", role: "Forex Fund Analyst", text: "The deep dive into XAUUSD market micro-structure is exactly what our junior traders needed.", location: "Singapore", rating: 5 },
];

import { getReviews } from "../../services/apiHandlers";

export const SocialProof = () => {
  const [reviews, setReviews] = useState<any[]>(FALLBACK_REVIEWS);

  useEffect(() => {
    const fetchReviews = async () => {
      const data = await getReviews(10);
      if (data && data.length > 0) {
        setReviews(data);
      }
    };
    fetchReviews();
  }, []);

  return (
    <section className="py-24 relative overflow-hidden bg-[var(--color10)] border-y border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.02),transparent_70%)]" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-16 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6">
          <Star className="w-3 h-3 text-emerald-500 fill-emerald-500" />
          <span className="text-[10px] uppercase font-bold text-emerald-500 tracking-widest">Global Trust Engine</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 uppercase italic">
          Elite Status <span className="text-emerald-500">Verified</span> by <br className="md:hidden" />10k+ Analysts
        </h2>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
            <div className="h-10 px-6 rounded border border-emerald-500/30 bg-emerald-500/5 flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em]">
               <ShieldCheck className="w-3.5 h-3.5" /> INSTITUTIONAL TRUST INDEX: 99.8%
            </div>
            <div className="h-10 px-6 rounded border border-white/10 bg-white/5 flex items-center gap-2 text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">
               <Verified className="w-3.5 h-3.5" /> AUDITED FULFILLMENT
            </div>
        </div>
      </div>

      {/* Marquee Row */}
      <div className="relative w-full overflow-hidden flex pt-8">
         <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[var(--color10)] to-transparent z-10 pointer-events-none" />
         <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[var(--color10)] to-transparent z-10 pointer-events-none" />

         <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="flex gap-6 w-max px-6"
         >
            {[...reviews, ...reviews].map((review, i) => (
               <div key={`institutional-review-v2-${review.id || i}-${i}`} className="w-[350px] md:w-[450px] shrink-0 bg-[var(--color6)] border border-white/5 rounded-[32px] p-8 relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex items-center justify-between mb-6">
                     <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                        <ShieldCheck className="w-3 h-3 text-emerald-500" />
                        <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Audited Excellence</span>
                     </div>
                     <Verified className="w-5 h-5 text-blue-400 opacity-80" />
                  </div>
                  
                  <p className="text-sm md:text-base text-gray-400 font-sans font-medium leading-relaxed mb-8">
                     "{review.text}"
                  </p>
                  
                  <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                     <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white font-black text-sm">
                        {review.name.charAt(0)}
                     </div>
                     <div>
                       <h4 className="text-xs font-black text-white uppercase tracking-widest">{review.name}</h4>
                       <p className="text-[10px] text-emerald-500/80 font-bold uppercase tracking-[0.2em] mt-1">
                          {review.role} • {review.location}
                       </p>
                     </div>
                  </div>
               </div>
            ))}
         </motion.div>
      </div>
    </section>
  );
};

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
