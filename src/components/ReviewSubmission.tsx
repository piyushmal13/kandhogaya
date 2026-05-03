import React, { useState } from "react";
import { Star, Send, ShieldCheck, Mail, User, Globe } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useRateLimit } from "../hooks/useRateLimit";
import { reviewService } from "../services/admin/reviewService";
import { cn } from "../utils/cn";

/**
 * Review Submission - Institutional Reputation Acquisition
 * Enforces Rate Limiting and 'pending' status.
 */
export const ReviewSubmission = () => {
  const { userProfile } = useAuth();
  const { isLimited, executeSafe } = useRateLimit(60000); // 1 minute throttle
  
  const [name, setName] = useState(userProfile?.full_name || "");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile?.id) return alert("Discovery requires authentication.");

    executeSafe(async () => {
      setLoading(true);
      const ok = await reviewService.submitReview({
        user_id: userProfile.id,
        name,
        rating,
        text,
        region: "Global Discovery", // Initial acquisition region
        source: "web"
      });

      if (ok) {
        setSuccess(true);
        setText("");
      }
      setLoading(false);
    });
  };

  if (success) return (
     <div className="bg-emerald-500/10 border border-emerald-500/20 p-10 rounded-[48px] animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="w-16 h-16 bg-emerald-500 text-black rounded-[24px] flex items-center justify-center mx-auto mb-6">
           <ShieldCheck className="w-8 h-8 font-black" />
        </div>
        <h3 className="text-xl font-black text-white text-center uppercase tracking-tighter italic">Feedback Acknowledged</h3>
        <p className="text-[10px] text-emerald-500 text-center font-black uppercase tracking-widest mt-4">Awaiting Institutional Moderation Audit</p>
     </div>
  );

  return (
    <div className="bg-zinc-900 border border-white/5 p-10 rounded-[48px] shadow-2xl relative overflow-hidden group">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-4 bg-amber-500/10 rounded-24 flex items-center justify-center text-amber-500">
          <Send className="w-6 h-6 rotate-45" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Protocol Feedback</h3>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Institutional Feedback Channel</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 px-1">Institutional Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-amber-500 transition-colors" />
                <input 
                  type="text" value={name} onChange={(e) => setName(e.target.value)} required
                  className="w-full bg-black border border-white/5 focus:border-amber-500/50 rounded-2xl p-4 pl-12 text-white text-sm outline-none transition-all placeholder:text-gray-800"
                  placeholder="Master Trader"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-1 italic">Discovery Quality</label>
              <div className="flex gap-2">
                {[1,2,3,4,5].map(r => (
                  <button 
                    key={r} type="button" onClick={() => setRating(r)}
                    className={cn(
                      "flex-1 p-3 rounded-xl border transition-all text-[11px] font-black italic",
                      rating >= r ? "border-amber-500 bg-amber-500 text-black shadow-lg shadow-amber-500/20" : "border-white/5 bg-black text-gray-600 hover:border-amber-500/30"
                    )}
                  >
                    {r} ★
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 px-1 italic">Detailed Sentiment Content</label>
              <textarea 
                value={text} onChange={(e) => setText(e.target.value)} required rows={4}
                className="w-full bg-black border border-white/5 focus:border-amber-500/50 rounded-2xl p-4 text-white text-sm outline-none transition-all resize-none h-[116px] placeholder:text-gray-800"
                placeholder="Institutional discovery results are stable..."
              />
            </div>
          </div>
        </div>

        <button 
          type="submit" disabled={loading || isLimited}
          className="w-full py-5 bg-amber-500 hover:bg-amber-400 text-black font-black text-[11px] uppercase tracking-[0.3em] rounded-24 shadow-2xl shadow-amber-500/10 transition-all disabled:opacity-50 group flex items-center justify-center gap-3 italic"
        >
          {loading ? "Discovering..." : isLimited ? "Cooldown Active" : "Submit Feedback"}
          <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </form>
    </div>
  );
};
