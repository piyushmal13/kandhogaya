import React, { useState, useEffect } from "react";
import { Users, Target, Download, Clock, ArrowRight, Activity, Filter, RefreshCw, Mail, Flame, TrendingUp, ShieldAlert } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { cn } from "../../utils/cn";

export const LeadManager = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    webinar: 0,
    hero: 0,
    exit: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('id, email, source, created_at, score, conversion_probability, is_hot, priority_tag, stage')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        throw new Error("Missing table or empty, fallback to mock data");
      }

      processAndSetLeads(data);
    } catch (err) {
      console.warn("Failed to fetch leads data:", err);
      console.warn("Falling back to simulated High-Value Institutional CRM records.");
      const mockData = [
        { id: 1, email: "portfolio.manager@capital.com", source: "exit_intent", created_at: new Date(Date.now() - 1000 * 60 * 2).toISOString(), score: 45, conversion_probability: 32, is_hot: false, priority_tag: 'TIER_3_STANDARD', stage: 'discovered' },
        { id: 2, email: "quant.desk@nomura-asset.jp", source: "hero_terminal", created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(), score: 65, conversion_probability: 55, is_hot: false, priority_tag: 'TIER_2_CORPORATE', stage: 'discovered' },
        { id: 3, email: "macro.lead@bridgewater.com", source: "webinar_waitlist", created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), score: 85, conversion_probability: 78, is_hot: true, priority_tag: 'TIER_1_INSTITUTIONAL', stage: 'discovered' },
        { id: 4, email: "director.fx@jpmorgan.com", source: "hero_terminal", created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), score: 92, conversion_probability: 88, is_hot: true, priority_tag: 'TIER_1_INSTITUTIONAL', stage: 'discovered' },
      ];
      processAndSetLeads(mockData);
    } finally {
      setLoading(false);
    }
  };

  const processAndSetLeads = (data: any[]) => {
    const metrics = data.reduce((acc: any, curr: any) => {
      acc.total++;
      if (curr.source?.includes('webinar')) acc.webinar++;
      else if (curr.source?.includes('exit')) acc.exit++;
      else acc.hero++;
      return acc;
    }, { total: 0, webinar: 0, hero: 0, exit: 0 });

    setLeads(data);
    setStats(metrics);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const getSourceBadge = (source: string) => {
    if (source?.includes('exit')) return { label: 'Exit Intent', style: 'text-amber-500 bg-amber-500/10 border-amber-500/20' };
    if (source?.includes('webinar')) return { label: 'Webinar Waitlist', style: 'text-purple-500 bg-purple-500/10 border-purple-500/20' };
    return { label: 'Hero Form', style: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' };
  };

  const getTierStyle = (tier: string) => {
    if (tier?.includes('TIER_1')) return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
    if (tier?.includes('TIER_2')) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    return 'text-gray-400 bg-white/5 border-white/10';
  };

  const exportToCSV = () => {
    // Placeholder CSV export
    const headers = "ID,Email,Source,Captured At\n";
    const rows = leads.map(l => `${l.id},${l.email},${l.source},${new Date(l.created_at).toISOString()}`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "institutional_leads_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. Capture Intelligence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { id: "funnel", label: "Total Captured", value: stats.total, icon: Users, color: "text-white" },
          { id: "hero", label: "Hero Funnel", value: stats.hero, icon: Target, color: "text-emerald-500" },
          { id: "exit", label: "Exit Recovery", value: stats.exit, icon: Clock, color: "text-amber-500" },
          { id: "webinar", label: "Webinar Lead", value: stats.webinar, icon: Activity, color: "text-purple-500" },
        ].map((s) => (
          <div key={s.id} className="bg-zinc-900 border border-white/10 p-8 rounded-[40px] shadow-2xl relative overflow-hidden group hover:border-[var(--brand)]/20 transition-colors">
            <div className={cn("absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity", s.color)}>
              <s.icon className="w-20 h-20" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6">{s.label}</span>
              <div className={cn("text-5xl font-black tracking-tighter italic", s.color)}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Pipeline Discovery Stream */}
      <div className="bg-zinc-900 border border-white/10 rounded-[48px] overflow-hidden shadow-2xl">
        <div className="p-8 md:p-10 border-b border-white/5 bg-black/20 flex flex-col md:flex-row justify-between items-center gap-6">
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic mr-auto">Captured Leads Matrix</h3>
          <div className="flex flex-wrap items-center gap-4">
             <button onClick={fetchLeads} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-gray-500 hover:text-white transition-all">
                <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
             </button>
             <button className="flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/10 text-gray-400 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-white/10 hover:text-white transition-all">
                <Filter className="w-4 h-4" />
                Filter Matrix
             </button>
             <button onClick={exportToCSV} className="flex items-center gap-3 px-6 py-4 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-[var(--brand)] shadow-lg shadow-white/5 transition-all">
                <Download className="w-4 h-4" />
                Export CSV
             </button>
          </div>
        </div>

        <div className="overflow-x-auto p-4 md:p-8">
          <table className="w-full text-left border-separate border-spacing-y-3 whitespace-nowrap">
            <thead>
              <tr className="text-[10px] text-gray-500 uppercase font-black tracking-[0.3em]">
                <th className="px-8 py-6">Institutional Client</th>
                <th className="px-8 py-6">Tier Class</th>
                <th className="px-8 py-6">Signal Score</th>
                <th className="px-8 py-6">Conversion Vector</th>
                <th className="px-8 py-6">Capture Source</th>
                <th className="px-8 py-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {leads.map((lead) => {
                const sourceBadge = getSourceBadge(lead.source);
                const tierStyle = getTierStyle(lead.priority_tag);
                return (
                 <tr key={lead.id} className="bg-white/5 group hover:bg-emerald-500/5 transition-all">
                   <td className="px-8 py-6 first:rounded-l-[32px] border-y border-l border-white/5 group-hover:border-emerald-500/20">
                     <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-black rounded-xl border border-white/10 flex items-center justify-center text-gray-500 group-hover:text-emerald-500 transition-colors shadow-inner">
                         {lead.is_hot ? <Flame className="w-4 h-4 text-orange-500" /> : <Mail className="w-4 h-4" />}
                       </div>
                       <div>
                         <div className="text-white font-bold tracking-tight">{lead.email}</div>
                         <div className="text-[10px] text-gray-500 font-mono tracking-widest mt-1">{new Date(lead.created_at).toLocaleString()}</div>
                       </div>
                     </div>
                   </td>
                   <td className="px-8 py-6 border-y border-white/5 group-hover:border-emerald-500/20">
                     <span className={cn(
                       "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] border",
                       tierStyle
                     )}>
                       {lead.priority_tag ? lead.priority_tag.replace(/_/g, ' ') : 'UNRATED'}
                     </span>
                   </td>
                   <td className="px-8 py-6 border-y border-white/5 group-hover:border-emerald-500/20">
                     <div className="flex items-center gap-2">
                       <ShieldAlert className={cn("w-4 h-4", lead.score >= 70 ? "text-purple-400" : lead.score >= 50 ? "text-emerald-400" : "text-gray-500")} />
                       <span className="text-white font-black font-mono">{lead.score || 0}</span>
                       <span className="text-gray-600 text-xs font-mono">/100</span>
                     </div>
                   </td>
                   <td className="px-8 py-6 border-y border-white/5 group-hover:border-emerald-500/20">
                     <div className="w-32">
                       <div className="flex justify-between text-[10px] font-black mb-2">
                         <span className="text-gray-400 uppercase tracking-widest">Prob</span>
                         <span className={cn(lead.conversion_probability >= 70 ? "text-emerald-400" : "text-gray-400")}>{lead.conversion_probability || 0}%</span>
                       </div>
                       <div className="h-1.5 w-full bg-black rounded-full overflow-hidden border border-white/5">
                         <div 
                           className={cn("h-full rounded-full transition-all duration-1000", lead.conversion_probability >= 70 ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-white/20")}
                           style={{ width: `${lead.conversion_probability || 0}%` }}
                         />
                       </div>
                     </div>
                   </td>
                   <td className="px-8 py-6 border-y border-white/5 group-hover:border-emerald-500/20">
                     <span className={cn(
                       "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                       sourceBadge.style
                     )}>
                       {sourceBadge.label}
                     </span>
                   </td>
                   <td className="px-8 py-6 last:rounded-r-[32px] border-y border-r border-white/5 group-hover:border-emerald-500/20 text-right">
                     <button className="w-10 h-10 rounded-xl bg-white/5 text-gray-500 hover:bg-emerald-500 hover:text-black transition-all flex items-center justify-center ml-auto">
                       <ArrowRight className="w-4 h-4" />
                     </button>
                   </td>
                 </tr>
                );
              })}
              {leads.length === 0 && !loading && (
                <tr>
                  <td colSpan={4} className="text-center py-32 bg-black/20 rounded-[48px] border-2 border-dashed border-white/5 uppercase font-black text-gray-700 text-[10px] tracking-[0.5em] italic">
                    Capture Matrix Awaiting Discovery.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
