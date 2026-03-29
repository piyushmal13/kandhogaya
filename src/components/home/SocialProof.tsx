import React from "react";
import { motion } from "motion/react";
import { Star, Verified } from "lucide-react";

// Institutional Tone Social Proof
const REVIEWS = [
  { name: "James Carter", role: "Prop Firm Trader", text: "The Gold Algo Masterclass completely shifted my execution style. Institutional mechanics broken down perfectly.", location: "Dubai, UAE" },
  { name: "Aarav Sharma", role: "HNWI Portfolio Manager", text: "IFX Trades delivers unmatched macro research. Their algorithmic framework is world-class.", location: "Mumbai, India" },
  { name: "Michael T.", role: "Independent Algo", text: "Finally, an education platform that doesn't feel like a retail broker. Pure quantitative execution.", location: "London, UK" },
  { name: "Elena R.", role: "Forex Fund Analyst", text: "The deep dive into XAUUSD market micro-structure is exactly what our junior traders needed.", location: "Singapore" },
];

export const SocialProof = () => (
   <section className="py-24 relative overflow-hidden bg-[#020202] border-y border-white/5">
     <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.02),transparent_70%)]" />
     
     <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-16 text-center relative z-10">
       <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6">
         <Star className="w-3 h-3 text-emerald-500 fill-emerald-500" />
         <span className="text-[10px] uppercase font-bold text-emerald-500 tracking-widest">Global Trust Engine</span>
       </div>
       <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tight mb-4">
         Rated <span className="text-emerald-500">4.9/5</span> by <br className="md:hidden" />10k+ Elite Traders
       </h2>
       
       <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
           {/* Trustpilot Native Placeholder */}
           <div className="h-10 px-6 rounded border border-white/10 bg-white/5 flex items-center gap-2 text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">
              [ Embed Trustpilot Widget Here ]
           </div>
           {/* Google Reviews Native Placeholder */}
           <div className="h-10 px-6 rounded border border-white/10 bg-white/5 flex items-center gap-2 text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">
              [ Embed Google Reviews Widget Here ]
           </div>
       </div>
     </div>

     {/* Marquee Row */}
     <div className="relative w-full overflow-hidden flex pt-8">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#020202] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#020202] to-transparent z-10 pointer-events-none" />

        <motion.div
           animate={{ x: ["0%", "-50%"] }}
           transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
           className="flex gap-6 w-max px-6"
        >
           {[...REVIEWS, ...REVIEWS].map((review, i) => (
              <div key={i} className="w-[350px] md:w-[450px] shrink-0 bg-[#050505] border border-white/5 rounded-[32px] p-8 relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-500">
                 <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 
                 <div className="flex items-center justify-between mb-6">
                    <div className="flex text-emerald-500">
                      {[1, 2, 3, 4, 5].map((star) => <Star key={star} className="w-4 h-4 fill-current" />)}
                    </div>
                    <Verified className="w-5 h-5 text-blue-400 opacity-80" />
                 </div>
                 
                 <p className="text-sm md:text-base text-gray-400 font-sans font-medium italic leading-relaxed mb-8">
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
