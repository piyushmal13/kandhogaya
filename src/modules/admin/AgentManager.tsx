import React, { useState, useEffect } from "react";
import { Plus, Search, Copy, TrendingUp, DollarSign } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { cn } from "../../utils/cn";

export const AgentManager = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('agent_accounts').select('*, users(full_name, email)');
      if (error) throw error;
      setAgents(data);
    } catch (err) {
      console.error("Institutional Agent Discovery Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const filteredAgents = agents.filter(a => 
    (a.users?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
     a.users?.email?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Partner Orchestration</h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Institutional Sales Network Management</p>
        </div>
        <button className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-emerald-500/10 transition-all flex items-center gap-3">
          <Plus className="w-5 h-5" />
          Authorize New Agent
        </button>
      </div>

      <div className="bg-zinc-900 border border-white/10 rounded-[40px] overflow-hidden shadow-2xl">
        <div className="p-10 border-b border-white/5 flex flex-col lg:row-reverse justify-between items-center gap-6 bg-black/20">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-700" />
            <input 
              type="text" 
              placeholder="Search institutional partners..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black border border-white/5 focus:border-emerald-500/50 rounded-2xl pl-14 pr-6 py-4 text-sm text-white focus:ring-0 outline-none transition-all placeholder:text-zinc-800"
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Global Network</span>
              <span className="text-xl font-mono font-black text-white">{agents.length} AGENTS</span>
            </div>
          </div>
        </div>

        <div className="p-4 overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em]">
                <th className="px-8 py-6">Partner Identity</th>
                <th className="px-8 py-6">Commission Structure</th>
                <th className="px-8 py-6">Performance</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Matrix</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredAgents.map((agent) => (
                <tr key={agent.id} className="bg-white/5 group hover:bg-emerald-500/5 transition-all">
                  <td className="px-8 py-8 first:rounded-l-[32px] border-y border-l border-white/5 group-hover:border-emerald-500/20">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-emerald-500 font-black text-xs uppercase shadow-inner italic">
                        {agent.users?.full_name?.split(' ').map((n: string) => n[0]).join('') || 'FX'}
                      </div>
                      <div>
                        <div className="text-white font-black uppercase tracking-tight italic">{agent.users?.full_name || "Unknown Agent"}</div>
                        <div className="text-[9px] text-gray-500 font-black tracking-widest mt-1 lowercase font-mono">{agent.users?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8 border-y border-white/5 group-hover:border-emerald-500/20">
                    <div className="flex flex-col">
                      <span className="text-emerald-500 font-mono font-black text-lg">{(agent.commission_rate * 100).toFixed(0)}%</span>
                      <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Incentive Tier</span>
                    </div>
                  </td>
                  <td className="px-8 py-8 border-y border-white/5 group-hover:border-emerald-500/20">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                         <DollarSign className="w-4 h-4 text-emerald-500" />
                         <span className="text-white font-black tabular-nums italic">$0</span>
                      </div>
                      <span className="text-gray-500 font-black text-[10px]">LIFETIME</span>
                    </div>
                  </td>
                  <td className="px-8 py-8 border-y border-white/5 group-hover:border-emerald-500/20">
                    <span className={cn(
                      "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest italic border",
                      agent.account_status === "active" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-zinc-800 text-gray-500 border-white/5"
                    )}>
                      {agent.account_status}
                    </span>
                  </td>
                  <td className="px-8 py-8 last:rounded-r-[32px] border-y border-r border-white/5 group-hover:border-emerald-500/20 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="p-3 rounded-xl bg-white/5 text-gray-500 hover:bg-emerald-500 hover:text-black transition-all" title="Copy Referral Link">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button className="p-3 rounded-xl bg-white/5 text-gray-500 hover:bg-cyan-500 hover:text-black transition-all" title="View Full Analytics">
                        <TrendingUp className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredAgents.length === 0 && !loading && (
            <div className="text-center py-32 bg-black/20 rounded-[48px] border-2 border-dashed border-white/5 uppercase font-black text-gray-700 text-[10px] tracking-widest italic mx-6 mb-6">
              No institutional partners discovered in this quadrant.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
