import React, { useState, useEffect, SyntheticEvent } from "react";
import { Zap, Video, Download, Image as ImageIcon, FileText, Plus, Search, Trash2, Edit2 } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import { Dialog } from "../../components/ui/Dialog";
import { getCache, setCache } from "@/utils/cache";

const cacheKey = "content_list";

export const ContentManager = () => {
  const { session } = useAuth();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [type, setType] = useState("signal");
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
    const res = await supabase
      .from('content_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    if (res?.data) {
      setCache(cacheKey, res.data, 60000);
      setRecentContent(res.data);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initFetch = async () => {
      const cached = getCache(cacheKey);
      if (cached) {
        setRecentContent(cached);
        return;
      }

      const res = await supabase
        .from('content_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (!isMounted) return;

      if (res?.data) {
        setCache(cacheKey, res.data, 60000);
        setRecentContent(res.data);
      }
    };

    initFetch();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setTitle(item.title || "");
    setBody(item.content || "");
    setType(item.content_type || "signal");
    setVideoUrl(item.metadata?.video_url || "");
    setDownloadUrl(item.metadata?.download_url || "");
    setCoverImage(item.metadata?.cover_image || "");
    setTakeaways(item.metadata?.takeaways?.join("\n") || "");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setBody("");
    setType("signal");
    setVideoUrl("");
    setDownloadUrl("");
    setCoverImage("");
    setTakeaways("");
  };

  const handlePublish = async (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!session) throw new Error("No active session");
      
      const payload = { 
        title, 
        content_type: type, 
        content: body, 
        metadata: { 
          video_url: videoUrl,
          download_url: downloadUrl,
          cover_image: coverImage,
          takeaways: takeaways.split("\n").filter(t => t.trim() !== ""),
        } 
      };

      let res;
      if (editingId) {
        res = await fetch(`/api/admin/content/${editingId}`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch("/api/admin/content", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
          },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        alert(editingId ? "Updated successfully!" : "Published successfully!");
        handleCancelEdit();
        fetchRecentContent();
      } else {
        const err = await res.json();
        alert(`Error: ${err.error}`);
      }
    } catch (err) {
      console.error("Publishing error:", err);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!contentToDelete) return;
    setDeleteLoading(true);
    try {
      if (!session) throw new Error("No active session");
      const res = await fetch(`/api/admin/content/${contentToDelete}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${session?.access_token}` }
      });
      if (res.ok) {
        fetchRecentContent();
        setIsDeleteDialogOpen(false);
      } else {
        alert("Failed to delete content.");
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeleteLoading(false);
      setContentToDelete(null);
    }
  };

  const openDeleteDialog = (id: string) => {
    setContentToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-7">
        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
              <Plus className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {editingId ? "Edit Content" : "Create New Content"}
            </h2>
          </div>

          <form onSubmit={handlePublish} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="contentTitle" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Content Title</label>
                <input 
                  id="contentTitle"
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  placeholder="e.g., Gold Market Outlook"
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-all" 
                />
              </div>
              <div>
                <label htmlFor="contentType" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Content Type</label>
                <select 
                  id="contentType"
                  value={type} 
                  onChange={e => setType(e.target.value)} 
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-all"
                >
                  <option value="signal">Trading Signal</option>
                  <option value="blog">Blog Post</option>
                  <option value="market_report">Market Report</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="contentBody" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Body / Analysis (Markdown Support)</label>
              <textarea 
                id="contentBody"
                rows={8} 
                value={body} 
                onChange={e => setBody(e.target.value)} 
                placeholder="Enter your detailed analysis here..."
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-all font-mono text-sm" 
              />
            </div>

            {type === "blog" && (
              <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-6">
                <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Advanced Media Features</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="videoUrl" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Video URL</label>
                    <div className="relative">
                      <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input id="videoUrl" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white outline-none focus:border-emerald-500" placeholder="YouTube/Vimeo link" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="downloadUrl" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Download URL</label>
                    <div className="relative">
                      <Download className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input id="downloadUrl" value={downloadUrl} onChange={e => setDownloadUrl(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white outline-none focus:border-emerald-500" placeholder="PDF/Report link" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="coverImage" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Cover Image URL</label>
                    <div className="relative">
                      <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input id="coverImage" value={coverImage} onChange={e => setCoverImage(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white outline-none focus:border-emerald-500" placeholder="https://..." />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="takeaways" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Key Takeaways (One per line)</label>
                    <textarea id="takeaways" rows={3} value={takeaways} onChange={e => setTakeaways(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" placeholder="Support at 2150&#10;Bullish trend..." />
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              {editingId && (
                <button 
                  type="button" 
                  onClick={handleCancelEdit}
                  className="px-6 py-4 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
              )}
              <button 
                disabled={loading}
                className="flex-1 py-4 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                {loading ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Zap className="w-5 h-5" />}
                {editingId ? "Update Content" : "Publish to Intelligence Hub"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-xl h-full">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-white font-bold flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-500" />
              Recent Content
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500" />
              <input type="text" placeholder="Search..." className="bg-black border border-white/10 rounded-lg pl-8 pr-3 py-1 text-xs text-white outline-none focus:border-emerald-500" />
            </div>
          </div>
          <div className="p-4 space-y-4">
            {recentContent.map((item) => (
              <div key={item.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-emerald-500/30 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-emerald-500 font-bold text-xs uppercase">
                    {item.content_type.substring(0, 3)}
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm line-clamp-1">{item.title}</div>
                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">
                      {new Date(item.created_at).toLocaleDateString()} • {item.status}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(item)} className="p-2 text-gray-500 hover:text-emerald-500 transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => openDeleteDialog(item.id)} className="p-2 text-gray-500 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
            {recentContent.length === 0 && (
              <div className="text-center text-gray-500 py-8">No recent content found.</div>
            )}
          </div>
        </div>
      </div>

      <Dialog 
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        isLoading={deleteLoading}
        title="Delete Content"
        description="Are you sure you want to delete this content post? This will remove it from the intelligence hub for all users. This action cannot be undone."
        confirmText="Delete Content"
      />
    </div>
  );
};
