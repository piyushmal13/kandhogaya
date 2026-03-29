import React, { useState, useEffect, SyntheticEvent } from "react";
import { Zap, Video, Download, Image as ImageIcon, FileText, Plus, Search, Trash2, Edit2, Globe } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import { Dialog } from "../../components/ui/Dialog";
import { getCache, setCache } from "@/utils/cache";

const cacheKey = "content_list";

export const ContentManager = () => {
  const { userProfile } = useAuth();
  
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [type, setType] = useState("blog");
  const [videoUrl, setVideoUrl] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [takeaways, setTakeaways] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [recentContent, setRecentContent] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [contentToDelete, setContentToDelete] = useState<string | null>(null);

  const fetchRecentContent = async () => {
    const { data, error } = await supabase
      .from('content_posts')
      .select('*, author:users(full_name)')
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (data) {
      setCache(cacheKey, data, 60000);
      setRecentContent(data);
    }
  };

  useEffect(() => {
    const cached = getCache(cacheKey);
    if (cached) {
      setRecentContent(cached);
    } else {
      fetchRecentContent();
    }
  }, []);

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setTitle(item.title || "");
    setBody(item.content || "");
    setType(item.content_type || "blog");
    setVideoUrl(item.metadata?.video_url || "");
    setDownloadUrl(item.metadata?.download_url || "");
    setCoverImage(item.image_url || "");
    setTakeaways(item.metadata?.takeaways?.join("\n") || "");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setBody("");
    setType("blog");
    setVideoUrl("");
    setDownloadUrl("");
    setCoverImage("");
    setTakeaways("");
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!userProfile?.id) return;
    setLoading(true);

    try {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const payload = { 
        title, 
        slug,
        content_type: type, 
        content: body,
        image_url: coverImage,
        author_id: userProfile.id,
        metadata: { 
          video_url: videoUrl,
          download_url: downloadUrl,
          takeaways: takeaways.split("\n").filter(t => t.trim() !== ""),
        } 
      };

      if (editingId) {
        const { error } = await supabase.from('content_posts').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('content_posts').insert([payload]);
        if (error) throw error;
      }

      handleCancelEdit();
      fetchRecentContent();
    } catch (err) {
      console.error("Institutional Content Execution Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!contentToDelete) return;
    setDeleteLoading(true);
    try {
      const { error } = await supabase.from('content_posts').delete().eq('id', contentToDelete);
      if (error) throw error;
      setIsDeleteDialogOpen(false);
      setContentToDelete(null);
      fetchRecentContent();
    } catch (err) {
      console.error("Institutional Erasure Error:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7">
          <section className="bg-zinc-900 border border-white/10 rounded-[40px] p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                <FileText className="w-48 h-48 text-emerald-500" />
            </div>
            
            <div className="flex items-center gap-4 mb-10 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">
                  {editingId ? "Amend Intel" : "Publish Discovery"}
                </h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] mt-1">Content Orchestration v4.2</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 px-1 italic">Intelligence Title</label>
                  <input 
                    value={title} onChange={e => setTitle(e.target.value)} required
                    placeholder="e.g. Gold Macro Structure"
                    className="w-full bg-black border border-white/5 rounded-2xl p-4 text-white text-sm outline-none focus:border-emerald-500/50 transition-all italic" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 px-1 italic">Content Category</label>
                  <select 
                    value={type} onChange={e => setType(e.target.value)} 
                    className="w-full bg-black border border-white/5 rounded-2xl p-4 text-white text-sm outline-none focus:border-emerald-500/50 transition-all uppercase font-black"
                  >
                    <option value="blog">Article / Analysis</option>
                    <option value="signal">Technical Signal</option>
                    <option value="market_report">Institutional Report</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 px-1 italic">Analysis Matrix (Markdown)</label>
                <textarea 
                  rows={8} value={body} onChange={e => setBody(e.target.value)} required
                  placeholder="Deploy institutional data here..."
                  className="w-full bg-black border border-white/5 rounded-3xl p-6 text-white text-sm outline-none focus:border-emerald-500/50 transition-all font-mono resize-none" 
                />
              </div>

              <div className="p-8 bg-black/40 border border-white/5 rounded-3xl space-y-8">
                <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] italic">Media Integration Layer</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest px-1">Cover Image Source</label>
                    <input value={coverImage} onChange={e => setCoverImage(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-xs text-white outline-none focus:border-cyan-500/50" placeholder="https://..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest px-1">Webinar/Video Probe</label>
                    <input value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-xs text-white outline-none focus:border-cyan-500/50" placeholder="Stream URL" />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  disabled={loading}
                  className="flex-1 py-4 bg-emerald-500 text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-emerald-500/20 disabled:opacity-50"
                >
                  {loading ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Zap className="w-4 h-4" />}
                  {editingId ? "Commit Amendment" : "Execute Publication"}
                </button>
                {editingId && (
                  <button type="button" onClick={handleCancelEdit} className="px-8 py-4 bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all">Abort</button>
                )}
              </div>
            </form>
          </section>
        </div>

        <div className="lg:col-span-5">
          <section className="bg-zinc-900 border border-white/10 rounded-[40px] overflow-hidden shadow-2xl h-full flex flex-col">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/20">
              <div>
                <h3 className="text-white font-black uppercase tracking-tighter italic flex items-center gap-3">
                  <Globe className="w-4 h-4 text-emerald-500" /> Discovery Feed
                </h3>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
                <input type="text" placeholder="Probe..." className="bg-black border border-white/10 rounded-xl pl-9 pr-4 py-1.5 text-[10px] text-white outline-none focus:border-emerald-500/50 w-32" />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[700px] scrollbar-hide">
              {recentContent.map((item) => (
                <div key={item.id} className="p-5 rounded-3xl bg-black/40 border border-white/5 flex items-center justify-between group hover:border-emerald-500/20 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-500 text-[9px] font-black uppercase italic group-hover:bg-emerald-500 group-hover:text-black transition-all">
                      {item.content_type.substring(0, 3)}
                    </div>
                    <div>
                      <div className="text-white font-black text-[11px] uppercase tracking-tight italic line-clamp-1">{item.title}</div>
                      <div className="text-[8px] text-gray-600 uppercase font-black tracking-widest mt-1.5 flex items-center gap-2">
                        <span>{new Date(item.created_at).toLocaleDateString()}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-800" />
                        <span className="text-emerald-500/60 ">{item.author?.full_name || 'System Analyst'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                    <button onClick={() => handleEdit(item)} className="p-2.5 text-gray-500 hover:text-emerald-500 transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => { setContentToDelete(item.id); setIsDeleteDialogOpen(true); }} className="p-2.5 text-gray-500 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
              {recentContent.length === 0 && (
                <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl uppercase font-black text-gray-800 text-[10px] tracking-widest italic">Zero intelligence discovered in feed.</div>
              )}
            </div>
          </section>
        </div>
      </div>

      <Dialog 
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Destroy Intelligence?"
        variant="danger"
        confirmText="Execute Destruction"
      >
        <p className="text-gray-400 text-sm font-medium leading-relaxed italic text-center p-6">
          "Are you certain you want to erase this intelligence post? This action is non-reversible and will remove data from the global discovery hub."
        </p>
      </Dialog>
    </div>
  );
};
