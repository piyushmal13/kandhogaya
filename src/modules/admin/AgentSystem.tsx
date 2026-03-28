import React, { useState, useEffect } from "react";
import { 
  Trophy, TrendingUp, Wallet, 
  User, Landmark, RefreshCw
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { cn } from "../../utils/cn";
import { safeQuery } from "@/core/dataMapper";

export const AgentSystem = () => {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAgentIntelligence = async () => {
    setLoading(true);
    try {
      // 1. Discovery: Get All Sales with Agent Codes
      const sales = await safeQuery(
        supabase
          .from('sales_tracking')
          .select(`*, sales_pipeline!inner(agent_code)`)
          .then() as any,
        (raw) => raw,
        "Agent Sales Discovery"
      );

      // 2. Intelligence: Aggregate Performance
      const agentPerf: any = {};
      sales?.forEach((s: any) => {
        const code = s.sales_pipeline?.agent_code || "unassigned";
        if (!agentPerf[code]) {
           agentPerf[code] = { code, revenue: 0, salesCount: 0, payoutPending: 0 };
        }
        agentPerf[code].revenue += (s.sale_amount || 0);
        agentPerf[code].salesCount += 1;
        // Mock Payout Rules: 20% commission
        if (s.status === 'success') {
          agentPerf[code].payoutPending += (s.sale_amount || 0) * 0.2;
        }
      });

      const leaderBoard = Object.values(agentPerf)
        .sort((a: any, b: any) => b.revenue - a.revenue);

      setAgents(leaderBoard);
    } catch (err) {
      console.error("Institutional Agent Discovery Failure:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgentIntelligence();
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* 1. Executive Performance summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { id: "active", label: "Active Revenue Agents", value: agents.length, icon: User, color: "text-white" },
          { id: "payout", label: "System Payout Volume", value: `$${agents.reduce((sum, a) => sum + a.payoutPending, 0).toLocaleString()}`, icon: Wallet, color: "text-emerald-500" },
          { id: "tier", label: "Elite Growth Tier", value: agents[0]?.code || "N/A", icon: Trophy, color: "text-amber-500" }
        ].map((s) => (
          <div key={s.id} className="bg-zinc-900 border border-white/10 p-10 rounded-[48px] shadow-2xl relative group overflow-hidden">
             <div className={cn("absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity", s.color)}>
               <s.icon className="w-24 h-24" />
             </div>
             <div className="flex flex-col">
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-8">{s.label}</span>
               <div className={cn("text-5xl font-black tracking-tighter italic", s.color)}>{s.value}</div>
             </div>
          </div>
        ))}
      </div>

      {/* 2. Leaderboard Matrix */}
      <div className="bg-zinc-900 border border-white/10 rounded-[56px] shadow-2xl overflow-hidden p-12">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic text-center lg:text-left">Elite Agent Leaderboard</h2>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2 text-center lg:text-left">Automated performance and payout distribution</p>
          </div>
          <button onClick={fetchAgentIntelligence} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all self-center lg:self-auto">
             <RefreshCw className={cn("w-5 h-5 text-gray-400", loading && "animate-spin")} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {agents.map((agent, index) => (
            <div key={agent.code} className="group relative bg-black/40 border border-white/5 p-8 rounded-[40px] hover:border-emerald-500/20 transition-all">
               <div className="absolute top-8 right-8 text-[64px] font-black italic text-white/5 group-hover:text-emerald-500/10 transition-colors pointer-events-none">
                 #{index + 1}
               </div>

               <div className="flex flex-col lg:flex-row lg:items-center gap-10 relative z-10">
                  <div className={cn(
                    "w-20 h-20 rounded-[32px] flex items-center justify-center transition-all shadow-2xl shadow-emerald-500/10",
                    index === 0 ? "bg-amber-500 text-black" : "bg-white/5 text-emerald-500 border border-white/10"
                  )}>
                    {index === 0 ? <Trophy className="w-10 h-10" /> : <TrendingUp className="w-10 h-10" />}
                  </div>

                  <div className="flex-1">
                     <div className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">{agent.code}</div>
                     <div className="flex flex-wrap items-center gap-10">
                        <div>
                          <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-1">Generated Revenue</span>
                          <span className="text-2xl font-black text-white italic">${agent.revenue.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-1">Total Signals</span>
                          <span className="text-xl font-black text-white italic">{agent.salesCount}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest block mb-1">Pending Payout</span>
                          <span className="text-2xl font-black text-emerald-500 italic">${agent.payoutPending.toLocaleString()}</span>
                        </div>
                     </div>
                  </div>

                  <div className="flex items-center gap-4 w-full lg:w-auto mt-6 lg:mt-0">
                     <button className="flex-1 lg:flex-none py-5 px-10 bg-emerald-500 text-black font-black text-[10px] uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl shadow-emerald-500/20">
                        Finalize Payout
                     </button>
                     <button className="w-16 h-16 bg-white/5 border border-white/10 text-white flex items-center justify-center rounded-2xl hover:bg-white/10 transition-all">
                        <Landmark className="w-6 h-6" />
                     </button>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
