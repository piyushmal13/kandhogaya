import React, { useState } from "react";
import { 
  Search, Filter, 
  Target, Zap,
  ChevronLeft, ChevronRight,
  TrendingUp
} from "lucide-react";
import { cn } from "../../utils/cn";
import { useCRM } from "../../hooks/useCRM";

import { useRealtime } from "../../hooks/useRealtime";
import { Lead } from "../../types";

/**
 * LeadManager - Institutional Prospect Acquisition Matrix
 * Transitioned to LIVE STREAM for zero-latency discovery.
 */
export const LeadManager = () => {
  const { data: leads, loading } = useRealtime<Lead>('leads');
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);

  const filteredLeads = leads.filter(l => 
    l.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderLeadContent = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={6} className="px-8 py-20 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </td>
        </tr>
      );
    }

    if (filteredLeads.length === 0) {
      return (
        <tr>
          <td colSpan={6} className="px-8 py-20 text-center text-[10px] font-black text-gray-600 uppercase tracking-widest">
            No Prospects Discovered
          </td>
        </tr>
      );
    }

    return filteredLeads.map((lead) => (
      <tr key={lead.id} className="hover:bg-white/5 transition-colors group cursor-pointer">
        <td className="px-8 py-6">
          <div className="flex flex-col">
            <span className="text-[11px] font-black text-white uppercase tracking-wider">{lead.name || 'Anonymous Prospect'}</span>
            <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest mt-1">{lead.email}</span>
            <div className="flex gap-2 mt-2">
               {(lead.active_licenses ?? 0) > 0 && (
                 <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-tighter">
                   {lead.active_licenses} ACTIVE BOTS
                 </span>
               )}
               {(lead.webinar_count ?? 0) > 0 && (
                 <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 text-[10px] font-black uppercase tracking-tighter">
                   {lead.webinar_count} WEBINARS
                 </span>
               )}
            </div>
          </div>
        </td>
        <td className="px-8 py-6">
          <div className="flex items-center gap-2">
            {(() => {
               let color = 'bg-gray-600';
               let glow = '';
               if (lead.stage === 'CONVERTED') {
                 color = 'bg-emerald-500';
                 glow = 'shadow-[0_0_8px_rgba(16,185,129,0.5)]';
               } else if (lead.stage === 'HIGH_INTENT' || lead.stage === 'INTERESTED') {
                 color = 'bg-cyan-500';
               } else if (lead.stage === 'PAYMENT_PENDING') {
                 color = 'bg-amber-500';
               }
               return <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", color, glow)} />;
            })()}
            <span className="text-[10px] font-black text-white uppercase tracking-widest italic">{lead.stage}</span>
          </div>
        </td>
        <td className="px-8 py-6">
          <div className="flex items-center gap-4">
             <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden w-16">
                <div 
                   className="h-full bg-[#58F2B6]" 
                   style={{ width: `${lead.conversion_probability || 0}%` }}
                />
             </div>
             <span className="text-[11px] font-black text-[#58F2B6] italic">{lead.conversion_probability || 0}%</span>
          </div>
        </td>
        <td className="px-8 py-6 text-center">
          <span className={cn(
             "text-[11px] font-black italic",
             (lead.score || 0) > 70 ? "text-emerald-400" : (lead.score || 0) > 40 ? "text-cyan-400" : "text-gray-500"
          )}>
             {lead.score || 0}
          </span>
        </td>
        <td className="px-8 py-6">
          {lead.assigned_agent_code || lead.referred_by_code ? (
            <div className="flex flex-col">
               <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">{lead.assigned_agent_code || lead.referred_by_code}</span>
               <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest mt-1">
                 {lead.assigned_agent_name ? `Via ${lead.assigned_agent_name}` : 'Affiliate Signal'}
               </span>
            </div>
          ) : (
            <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest italic">Direct Discovery</span>
          )}
        </td>
        <td className="px-8 py-6 text-right">
          <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{new Date(lead.created_at).toLocaleDateString()}</span>
        </td>
      </tr>
    ));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      
      {/* 1. Prospect Discovery Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Lead Acquisition Matrix</h2>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Live Discovery</span>
            </div>
          </div>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mt-2">Institutional Prospect Auditing v6.0</p>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              const csv = [
                ["ID", "Name", "Email", "Status", "Source", "Referrer", "Discovery Date"],
                ...filteredLeads.map(l => [
                  l.id, 
                  l.name || 'Anonymous', 
                  l.email || 'N/A', 
                  l.status || l.stage || 'NEW', 
                  l.source || 'Direct', 
                  l.referred_by_code || 'None', 
                  l.created_at ? new Date(l.created_at).toLocaleDateString() : 'N/A'
                ])
              ].map(e => e.join(",")).join("\n");
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = globalThis.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.setAttribute('href', url);
              a.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
              a.click();
            }}
            className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black text-gray-400 uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <TrendingUp className="w-3 h-3 text-emerald-500" />
            Export CSV
          </button>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-hover:text-emerald-500 transition-colors" />
            <input 
              type="text"
              placeholder="DISCOVER PROSPECT..."
              className="bg-zinc-900 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-[10px] font-black tracking-widest text-white focus:border-emerald-500 transition-all w-64 uppercase"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-3 bg-zinc-900 border border-white/10 rounded-2xl hover:border-emerald-500 transition-all group">
            <Filter className="w-4 h-4 text-gray-500 group-hover:text-emerald-500" />
          </button>
        </div>
      </div>

      {/* 2. Intelligence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Pipeline Velocity", value: "84%", icon: Zap, color: "text-emerald-500" },
          { label: "Intent Signals", value: "12 Active", icon: Target, color: "text-cyan-500" },
          { label: "LTV Projection", value: "$4.8M", icon: TrendingUp, color: "text-amber-500" }
        ].map((stat) => (
          <div key={stat.label} className="bg-zinc-900 border border-white/10 p-8 rounded-[40px] relative overflow-hidden group">
            <div className={cn("absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity", stat.color)}>
              <stat.icon className="w-20 h-20" />
            </div>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 block">{stat.label}</span>
            <div className={cn("text-3xl font-black tracking-tighter italic", stat.color)}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* 3. Prospect Matrix */}
      <div className="bg-zinc-900 border border-white/10 rounded-[48px] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-8 py-6 text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Institutional Identity</th>
                <th className="px-8 py-6 text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Lifecycle Stage</th>
                 <th className="px-8 py-6 text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Conversion Prob.</th>
                 <th className="px-8 py-6 text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] text-center">Score</th>
                 <th className="px-8 py-6 text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Attribution code</th>
                 <th className="px-8 py-6 text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] text-right">Discovery Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {renderLeadContent()}
            </tbody>
          </table>
        </div>

        {/* Server-Side Pagination Controller */}
        <div className="px-8 py-6 bg-white/5 border-t border-white/5 flex items-center justify-between">
          <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
            Displaying Segment {page + 1}
          </div>
          <div className="flex items-center gap-2">
            <button 
              disabled={loading}
              onClick={() => setPage(page - 1)}
              className="p-2 bg-zinc-900 border border-white/10 rounded-xl hover:border-emerald-500 disabled:opacity-30 disabled:hover:border-white/10 transition-all group"
            >
              <ChevronLeft className="w-4 h-4 text-gray-500 group-hover:text-emerald-500" />
            </button>
            <button 
              disabled={loading || leads.length < 20}
              onClick={() => setPage(page + 1)}
              className="p-2 bg-zinc-900 border border-white/10 rounded-xl hover:border-emerald-500 disabled:opacity-30 disabled:hover:border-white/10 transition-all group"
            >
              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-emerald-500" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
