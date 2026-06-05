import React, { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Save, X, Briefcase, FileText, Download, Check, AlertCircle } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { motion } from "motion/react";
import { cn } from "../../utils/cn";

interface Position {
  id: string;
  title: string;
  department: string;
  description: string;
  requirements: string[];
  is_active: boolean;
  type: 'internal' | 'broker_talent';
  location: string;
  created_at: string;
}

interface Application {
  id: string;
  position_id: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  resume_url: string;
  portfolio_url: string | null;
  cover_letter: string | null;
  metadata: {
    tracking_id?: string;
    engagement_type?: string;
    source?: string;
    submitted_at?: string;
  };
  created_at: string;
  position?: {
    title: string;
  } | null;
}

export const HiringManager: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'positions' | 'applications'>('positions');
  const [positions, setPositions] = useState<Position[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);

  // Form State
  const [form, setForm] = useState({
    title: "",
    department: "",
    description: "",
    type: "internal" as 'internal' | 'broker_talent',
    location: "Remote",
    requirementsText: "", // Newline separated
    is_active: true
  });

  const fetchPositions = async () => {
    try {
      const { data, error } = await supabase
        .from("hiring_positions")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) {
        setPositions(data);
      }
    } catch (err) {
      console.error("Error fetching hiring positions:", err);
    }
  };

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from("hiring_applications")
        .select(`
          *,
          position:hiring_positions(title)
        `)
        .order("created_at", { ascending: false });
      
      if (!error && data) {
        setApplications(data as unknown as Application[]);
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([fetchPositions(), fetchApplications()]);
    setLoading(false);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const resetForm = () => {
    setEditingPosition(null);
    setForm({
      title: "",
      department: "",
      description: "",
      type: "internal",
      location: "Remote",
      requirementsText: "",
      is_active: true
    });
    setFormOpen(false);
  };

  const handlePositionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.department || !form.description) {
      alert("Please fill out the required position fields.");
      return;
    }

    const requirements = form.requirementsText
      .split("\n")
      .map(r => r.trim())
      .filter(Boolean);

    const positionPayload = {
      title: form.title,
      department: form.department,
      description: form.description,
      type: form.type,
      location: form.location,
      requirements,
      is_active: form.is_active
    };

    setLoading(true);
    try {
      if (editingPosition) {
        const { error } = await supabase
          .from("hiring_positions")
          .update(positionPayload)
          .eq("id", editingPosition.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("hiring_positions")
          .insert([positionPayload]);
        
        if (error) throw error;
      }
      
      await fetchPositions();
      resetForm();
    } catch (err: any) {
      alert(`Operation failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPosition = (pos: Position) => {
    setEditingPosition(pos);
    setForm({
      title: pos.title,
      department: pos.department,
      description: pos.description,
      type: pos.type,
      location: pos.location,
      requirementsText: (pos.requirements || []).join("\n"),
      is_active: pos.is_active
    });
    setFormOpen(true);
  };

  const handleDeletePosition = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job opening? Candidates applied to this role will lose their job association.")) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from("hiring_positions")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      await loadAllData();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteApplication = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete/reject this candidate application?")) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from("hiring_applications")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      await fetchApplications();
    } catch (err: any) {
      alert(`Failsafe: CV eviction failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getPositionTitle = (app: Application) => {
    if (app.position?.title) return app.position.title;
    return app.metadata?.engagement_type || "General Desk Candidate";
  };

  return (
    <div className="space-y-6">
      
      {/* Title Desk */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-emerald-500" />
          Hiring &amp; B2B Talent Desk
        </h2>
        
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSubTab('positions')}
            className={cn(
              "px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all border",
              activeSubTab === 'positions'
                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                : "bg-white/5 text-white/40 border-transparent hover:text-white"
            )}
          >
            Job Postings ({positions.length})
          </button>
          <button
            onClick={() => setActiveSubTab('applications')}
            className={cn(
              "px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all border",
              activeSubTab === 'applications'
                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                : "bg-white/5 text-white/40 border-transparent hover:text-white"
            )}
          >
            CV Applications ({applications.length})
          </button>
        </div>
      </div>

      {/* Main Switchboard */}
      {activeSubTab === 'positions' ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-black/40 p-4 border border-white/5 rounded-2xl">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Configure active internal or B2B job roles</p>
            <button
              onClick={() => { resetForm(); setFormOpen(!formOpen); }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all text-xs uppercase tracking-widest"
            >
              <Plus className="w-4 h-4" />
              {formOpen ? 'Close Editor' : 'Post Job Opening'}
            </button>
          </div>

          {/* Form Editor */}
          {formOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900 border border-white/5 rounded-3xl p-6 md:p-8 space-y-6"
            >
              <h3 className="text-sm font-black text-white uppercase tracking-widest border-b border-white/5 pb-3 italic">
                {editingPosition ? 'Modify Opening' : 'Deploy New Opening'}
              </h3>

              <form onSubmit={handlePositionSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Role Title *</label>
                    <input
                      required
                      type="text"
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-emerald-500/50 transition-all font-mono"
                      value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value })}
                      placeholder="e.g. C++ HFT Execution Engineer"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Department *</label>
                    <input
                      required
                      type="text"
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-emerald-500/50 transition-all font-mono"
                      value={form.department}
                      onChange={e => setForm({ ...form, department: e.target.value })}
                      placeholder="e.g. Quantitative Strategy"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Hiring Stream Type</label>
                    <select
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-emerald-500/50 transition-all font-mono cursor-pointer"
                      value={form.type}
                      onChange={e => setForm({ ...form, type: e.target.value as any })}
                    >
                      <option value="internal">Internal Core Desk (IFX Core)</option>
                      <option value="broker_talent">B2B Partner Broker Talent Pipeline</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Physical Location</label>
                    <input
                      type="text"
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-emerald-500/50 transition-all font-mono"
                      value={form.location}
                      onChange={e => setForm({ ...form, location: e.target.value })}
                      placeholder="Remote / Mumbai / Dubai"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Role Scope (Description) *</label>
                  <textarea
                    required
                    rows={4}
                    className="w-full bg-black border border-white/10 rounded-2xl px-4 py-3 text-white text-xs outline-none focus:border-emerald-500/50 transition-all font-mono resize-none"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Enter detailed role description..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Requirements List (One per line)</label>
                  <textarea
                    rows={4}
                    className="w-full bg-black border border-white/10 rounded-2xl px-4 py-3 text-white text-xs outline-none focus:border-emerald-500/50 transition-all font-mono resize-none"
                    value={form.requirementsText}
                    onChange={e => setForm({ ...form, requirementsText: e.target.value })}
                    placeholder="e.g.&#13;3+ years of systematic backtesting experience&#13;Proficient with Pandas/Numpy&#13;Previous props exposure preferred"
                  />
                </div>

                <div className="flex items-center gap-6 py-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-white/10 bg-black text-emerald-500"
                      checked={form.is_active}
                      onChange={e => setForm({ ...form, is_active: e.target.checked })}
                    />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Publish Role in Live Desk Portal</span>
                  </label>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-emerald-500 text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-all flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {editingPosition ? 'Update Job Posting' : 'Publish Opening'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 bg-white/5 text-white/60 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Jobs Listing */}
          <div className="space-y-4">
            {loading ? (
              <div className="py-20 flex justify-center">
                <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
              </div>
            ) : positions.length === 0 ? (
              <div className="py-20 text-center border border-dashed border-white/5 rounded-2xl bg-zinc-900/10">
                <p className="text-white/20 text-xs font-bold uppercase tracking-widest">No active desk openings found.</p>
              </div>
            ) : (
              positions.map(pos => (
                <div key={pos.id} className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 md:p-8 hover:border-white/10 transition-all relative overflow-hidden group">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[8px] font-black text-emerald-500 uppercase tracking-widest">
                          {pos.department}
                        </span>
                        <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded text-[8px] font-black text-blue-400 uppercase tracking-widest font-mono">
                          {pos.type === 'internal' ? 'Core Internal' : 'B2B Partner Pipeline'}
                        </span>
                        <span className="text-[10px] font-mono text-white/20">
                          {pos.location}
                        </span>
                        {!pos.is_active && (
                          <span className="px-2.5 py-0.5 bg-red-500/10 border border-red-500/20 rounded text-[8px] font-black text-red-400 uppercase tracking-widest">
                            Paused
                          </span>
                        )}
                      </div>
                      
                      <h4 className="text-white font-black text-lg md:text-xl uppercase tracking-tight italic group-hover:text-emerald-400 transition-colors">
                        {pos.title}
                      </h4>
                      <p className="text-xs text-white/40 leading-relaxed max-w-2xl">{pos.description}</p>
                      
                      {pos.requirements && pos.requirements.length > 0 && (
                        <div className="pt-2">
                          <div className="text-[9px] font-black uppercase text-white/30 tracking-widest mb-1.5">Key Spec Requirements:</div>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {pos.requirements.map((req, i) => (
                              <li key={i} className="flex items-start gap-2 text-[10px] font-mono text-white/50">
                                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="flex md:flex-col gap-2 shrink-0 pt-2 md:pt-0">
                      <button
                        onClick={() => handleEditPosition(pos)}
                        className="p-2.5 bg-white/5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center border border-white/5"
                        title="Edit Role specs"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePosition(pos.id)}
                        className="p-2.5 bg-red-500/10 rounded-xl text-red-500/60 hover:text-red-500 hover:bg-red-500/20 transition-all active:scale-95 flex items-center justify-center border border-red-500/10"
                        title="Evict Job Opening"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* Tab 2: Applications Submissions */
        <div className="space-y-4 animate-in fade-in duration-500">
          {loading ? (
            <div className="py-20 flex justify-center">
              <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
            </div>
          ) : applications.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-white/5 rounded-3xl bg-zinc-900/10">
              <p className="text-white/20 text-xs font-bold uppercase tracking-widest">No CV candidates logged yet.</p>
            </div>
          ) : (
            applications.map(app => (
              <div key={app.id} className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 md:p-8 hover:border-white/10 transition-all relative overflow-hidden group">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                  
                  {/* Bio Desk */}
                  <div className="space-y-4 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[8px] font-black text-emerald-500 uppercase tracking-widest">
                        {getPositionTitle(app)}
                      </span>
                      {app.metadata?.engagement_type && (
                        <span className="px-2.5 py-0.5 bg-white/5 border border-white/10 rounded text-[8px] font-bold text-white/50 uppercase tracking-wider font-mono">
                          {app.metadata.engagement_type}
                        </span>
                      )}
                      <span className="text-[9px] font-mono text-white/20">
                        Submitted: {new Date(app.created_at).toLocaleString()}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-white font-black text-lg md:text-xl uppercase tracking-tighter italic">
                        {app.full_name}
                      </h4>
                      <div className="flex flex-wrap gap-x-6 gap-y-1.5 pt-1 text-xs font-mono text-white/60">
                        <div>Email: <a href={`mailto:${app.email}`} className="text-cyan-400 underline">{app.email}</a></div>
                        {app.phone && <div>Phone: <span className="text-white/80">{app.phone}</span></div>}
                        {app.portfolio_url && (
                          <div>Portfolio: <a href={app.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">{app.portfolio_url}</a></div>
                        )}
                      </div>
                    </div>

                    {app.cover_letter && (
                      <div className="bg-black/40 border border-white/5 p-4 rounded-2xl max-w-3xl">
                        <div className="text-[8px] font-black uppercase text-white/30 tracking-widest mb-1.5">Cover Letter / Quantitative Record:</div>
                        <p className="text-xs text-white/50 leading-relaxed font-mono whitespace-pre-wrap">{app.cover_letter}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions Drawer */}
                  <div className="flex md:flex-col gap-2 shrink-0 pt-2 md:pt-0">
                    <a
                      href={app.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 bg-emerald-500 text-black font-black text-[9px] uppercase tracking-widest rounded-xl hover:bg-emerald-400 active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(16,185,129,0.15)] shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Ingest CV File
                    </a>
                    <button
                      onClick={() => handleDeleteApplication(app.id)}
                      className="p-2.5 bg-red-500/10 rounded-xl text-red-500/60 hover:text-red-500 hover:bg-red-500/20 transition-all active:scale-95 flex items-center justify-center border border-red-500/10"
                      title="Reject Candidate application"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
