import React, { useState, useEffect, SyntheticEvent } from "react";
import {
  Zap, FileText, Plus, Search, Trash2, Edit2, Globe,
  Eye, EyeOff, RefreshCw, CheckCircle, XCircle, Tag
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import { Dialog } from "../../components/ui/Dialog";
import { cn } from "../../utils/cn";

interface ContentPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  image_url: string;
  content_type: string;
  status: string;
  created_at: string;
  author?: { full_name: string };
}

const CONTENT_TYPES = [
  { value: "blog",          label: "Article / Analysis" },
  { value: "signal",        label: "Technical Signal" },
  { value: "market_report", label: "Institutional Report" },
  { value: "course",        label: "Course Material" },
];

const STATUSES = ["published", "draft", "archived"];

const slugify = (str: string) =>
  str.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replaceAll(/(^-|-$)/g, "");

export const ContentManager = () => {
  const { userProfile } = useAuth();

  // Form State
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [type, setType] = useState("blog");
  const [status, setStatus] = useState("published");
  const [coverImage, setCoverImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // List State
  const [posts, setPosts] = useState<ContentPost[]>([]);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  // UI State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [contentToDelete, setContentToDelete] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchPosts = async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from("content_posts")
      .select("*, author:users(full_name)")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("[ContentManager] Fetch error:", error);
      showToast("error", "Failed to load content.");
    } else {
      setPosts(data || []);
    }
    setFetching(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleEdit = (item: ContentPost) => {
    setEditingId(item.id);
    setTitle(item.title || "");
    setBody(item.content || "");
    setType(item.content_type || "blog");
    setStatus(item.status || "published");
    setCoverImage(item.image_url || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setBody("");
    setType("blog");
    setStatus("published");
    setCoverImage("");
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!userProfile?.id) return;
    setLoading(true);

    try {
      const slug = slugify(title);
      const payload = {
        title,
        slug,
        content_type: type,
        content: body,
        status,
        image_url: coverImage,
        author_id: userProfile.id,
      };

      if (editingId) {
        const { error } = await supabase.from("content_posts").update(payload).eq("id", editingId);
        if (error) throw error;
        showToast("success", "Content updated successfully.");
      } else {
        const { error } = await supabase.from("content_posts").insert([payload]);
        if (error) throw error;
        showToast("success", "Content published successfully.");
      }

      handleCancelEdit();
      fetchPosts();
    } catch (err: any) {
      console.error("[ContentManager] Submit error:", err);
      showToast("error", err.message || "Operation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "draft" : "published";
    try {
      const { error } = await supabase.from("content_posts").update({ status: newStatus }).eq("id", id);
      if (error) throw error;
      setPosts(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
      showToast("success", `Post ${newStatus === "published" ? "published" : "unpublished"}.`);
    } catch (err: any) {
      showToast("error", err.message || "Toggle failed.");
    }
  };

  const handleDelete = async () => {
    if (!contentToDelete) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("content_posts").delete().eq("id", contentToDelete);
      if (error) throw error;
      setIsDeleteDialogOpen(false);
      setContentToDelete(null);
      showToast("success", "Content removed.");
      fetchPosts();
    } catch (err: any) {
      showToast("error", err.message || "Delete failed.");
    } finally {
      setLoading(false);
    }
  };

  // Filtered list
  const filteredPosts = posts.filter(p => {
    const matchSearch = search === "" || p.title.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || p.content_type === filterType;
    return matchSearch && matchType;
  });

  const STATUS_STYLE: Record<string, string> = {
    published: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    draft:     "bg-amber-500/10 text-amber-400 border-amber-500/20",
    archived:  "bg-gray-500/10 text-gray-500 border-gray-500/20",
  };

  const renderContentList = () => {
    if (fetching) {
      return Array.from({ length: 4 }).map((_, i) => (
        <div key={`skeleton-${i}`} className="h-16 bg-white/5 rounded-2xl animate-pulse" />
      ));
    }

    if (filteredPosts.length === 0) {
      return (
        <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl uppercase font-black text-gray-700 text-[10px] tracking-widest">
          {search || filterType !== "all" ? "No matching content found." : "No content published yet."}
        </div>
      );
    }

    return filteredPosts.map(item => (
      <div
        key={item.id}
        className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between group hover:border-white/10 transition-all"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-emerald-500 text-[8px] font-black uppercase shrink-0">
            {item.content_type.substring(0, 3)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-black text-[11px] uppercase tracking-tight line-clamp-1">
              {item.title}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn(
                "px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-wider border",
                STATUS_STYLE[item.status] || STATUS_STYLE.archived
              )}>
                {item.status}
              </span>
              <span className="text-[8px] text-gray-700 uppercase">
                {new Date(item.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 shrink-0 ml-2">
          <button
            onClick={() => handleToggleStatus(item.id, item.status)}
            className="p-2 text-gray-500 hover:text-amber-400 transition-colors"
            title={item.status === "published" ? "Unpublish" : "Publish"}
          >
            {item.status === "published" ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => handleEdit(item)}
            className="p-2 text-gray-500 hover:text-emerald-500 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => { setContentToDelete(item.id); setIsDeleteDialogOpen(true); }}
            className="p-2 text-gray-500 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="space-y-8">
      {/* Toast */}
      {toast && (
        <div className={cn(
          "fixed top-24 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl border shadow-2xl text-sm font-bold animate-in slide-in-from-right duration-300",
          toast.type === "success"
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
            : "bg-red-500/10 border-red-500/30 text-red-400"
        )}>
          {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ── Form Panel ── */}
        <div className="lg:col-span-7">
          <section className="bg-zinc-900 border border-white/10 rounded-[40px] p-8 lg:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
              <FileText className="w-48 h-48 text-emerald-500" />
            </div>

            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  {editingId ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                    {editingId ? "Edit Content" : "Publish Content"}
                  </h2>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] mt-1">
                    Content Orchestration Console
                  </p>
                </div>
              </div>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-white/5 text-gray-400 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              {/* Row 1: Title + Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="content-title" className="text-[9px] font-black uppercase tracking-widest text-gray-500 px-1">Title *</label>
                  <input
                    id="content-title"
                    value={title} onChange={e => setTitle(e.target.value)} required
                    placeholder="e.g. Gold Macro Structure Q2 2025"
                    className="w-full bg-black border border-white/5 rounded-2xl p-4 text-white text-sm outline-none focus:border-emerald-500/50 transition-all placeholder:text-zinc-700"
                  />
                  {title && (
                    <div className="flex items-center gap-2 px-2 py-1">
                      <Tag className="w-3 h-3 text-gray-600" />
                      <span className="text-[9px] text-gray-600 font-mono">{slugify(title)}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="content-type" className="text-[9px] font-black uppercase tracking-widest text-gray-500 px-1">Content Type</label>
                  <select
                    id="content-type"
                    value={type} onChange={e => setType(e.target.value)}
                    className="w-full bg-black border border-white/5 rounded-2xl p-4 text-white text-sm outline-none focus:border-emerald-500/50 transition-all"
                  >
                    {CONTENT_TYPES.map(ct => (
                      <option key={ct.value} value={ct.value}>{ct.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Body */}
              <div className="space-y-2">
                <label htmlFor="content-body" className="text-[9px] font-black uppercase tracking-widest text-gray-500 px-1">Content Body (Markdown) *</label>
                <textarea
                  id="content-body"
                  rows={8} value={body} onChange={e => setBody(e.target.value)} required
                  placeholder="Write your institutional content here using Markdown..."
                  className="w-full bg-black border border-white/5 rounded-3xl p-6 text-white text-sm outline-none focus:border-emerald-500/50 transition-all font-mono resize-none placeholder:text-zinc-700"
                />
              </div>

              {/* Media + Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="content-cover" className="text-[9px] font-black uppercase tracking-widest text-gray-500 px-1">Cover Image URL</label>
                  <input
                    id="content-cover"
                    type="url" value={coverImage} onChange={e => setCoverImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-black border border-white/5 rounded-2xl p-4 text-white text-sm outline-none focus:border-cyan-500/50 transition-all placeholder:text-zinc-700"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="content-status" className="text-[9px] font-black uppercase tracking-widest text-gray-500 px-1">Publication Status</label>
                  <select
                    id="content-status"
                    value={status} onChange={e => setStatus(e.target.value)}
                    className="w-full bg-black border border-white/5 rounded-2xl p-4 text-white text-sm outline-none focus:border-emerald-500/50 transition-all uppercase font-black"
                  >
                    {STATUSES.map(s => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full py-4 bg-emerald-500 text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-emerald-400 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-emerald-500/20 disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                {editingId ? "Save Changes" : "Publish Content"}
              </button>
            </form>
          </section>
        </div>

        {/* ── Content List ── */}
        <div className="lg:col-span-5">
          <section className="bg-zinc-900 border border-white/10 rounded-[40px] overflow-hidden shadow-2xl flex flex-col h-full">
            {/* List Header */}
            <div className="p-6 border-b border-white/5 bg-black/20 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-white font-black text-sm uppercase tracking-tight">
                    Content Feed
                  </h3>
                  <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">
                    ({filteredPosts.length})
                  </span>
                </div>
                <button onClick={fetchPosts} disabled={fetching} className="p-2 text-gray-600 hover:text-white transition-colors">
                  <RefreshCw className={cn("w-3.5 h-3.5", fetching && "animate-spin")} />
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
                <input
                  type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search content..."
                  className="w-full bg-black border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-emerald-500/50 transition-all placeholder:text-zinc-700"
                />
              </div>

              {/* Type Filter */}
              <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
                {["all", ...CONTENT_TYPES.map(t => t.value)].map(t => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={cn(
                      "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all",
                      filterType === t
                        ? "bg-emerald-500 text-black"
                        : "bg-white/5 text-gray-500 hover:text-white"
                    )}
                  >
                    {t === "all" ? "All" : CONTENT_TYPES.find(ct => ct.value === t)?.label.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* List Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-[700px] scrollbar-hide">
              {renderContentList()}
            </div>
          </section>
        </div>
      </div>

      <Dialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        isLoading={loading}
        title="Delete Content?"
        variant="danger"
        confirmText="Delete Forever"
      >
        <p className="text-gray-400 text-sm font-medium leading-relaxed text-center p-4">
          This will permanently remove the content from the platform. This cannot be undone.
        </p>
      </Dialog>
    </div>
  );
};
