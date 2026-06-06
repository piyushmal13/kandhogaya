import React, { useState } from "react";
import { 
  Search, Filter, 
  Target, Zap,
  ChevronLeft, ChevronRight,
  TrendingUp, Edit3, Trash2, Eye,
  CheckCircle2, AlertCircle, X, ShieldAlert,
  Layers, Users, Calendar
} from "lucide-react";
import { cn } from "../../utils/cn";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "../../lib/supabase";

import { useRealtime } from "../../hooks/useRealtime";
import { Lead } from "../../types";
import { mapLead } from "../../utils/dataMapper";
import { Dialog } from "../../components/ui/Dialog";

const ScoreBadge = ({ score }: { score: number }) => {
  let scoreColor = "text-gray-500";
  if (score > 70) scoreColor = "text-emerald-400";
  else if (score > 40) scoreColor = "text-cyan-400";
  return (
    <span className={cn("text-[11px] font-black italic", scoreColor)}>
      {score}
    </span>
  );
};

export const LeadManager = () => {
  const { data: leads, loading } = useRealtime<any>('leads', undefined, undefined, mapLead);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  
  // Modal states
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form states for editing
  const [editStage, setEditStage] = useState("NEW");
  const [editPriority, setEditPriority] = useState("Standard");
  const [editProbability, setEditProbability] = useState(0);
  const [editScore, setEditScore] = useState(0);
  const [leadFilter, setLeadFilter] = useState<'all' | 'clients' | 'newsletter'>('all');

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredLeads = leads.filter(l => {
    const matchesSearch = 
      l.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      l.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.source?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (leadFilter === 'clients') {
      return l.source !== 'newsletter' && l.stage !== 'NEWSLETTER';
    }
    if (leadFilter === 'newsletter') {
      return l.source === 'newsletter' || l.stage === 'NEWSLETTER';
    }
    return true;
  });

  const handleOpenEdit = (lead: any) => {
    setSelectedLead(lead);
    setEditStage(lead.stage || "NEW");
    setEditPriority(lead.priority_tag || "Standard");
    setEditProbability(lead.conversion_probability || 0);
    setEditScore(lead.score || 0);
    setIsEditOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from("leads")
        .update({
          stage: editStage,
          priority_tag: editPriority,
          conversion_probability: Number(editProbability),
          score: Number(editScore),
          last_action_at: new Date().toISOString()
        })
        .eq("id", selectedLead.id);

      if (error) throw error;
      showToast("success", "CRM Lead updated successfully.");
      setIsEditOpen(false);
    } catch (err: any) {
      console.error("Save Lead Error:", err);
      showToast("error", err.message || "Failed to update lead.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteLead = async () => {
    if (!selectedLead) return;
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from("leads")
        .delete()
        .eq("id", selectedLead.id);

      if (error) throw error;
      showToast("success", "CRM Lead deleted successfully.");
      setIsDeleteOpen(false);
      setSelectedLead(null);
    } catch (err: any) {
      console.error("Delete Lead Error:", err);
      showToast("error", err.message || "Failed to delete lead.");
    } finally {
      setActionLoading(false);
    }
  };

  const renderLeadContent = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={7} className="px-8 py-20 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </td>
        </tr>
      );
    }

    if (filteredLeads.length === 0) {
      return (
        <tr>
          <td colSpan={7} className="px-8 py-20 text-center text-[10px] font-black text-gray-600 uppercase tracking-widest">
            No Prospects Discovered
          </td>
        </tr>
      );
    }

    return filteredLeads.map((lead) => (
      <tr key={lead.id} className="hover:bg-white/5 transition-colors group cursor-pointer border-b border-white/[0.02]" onClick={() => handleOpenEdit(lead)}>
        <td className="px-8 py-6">
          <div className="flex flex-col">
            <span className="text-[11px] font-black text-white uppercase tracking-wider">{lead.name || 'Anonymous Prospect'}</span>
            <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest mt-1">{lead.email}</span>
            <div className="flex flex-wrap gap-2 mt-2">
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
               {lead.priority_tag && lead.priority_tag !== "Standard" && (
                 <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-tighter">
                   {lead.priority_tag}
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
          <ScoreBadge score={lead.score || 0} />
        </td>
        <td className="px-8 py-6">
          <div className="flex flex-col">
             <span className="text-[10px] font-black text-white uppercase tracking-widest italic truncate max-w-[150px]">
               {lead.crm_metadata?.last_action || lead.source || 'Direct Discovery'}
             </span>
             <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest mt-1">
               {lead.last_action_at ? formatDistanceToNow(new Date(lead.last_action_at), { addSuffix: true }) : 'N/A'}
             </span>
          </div>
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
            <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest italic">Organic Alpha</span>
          )}
        </td>
        <td className="px-8 py-6 text-right flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => handleOpenEdit(lead)}
            className="p-2 rounded-xl bg-white/5 text-gray-400 hover:bg-emerald-500/20 hover:text-emerald-400 transition-all"
            title="Edit Prospect"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => { setSelectedLead(lead); setIsDeleteOpen(true); }}
            className="p-2 rounded-xl bg-white/5 text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-all"
            title="Delete Prospect"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 relative">
      
      {/* Toast Alert */}
      {toast && (
        <div className={cn(
          "fixed top-24 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl border shadow-2xl text-sm font-bold animate-in slide-in-from-right duration-300",
          toast.type === "success"
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
            : "bg-red-500/10 border-red-500/30 text-red-400"
        )}>
          {toast.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

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

        <div className="flex flex-wrap items-center gap-4">
          {/* Coded Segmentation Tabs */}
          <div className="flex gap-1.5 bg-zinc-950 p-1.5 rounded-2xl border border-white/5">
            <button
              onClick={() => setLeadFilter('all')}
              className={cn("px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer",
                leadFilter === 'all' ? "bg-emerald-500 text-black shadow-lg" : "text-gray-500 hover:text-white"
              )}
            >
              All ({leads.length})
            </button>
            <button
              onClick={() => setLeadFilter('clients')}
              className={cn("px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer",
                leadFilter === 'clients' ? "bg-emerald-500 text-black shadow-lg" : "text-gray-500 hover:text-white"
              )}
            >
              Client Leads ({leads.filter(l => l.source !== 'newsletter' && l.stage !== 'NEWSLETTER').length})
            </button>
            <button
              onClick={() => setLeadFilter('newsletter')}
              className={cn("px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer",
                leadFilter === 'newsletter' ? "bg-emerald-500 text-black shadow-lg" : "text-gray-500 hover:text-white"
              )}
            >
              Newsletter ({leads.filter(l => l.source === 'newsletter' || l.stage === 'NEWSLETTER').length})
            </button>
          </div>

          <button 
            onClick={() => {
              const csv = [
                ["ID", "Name", "Email", "Status/Stage", "Source", "Referrer", "Discovery Date"],
                ...filteredLeads.map(l => [
                  l.id, 
                  l.name || 'Anonymous', 
                  l.email || 'N/A', 
                  l.stage || 'NEW', 
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
          { label: "Pipeline Velocity", value: `${Math.round(leads.length > 0 ? (leads.filter(l => l.stage === 'CONVERTED').length / leads.length) * 100 : 0)}% Converted`, icon: Zap, color: "text-emerald-500" },
          { label: "B2B Intent Signals", value: `${leads.filter(l => l.source?.includes('b2b') || l.source?.includes('talent')).length} Enquiries`, icon: Target, color: "text-cyan-500" },
          { label: "Active Pipeline Size", value: `${leads.length} Records`, icon: TrendingUp, color: "text-amber-500" }
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
                 <th className="px-8 py-6 text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Last Engagement</th>
                 <th className="px-8 py-6 text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Attribution code</th>
                 <th className="px-8 py-6 text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] text-right">Actions</th>
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

      {/* ── EDIT DETAILED PROSPECT MODAL ── */}
      {isEditOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0c0d10] border border-white/10 rounded-[3rem] p-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative animate-in zoom-in duration-300">
            <button 
              onClick={() => setIsEditOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-8 pb-4 border-b border-white/5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Prospect Details & Edit</h3>
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">{selectedLead.source}</span>
              </div>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-6">
              {/* Display Fields */}
              <div className="grid grid-cols-2 gap-4 bg-white/[0.01] border border-white/5 p-6 rounded-2xl text-xs space-y-2">
                <div className="col-span-2 text-[9px] font-black uppercase tracking-widest text-gray-500">PROSPECT METADATA</div>
                <div>
                  <span className="text-gray-500 block uppercase tracking-wider text-[8px]">Full Name</span>
                  <span className="text-white font-bold text-sm uppercase">{selectedLead.name}</span>
                </div>
                <div>
                  <span className="text-gray-500 block uppercase tracking-wider text-[8px]">Email Node</span>
                  <span className="text-emerald-400 font-mono font-semibold">{selectedLead.email}</span>
                </div>
                <div>
                  <span className="text-gray-500 block uppercase tracking-wider text-[8px]">Ingestion Source</span>
                  <span className="text-white font-bold uppercase tracking-wider">{selectedLead.source}</span>
                </div>
                <div>
                  <span className="text-gray-500 block uppercase tracking-wider text-[8px]">Discovery Date</span>
                  <span className="text-white font-mono">{new Date(selectedLead.created_at).toLocaleString()}</span>
                </div>
              </div>

              {/* Ingested Form Telemetry Details */}
              {selectedLead.crm_metadata && Object.keys(selectedLead.crm_metadata).length > 0 && (
                <div className="bg-[#050608] border border-emerald-500/15 p-6 rounded-2xl text-xs space-y-4">
                  <div className="text-[9px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5" />
                    Ingested Brief Details
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
                    {Object.entries(selectedLead.crm_metadata).map(([key, val]: [string, any]) => {
                      if (typeof val === 'object') return null;
                      return (
                        <div key={key} className="border-b border-white/[0.02] pb-2">
                          <span className="text-gray-500 block uppercase tracking-wider text-[8px]">{key.replace(/_/g, " ")}</span>
                          <span className="text-white font-semibold">{String(val)}</span>
                        </div>
                      );
                    })}
                  </div>
                  {selectedLead.crm_metadata.custom_requirements && (
                    <div className="pt-2 border-t border-white/5">
                      <span className="text-gray-500 block uppercase tracking-wider text-[8px] mb-1">Custom Inquiries / Requirements</span>
                      <p className="text-white/80 font-mono text-[11px] leading-relaxed bg-black/40 p-4 rounded-xl border border-white/5 whitespace-pre-wrap">{selectedLead.crm_metadata.custom_requirements}</p>
                    </div>
                  )}
                  {selectedLead.message && (
                    <div className="pt-2 border-t border-white/5">
                      <span className="text-gray-500 block uppercase tracking-wider text-[8px] mb-1">User Message / Track Record</span>
                      <p className="text-white/80 font-mono text-[11px] leading-relaxed bg-black/40 p-4 rounded-xl border border-white/5 whitespace-pre-wrap">{selectedLead.message}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Brand Promotion & CPA Telemetry */}
              {((selectedLead.metadata && Object.keys(selectedLead.metadata).length > 0) || selectedLead.referred_by_code) && (
                <div className="bg-[#050B14] border border-blue-500/15 p-6 rounded-2xl text-xs space-y-4">
                  <div className="text-[9px] font-black uppercase tracking-widest text-blue-400 flex items-center gap-2">
                    <Target className="w-3.5 h-3.5" />
                    Brand Promotion & CPA Attribution
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs font-medium">
                    <div>
                      <span className="text-gray-500 block uppercase tracking-wider text-[8px]">Target Brand / Partner</span>
                      <span className="text-white font-bold uppercase">{selectedLead.metadata?.target_brand || selectedLead.metadata?.broker || 'IFX Trades Direct'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block uppercase tracking-wider text-[8px]">Attribution Source</span>
                      <span className="text-white font-bold uppercase">{selectedLead.referred_by_code || selectedLead.metadata?.referred_by_code || 'Organic Link'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block uppercase tracking-wider text-[8px]">CPA Conversion Payout</span>
                      <span className="text-emerald-400 font-mono font-bold">${selectedLead.metadata?.cpa_payout || selectedLead.metadata?.payout_amount || '0.00'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block uppercase tracking-wider text-[8px]">Campaign Clicks</span>
                      <span className="text-white font-bold font-mono">{selectedLead.metadata?.clicks_count || selectedLead.metadata?.click_count || '1'} Clicks</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block uppercase tracking-wider text-[8px]">Converted Sales</span>
                      <span className="text-white font-bold font-mono">{selectedLead.metadata?.sales_count || '0'} Sales</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block uppercase tracking-wider text-[8px]">Target Campaign</span>
                      <span className="text-white font-bold uppercase truncate max-w-[120px]">{selectedLead.metadata?.campaign || 'Default Growth'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Editable Fields */}
              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/5">
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black uppercase tracking-widest text-gray-500">Lifecycle Stage</label>
                  <select 
                    value={editStage}
                    onChange={(e) => setEditStage(e.target.value)}
                    className="w-full bg-black border border-white/5 rounded-xl p-3.5 text-xs text-white outline-none focus:border-emerald-500/50 uppercase font-black tracking-wider"
                  >
                    <option value="NEW">NEW</option>
                    <option value="INTERESTED">INTERESTED</option>
                    <option value="HIGH_INTENT">HIGH_INTENT</option>
                    <option value="PAYMENT_PENDING">PAYMENT_PENDING</option>
                    <option value="CONVERTED">CONVERTED</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[8px] font-black uppercase tracking-widest text-gray-500">Priority Tag</label>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value)}
                    className="w-full bg-black border border-white/5 rounded-xl p-3.5 text-xs text-white outline-none focus:border-emerald-500/50 uppercase font-black tracking-wider"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Vetted Quant">Vetted Quant</option>
                    <option value="VIP Broker">VIP Broker</option>
                    <option value="White Label Partner">White Label Partner</option>
                    <option value="High Intent Prospect">High Intent Prospect</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[8px] font-black uppercase tracking-widest text-gray-500">Conversion Probability (0 - 100)</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="100" 
                    value={editProbability}
                    onChange={(e) => setEditProbability(Number(e.target.value))}
                    className="w-full bg-black border border-white/5 rounded-xl p-3.5 text-xs text-white outline-none focus:border-emerald-500/50 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[8px] font-black uppercase tracking-widest text-gray-500">Vetting Score (0 - 100)</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="100" 
                    value={editScore}
                    onChange={(e) => setEditScore(Number(e.target.value))}
                    className="w-full bg-black border border-white/5 rounded-xl p-3.5 text-xs text-white outline-none focus:border-emerald-500/50 font-mono font-bold"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t border-white/5">
                <button 
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-[10px] uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {actionLoading ? <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Save CRM Changes
                </button>
                <button 
                  type="button"
                  onClick={() => setIsDeleteOpen(true)}
                  disabled={actionLoading}
                  className="px-6 py-4 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Lead Dialog */}
      <Dialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteLead}
        isLoading={actionLoading}
        title="Remove Lead Profile?"
        variant="danger"
        confirmText="Confirm Delete"
      >
        <p className="text-gray-400 text-sm font-medium leading-relaxed text-center p-6">
          This will permanently delete {selectedLead?.name || "this prospect"}'s record and all associated metadata from your Supabase leads repository. This action is irreversible.
        </p>
      </Dialog>

    </div>
  );
};
