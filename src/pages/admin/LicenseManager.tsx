import React, { useState, useEffect } from "react";
import { ShieldCheck, Plus, Search, Trash2, Edit2, Zap, Copy, ExternalLink } from "lucide-react";
import { supabase } from "../../lib/supabase";

export const LicenseManager = () => {
  const [licenseUserId, setLicenseUserId] = useState("");
  const [licenseAlgoId, setLicenseAlgoId] = useState("");
  const [licenseKey, setLicenseKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [licenses, setLicenses] = useState<any[]>([]);

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
      console.error("Error fetching licenses:", err);
    }
  };

  useEffect(() => {
    fetchLicenses();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this license?")) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`/api/admin/licenses/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${session?.access_token}` }
      });
      if (res.ok) {
        fetchLicenses();
      } else {
        alert("Failed to delete license.");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleGenerateLicense = async (e: React.FormEvent) => {
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
        alert("License Generated!");
        fetchLicenses();
      } else {
        const err = await res.json();
        alert(`Error: ${err.error}`);
      }
    } catch (err) {
      console.error("License generation error:", err);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-6">
        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Generate Bot License</h2>
          </div>

          <form onSubmit={handleGenerateLicense} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">User ID (UUID)</label>
                <input 
                  value={licenseUserId} 
                  onChange={e => setLicenseUserId(e.target.value)} 
                  placeholder="Paste Supabase User ID"
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-all" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Algo Bot ID</label>
                <input 
                  value={licenseAlgoId} 
                  onChange={e => setLicenseAlgoId(e.target.value)} 
                  placeholder="Paste Bot ID"
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-all" 
                />
              </div>
            </div>

            {licenseKey && (
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl relative group">
                <div className="text-[10px] text-emerald-500 font-bold uppercase mb-2 tracking-widest">Generated Key (Send via WhatsApp)</div>
                <div className="flex items-center justify-between">
                  <div className="text-white font-mono font-bold select-all text-lg">{licenseKey}</div>
                  <button 
                    onClick={() => navigator.clipboard.writeText(licenseKey)}
                    className="p-2 text-emerald-500 hover:text-emerald-400 transition-colors"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            <button 
              disabled={loading}
              className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/10 disabled:opacity-50"
            >
              {loading ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
              Generate & Save License
            </button>
          </form>
        </div>
      </div>

      <div className="lg:col-span-6">
        <div className="bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-xl h-full">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-white font-bold flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-500" />
              Active Licenses
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500" />
              <input type="text" placeholder="Search..." className="bg-black border border-white/10 rounded-lg pl-8 pr-3 py-1 text-xs text-white outline-none focus:border-emerald-500" />
            </div>
          </div>
          <div className="p-4 space-y-4">
            {licenses.map((license) => {
              const isActive = license.is_active && new Date(license.expires_at) > new Date();
              const daysLeft = Math.ceil((new Date(license.expires_at).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
              
              return (
                <div key={license.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-emerald-500/30 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl bg-black flex items-center justify-center font-bold text-xs ${isActive ? 'text-emerald-500' : 'text-red-500'}`}>
                      {isActive ? 'ACT' : 'EXP'}
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm line-clamp-1">{license.license_key}</div>
                      <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">
                        User: {license.users?.email || license.user_id} • {isActive ? `Expires in ${daysLeft} days` : 'Expired'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleDelete(license.id)} className="p-2 text-gray-500 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              );
            })}
            {licenses.length === 0 && (
              <div className="text-center text-gray-500 py-8">No licenses found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
