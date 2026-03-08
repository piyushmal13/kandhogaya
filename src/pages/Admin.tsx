import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { BarChart3, Zap, ShieldCheck, Users, ShoppingCart, Video } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { cn } from "../utils/cn";

export const Admin = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("content");
  const [stats, setStats] = useState<any>(null);
  
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [type, setType] = useState("signal");
  const [videoUrl, setVideoUrl] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [takeaways, setTakeaways] = useState("");
  
  const [licenseUserId, setLicenseUserId] = useState("");
  const [licenseAlgoId, setLicenseAlgoId] = useState("");
  const [licenseKey, setLicenseKey] = useState("");

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(r => r.json())
      .then(data => {
        if (data && !data.error) {
          setStats(data);
        } else {
          console.error("Failed to load stats:", data);
          setStats(null);
        }
      })
      .catch(err => {
        console.error("Error fetching stats:", err);
        setStats(null);
      });
  }, []);

  const isAdmin = user?.email === 'admin@ifxtrades.com' || user?.email === 'admin@tradinghub.com' || user?.user_metadata?.role === 'admin';
  if (!user || !isAdmin) return <Navigate to="/" />;

  const handlePublish = async (e: any) => {
    e.preventDefault();
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch("/api/admin/content", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session?.access_token}`
      },
      body: JSON.stringify({ 
        title, 
        content_type: type, 
        body, 
        data: { 
          video_url: videoUrl,
          download_url: downloadUrl,
          cover_image: coverImage,
          takeaways: takeaways.split("\n").filter(t => t.trim() !== ""),
          entry: 2150, sl: 2140, tp: 2170 
        } 
      })
    });
    if (res.ok) {
      alert("Published!");
      setTitle("");
      setBody("");
      setVideoUrl("");
      setDownloadUrl("");
      setCoverImage("");
      setTakeaways("");
    }
  };

  const handleGenerateLicense = async (e: any) => {
    e.preventDefault();
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
    }
  };

  const tabs = [
    { id: "stats", name: "Analytics", icon: BarChart3 },
    { id: "content", name: "Publishing", icon: Zap },
    { id: "licenses", name: "Licenses", icon: ShieldCheck },
    { id: "webinars", name: "Webinars", icon: Video },
    { id: "users", name: "Users", icon: Users },
  ];

  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-bold text-white">IFXTrades Control Center</h1>
        <div className="flex bg-zinc-900 p-1 rounded-xl border border-white/5">
          {tabs.map(tab => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all",
                activeTab === tab.id ? "bg-emerald-500 text-black shadow-lg" : "text-gray-400 hover:text-white"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {activeTab === "stats" && stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: "Total Traders", value: stats.total_users, icon: Users },
              { label: "Active Subs", value: stats.active_subscriptions, icon: ShieldCheck },
              { label: "Revenue (MTD)", value: `$${stats.revenue_mtd}`, icon: ShoppingCart },
              { label: "Signal Accuracy", value: stats.signal_accuracy, icon: Zap },
            ].map((s, i) => (
              <div key={i} className="bg-zinc-900 border border-white/10 p-6 rounded-2xl">
                <s.icon className="text-emerald-500 w-6 h-6 mb-4" />
                <div className="text-2xl font-bold text-white mb-1">{s.value}</div>
                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "content" && (
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8 max-w-3xl">
            <h2 className="text-xl font-bold text-white mb-6">Quick Publish Content</h2>
            <form onSubmit={handlePublish} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Title</label>
                  <input value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Type</label>
                  <select value={type} onChange={e => setType(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500">
                    <option value="signal">Signal</option>
                    <option value="blog">Blog Post</option>
                    <option value="market_report">Market Report</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Body / Analysis</label>
                <textarea rows={5} value={body} onChange={e => setBody(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" />
              </div>

              {type === "blog" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white/5 rounded-2xl border border-white/5">
                  <div className="col-span-2 text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2">Advanced Blog Features</div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Video URL (YouTube/Vimeo)</label>
                    <input value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" placeholder="https://..." />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Download URL (PDF/Report)</label>
                    <input value={downloadUrl} onChange={e => setDownloadUrl(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" placeholder="https://..." />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Cover Image URL</label>
                    <input value={coverImage} onChange={e => setCoverImage(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" placeholder="https://..." />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Key Takeaways (One per line)</label>
                    <textarea rows={3} value={takeaways} onChange={e => setTakeaways(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" placeholder="Support at 2150&#10;Bullish trend..." />
                  </div>
                </div>
              )}

              <button className="w-full py-4 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all">
                Publish to Hub
              </button>
            </form>
          </div>
        )}

        {activeTab === "licenses" && (
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8 max-w-3xl">
            <h2 className="text-xl font-bold text-white mb-6">Generate Bot License</h2>
            <form onSubmit={handleGenerateLicense} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">User ID (UUID)</label>
                  <input value={licenseUserId} onChange={e => setLicenseUserId(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" placeholder="Paste Supabase User ID" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Algo Bot ID</label>
                  <input value={licenseAlgoId} onChange={e => setLicenseAlgoId(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" placeholder="Paste Bot ID" />
                </div>
              </div>
              {licenseKey && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <div className="text-[10px] text-emerald-500 font-bold uppercase mb-1">Generated Key (Send via WhatsApp)</div>
                  <div className="text-white font-mono font-bold select-all">{licenseKey}</div>
                </div>
              )}
              <button className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-emerald-500 transition-all">
                Generate & Save License
              </button>
            </form>
          </div>
        )}
        {activeTab === "webinars" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl">
                <Users className="text-emerald-500 w-6 h-6 mb-4" />
                <div className="text-2xl font-bold text-white mb-1">4,820</div>
                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Total Webinar Leads</div>
              </div>
              <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl">
                <Video className="text-emerald-500 w-6 h-6 mb-4" />
                <div className="text-2xl font-bold text-white mb-1">12</div>
                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Sessions Hosted</div>
              </div>
              <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl">
                <ShoppingCart className="text-emerald-500 w-6 h-6 mb-4" />
                <div className="text-2xl font-bold text-white mb-1">18.4%</div>
                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Avg. Conversion Rate</div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-white font-bold">Recent Webinar Performance</h3>
                <button className="text-xs text-emerald-500 font-bold hover:underline">Export Leads (CSV)</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] text-gray-500 uppercase tracking-widest border-b border-white/5">
                      <th className="px-6 py-4">Webinar Title</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Registrations</th>
                      <th className="px-6 py-4">Attended</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {[
                      { title: "Gold Market Outlook", date: "Oct 24, 2026", reg: 1248, attended: 842, status: "Upcoming" },
                      { title: "Forex Macro Strategy", date: "Oct 17, 2026", reg: 950, attended: 620, status: "Completed" },
                      { title: "Algo Trading Masterclass", date: "Oct 10, 2026", reg: 1540, attended: 1120, status: "Completed" },
                    ].map((w, i) => (
                      <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-white font-medium">{w.title}</td>
                        <td className="px-6 py-4 text-gray-400">{w.date}</td>
                        <td className="px-6 py-4 text-white">{w.reg}</td>
                        <td className="px-6 py-4 text-white">{w.attended}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                            w.status === "Upcoming" ? "bg-emerald-500/10 text-emerald-500" : "bg-gray-500/10 text-gray-500"
                          )}>
                            {w.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
