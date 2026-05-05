import React, { useState, useEffect } from "react";
import { 
  Users, UserMinus, UserCheck, AlertCircle, 
  Mail, RefreshCw, Clock
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { cn } from "../../utils/cn";
import { safeQuery } from "@/core/dataMapper";

export const RetentionHub = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  const fetchRetentionData = async () => {
    setLoading(true);
    try {
      const res = await safeQuery(
        supabase
          .from('sales_pipeline')
          .select(`
            *,
            users(id, email, full_name)
          `)
          .order('updated_at', { ascending: false })
          .then() as any,
        (raw) => raw,
        "Retention Discovery"
      );
      setData(res || []);
    } catch (err) {
      console.error("Institutional Retention Hub failure:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRetentionData();
  }, []);

  const getRetentionStatus = (lastActive: string | null) => {
    if (!lastActive) return { label: "Unknown", color: "text-gray-500", bg: "bg-gray-500/10" };
    
    const diff = Date.now() - new Date(lastActive).getTime();
    const hours = diff / (1000 * 60 * 60);
    const days = hours / 24;

    if (days >= 30) return { label: "Churned", color: "text-red-500", bg: "bg-red-500/10" };
    if (days >= 7) return { label: "At Risk", color: "text-amber-500", bg: "bg-amber-500/10" };
    if (hours >= 48) return { label: "Inactive", color: "text-purple-500", bg: "bg-purple-500/10" };
    return { label: "Pulse Active", color: "text-emerald-500", bg: "bg-emerald-500/10" };
  };

  const categories = {
    active: data.filter(d => getRetentionStatus(d.updated_at).label === "Pulse Active").length,
    inactive: data.filter(d => getRetentionStatus(d.updated_at).label === "Inactive").length,
    atRisk: data.filter(d => getRetentionStatus(d.updated_at).label === "At Risk").length,
    churned: data.filter(d => getRetentionStatus(d.updated_at).label === "Churned").length
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* Executive Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { id: "active", label: "Active Traders", value: categories.active, icon: UserCheck, color: "text-emerald-500" },
          { id: "inactive", label: "Pulse Inactive", value: categories.inactive, icon: Clock, color: "text-purple-500" },
          { id: "risk", label: "Risk Exposure", value: categories.atRisk, icon: AlertCircle, color: "text-amber-500" },
          { id: "churn", label: "Churned Accounts", value: categories.churned, icon: UserMinus, color: "text-red-500" }
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

      <div className="bg-zinc-900 border border-white/10 rounded-[56px] shadow-2xl overflow-hidden p-12">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Retention Monitoring Matrix</h2>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2">Active churn discovery and engagement forecasting</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button onClick={fetchRetentionData} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
               <RefreshCw className={cn("w-5 h-5 text-gray-400", loading && "animate-spin")} />
            </button>
            <div className="flex items-center gap-2 bg-black/40 border border-white/5 p-2 rounded-2xl">
              {["all", "Pulse Active", "Inactive", "At Risk", "Churned"].map((c) => (
                <button 
                  key={c}
                  onClick={() => setFilter(c)}
                  className={cn(
                    "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                    filter === c ? "bg-white text-black" : "text-gray-500 hover:text-white"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {data
            .filter(d => filter === "all" || getRetentionStatus(d.updated_at).label === filter)
            .map((user) => {
              const status = getRetentionStatus(user.updated_at);
              return (
                <div key={user.user_id} className="group flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-black/40 border border-white/5 rounded-3xl hover:border-white/10 transition-all">
                  <div className="flex items-center gap-6">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-all", status.bg, status.color)}>
                       <Users className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="text-lg font-black text-white italic uppercase tracking-tighter">{user.users?.full_name || "Traders Entry"}</div>
                      <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">{user.users?.email}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-8">
                     <div className="flex flex-col text-center">
                        <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-2">Stage</span>
                        <span className="text-xs font-black text-white uppercase italic">{user.stage}</span>
                     </div>
                     <div className="flex flex-col text-center">
                        <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-2">Last Heartbeat</span>
                        <span className="text-xs font-black text-white italic">{user.updated_at ? new Date(user.updated_at).toLocaleString() : "Never"}</span>
                     </div>
                     <div className={cn("px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] italic border border-white/5", status.bg, status.color)}>
                        {status.label}
                     </div>
                     <button className="p-4 bg-emerald-500 text-black rounded-2xl hover:scale-105 transition-all shadow-lg shadow-emerald-500/20">
                        <Mail className="w-5 h-5" />
                     </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

    </div>
  );
};
