import React, { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Save, X, Image as ImageIcon } from "lucide-react";
import { bannerService, Banner } from "../../services/bannerService";
import { useAuth } from "../../contexts/AuthContext";
import { getSupabasePublicUrl } from "../../lib/supabase";
import { motion } from "motion/react";

export const BannerManager = () => {
  const { session } = useAuth();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);

  const [form, setForm] = useState<Partial<Banner>>({
    title: "",
    description: "",
    placement: "home",
    link_url: "",
    is_active: true,
    priority: 0,
    image_url: "",
  });

  const fetchBanners = async () => {
    setLoading(true);
    const data = await bannerService.getAllBanners();
    setBanners(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const resetForm = () => {
    setEditing(null);
    setForm({
      title: "",
      description: "",
      placement: "home",
      link_url: "",
      is_active: true,
      priority: 0,
      image_url: "",
    });
    setFormOpen(false);
  };

  const handleSubmit = async () => {
    if (!form.title) {
      alert("Title is required.");
      return;
    }

    if (editing) {
      const result = await bannerService.updateBanner(editing.id, form);
      if (result) {
        await fetchBanners();
        resetForm();
      }
    } else {
      const result = await bannerService.createBanner(form);
      if (result) {
        await fetchBanners();
        resetForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this banner?")) {
      const success = await bannerService.deleteBanner(id);
      if (success) {
        await fetchBanners();
      }
    }
  };

  const startEdit = (b: Banner) => {
    setEditing(b);
    setForm({
      title: b.title,
      description: b.description,
      placement: b.placement,
      link_url: b.link_url,
      is_active: b.is_active,
      priority: b.priority,
      image_url: b.image_url,
    });
    setFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-emerald-500" />
          Institutional Ad Banners
        </h2>
        <button
          onClick={() => { resetForm(); setFormOpen(!formOpen); }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all text-xs uppercase tracking-widest"
        >
          <Plus className="w-4 h-4" />
          {formOpen ? 'Close' : 'Create Banner'}
        </button>
      </div>

      {formOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900 border border-white/5 rounded-2xl p-6 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Title</label>
              <input 
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-emerald-500/50 transition-all" 
                value={form.title} 
                onChange={e => setForm({...form, title: e.target.value})} 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Placement</label>
              <select 
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-emerald-500/50 transition-all" 
                value={form.placement} 
                onChange={e => setForm({...form, placement: e.target.value})}
              >
                <option value="home">Home Page</option>
                <option value="webinar">Webinar Hub</option>
                <option value="marketplace">Marketplace</option>
                <option value="global">Global Broadcast</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Priority</label>
              <input 
                type="number" 
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-emerald-500/50 transition-all" 
                value={form.priority} 
                onChange={e => setForm({...form, priority: parseInt(e.target.value)})} 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Description</label>
            <textarea 
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-emerald-500/50 transition-all" 
              rows={2} 
              value={form.description || ''} 
              onChange={e => setForm({...form, description: e.target.value})} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Link URL</label>
              <input 
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-emerald-500/50 transition-all" 
                value={form.link_url || ''} 
                onChange={e => setForm({...form, link_url: e.target.value})} 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Image URL</label>
              <input 
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-emerald-500/50 transition-all" 
                value={form.image_url || ''} 
                onChange={e => setForm({...form, image_url: e.target.value})} 
              />
            </div>
          </div>

          <div className="flex items-center gap-6 py-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-white/10 bg-black text-emerald-500" 
                checked={form.is_active} 
                onChange={e => setForm({...form, is_active: e.target.checked})} 
              />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Active Production Status</span>
            </label>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button 
              onClick={handleSubmit} 
              className="px-6 py-2.5 bg-emerald-500 text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {editing ? 'Update Banner' : 'Deploy Banner'}
            </button>
            <button 
              onClick={resetForm} 
              className="px-6 py-2.5 bg-white/5 text-white/60 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 py-20 flex justify-center">
            <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        ) : (
          banners.map(b => (
            <div key={b.id} className="group bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden hover:border-white/10 transition-all">
              <div className="aspect-[21/9] w-full bg-black relative">
                {b.image_url ? (
                  <img src={b.image_url.startsWith('http') ? b.image_url : getSupabasePublicUrl('banners', b.image_url)} alt={b.title} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/10">
                    <ImageIcon className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button onClick={() => startEdit(b)} className="p-2 bg-black/60 backdrop-blur-md rounded-xl text-white/60 hover:text-white transition-all"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(b.id)} className="p-2 bg-black/60 backdrop-blur-md rounded-xl text-red-500/60 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="absolute bottom-4 left-6">
                   <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[8px] font-black text-emerald-500 uppercase tracking-widest">
                      {b.placement}
                    </span>
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-white font-bold text-lg mb-1">{b.title}</h4>
                <p className="text-xs text-white/40 line-clamp-2">{b.description}</p>
                <div className="mt-4 flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                   <div className="text-white/20">Priority: {b.priority}</div>
                   <div className={b.is_active ? "text-emerald-500" : "text-red-500"}>
                      {b.is_active ? "Live" : "Inactive"}
                   </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BannerManager;
