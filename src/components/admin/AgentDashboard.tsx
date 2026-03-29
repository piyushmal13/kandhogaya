import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Users, Flame, UserPlus, Target, Search, MoreVertical, ShieldAlert } from "lucide-react";
import { publicSupabase, safeQuery } from "../../lib/supabase";
import { cn } from "../../utils/cn";

/**
 * Institutional Agent Console (v1.24)
 * High-velocity Lead Management and Conversion Tracking.
 */

export const AgentDashboard = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [leadsRes, agentsRes] = await Promise.all([
        safeQuery<any[]>(publicSupabase.from('leads').select('*, user_id!left(email, full_name)')),
        safeQuery<any[]>(publicSupabase.from('agents').select('*'))
      ]);

      setLeads(leadsRes || []);
      setAgents(agentsRes || []);
    } catch (err) {
      console.error("[CRM] Agent Discovery Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReassign = async (leadId: string, agentId: string) => {
    await publicSupabase
      .from('leads')
      .update({ assigned_to: agentId })
      .eq('id', leadId);
    fetchData();
  };

  const filteredLeads = leads.filter(l => {
    if (filter === 'HOT') return l.is_hot;
    if (filter === 'PRIORITY') return l.priority_tag;
    return true;
  });

  if (loading) return <div className="h-screen flex items-center justify-center font-mono text-[10px] uppercase tracking-widest text-[#64748b] animate-pulse">Initializing Agent Interface...</div>;

  return (
    <div className="space-y-8 p-12 bg-black min-h-screen">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">Lead Intelligence <span className="text-emerald-500">Console.</span></h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">v1.24 Institutional Conversion Workflow</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button onClick={() => setFilter('ALL')} className={cn("px-6 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all", filter === 'ALL' ? 'bg-white text-black border-white' : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30')}>All</button>
          <button onClick={() => setFilter('HOT')} className={cn("px-6 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all", filter === 'HOT' ? 'bg-rose-500 text-black border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)]' : 'bg-transparent text-gray-400 border-white/10')}>Hot Leads</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredLeads.map((lead) => (
          <motion.div 
            key={lead.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              "p-8 rounded-[2rem] border transition-all flex items-center justify-between group",
              lead.is_hot ? "bg-rose-500/5 border-rose-500/20" : "bg-white/5 border-white/10 hover:border-white/20"
            )}
          >
            <div className="flex items-center gap-8 flex-1">
              {/* --- Identity --- */}
              <div className="flex flex-col min-w-[200px]">
                <span className="text-white font-black text-xl tracking-tight leading-none mb-2 italic uppercase">
                  {lead.user_id?.full_name || lead.anon_id || 'Unknown Prosp'}
                </span>
                <span className="text-gray-500 text-[10px] font-mono leading-none flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  {lead.user_id?.email || lead.anon_id.split('_')[1] || 'Anonymous'}
                </span>
              </div>

              {/* --- Stage Metrics --- */}
              <div className="flex flex-col min-w-[120px]">
                <span className="text-[9px] font-black text-[#64748b] uppercase tracking-widest mb-2">Stage</span>
                <span className={cn(
                  "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest w-fit",
                  lead.stage === 'CONVERTED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-gray-400'
                )}>
                  {lead.stage}
                </span>
              </div>

              {/* --- Conversion Probability --- */}
              <div className="flex flex-col min-w-[150px]">
                <span className="text-[9px] font-black text-[#64748b] uppercase tracking-widest mb-2">Probability</span>
                <div className="flex items-center gap-3">
                  <span className="text-white font-black text-lg">{lead.conversion_probability}%</span>
                  <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${lead.conversion_probability}%` }} />
                  </div>
                </div>
              </div>

              {/* --- Priority --- */}
              {lead.is_hot && (
                <div className="px-5 py-2 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3">
                  <ShieldAlert className="w-4 h-4 text-rose-500" />
                  <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Priority Trigger</span>
                </div>
              )}
            </div>

            {/* --- Assignment & Control --- */}
            <div className="flex items-center gap-6">
              <div className="flex flex-col text-right">
                <span className="text-[9px] font-black text-[#64748b] uppercase tracking-widest mb-2">Assigned Agent</span>
                <select 
                  className="bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-emerald-500 outline-none"
                  value={lead.assigned_to || ''}
                  onChange={(e) => handleReassign(lead.id, e.target.value)}
                >
                  <option value="">Unassigned</option>
                  {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center cursor-pointer">
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
