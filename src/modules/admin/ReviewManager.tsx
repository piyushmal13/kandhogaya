import React, { useState } from "react";
import { 
  Star, Trash2, Globe, CheckCircle, XCircle, 
  ChevronLeft, ChevronRight, Activity,
  ShieldOff, TrendingUp, TrendingDown, CheckSquare, Flag, Square
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useReviews } from "../../hooks/useReviews";
import { cn } from "../../utils/cn";
import { Dialog } from "../../components/ui/Dialog";

/**
 * Reputation Intelligence Hub - Institutional Administration
 * High-Stakes Logic: Sentiment Discovery -> Intelligence -> Moderation.
 */
export const ReviewManager = () => {
  const { userProfile } = useAuth();
  const { 
    reviews, loading, metrics, page, 
    status, rating, selectedIds,
    setSelectedIds, setStatus, setRating, 
    fetchPage, approve, bulkAction, delete: deleteReview, 
    reject
  } = useReviews();

  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [reviewToReject, setReviewToReject] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'approved': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'rejected': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'hidden': return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
      default: return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleApprove = async (id: string) => {
    if (!userProfile?.id) return;
    await approve(id, userProfile.id);
  };

  const handleReject = async () => {
    if (!userProfile?.id || !reviewToReject) return;
    await reject(reviewToReject, rejectionReason, userProfile.id);
    setIsRejectDialogOpen(false);
    setReviewToReject(null);
    setRejectionReason("");
  };

  const handleBulkApprove = async () => {
    if (!userProfile?.id) return;
    await bulkAction('approved', userProfile.id);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      
      {/* 1. Reputation Intelligence Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Confidence Score", value: metrics?.avg_rating || "—", trait: "ELITE", icon: Star, color: "text-amber-500" },
          { label: "Approval Delta", value: metrics?.approval_rate || "—", trait: "STABLE", icon: Activity, color: "text-emerald-500" },
          { label: "Fraud Discovery", value: reviews.filter(r => r.flagged).length, trait: "FLAGGED SIGNALS", icon: ShieldOff, color: "text-red-500" },
          { 
            label: "Sentiment Trend", 
            value: reviews.filter(r => r.rating <= 2).length > 2 ? "NEGATIVE" : "POSITIVE",
            trait: reviews.filter(r => r.rating <= 2).length > 2 ? "SPIKE DETECTED" : "HEALTHY",
            icon: reviews.filter(r => r.rating <= 2).length > 2 ? TrendingDown : TrendingUp,
            color: reviews.filter(r => r.rating <= 2).length > 2 ? "text-red-500 animate-pulse" : "text-cyan-500"
          }
        ].map((stat) => (
          <div key={stat.label} className={cn("bg-zinc-900 border p-8 rounded-[40px] group overflow-hidden relative shadow-2xl transition-all", stat.color.includes("text-red-500") ? "border-red-500/20 shadow-red-500/10" : "border-white/10")}>
            <div className={cn("absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity", stat.color)}>
              <stat.icon className="w-24 h-24" />
            </div>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 block italic">{stat.label}</span>
            <div className={cn("text-3xl font-black tracking-tighter italic", stat.color.includes("animate-pulse") ? "animate-pulse" : "")}>{stat.value}</div>
             <div className="flex items-center gap-2 mt-4">
              <div className={cn("w-1 h-1 rounded-full animate-pulse", stat.color.includes("text-red-500") ? "bg-red-500" : "bg-cyan-500")} />
              <span className={cn("text-[9px] font-black uppercase tracking-widest", stat.color)}>{stat.trait}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Bulk Orchestration Bar */}
      {selectedIds.length > 0 && (
         <div className="bg-amber-500 border border-amber-400 p-6 rounded-[32px] flex items-center justify-between shadow-2xl shadow-amber-500/20 animate-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-black/10 rounded-xl flex items-center justify-center text-black shadow-inner">
                  <CheckSquare className="w-6 h-6" />
               </div>
               <span className="text-sm font-black text-black uppercase tracking-tight italic">
                  {selectedIds.length} Sentiment Signals Selected
               </span>
            </div>
            <div className="flex items-center gap-4">
               <button onClick={handleBulkApprove} className="px-6 py-3 bg-black text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-zinc-900 transition-all shadow-xl">Bulk Approve</button>
               <button onClick={() => setSelectedIds([])} className="px-6 py-3 bg-black/5 text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-black/10 transition-all">Cancel</button>
            </div>
         </div>
      )}

      {/* 3. Operational Discovery Hub */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Reputation Intelligence</h2>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mt-2">Zero Blindness Moderation Matrix v6.5</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-zinc-900 border border-white/10 rounded-2xl p-1 h-12 shadow-inner">
            {[
              { id: undefined, label: "ALL" },
              { id: "pending", label: "PENDING" },
              { id: "approved", label: "APPROVED" }
            ].map((opt) => (
              <button
                key={opt.label}
                onClick={() => setStatus(opt.id)}
                className={cn(
                  "px-6 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all h-full",
                  status === opt.id ? "bg-white/10 text-white shadow-xl" : "text-gray-500 hover:text-white"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
          
          <select 
            value={rating || ""}
            onChange={(e) => setRating(e.target.value ? Number(e.target.value) : undefined)}
            className="bg-zinc-900 border border-white/10 rounded-2xl p-3 h-12 text-[10px] font-black text-white outline-none focus:border-amber-500 uppercase px-6"
          >
            <option value="">Quality (Any)</option>
            {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} STARS</option>)}
          </select>
        </div>
      </div>

      {/* 4. Sentiment Intelligence Matrix */}
      <div className="bg-zinc-900 border border-white/10 rounded-[48px] overflow-hidden shadow-2xl relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-black/20">
                <th className="px-8 py-6 w-10">
                   <div className="w-5 h-5 bg-white/5 rounded border border-white/10 flex items-center justify-center cursor-not-allowed">
                      <Square className="w-3 h-3 text-gray-800" />
                   </div>
                </th>
                <th className="px-8 py-6 text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">Institutional Signal</th>
                <th className="px-8 py-6 text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Discovery Context</th>
                <th className="px-8 py-6 text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] text-center">Score</th>
                <th className="px-8 py-6 text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Status</th>
                <th className="px-8 py-6 text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] text-right">Executive Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(() => {
                if (loading) {
                  return (
                    <tr>
                       <td colSpan={6} className="px-8 py-20 text-center">
                          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
                       </td>
                    </tr>
                  );
                }
                if (reviews.length === 0) {
                  return (
                    <tr>
                       <td colSpan={6} className="px-8 py-20 text-center text-[10px] font-black text-gray-600 uppercase tracking-widest">
                          Zero Sentiment Signals Discovered
                       </td>
                    </tr>
                  );
                }
                return reviews.map((r) => (
                  <tr key={r.id} className={cn("transition-colors group", r.flagged ? "bg-red-500/[0.03]" : "hover:bg-white/[0.02]")}>
                    <td className="px-8 py-6">
                      <button 
                        onClick={() => toggleSelection(r.id)}
                        className={cn(
                          "w-5 h-5 rounded border transition-all flex items-center justify-center",
                          selectedIds.includes(r.id) ? "bg-amber-500 border-amber-500 text-black shadow-lg shadow-amber-500/20" : "bg-white/5 border-white/10 hover:border-amber-500/50"
                        )}
                      >
                        {selectedIds.includes(r.id) && <CheckSquare className="w-3 h-3" />}
                      </button>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-2">
                         <div className="flex items-center gap-2">
                           <div className="flex gap-0.5">
                             {new Array(5).fill(0).map((_, i) => (
                               <Star key={`${r.id}-star-${i}`} className={cn("w-2.5 h-2.5", i < (r.rating || 0) ? "text-amber-500 fill-amber-500" : "text-gray-800")} />
                             ))}
                           </div>
                           {r.flagged && (
                             <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-[8px] font-black uppercase tracking-tighter italic border border-red-500/20">
                               <ShieldOff className="w-2.5 h-2.5" /> FRAUD DETECTED
                             </div>
                           )}
                         </div>
                         <p className="text-[12px] text-gray-400 font-medium italic line-clamp-2 max-w-md leading-relaxed italic">"{r.text}"</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[11px] font-black text-white uppercase tracking-tight italic">{r.name}</span>
                        <div className="flex items-center gap-3 text-[9px] font-black text-gray-500 uppercase tracking-widest italic">
                           <span className="flex items-center gap-1"><Globe className="w-3 h-3 text-cyan-500" /> {r.region || 'GLOBAL'}</span>
                           <span className="w-0.5 h-0.5 rounded-full bg-gray-700" />
                           <span className="flex items-center gap-1"><Flag className="w-3 h-3 text-amber-500" /> {r.source || 'ADMIN'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col items-center gap-1.5">
                        <span className="text-[14px] font-black text-white italic tracking-tighter shadow-sm">{r.priority || 0}</span>
                        <div className="h-1 w-8 bg-white/5 rounded-full overflow-hidden shadow-inner">
                          <div className="h-full bg-amber-500" style={{ width: `${(r.priority || 1) * 10}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "inline-flex px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border italic shadow-sm",
                        getStatusColor(r.status)
                      )}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-2">
                        {r.status === 'pending' && (
                          <button 
                            onClick={() => handleApprove(r.id)}
                            className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all shadow-xl shadow-emerald-500/10"
                          >
                            <CheckCircle className="w-4.4 h-4.4" />
                          </button>
                        )}
                        <button 
                          onClick={() => { setReviewToReject(r.id); setIsRejectDialogOpen(true); }}
                          className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xl shadow-red-500/10"
                        >
                          <XCircle className="w-4.4 h-4.4" />
                        </button>
                        <button 
                             onClick={() => { if(confirm('Permanently erase sentiment?')) deleteReview(r.id, userProfile?.id || '') }}
                             className="p-3 bg-zinc-800 border border-white/10 rounded-xl text-gray-500 hover:bg-white hover:text-black transition-all"
                        >
                           <Trash2 className="w-4.4 h-4.4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ));
              })()}
            </tbody>
          </table>
        </div>

        {/* Modular Pagination Hub */}
        <div className="px-8 py-10 bg-black/20 border-t border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic font-medium">Segment Discovery Stream Index {page + 1}</span>
           </div>
           <div className="flex items-center gap-3">
              <button 
                 disabled={page === 0 || loading}
                 onClick={() => fetchPage(page - 1)}
                 className="p-3 bg-zinc-900 border border-white/10 rounded-xl hover:border-amber-500 disabled:opacity-30 transition-all group shadow-2xl"
              >
                 <ChevronLeft className="w-5 h-5 text-gray-500 group-hover:text-amber-500" />
              </button>
              <button 
                 disabled={reviews.length < 20 || loading}
                 onClick={() => fetchPage(page + 1)}
                 className="p-3 bg-zinc-900 border border-white/10 rounded-xl hover:border-amber-500 disabled:opacity-30 transition-all group shadow-2xl"
              >
                 <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-amber-500" />
              </button>
           </div>
        </div>
      </div>

      <Dialog 
         isOpen={isRejectDialogOpen} 
         onClose={() => setIsRejectDialogOpen(false)} 
         onConfirm={handleReject}
         title="Disposal Protocol"
         description="Signal will be archived in the shadow registry. Provide administrative reasoning below."
         variant="danger"
         confirmText="Execute Rejection"
      >
         <div className="space-y-4 text-left">
            <div className="space-y-2">
               <label htmlFor="rejectionReason" className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-1 italic">Moderation Rationale</label>
               <textarea 
                  id="rejectionReason"
                  value={rejectionReason} 
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-red-500/50 transition-all h-32 resize-none placeholder:text-gray-800 italic"
                  placeholder="e.g. Spam discovery, Off-brand sentiment..."
               />
            </div>
         </div>
      </Dialog>
    </div>
  );
};
