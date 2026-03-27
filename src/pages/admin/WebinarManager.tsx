import React, { useState, useEffect, SyntheticEvent } from "react";
import { Video, Plus, Calendar, Search, Trash2, Edit2 } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import { Dialog } from "../../components/ui/Dialog";
import { getCache, setCache } from "@/utils/cache";

const cacheKey = "webinars_list";

export const WebinarManager = () => {
  const { session } = useAuth();
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
  const [recentWebinars, setRecentWebinars] = useState<any[]>([]);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [webinarToDelete, setWebinarToDelete] = useState<string | null>(null);

  const fetchRecentWebinars = async () => {
    const res = await supabase
      .from('webinars')
      .select('*')
      .order('date_time', { ascending: true })
      .limit(10);
    if (res?.data) {
      setCache(cacheKey, res.data);
      setRecentWebinars(res.data);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initFetch = async () => {
      const cached = getCache(cacheKey);
      if (cached) {
        setRecentWebinars(cached);
        return;
      }

      const res = await supabase
        .from('webinars')
        .select('*')
        .order('date_time', { ascending: true })
        .limit(10);
      
      if (!isMounted) return;

      if (res?.data) {
        setCache(cacheKey, res.data);
        setRecentWebinars(res.data);
      }
    };

    initFetch();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleEdit = (webinar: any) => {
    setEditingId(webinar.id);
    setTitle(webinar.title || "");
    setDescription(webinar.description || "");
    setDateTime(webinar.date_time ? new Date(webinar.date_time).toISOString().slice(0, 16) : "");
    setSpeaker(webinar.speaker_name || "");
    setSpeakerProfileUrl(webinar.speaker_profile_url || "");
    setBrandLogoUrl(webinar.brand_logo_url || "");
    setWebinarImageUrl(webinar.webinar_image_url || "");
    setAboutContent(webinar.about_content || "");
    setLevel(webinar.metadata?.level || "All Levels");
    setDuration(webinar.metadata?.duration || "60 mins");
    setIsPaid(webinar.is_paid || false);
    setPrice(webinar.price || 0);
    setIsSponsored(webinar.metadata?.is_sponsored || false);
    setSponsors(webinar.metadata?.sponsors?.join(", ") || "");
    setSponsorLogos(Array.isArray(webinar.sponsor_logos) ? webinar.sponsor_logos.join(", ") : "");
    setMaxAttendees(webinar.max_attendees || 500);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
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

  const handlePublish = async (e: SyntheticEvent) => {
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
        price: isPaid ? price : 0,
        max_attendees: maxAttendees,
        status: 'upcoming',
        sponsor_logos: sponsorLogos.split(",").map(s => s.trim()).filter(s => s !== ""),
        advanced_features: {
          level,
          duration,
          is_sponsored: isSponsored,
          sponsors: sponsors.split(",").map(s => s.trim()).filter(s => s !== ""),
        }
      };

      if (!session) throw new Error("No active session");
      
      let res;
      if (editingId) {
        res = await fetch(`/api/admin/webinars/${editingId}`, {
          method: "PUT",
          headers: { 
            "Authorization": `Bearer ${session?.access_token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`/api/admin/webinars`, {
          method: "POST",
          headers: { 
            "Authorization": `Bearer ${session?.access_token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        alert(editingId ? "Webinar updated successfully!" : "Webinar published successfully!");
        handleCancelEdit();
        fetchRecentWebinars();
      } else {
        const err = await res.json();
        alert(`Error: ${err.error || "Failed to save webinar"}`);
      }
    } catch (err) {
      console.error("Publishing error:", err);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!webinarToDelete) return;
    setDeleteLoading(true);
    try {
      if (!session) throw new Error("No active session");
      const res = await fetch(`/api/admin/webinars/${webinarToDelete}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${session?.access_token}` }
      });
      if (res.ok) {
        fetchRecentWebinars();
        setIsDeleteDialogOpen(false);
      } else {
        alert("Failed to delete webinar.");
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeleteLoading(false);
      setWebinarToDelete(null);
    }
  };

  const openDeleteDialog = (id: string) => {
    setWebinarToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-7">
        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
              <Video className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {editingId ? "Edit Webinar" : "Create New Webinar"}
            </h2>
          </div>

          <form onSubmit={handlePublish} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="webinarTitle" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Webinar Title</label>
                <input 
                  id="webinarTitle"
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  placeholder="e.g., Institutional Order Flow Masterclass"
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-all" 
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Description</label>
                <textarea 
                  id="description"
                  rows={3} 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  placeholder="Enter webinar description..."
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-all resize-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="dateTime" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Date & Time</label>
                <input 
                  id="dateTime"
                  type="datetime-local"
                  value={dateTime} 
                  onChange={e => setDateTime(e.target.value)} 
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-all" 
                  required
                />
              </div>

              <div>
                <label htmlFor="duration" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Duration</label>
                <input 
                  id="duration"
                  value={duration} 
                  onChange={e => setDuration(e.target.value)} 
                  placeholder="e.g., 60 mins"
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-all" 
                />
              </div>

              <div>
                <label htmlFor="speakerName" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Speaker Name</label>
                <input 
                  id="speakerName"
                  value={speaker} 
                  onChange={e => setSpeaker(e.target.value)} 
                  placeholder="e.g., Alex Wright"
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-all" 
                  required
                />
              </div>

              <div>
                <label htmlFor="speakerProfile" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Speaker Profile Image URL</label>
                <input 
                  id="speakerProfile"
                  value={speakerProfileUrl} 
                  onChange={e => setSpeakerProfileUrl(e.target.value)} 
                  placeholder="https://..."
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-all" 
                />
              </div>

              <div>
                <label htmlFor="brandLogo" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Brand Logo URL</label>
                <input 
                  id="brandLogo"
                  value={brandLogoUrl} 
                  onChange={e => setBrandLogoUrl(e.target.value)} 
                  placeholder="https://..."
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-all" 
                />
              </div>

              <div>
                <label htmlFor="webinarImage" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Webinar Main Image URL</label>
                <input 
                  id="webinarImage"
                  value={webinarImageUrl} 
                  onChange={e => setWebinarImageUrl(e.target.value)} 
                  placeholder="https://..."
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-all" 
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="about" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">About Webinar (Detailed)</label>
                <textarea 
                  id="about"
                  rows={4} 
                  value={aboutContent} 
                  onChange={e => setAboutContent(e.target.value)} 
                  placeholder="Detailed breakdown of what will be covered..."
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-all resize-none"
                />
              </div>

              <div>
                <label htmlFor="level" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Level</label>
                <select 
                  id="level"
                  value={level} 
                  onChange={e => setLevel(e.target.value)} 
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-all"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="All Levels">All Levels</option>
                </select>
              </div>

              <div>
                <label htmlFor="maxAttendees" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Max Attendees</label>
                <input 
                  id="maxAttendees"
                  type="number"
                  value={maxAttendees} 
                  onChange={e => setMaxAttendees(Number.parseInt(e.target.value))} 
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-all" 
                  required
                />
              </div>

              <div className="flex items-center gap-4 mt-8">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isPaid}
                    onChange={e => setIsPaid(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500"
                  />
                  <span className="text-sm text-white">Paid Webinar</span>
                </label>
                {isPaid && (
                  <input 
                    type="number"
                    value={price} 
                    onChange={e => setPrice(Number.parseFloat(e.target.value))} 
                    placeholder="Price ($)"
                    className="w-32 bg-black border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500 transition-all" 
                  />
                )}
              </div>

              <div className="md:col-span-2 flex flex-col gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isSponsored}
                    onChange={e => setIsSponsored(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500"
                  />
                  <span className="text-sm text-white">Sponsored Webinar</span>
                </label>
                {isSponsored && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="sponsors" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Sponsors (Comma separated)</label>
                      <input 
                        id="sponsors"
                        value={sponsors} 
                        onChange={e => setSponsors(e.target.value)} 
                        placeholder="e.g., APEX LIQUIDITY, QUANT.AI"
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-all" 
                      />
                    </div>
                    <div>
                      <label htmlFor="sponsorLogos" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Sponsor Logo URLs (Comma separated)</label>
                      <input 
                        id="sponsorLogos"
                        value={sponsorLogos} 
                        onChange={e => setSponsorLogos(e.target.value)} 
                        placeholder="https://logo1.png, https://logo2.png"
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-all" 
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

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
                type="submit" 
                disabled={loading}
                className="flex-1 py-4 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span>{editingId ? "Update Webinar" : "Publish Webinar"}</span>
                    {!editingId && <Plus className="w-5 h-5" />}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="lg:col-span-5 space-y-6">
        <div className="bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-xl h-full">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-white font-bold flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-500" />
              Upcoming Webinars
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500" />
              <input type="text" placeholder="Search..." className="bg-black border border-white/10 rounded-lg pl-8 pr-3 py-1 text-xs text-white outline-none focus:border-emerald-500" />
            </div>
          </div>
          <div className="p-4 space-y-4">
            {recentWebinars.map((item) => (
              <div key={item.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-emerald-500/30 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-emerald-500 font-bold text-xs uppercase">
                    WEB
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm line-clamp-1">{item.title}</div>
                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">
                      {new Date(item.date_time).toLocaleDateString()} • {item.status}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(item)} className="p-2 text-gray-500 hover:text-emerald-500 transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => openDeleteDialog(item.id)} className="p-2 text-gray-500 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
            {recentWebinars.length === 0 && (
              <div className="text-center text-gray-500 py-8">No upcoming webinars found.</div>
            )}
          </div>
        </div>
      </div>

      <Dialog 
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        isLoading={deleteLoading}
        title="Delete Webinar"
        description="Are you sure you want to delete this webinar? This will remove all registration data and the webinar page itself. This action cannot be undone."
        confirmText="Delete Webinar"
      />
    </div>
  );
};
