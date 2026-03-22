import React, { useState, useEffect } from "react";
import { Star, Trash2, Plus, Save, X, MapPin } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { Review } from "../../types";

export const ReviewManager = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Review>>({});

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setReviews(data);
    setLoading(false);
  };

  const handleEdit = (review: Review) => {
    setEditingId(review.id || null);
    setEditForm(review);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSave = async () => {
    if (!editingId) return;
    
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`/api/admin/reviews/${editingId}`, {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${session?.access_token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: editForm.name || editForm.user_name,
          user_name: editForm.user_name,
          rating: editForm.rating,
          comment: editForm.comment,
          text: editForm.text || editForm.comment,
          image_url: editForm.image_url,
          region: editForm.region,
          role: editForm.role
        })
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update review");
      }
      
      setEditingId(null);
      fetchReviews();
    } catch (error: unknown) {
      const err = error as Error;
      alert("Error updating review: " + err.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${session?.access_token}` }
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete review");
      }
      
      fetchReviews();
    } catch (error: unknown) {
      const err = error as Error;
      alert("Error deleting review: " + err.message);
    }
  };

  const handleCreate = async () => {
    const newReview = {
      name: "New Client",
      user_name: "New Client",
      rating: 5,
      comment: "Excellent service!",
      text: "Excellent service!",
      region: "Global",
      role: "Trader",
      image_url: "https://picsum.photos/seed/user/200/200",
      target_id: '00000000-0000-0000-0000-000000000000' // Placeholder for general review
    };

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`/api/admin/reviews`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${session?.access_token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newReview)
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create review");
      }
      
      fetchReviews();
    } catch (error: unknown) {
      const err = error as Error;
      alert("Error creating review: " + err.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Star className="w-5 h-5 text-emerald-500" />
          Client Reviews Management
        </h2>
        <button 
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Manual Review
        </button>
      </div>

      {loading && reviews.length === 0 ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div 
              key={review.id} 
              className="bg-zinc-900 border border-white/10 rounded-3xl p-6 hover:border-emerald-500/30 transition-all group"
            >
              {editingId === review.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="userName" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">User Name</label>
                      <input 
                        id="userName"
                        value={editForm.user_name || ""} 
                        onChange={e => setEditForm({...editForm, user_name: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="region" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Region</label>
                      <input 
                        id="region"
                        value={editForm.region || ""} 
                        onChange={e => setEditForm({...editForm, region: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="rating" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Rating (1-5)</label>
                      <input 
                        id="rating"
                        type="number"
                        min="1"
                        max="5"
                        value={editForm.rating || 5} 
                        onChange={e => setEditForm({...editForm, rating: Number.parseInt(e.target.value)})}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="imageUrl" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Image URL</label>
                      <input 
                        id="imageUrl"
                        value={editForm.image_url || ""} 
                        onChange={e => setEditForm({...editForm, image_url: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="reviewText" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Review Text</label>
                    <textarea 
                      id="reviewText"
                      value={editForm.text || editForm.comment || ""} 
                      onChange={e => setEditForm({...editForm, text: e.target.value, comment: e.target.value})}
                      rows={3}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button onClick={handleCancel} className="p-2 text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
                    <button onClick={handleSave} className="p-2 text-emerald-500 hover:text-emerald-400"><Save className="w-5 h-5" /></button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-black border border-white/5 shrink-0">
                    <img 
                      src={review.image_url || `https://picsum.photos/seed/${review.id}/200/200`} 
                      alt={review.user_name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-white font-bold text-sm">{review.user_name}</h3>
                        <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-bold uppercase tracking-widest">
                          <MapPin className="w-3 h-3" />
                          {review.region || "Global"}
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(review)} className="text-gray-500 hover:text-white"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(review.id)} className="text-gray-500 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <div className="flex gap-0.5 mb-2">
                      {['star-1', 'star-2', 'star-3', 'star-4', 'star-5'].map((key, i) => (
                        <Star key={key} className={`w-3 h-3 ${i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-700'}`} />
                      ))}
                    </div>
                    <p className="text-gray-400 text-xs line-clamp-3 italic">"{review.text || review.comment}"</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Edit2 = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);
