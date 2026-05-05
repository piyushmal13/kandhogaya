import React, { useState, useEffect, SyntheticEvent } from "react";
import {
  Video, Calendar, Trash2, Edit2, Clock, Users, Plus,
  RefreshCw, CheckCircle, XCircle, DollarSign, Globe, Eye
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { Dialog } from "../../components/ui/Dialog";
import { cn } from "../../utils/cn";

interface Webinar {
  id: string;
  title: string;
  description: string;
  date_time: string;
  speaker_name: string;
  speaker_profile_url: string;
  brand_logo_url: string;
  webinar_image_url: string;
  about_content: string;
  is_paid: boolean;
  price: number;
  status: "upcoming" | "live" | "past";
  max_attendees: number;
  registration_count: number;
  sponsor_logos: string[];
  metadata?: {
    partner_name?: string;
    learning_points?: string[];
    [key: string]: any;
  };
}

interface RegistrationRow {
  id: string;
  email: string;
  created_at: string;
  attended: boolean;
  payment_status: string;
}

const EMPTY_FORM = {
  title: "",
  description: "",
  dateTime: "",
  speaker: "",
  speakerProfileUrl: "",
  brandLogoUrl: "",
  webinarImageUrl: "",
  aboutContent: "",
  isPaid: false,
  price: 0,
  status: "upcoming" as Webinar["status"],
  maxAttendees: 500,
  sponsorLogos: "",
  metadata: {} as NonNullable<Webinar["metadata"]>,
};


export const WebinarManager = () => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [webinarToDelete, setWebinarToDelete] = useState<string | null>(null);
  const [viewRegistrations, setViewRegistrations] = useState<string | null>(null);
  const [registrations, setRegistrations] = useState<RegistrationRow[]>([]);
  const [regLoading, setRegLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchWebinars = async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from("webinars")
      .select("*")
      .order("date_time", { ascending: true });

    if (error) {
      console.error("[WebinarManager] Fetch error:", error);
      showToast("error", "Failed to load webinars.");
    } else {
      setWebinars(data || []);
    }
    setFetching(false);
  };

  const fetchRegistrations = async (webinarId: string) => {
    setRegLoading(true);
    setViewRegistrations(webinarId);
    const { data, error } = await supabase
      .from("webinar_registrations")
      .select("id, email, created_at, attended, payment_status")
      .eq("webinar_id", webinarId)
      .order("created_at", { ascending: false });

    if (!error) setRegistrations(data || []);
    setRegLoading(false);
  };

  useEffect(() => { fetchWebinars(); }, []);

  const handleEdit = (w: Webinar) => {
    setEditingId(w.id);
    setForm({
      title: w.title || "",
      description: w.description || "",
      dateTime: w.date_time ? new Date(w.date_time).toISOString().slice(0, 16) : "",
      speaker: w.speaker_name || "",
      speakerProfileUrl: w.speaker_profile_url || "",
      brandLogoUrl: w.brand_logo_url || "",
      webinarImageUrl: w.webinar_image_url || "",
      aboutContent: w.about_content || "",
      isPaid: w.is_paid || false,
      price: w.price || 0,
      status: w.status || "upcoming",
      maxAttendees: w.max_attendees || 500,
      sponsorLogos: Array.isArray(w.sponsor_logos) ? w.sponsor_logos.join(", ") : "",
      metadata: w.metadata || {},
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title: form.title,
      description: form.description,
      date_time: new Date(form.dateTime).toISOString(),
      speaker_name: form.speaker,
      speaker_profile_url: form.speakerProfileUrl,
      brand_logo_url: form.brandLogoUrl,
      webinar_image_url: form.webinarImageUrl,
      about_content: form.aboutContent,
      is_paid: form.isPaid,
      price: form.isPaid ? form.price : 0,
      status: form.status,
      max_attendees: form.maxAttendees,
      sponsor_logos: form.sponsorLogos
        ? form.sponsorLogos.split(",").map(s => s.trim()).filter(Boolean)
        : [],
      metadata: form.metadata,
    };

    try {
      if (editingId) {
        const { error } = await supabase.from("webinars").update(payload).eq("id", editingId);
        if (error) throw error;
        showToast("success", "Webinar updated successfully.");
      } else {
        const { error } = await supabase.from("webinars").insert([payload]);
        if (error) throw error;
        showToast("success", "Webinar scheduled successfully.");
      }
      resetForm();
      fetchWebinars();
    } catch (err: any) {
      console.error("[WebinarManager] Submit error:", err);
      showToast("error", err.message || "Operation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!webinarToDelete) return;
    setDeleteLoading(true);
    try {
      const { error } = await supabase.from("webinars").delete().eq("id", webinarToDelete);
      if (error) throw error;
      setIsDeleteDialogOpen(false);
      setWebinarToDelete(null);
      showToast("success", "Webinar removed from schedule.");
      fetchWebinars();
    } catch (err: any) {
      showToast("error", err.message || "Delete failed.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const STATUS_COLORS = {
    upcoming: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    live:     "bg-red-500/10 text-red-400 border-red-500/20",
    past:     "bg-gray-500/10 text-gray-400 border-gray-500/20",
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
          {toast.type === "success"
            ? <CheckCircle className="w-4 h-4" />
            : <XCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Form Panel */}
      <div className="bg-zinc-900 border border-white/10 p-8 lg:p-12 rounded-[40px] shadow-2xl">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              {editingId ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                {editingId ? "Edit Session" : "Schedule New Session"}
              </h2>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] mt-1">
                Institutional Webinar Orchestration Console
              </p>
            </div>
          </div>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-red-500/20 transition-all"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Row 1: Title + Date + Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-2">
              <label htmlFor="session-title" className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-500">Session Title *</label>
              <input
                id="session-title"
                type="text" required value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Institutional Macro Structure v4"
                className="w-full bg-black border border-white/5 focus:border-emerald-500/50 rounded-2xl p-4 text-white text-sm outline-none transition-all placeholder:text-zinc-700"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="session-date" className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-500">Date & Time *</label>
              <input
                id="session-date"
                type="datetime-local" required value={form.dateTime}
                onChange={e => setForm(f => ({ ...f, dateTime: e.target.value }))}
                className="w-full bg-black border border-white/5 focus:border-emerald-500/50 rounded-2xl p-4 text-white text-sm outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="session-status" className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-500">Status</label>
              <select
                id="session-status"
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value as Webinar["status"] }))}
                className="w-full bg-black border border-white/5 focus:border-emerald-500/50 rounded-2xl p-4 text-white text-sm outline-none transition-all uppercase font-black"
              >
                <option value="upcoming">Upcoming</option>
                <option value="live">Live Now</option>
                <option value="past">Past / Archived</option>
              </select>
            </div>
          </div>

          {/* Row 2: Description */}
          <div className="space-y-2">
            <label htmlFor="session-desc" className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-500">Session Description *</label>
            <textarea
              id="session-desc"
              required rows={3} value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="What will traders learn in this session?"
              className="w-full bg-black border border-white/5 focus:border-emerald-500/50 rounded-2xl p-4 text-white text-sm outline-none transition-all resize-none"
            />
          </div>

          {/* Row 3: Speaker + Max Attendees */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="session-speaker" className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-500">Speaker Name</label>
              <input
                id="session-speaker"
                type="text" value={form.speaker}
                onChange={e => setForm(f => ({ ...f, speaker: e.target.value }))}
                placeholder="e.g. Vikram Shah"
                className="w-full bg-black border border-white/5 rounded-2xl p-4 text-white text-sm outline-none transition-all placeholder:text-zinc-700"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="session-max" className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-500">Max Attendees</label>
              <input
                id="session-max"
                type="number" min={1} value={form.maxAttendees}
                onChange={e => setForm(f => ({ ...f, maxAttendees: Number(e.target.value) }))}
                className="w-full bg-black border border-white/5 rounded-2xl p-4 text-white text-sm outline-none transition-all"
              />
            </div>
            <div className="space-y-2 flex flex-col justify-end">
              <div className="flex items-center gap-6 p-4 bg-black border border-white/5 rounded-2xl">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox" checked={form.isPaid}
                    onChange={e => setForm(f => ({ ...f, isPaid: e.target.checked }))}
                    className="w-4 h-4 rounded border-white/10 bg-black text-emerald-500"
                  />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Paid Session</span>
                </label>
                {form.isPaid && (
                  <div className="flex items-center gap-2 flex-1">
                    <DollarSign className="w-4 h-4 text-gray-500 shrink-0" />
                    <input
                      type="number" min={0} value={form.price}
                      onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                      className="w-full bg-transparent text-white text-sm outline-none font-bold"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Row 4: Media & Collaboration */}
          <div className="p-8 bg-black/60 border border-white/10 rounded-[32px] space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
              <Globe className="w-32 h-32 text-emerald-500" />
            </div>
            
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Institutional Collaboration</h3>
              <div className="px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-widest">
                Partner Desk v2.0
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="partner-name" className="text-[9px] font-black uppercase tracking-widest text-gray-500 px-1">Primary Partner Name</label>
                  <input
                    id="partner-name"
                    type="text"
                    value={form.metadata?.partner_name || ""}
                    onChange={e => setForm(f => ({ ...f, metadata: { ...f.metadata, partner_name: e.target.value } }))}
                    placeholder="e.g. IC Markets / Pepperstone"
                    className="w-full bg-black/60 border border-white/5 rounded-xl p-3.5 text-xs text-white outline-none focus:border-emerald-500/50 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="partner-logo" className="text-[9px] font-black uppercase tracking-widest text-gray-500 px-1">Primary Partner Logo URL</label>
                  <input
                    id="partner-logo"
                    type="url"
                    value={form.brandLogoUrl}
                    onChange={e => setForm(f => ({ ...f, brandLogoUrl: e.target.value }))}
                    placeholder="https://partner-logo.png"
                    className="w-full bg-black/60 border border-white/5 rounded-xl p-3.5 text-xs text-white outline-none focus:border-emerald-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="speaker-profile" className="text-[9px] font-black uppercase tracking-widest text-gray-500 px-1">Speaker Profile Image</label>
                  <input
                    id="speaker-profile"
                    type="url"
                    value={form.speakerProfileUrl}
                    onChange={e => setForm(f => ({ ...f, speakerProfileUrl: e.target.value }))}
                    placeholder="https://speaker-avatar.jpg"
                    className="w-full bg-black/60 border border-white/5 rounded-xl p-3.5 text-xs text-white outline-none focus:border-cyan-500/50 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="webinar-header" className="text-[9px] font-black uppercase tracking-widest text-gray-500 px-1">Webinar Header Image</label>
                  <input
                    id="webinar-header"
                    type="url"
                    value={form.webinarImageUrl}
                    onChange={e => setForm(f => ({ ...f, webinarImageUrl: e.target.value }))}
                    placeholder="https://hero-banner.jpg"
                    className="w-full bg-black/60 border border-white/5 rounded-xl p-3.5 text-xs text-white outline-none focus:border-cyan-500/50 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="sponsor-logos" className="text-[9px] font-black uppercase tracking-widest text-gray-500 px-1">Co-Sponsor Logos (Comma Separated)</label>
              <textarea
                id="sponsor-logos"
                rows={2}
                value={form.sponsorLogos}
                onChange={e => setForm(f => ({ ...f, sponsorLogos: e.target.value }))}
                placeholder="https://broker1.png, https://broker2.png"
                className="w-full bg-black/60 border border-white/5 rounded-xl p-3.5 text-xs text-white outline-none focus:border-emerald-500/50 transition-all resize-none"
              />
            </div>
          </div>

          {/* Row 5: Content Details */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-8 space-y-2">
              <label htmlFor="session-about" className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-500">About This Session (Extended Bio)</label>
              <textarea
                id="session-about"
                rows={8} value={form.aboutContent}
                onChange={e => setForm(f => ({ ...f, aboutContent: e.target.value }))}
                placeholder="Detailed session breakdown and expert bio..."
                className="w-full bg-black border border-white/10 focus:border-emerald-500/50 rounded-[32px] p-6 text-white text-sm outline-none transition-all resize-none font-mono"
              />
            </div>
            <div className="md:col-span-4 space-y-6">
                <div className="p-6 bg-cyan-500/[0.03] border border-cyan-500/10 rounded-[32px] space-y-4">
                   <label htmlFor="learning-points" className="text-[9px] font-black uppercase tracking-widest text-cyan-400">Learning Points (Comma Sep)</label>
                   <textarea
                     id="learning-points"
                     rows={6}
                     value={form.metadata?.learning_points?.join(", ") || ""}
                     onChange={e => setForm(f => ({ ...f, metadata: { ...f.metadata, learning_points: e.target.value.split(",").map(p => p.trim()) } }))}
                     placeholder="Point 1, Point 2, Point 3..."
                     className="w-full bg-black border border-white/5 rounded-2xl p-4 text-xs text-white outline-none focus:border-cyan-500/50 transition-all resize-none"
                   />
                </div>
            </div>
          </div>

          <div className="space-y-2 bg-black/40 p-6 rounded-3xl border border-white/5">
            <label htmlFor="json-metadata" className="text-[9px] font-black uppercase tracking-widest text-cyan-400 px-1 flex items-center gap-2">
              Institutional Metadata (JSON)
            </label>
            <textarea
              id="json-metadata"
              rows={4}
              value={JSON.stringify(form.metadata, null, 2)}
              onChange={e => {
                try { 
                  const parsed = JSON.parse(e.target.value);
                  setForm(f => ({ ...f, metadata: parsed }));
                } catch (err) {}
              }}
              className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white text-xs outline-none focus:border-cyan-500/50 transition-all font-mono"
            />
          </div>


          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="submit" disabled={loading}
              className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-emerald-500/10 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Video className="w-4 h-4" />
              )}
              {editingId ? "Save Changes" : "Schedule Session"}
            </button>
          </div>
        </form>
      </div>

      {/* Webinar List */}
      <div className="bg-zinc-900 border border-white/10 p-8 lg:p-10 rounded-[40px] shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Live Calendar</h2>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] mt-1">
                {webinars.length} sessions in system
              </p>
            </div>
          </div>
          <button
            onClick={fetchWebinars}
            disabled={fetching}
            className="p-3 rounded-xl bg-white/5 border border-white/5 text-gray-500 hover:text-white transition-all"
          >
            <RefreshCw className={cn("w-4 h-4", fetching && "animate-spin")} />
          </button>
        </div>

        {fetching ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-white/5 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {webinars.length === 0 ? (
              <div className="text-center py-20 bg-black/20 rounded-[32px] border-2 border-dashed border-white/5 uppercase font-black text-gray-700 text-[10px] tracking-widest">
                No sessions scheduled. Create one above.
              </div>
            ) : (
              <div className="space-y-4">
                {webinars.map(w => (
                  <div key={w.id} className="p-6 rounded-3xl bg-black/40 border border-white/5 hover:border-white/10 transition-all group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-5 flex-1 min-w-0">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-emerald-500 transition-colors shrink-0">
                          <Clock className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1.5">
                            <h4 className="text-white font-black uppercase tracking-tight text-sm truncate">{w.title}</h4>
                            <span className={cn("px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border shrink-0", STATUS_COLORS[w.status])}>
                              {w.status}
                            </span>
                            {w.is_paid && (
                              <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border shrink-0 bg-amber-500/10 text-amber-400 border-amber-500/20">
                                ${w.price}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-gray-500">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3 h-3 text-emerald-500" />
                              {new Date(w.date_time).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                            </span>
                            {w.speaker_name && (
                              <span className="flex items-center gap-1.5">
                                <Globe className="w-3 h-3 text-cyan-500" />
                                {w.speaker_name}
                              </span>
                            )}
                            <span className="flex items-center gap-1.5 text-gray-600">
                              <Users className="w-3 h-3" />
                              {w.registration_count ?? 0} / {w.max_attendees}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-4">
                        <button
                          onClick={() => fetchRegistrations(w.id)}
                          className="p-3 rounded-xl bg-white/5 text-gray-400 hover:bg-blue-500/20 hover:text-blue-400 transition-all"
                          title="View Registrations"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(w)}
                          className="p-3 rounded-xl bg-white/5 text-gray-400 hover:bg-emerald-500/20 hover:text-emerald-400 transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { setWebinarToDelete(w.id); setIsDeleteDialogOpen(true); }}
                          className="p-3 rounded-xl bg-white/5 text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Registrations Panel */}
      {viewRegistrations && (
        <div className="bg-zinc-900 border border-white/10 p-8 lg:p-10 rounded-[40px] shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Registrations</h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] mt-1">
                  {webinars.find(w => w.id === viewRegistrations)?.title}
                </p>
              </div>
            </div>
            <button onClick={() => setViewRegistrations(null)} className="p-3 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-all">
              <XCircle className="w-4 h-4" />
            </button>
          </div>

          {regLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-12 bg-white/5 rounded-2xl animate-pulse" />)}
            </div>
          ) : (
            <>
              {registrations.length === 0 ? (
                <div className="text-center py-12 text-gray-600 font-bold text-[11px] uppercase tracking-widest">
                  No registrations yet for this session.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/5">
                        {["Email", "Registered At", "Attended", "Payment"].map(h => (
                          <th key={h} className="pb-3 text-[9px] font-black uppercase tracking-widest text-gray-600">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {registrations.map(r => (
                        <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 text-xs text-white font-mono">{r.email}</td>
                          <td className="py-3 text-[10px] text-gray-500">{new Date(r.created_at).toLocaleDateString()}</td>
                          <td className="py-3">
                            <span className={cn("px-2 py-0.5 rounded-full text-[8px] font-black uppercase border", r.attended ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-gray-500/10 text-gray-500 border-gray-500/20")}>
                              {r.attended ? "Yes" : "No"}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className={cn("px-2 py-0.5 rounded-full text-[8px] font-black uppercase border", r.payment_status === "completed" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20")}>
                              {r.payment_status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Delete Dialog */}
      <Dialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        isLoading={deleteLoading}
        title="Remove Session?"
        variant="danger"
        confirmText="Delete Session"
      >
        <p className="text-gray-400 text-sm font-medium leading-relaxed text-center p-6">
          This will permanently remove the webinar and all associated data. This action cannot be undone.
        </p>
      </Dialog>
    </div>
  );
};
