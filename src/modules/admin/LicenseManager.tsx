import React, { useState, useEffect, SyntheticEvent } from "react";
import { ShieldCheck, Trash2, Zap, Copy, Clock, User } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { Dialog } from "../../components/ui/Dialog";
import { cn } from "../../utils/cn";

export const LicenseManager = () => {
  const [licenseUserId, setLicenseUserId] = useState("");
  const [licenseAlgoId, setLicenseAlgoId] = useState("");
  const [licenseKey, setLicenseKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [licenses, setLicenses] = useState<any[]>([]);
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [licenseToDelete, setLicenseToDelete] = useState<string | null>(null);

  const fetchLicenses = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/admin/licenses", {
        headers: { "Authorization": `Bearer ${session?.access_token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLicenses(data);
      }
    } catch (err) {
      console.error("Institutional License Discovery Error:", err);
    }
  };

  useEffect(() => {
    fetchLicenses();
  }, []);

  const handleDelete = async () => {
    if (!licenseToDelete) return;
    setDeleteLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`/api/admin/licenses/${licenseToDelete}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${session?.access_token}` }
      });
      if (res.ok) {
        fetchLicenses();
        setIsDeleteDialogOpen(false);
      }
    } catch (err) {
      console.error("Institutional License Erasure Error:", err);
    } finally {
      setDeleteLoading(false);
      setLicenseToDelete(null);
    }
  };

  const openDeleteDialog = (id: string) => {
    setLicenseToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleGenerateLicense = async (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/admin/licenses", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ user_id: licenseUserId, algo_id: licenseAlgoId, duration_days: 30 })
      });
      if (res.ok) {
        const data = await res.json();
        setLicenseKey(data.license_key);
        fetchLicenses();
      }
    } catch (err) {
      console.error("Institutional License Orchestration Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="lg:col-span-12 xl:col-span-5">
        <div className="bg-zinc-900 border border-white/10 rounded-[40px] p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 opacity-30 group-hover:opacity-100 transition-opacity" />
          
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Generate Key</h2>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Institutional Entitlement Issuance</p>
            </div>
          </div>

          <form onSubmit={handleGenerateLicense} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="userId" className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 px-1">Trader ID (UUID)</label>
                <input 
                  id="userId"
                  value={licenseUserId} onChange={e => setLicenseUserId(e.target.value)} 
                  placeholder="Paste Supabase User ID"
                  className="w-full bg-black border border-white/5 focus:border-emerald-500/50 rounded-2xl p-4 text-white text-sm outline-none transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="algoId" className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 px-1">Target Engine ID</label>
                <input 
                  id="algoId"
                  value={licenseAlgoId} onChange={e => setLicenseAlgoId(e.target.value)} 
                  placeholder="Paste Bot ID"
                  className="w-full bg-black border border-white/5 focus:border-emerald-500/50 rounded-2xl p-4 text-white text-sm outline-none transition-all" 
                />
              </div>
            </div>

            {licenseKey && (
              <div className="p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl relative group/key">
                <div className="text-[9px] text-emerald-500 font-black uppercase mb-4 tracking-[0.2em]">Generated Secure Key</div>
                <div className="flex items-center justify-between gap-4">
                  <div className="text-white font-mono font-black select-all text-xl tracking-tighter italic">{licenseKey}</div>
                  <button 
                    type="button"
                    onClick={() => navigator.clipboard.writeText(licenseKey)}
                    className="w-12 h-12 rounded-xl bg-emerald-500 text-black flex items-center justify-center hover:scale-110 transition-all shadow-lg"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            <button 
              type="submit" disabled={loading}
              className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-emerald-500/10 transition-all disabled:opacity-50"
            >
              {loading ? "Generating Signal..." : "Execute Issuance"}
            </button>
          </form>
        </div>
      </div>

      <div className="lg:col-span-12 xl:col-span-7">
        <div className="bg-zinc-900 border border-white/10 rounded-[40px] overflow-hidden shadow-2xl h-full flex flex-col">
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/20">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-500">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-tighter italic">Live Entitlements</h3>
            </div>
          </div>
          <div className="p-8 space-y-4 overflow-y-auto max-h-[600px]">
            {licenses.map((license) => {
              const expiresDate = new Date(license.expires_at);
              const isActive = license.is_active && expiresDate > new Date();
              const daysLeft = Math.ceil((expiresDate.getTime() - Date.now()) / (1000 * 3600 * 24));
              
              return (
                <div key={license.id} className="p-6 rounded-3xl bg-black/40 border border-white/5 flex items-center justify-between group hover:border-emerald-500/30 transition-all">
                  <div className="flex items-center gap-6">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-[10px] shrink-0 font-mono",
                      isActive ? "bg-emerald-500/10 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]" : "bg-red-500/10 text-red-500"
                    )}>
                      {isActive ? 'ACT' : 'EXP'}
                    </div>
                    <div>
                      <div className="text-white font-mono font-black text-sm tracking-tight select-all">{license.license_key}</div>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-gray-500">
                          <User className="w-3 h-3 text-cyan-500" /> {license.users?.email || "Unknown Discovery"}
                        </span>
                        <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-gray-500">
                          <Clock className="w-3 h-3 text-emerald-500" /> {isActive ? `${daysLeft}d Remaining` : "Entitlement Expired"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => openDeleteDialog(license.id)} className="p-3 rounded-xl bg-white/5 text-gray-500 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                </div>
              );
            })}
            {licenses.length === 0 && (
              <div className="text-center py-20 bg-black/20 rounded-[32px] border-2 border-dashed border-white/5 uppercase font-black text-gray-700 text-[10px] tracking-widest">
                No active entitlements discovered.
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Dialog 
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title="Revoke Entitlement?"
      >
        <div className="p-8 text-center">
          <p className="text-gray-400 text-sm font-medium leading-relaxed mb-8 italic">
            "Execute permanent revocation of this algorithmic license? The trader will lose institutional terminal access immediately."
          </p>
          <div className="flex gap-4">
            <button onClick={() => setIsDeleteDialogOpen(false)} className="flex-1 py-4 bg-white/5 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all">Abort</button>
            <button onClick={handleDelete} disabled={deleteLoading} className="flex-1 py-4 bg-red-500 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-red-400 shadow-xl shadow-red-500/20 transition-all">
              {deleteLoading ? "Revoking..." : "Execute Erasure"}
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
