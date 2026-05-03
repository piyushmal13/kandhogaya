import React, { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Save, X, Image as ImageIcon } from "lucide-react";
import { supabase, getSupabasePublicUrl } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";

export const BannerManager = () => {
  const { session } = useAuth();
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  const [form, setForm] = useState<any>({
    title: "",
    description: "",
    placement: "global",
    link_url: "",
    is_active: true,
    priority: 0,
    image_url: "",
    imageFile: null
  });

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('banners').select('*').order('priority', { ascending: false });
      if (error) {
        console.warn("Banner fetch error:", error.message);
        setBanners([]);
      } else {
        setBanners(data || []);
      }
    } catch (err) {
      console.error(err);
      setBanners([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchBanners(); }, []);

  const resetForm = () => {
    setEditing(null);
    setForm({ title: "", description: "", placement: "global", link_url: "", is_active: true, priority: 0, image_url: "", imageFile: null });
    setFormOpen(false);
  };

  const uploadImage = async (file: File) => {
    const path = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from('banners').upload(path, file, { cacheControl: '3600', upsert: true });
    if (error) throw error;
    return data?.path || path;
  };

  const handleCreate = async () => {
    try {
      if (!session) throw new Error("No active session");
      let image_path = form.image_url || null;
      if (form.imageFile) {
        image_path = await uploadImage(form.imageFile);
      }
      const body = {
        title: form.title,
        description: form.description || null,
        placement: form.placement,
        image_url: image_path,
        link_url: form.link_url || null,
        is_active: form.is_active,
        priority: Number(form.priority) || 0
      };

      const res = await fetch('/api/admin/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create banner');
      }

      await fetchBanners();
      resetForm();
    } catch (err: any) {
      alert('Error creating banner: ' + (err.message || err));
    }
  };

  const handleUpdate = async () => {
    try {
      if (!session || !editing) throw new Error("No active session or editing target");
      let image_path = form.image_url || editing.image_url || null;
      if (form.imageFile) {
        image_path = await uploadImage(form.imageFile);
      }

      const body = {
        title: form.title,
        description: form.description || null,
        placement: form.placement,
        image_url: image_path,
        link_url: form.link_url || null,
        is_active: form.is_active,
        priority: Number(form.priority) || 0
      };

      const res = await fetch(`/api/admin/banners/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update banner');
      }

      await fetchBanners();
      resetForm();
    } catch (err: any) {
      alert('Error updating banner: ' + (err.message || err));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this banner?')) return;
    try {
      if (!session) throw new Error("No active session");
      const res = await fetch(`/api/admin/banners/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${session?.access_token}` } });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to delete banner');
      }
      await fetchBanners();
    } catch (err: any) {
      alert('Error deleting banner: ' + (err.message || err));
    }
  };

  const startEdit = (b: any) => {
    setEditing(b);
    setForm({
      title: b.title || '',
      description: b.description || '',
      placement: b.placement || 'home',
      link_url: b.link_url || '',
      is_active: b.is_active ?? true,
      priority: b.priority ?? 0,
      image_url: b.image_url || '',
      imageFile: null
    });
    setFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-emerald-500" />
          Editable Banners
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { resetForm(); setFormOpen(!formOpen); }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all"
          >
            <Plus className="w-4 h-4" />
            {formOpen ? 'Close' : 'Create New'}
          </button>
        </div>
      </div>

      {formOpen && (
        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Title</label>
              <input className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-white" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Placement</label>
              <select className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-white" value={form.placement} onChange={e => setForm({...form, placement: e.target.value})}>
                <option value="global">Global Broadcast</option>
                <option value="home">Home Page</option>
                <option value="webinar">Webinar Hub</option>
                <option value="marketplace">Marketplace</option>
                <option value="header">Header Strip</option>
                <option value="sidebar">Sidebar Slot</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Priority</label>
              <input type="number" className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-white" value={form.priority} onChange={e => setForm({...form, priority: Number(e.target.value)})} />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs text-gray-400 mb-1">Description</label>
            <textarea className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-white" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Link URL</label>
              <input className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-white" value={form.link_url} onChange={e => setForm({...form, link_url: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Image Upload (PNG/SVG)</label>
              <input type="file" accept="image/png,image/svg+xml" onChange={e => setForm({...form, imageFile: e.target.files?.[0] || null})} />
              {form.image_url && (
                <div className="mt-2">
                  <img src={getSupabasePublicUrl('banners', form.image_url)} alt={form.title || 'Banner image'} className="max-h-32 rounded-md" />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4">
            {editing ? (
              <>
                <button onClick={handleUpdate} className="px-4 py-2 bg-emerald-500 text-black rounded-xl font-bold">Save</button>
                <button onClick={resetForm} className="px-4 py-2 bg-white/5 rounded-xl">Cancel</button>
              </>
            ) : (
              <button onClick={handleCreate} className="px-4 py-2 bg-emerald-500 text-black rounded-xl font-bold">Create Banner</button>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 py-10 flex justify-center"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          banners.map(b => (
            <div key={b.id} className="bg-zinc-900 border border-white/5 rounded-2xl p-4 flex gap-4 items-start">
              <div className="w-40 h-24 bg-black rounded-md overflow-hidden flex items-center justify-center">
                {b.image_url ? (
                  <img src={getSupabasePublicUrl('banners', b.image_url)} alt={b.title} className="object-cover w-full h-full" />
                ) : (
                  <div className="text-gray-500">No image</div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-white">{b.title}</div>
                    <div className="text-sm text-gray-400">{b.description}</div>
                    <div className="text-xs text-gray-500 mt-1">{b.placement} • priority {b.priority}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => startEdit(b)} className="px-3 py-2 bg-white/5 rounded-xl"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(b.id)} className="px-3 py-2 bg-red-600/80 rounded-xl"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                {b.description && (
                  <div className="mt-2 text-sm text-gray-300">{b.description}</div>
                )}
                {b.html_content && (
                  <div className="mt-2 text-sm text-gray-300" dangerouslySetInnerHTML={{ __html: b.html_content }} />
                )}
                {b.link_url && (
                  <div className="mt-2 text-xs text-emerald-400"><a href={b.link_url} target="_blank" rel="noreferrer">{b.link_url}</a></div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BannerManager;
