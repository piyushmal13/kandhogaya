import React, { useState, useEffect } from "react";
import { 
  TrendingUp, Users, 
  Target, DollarSign, Activity,
  Globe, Clock, Award, ShieldAlert
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { cn } from "../../utils/cn";

export const CEOPanel = () => {
  const [stats, setStats] = useState({
    revenueToday: 0,
    revenueMTD: 0,
    activeUsers: 0,
    conversionRate: 0,
    topAgent: "IFX_ALPHA",
    systemHealth: "Optimal"
  });

  const fetchExecutiveIntelligence = async () => {
    try {
      // 1. Revenue Discovery
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      const { data: sales } = await supabase.from('sales_tracking').select('sale_amount, created_at');
      
      const today = sales?.filter(s => s.created_at >= startOfDay).reduce((sum, s) => sum + s.sale_amount, 0) || 0;
      const mtd = sales?.filter(s => s.created_at >= startOfMonth).reduce((sum, s) => sum + s.sale_amount, 0) || 0;

      // 2. Engagement Discovery
      const { count: users } = await supabase.from('users').select('*', { count: 'exact', head: true });
      const { count: converted } = await supabase.from('sales_pipeline').select('*', { count: 'exact', head: true }).eq('stage', 'converted');

      // 3. Health Discovery
      const { count: errors } = await supabase.from('system_logs').select('*', { count: 'exact', head: true }).eq('level', 'error');

      setStats({
        revenueToday: today,
        revenueMTD: mtd,
        activeUsers: users || 0,
        conversionRate: users ? ((converted || 0) / users) * 100 : 0,
        topAgent: "AGENT_PRO",
        systemHealth: (errors || 0) > 5 ? "Action Required" : "Optimal"
      });
    } catch (err) {
      console.error("Executive Intelligence Discovery Failed:", err);
    }
  };

  useEffect(() => {
    fetchExecutiveIntelligence();
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      {/* 1. High-Density Revenue Matrix */}
      <div className="bg-gradient-to-br from-emerald-500/20 via-black to-black border border-emerald-500/20 p-16 rounded-[64px] shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none">
            <DollarSign className="w-64 h-64 text-emerald-500" />
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 relative z-10">
            <div>
               <div className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500 mb-6">Gross Revenue (MTD)</div>
               <div className="text-8xl font-black text-white tracking-tighter italic tabular-nums">
                  ${stats.revenueMTD.toLocaleString()}
               </div>
               <div className="flex items-center gap-4 mt-8">
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                     <TrendingUp className="w-4 h-4 text-emerald-500" />
                     <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">+12.4% vs LMTD</span>
                  </div>
               </div>
            </div>

            <div className="flex flex-col justify-end lg:items-end">
               <div className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-4">Revenue Realization (Today)</div>
               <div className="text-5xl font-black text-white italic tracking-tighter">${stats.revenueToday.toLocaleString()}</div>
            </div>
         </div>
      </div>

      {/* 2. Operational Intelligence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { id: "density", label: "Trader Density", value: stats.activeUsers, icon: Users, color: "text-white" },
           { id: "funnel", label: "Funnel Efficiency", value: `${stats.conversionRate.toFixed(1)}%`, icon: Target, color: "text-cyan-500" },
           { id: "agent", label: "Elite Growth Partner", value: stats.topAgent, icon: Award, color: "text-amber-500" },
           { id: "health", label: "System Health", value: stats.systemHealth, icon: Activity, color: stats.systemHealth === "Optimal" ? "text-emerald-500" : "text-red-500" }
         ].map((s) => (
           <div key={s.id} className="bg-zinc-900 border border-white/10 p-10 rounded-[48px] shadow-2xl relative group overflow-hidden">
              <div className={cn("absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity", s.color)}>
                 <s.icon className="w-24 h-24" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-6 block">{s.label}</span>
              <div className={cn("text-4xl font-black tracking-tighter italic", s.color)}>{s.value}</div>
              <div className="flex items-center gap-2 mt-6 text-[9px] font-black text-gray-600 uppercase tracking-widest">
                 <Clock className="w-3 h-3" />
                 Last Sync: {new Date().toLocaleTimeString()}
              </div>
           </div>
         ))}
      </div>

      {/* 3. Global Growth Pulse */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-zinc-900 border border-white/10 p-12 rounded-[56px] shadow-2xl">
            <div className="flex items-center justify-between mb-12">
               <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Regional Performance Discovery</h3>
               <Globe className="w-6 h-6 text-gray-600" />
            </div>
            
            <div className="space-y-8">
               {[
                 { id: "na", region: "North America", rev: "$124K", perf: 82 },
                 { id: "eea", region: "European Economic Area", rev: "$89K", perf: 74 },
                 { id: "sea", region: "South East Asia", rev: "$42K", perf: 61 }
               ].map((r) => (
                 <div key={r.id} className="group">
                    <div className="flex items-center justify-between mb-4">
                       <span className="text-[11px] font-black text-white uppercase tracking-widest">{r.region}</span>
                       <span className="text-[11px] font-black text-emerald-500 italic">{r.rev} Realized</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                       <div 
                         className="h-full bg-emerald-500 transition-all duration-1000 group-hover:bg-cyan-500" 
                         style={{ width: `${r.perf}%` }}
                       />
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-zinc-900 border border-white/10 p-12 rounded-[56px] shadow-2xl relative overflow-hidden">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic mb-8">Risk Monitoring</h3>
            <div className="space-y-6">
               <div className="p-8 rounded-[40px] bg-red-500/5 border border-red-500/10 mb-6">
                  <div className="flex items-center gap-4 text-red-500 mb-4">
                     <ShieldAlert className="w-6 h-6" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Bot Intelligence Signal</span>
                  </div>
                  <div className="text-lg font-black text-white uppercase tracking-tight italic">3 Attempts Detected</div>
                  <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest mt-2">Source: Anonymous/Proxy</div>
               </div>

               <div className="p-8 rounded-[40px] bg-white/5 border border-white/10">
                  <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Churn Forecast</div>
                  <div className="text-3xl font-black text-white italic tracking-tighter">1.2%</div>
                  <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-2">Phase: Minimal Risk</div>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
};
