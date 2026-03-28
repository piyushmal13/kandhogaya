import React, { useState, useEffect, SyntheticEvent } from "react";
import { Star, Plus, Trash2, Edit2, Search, User, Globe } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { Dialog } from "../../components/ui/Dialog";
import { cn } from "../../utils/cn";
import { Review } from "@/types";

export const ReviewManager = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [role, setRole] = useState("");
  const [region, setRegion] = useState("");

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      console.log("[Admin] Reviews Discovered:", data?.length);
      setReviews(data || []);
    } catch (err) {
      console.error("Institutional Review Discovery Error:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setRating(5);
    setText("");
    setRole("");
    setRegion("");
  };

  const handleEdit = (review: Review) => {
    setEditingId(review.id || null);
    setName(review.name || "");
    setRating(review.rating || 5);
    setText(review.text || "");
    setRole(review.role || "");
    setRegion(review.region || "");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name,
        rating,
        text,
        role,
        region,
        created_at: new Date().toISOString()
      };

      if (editingId) {
        const { error } = await supabase.from('reviews').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('reviews').insert([payload]);
        if (error) throw error;
      }

      resetForm();
      fetchReviews();
    } catch (err) {
      console.error("Institutional Review Orchestration Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!reviewToDelete) return;
    setDeleteLoading(true);
    try {
      const { error } = await supabase.from('reviews').delete().eq('id', reviewToDelete);
      if (error) throw error;
      setIsDeleteDialogOpen(false);
      setReviewToDelete(null);
      fetchReviews();
    } catch (err) {
      console.error("Institutional Review Erasure Error:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-zinc-900 border border-white/10 p-10 rounded-[40px] shadow-2xl relative overflow-hidden group">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
            <Star className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">
              {editingId ? "Modify Review" : "Publish Testimonial"}
            </h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Institutional Sentiment Management</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 px-1">Trader Name</label>
                <input 
                  type="text" value={name} onChange={(e) => setName(e.target.value)} required
                  className="w-full bg-black border border-white/5 focus:border-amber-500/50 rounded-2xl p-4 text-white text-sm outline-none transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 px-1">Rating (1-5)</label>
                  <input type="number" min="1" max="5" value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full bg-black border border-white/5 rounded-2xl p-4 text-white text-sm outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 px-1">Global Region</label>
                  <input type="text" value={region} onChange={(e) => setRegion(e.target.value)} placeholder="e.g. United Kingdom" className="w-full bg-black border border-white/5 rounded-2xl p-4 text-white text-sm outline-none" />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 px-1">Testimonial Content</label>
                <textarea 
                  value={text} onChange={(e) => setText(e.target.value)} required rows={4}
                  className="w-full bg-black border border-white/5 focus:border-amber-500/50 rounded-2xl p-4 text-white text-sm outline-none transition-all resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 px-1">Trader Role/Title</label>
                <input type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Master Trader" className="w-full bg-black border border-white/5 rounded-2xl p-4 text-white text-sm outline-none" />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button type="submit" disabled={loading} className="px-10 py-4 bg-amber-500 hover:bg-amber-400 text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-amber-500/10 transition-all disabled:opacity-50">
              {loading ? "Publishing..." : editingId ? "Save Amendment" : "Execute Publication"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="px-10 py-4 bg-white/5 text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-all">Cancel</button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-zinc-900 border border-white/10 p-10 rounded-[40px] shadow-2xl">
        <h3 className="text-xl font-black text-white mb-10 flex items-center gap-4 uppercase tracking-tighter italic">
          <Globe className="w-6 h-6 text-cyan-500" />
          Sentiment Feed
        </h3>

        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="p-8 rounded-[32px] bg-black/40 border border-white/5 flex items-center justify-between group hover:border-amber-500/30 transition-all">
              <div className="flex items-center gap-8">
                <div className="w-16 h-16 rounded-[24px] bg-white/5 flex items-center justify-center text-amber-500 shrink-0">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="text-lg font-black text-white italic tracking-tight">{r.name}</h4>
                    <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[8px] font-black uppercase tracking-widest rounded-lg">
                      {Array(r.rating).fill('★').join('')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 font-medium line-clamp-1 italic">"{r.text}"</p>
                  <div className="flex items-center gap-4 mt-2 text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
                    <span>{r.role || "Retail Trader"}</span>
                    <span>•</span>
                    <span>{r.region || "Global"}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <button onClick={() => handleEdit(r)} className="p-3 rounded-xl bg-white/5 text-gray-400 hover:bg-amber-500 hover:text-black transition-all"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => { setReviewToDelete(r.id!); setIsDeleteDialogOpen(true); }} className="p-3 rounded-xl bg-white/5 text-gray-400 hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
          {reviews.length === 0 && (
            <div className="text-center py-20 bg-black/20 rounded-[32px] border-2 border-dashed border-white/5 uppercase font-black text-gray-700 text-[10px] tracking-widest italic">
              Awaiting institutional feedback signals.
            </div>
          )}
        </div>
      </div>

      <Dialog isOpen={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} title="Destroy Review?">
        <div className="p-8 text-center">
          <p className="text-gray-400 text-sm font-medium leading-relaxed mb-8 italic">
            "Are you certain you want to erase this sentiment signal from the public discovery stream?"
          </p>
          <div className="flex gap-4">
            <button onClick={() => setIsDeleteDialogOpen(false)} className="flex-1 py-4 bg-white/5 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all">Abort</button>
            <button onClick={handleDelete} disabled={deleteLoading} className="flex-1 py-4 bg-red-500 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-red-400 shadow-xl shadow-red-500/20 transition-all">
              {deleteLoading ? "Erasing..." : "Execute Destruction"}
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
