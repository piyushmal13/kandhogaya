import React, { useState, useEffect, SyntheticEvent } from "react";
import { Video, Plus, Calendar, Search, Trash2, Edit2, Clock } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import { Dialog } from "../../components/ui/Dialog";
import { getCache, setCache } from "@/utils/cache";
import { DataMapper, safeQuery } from "@/core/dataMapper";
import { Webinar } from "@/types";

const cacheKey = "webinars_list";

export const WebinarManager = () => {
  const { session } = useAuth();
  
  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [speakerProfileUrl, setSpeakerProfileUrl] = useState("");
  const [brandLogoUrl, setBrandLogoUrl] = useState("");
  const [webinarImageUrl, setWebinarImageUrl] = useState("");
  const [aboutContent, setAboutContent] = useState("");
  const [level, setLevel] = useState("All Levels");
  const [duration, setDuration] = useState("60 mins");
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState(0);
  const [isSponsored, setIsSponsored] = useState(false);
  const [sponsors, setSponsors] = useState("");
  const [sponsorLogos, setSponsorLogos] = useState("");
  const [maxAttendees, setMaxAttendees] = useState(500);
  
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [recentWebinars, setRecentWebinars] = useState<Webinar[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [webinarToDelete, setWebinarToDelete] = useState<string | null>(null);

  const fetchRecentWebinars = async () => {
    const data = await safeQuery(
      supabase.from('webinars').select('*').order('date_time', { ascending: true }).limit(10),
      DataMapper.webinar,
      "Admin Webinar Discovery"
    );
    setCache(cacheKey, data, 30000);
    setRecentWebinars(data);
  };

  useEffect(() => {
    const cached = getCache(cacheKey);
    if (cached) {
      setRecentWebinars(cached);
    } else {
      fetchRecentWebinars();
    }
  }, []);

  const handleEdit = (webinar: Webinar) => {
    setEditingId(webinar.id);
    setTitle(webinar.title || "");
    setDescription(webinar.description || "");
    setDateTime(webinar.date_time ? new Date(webinar.date_time).toISOString().slice(0, 16) : "");
    setSpeaker(webinar.speaker_name || "");
    setSpeakerProfileUrl(webinar.speaker_profile_url || "");
    setBrandLogoUrl(webinar.brand_logo_url || "");
    setWebinarImageUrl(webinar.webinar_image_url || "");
    setAboutContent(webinar.about_content || "");
    setLevel((webinar as any).metadata?.level || "All Levels");
    setDuration((webinar as any).metadata?.duration || "60 mins");
    setIsPaid(webinar.is_paid || false);
    setPrice(webinar.price || 0);
    setIsSponsored((webinar as any).metadata?.is_sponsored || false);
    setSponsors((webinar as any).metadata?.sponsors?.join(", ") || "");
    setSponsorLogos(Array.isArray(webinar.sponsor_logos) ? webinar.sponsor_logos.join(", ") : "");
    setMaxAttendees(webinar.max_attendees || 500);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setDateTime("");
    setSpeaker("");
    setSpeakerProfileUrl("");
    setBrandLogoUrl("");
    setWebinarImageUrl("");
    setAboutContent("");
    setLevel("All Levels");
    setDuration("60 mins");
    setIsPaid(false);
    setPrice(0);
    setIsSponsored(false);
    setSponsors("");
    setSponsorLogos("");
    setMaxAttendees(500);
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const payload = {
        title,
        description,
        date_time: new Date(dateTime).toISOString(),
        speaker_name: speaker,
        speaker_profile_url: speakerProfileUrl,
        brand_logo_url: brandLogoUrl,
        webinar_image_url: webinarImageUrl,
        about_content: aboutContent,
        is_paid: isPaid,
        price,
        max_attendees: maxAttendees,
        sponsor_logos: sponsorLogos ? sponsorLogos.split(",").map(s => s.trim()) : [],
        metadata: {
          level,
          duration,
          is_sponsored: isSponsored,
          sponsors: sponsors ? sponsors.split(",").map(s => s.trim()) : [],
          updated_at: new Date().toISOString()
        }
      };

      if (editingId) {
        const { error } = await supabase.from('webinars').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('webinars').insert([payload]);
        if (error) throw error;
      }

      resetForm();
      fetchRecentWebinars();
    } catch (err) {
      console.error("Institutional Webinar Execution Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!webinarToDelete) return;
    setDeleteLoading(true);
    try {
      const { error } = await supabase.from('webinars').delete().eq('id', webinarToDelete);
      if (error) throw error;
      setIsDeleteDialogOpen(false);
      setWebinarToDelete(null);
      fetchRecentWebinars();
    } catch (err) {
      console.error("Institutional Webinar Erasure Error:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-zinc-900 border border-white/10 p-10 rounded-[40px] shadow-2xl">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">
              {editingId ? "Modify Session" : "Schedule New Session"}
            </h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Institutional Webinar Orchestration</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 px-1">Session Title</label>
                <input 
                  type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
                  placeholder="e.g., Institutional Macro Structure v4"
                  className="w-full bg-black border border-white/5 focus:border-emerald-500/50 rounded-2xl p-4 text-white text-sm outline-none transition-all placeholder:text-zinc-700"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 px-1">Institutional Date/Time</label>
                <input 
                  type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} required
                  className="w-full bg-black border border-white/5 focus:border-emerald-500/50 rounded-2xl p-4 text-white text-sm outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 px-1">Speaker Name</label>
                  <input type="text" value={speaker} onChange={(e) => setSpeaker(e.target.value)} className="w-full bg-black border border-white/5 rounded-2xl p-4 text-white text-sm outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 px-1">Max Capacity</label>
                  <input type="number" value={maxAttendees} onChange={(e) => setMaxAttendees(Number(e.target.value))} className="w-full bg-black border border-white/5 rounded-2xl p-4 text-white text-sm outline-none" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 px-1">Strategy Narrative</label>
                <textarea 
                  value={description} onChange={(e) => setDescription(e.target.value)} required rows={4}
                  className="w-full bg-black border border-white/5 focus:border-emerald-500/50 rounded-2xl p-4 text-white text-sm outline-none transition-all resize-none"
                />
              </div>

              <div className="flex gap-8 px-1 pt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" checked={isPaid} onChange={(e) => setIsPaid(e.target.checked)} className="w-5 h-5 rounded-lg border-white/10 bg-black text-emerald-500 focus:ring-emerald-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">Paid Session</span>
                </label>
                {isPaid && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 font-bold">$</span>
                    <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-20 bg-black border border-white/5 rounded-xl p-2 text-white text-xs outline-none" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="submit" disabled={loading}
              className="px-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-emerald-500/10 transition-all disabled:opacity-50"
            >
              {loading ? "Discovering..." : editingId ? "Save Amendment" : "Execute Schedule"}
            </button>
            {editingId && (
              <button 
                type="button" onClick={resetForm}
                className="px-10 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-all"
              >
                Abort Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-zinc-900 border border-white/10 p-10 rounded-[40px] shadow-2xl">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Live Calendar</h2>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Pending Institutional Sessions</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {recentWebinars.length > 0 ? (
            recentWebinars.map((w) => (
              <div key={w.id} className="p-6 rounded-3xl bg-black/40 border border-white/5 flex items-center justify-between group hover:bg-white/[0.02] transition-all">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-emerald-500 transition-colors shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-black uppercase tracking-tight italic">{w.title}</h4>
                    <div className="flex items-center gap-4 mt-1.5 text-[9px] font-black uppercase tracking-widest text-gray-500">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-emerald-500" /> {new Date(w.date_time).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1.5"><Search className="w-3 h-3 text-cyan-500" /> {w.speaker_name}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit(w)} className="p-3 rounded-xl bg-white/5 text-gray-400 hover:bg-emerald-500 hover:text-black transition-all"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => { setWebinarToDelete(w.id); setIsDeleteDialogOpen(true); }} className="p-3 rounded-xl bg-white/5 text-gray-400 hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-black/20 rounded-[32px] border-2 border-dashed border-white/5 uppercase font-black text-gray-700 text-[10px] tracking-widest">
              No sessions found in the institutional hopper.
            </div>
          )}
        </div>
      </div>

      <Dialog isOpen={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} title="Destroy Session?">
        <div className="p-8 text-center">
          <p className="text-gray-400 text-sm font-medium leading-relaxed mb-8 italic">
            "Are you certain you want to erase this session from the public discovery stream? This action is non-reversible."
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
