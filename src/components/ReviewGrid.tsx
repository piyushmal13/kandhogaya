import React from "react";
import { Star, User, Globe, Quote } from "lucide-react";
import { useReviews } from "../hooks/useReviews";
import { cn } from "../utils/cn";

/**
 * Public Sentiment Grid - Institutional Social Proof
 * Displays ONLY 'approved' sentiment data.
 */
export const PublicReviews = () => {
  const { reviews, loading } = useReviews('approved');

  if (loading) return (
     <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
        {[1,2,3].map(i => <div key={i} className="h-64 bg-white/5 rounded-[40px] border border-white/10" />)}
     </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {reviews.map((r, i) => (
        <div key={r.id} className="bg-zinc-900/50 backdrop-blur-3xl border border-white/5 p-10 rounded-[48px] group hover:border-amber-500/30 transition-all duration-700 relative overflow-hidden">
          {/* Executive Quote Decoration */}
          <div className="absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Quote className="w-20 h-20 text-amber-500" />
          </div>

          <div className="flex items-center gap-2 mb-6">
            {Array(r.rating).fill('★').join('')}
            <span className="text-[10px] font-black text-amber-500 tracking-widest">{r.rating}/5 RATING</span>
          </div>

          <p className="text-gray-400 text-sm font-medium leading-relaxed italic mb-8">
            "{r.text}"
          </p>

          <div className="flex items-center gap-4 border-t border-white/5 pt-8">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500 shadow-inner">
               <User className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white italic tracking-tight">{r.name}</h4>
              <div className="flex items-center gap-3 mt-1 text-[8px] font-black uppercase tracking-[0.2em] text-gray-600">
                <span>{r.role || "Elite Trader"}</span>
                <span className="w-1 h-1 rounded-full bg-gray-700" />
                <span className="flex items-center gap-1">
                   <Globe className="w-2 h-2" />
                   {r.region || 'GLOBAL'}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
