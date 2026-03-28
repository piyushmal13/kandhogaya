import React, { useState, useEffect } from "react";
import { Users, Target, CheckCircle2, DollarSign, Clock, ArrowRight, Activity, Filter, RefreshCw } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { cn } from "../../utils/cn";

export const LeadManager = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    interested: 0,
    pending: 0,
    converted: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      // 1. Discovery: Get Pipeline Signals joined with User data
      const { data, error } = await supabase
        .from('sales_pipeline')
        .select('*, users(full_name, email, created_at)')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // 2. Intelligence: Calculate Funnel Metrics
      const metrics = data?.reduce((acc: any, curr: any) => {
        acc.total++;
        if (curr.stage === 'new') acc.new++;
        if (curr.stage === 'interested') acc.interested++;
        if (curr.stage === 'payment_pending') acc.pending++;
        if (curr.stage === 'converted') acc.converted++;
        return acc;
      }, { total: 0, new: 0, interested: 0, pending: 0, converted: 0, revenue: 0 }) || {};

      // 3. Revenue Discovery
      const { data: sales } = await supabase.from('sales_tracking').select('user_id, sale_amount');
      metrics.revenue = sales?.reduce((sum, s) => sum + (s.sale_amount || 0), 0) || 0;

      // 4. LTV Calculation per Lead
      const ltvMap: any = {};
      sales?.forEach(s => {
        if (s.user_id) {
          ltvMap[s.user_id] = (ltvMap[s.user_id] || 0) + (s.sale_amount || 0);
        }
      });

      const leadsWithLTV = data?.map(lead => ({
        ...lead,
        ltv: ltvMap[lead.user_id] || 0
      })) || [];

      setLeads(leadsWithLTV);
      setStats(metrics);
    } catch (err) {
      console.error("Institutional CRM Discovery Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'converted': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'payment_pending': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'interested': return 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20';
      default: return 'text-gray-500 bg-white/5 border-white/10';
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. Funnel Intelligence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { id: "funnel", label: "Total Funnel", value: stats.total, icon: Users, color: "text-white" },
          { id: "intent", label: "High Intent", value: stats.interested, icon: Target, color: "text-cyan-500" },
          { id: "pending", label: "Pending Fulfillment", value: stats.pending, icon: Clock, color: "text-amber-500" },
          { id: "converted", label: "Conversions", value: stats.converted, icon: CheckCircle2, color: "text-emerald-500" },
        ].map((s) => (
          <div key={s.id} className="bg-zinc-900 border border-white/10 p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
            <div className={cn("absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity", s.color)}>
              <s.icon className="w-20 h-20" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6">{s.label}</span>
              <div className={cn("text-5xl font-black tracking-tighter italic", s.color)}>{s.value}</div>
              <div className="flex items-center gap-2 mt-4 text-[9px] font-black uppercase tracking-widest text-gray-600">
                <Activity className="w-3 h-3" />
                Live Discovery Signal
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Revenue Metric */}
      <div className="bg-gradient-to-br from-emerald-500/20 via-black to-black border border-emerald-500/20 p-12 rounded-[56px] shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-4">Gross Revenue (MTD)</div>
            <div className="text-7xl font-black text-white tracking-tight tabular-nums italic">$ {stats.revenue.toLocaleString()}</div>
          </div>
          <div className="flex items-center gap-10">
            <div className="text-right">
              <div className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Conversion Efficiency</div>
              <div className="text-2xl font-black text-white italic">{stats.total > 0 ? ((stats.converted / stats.total) * 100).toFixed(1) : 0}%</div>
            </div>
            <div className="w-16 h-16 bg-emerald-500 text-black rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/20">
              <DollarSign className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Pipeline Discovery Stream */}
      <div className="bg-zinc-900 border border-white/10 rounded-[48px] overflow-hidden shadow-2xl">
        <div className="p-10 border-b border-white/5 bg-black/20 flex flex-col md:row-reverse justify-between items-center gap-6">
          <div className="flex items-center gap-4">
             <button onClick={fetchLeads} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-gray-500 hover:text-white transition-all">
                <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
             </button>
             <button className="flex items-center gap-3 px-6 py-4 bg-white border border-white text-black font-black text-[10px] uppercase tracking-widest rounded-2xl hover:scale-105 transition-all">
                <Filter className="w-4 h-4" />
                Filter Matrix
             </button>
          </div>
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Lead Acquisition Matrix</h3>
        </div>

        <div className="overflow-x-auto p-4">
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead>
              <tr className="text-[10px] text-gray-500 uppercase font-black tracking-[0.3em]">
                <th className="px-8 py-6">Trader Discovery</th>
                <th className="px-8 py-6">Current Stage</th>
                <th className="px-8 py-6">Last Intelligence</th>
                <th className="px-8 py-6">Onboarding Date</th>
                <th className="px-8 py-6 text-right">LTV Discovery</th>
                <th className="px-8 py-6 text-right">Matrix</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {leads.map((lead) => (
                <tr key={lead.id} className="bg-white/5 group hover:bg-emerald-500/5 transition-all">
                  <td className="px-8 py-8 first:rounded-l-[32px] border-y border-l border-white/5 group-hover:border-emerald-500/20">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-black rounded-xl border border-white/10 flex items-center justify-center text-gray-500 group-hover:text-emerald-500 transition-colors font-black text-[10px] uppercase italic shadow-inner">
                        {lead.users?.full_name?.split(' ').map((n: string) => n[0]).join('') || 'TR'}
                      </div>
                      <div>
                        <div className="text-white font-black uppercase tracking-tight italic">{lead.users?.full_name || "Anonymous Trader"}</div>
                        <div className="text-[9px] text-gray-500 font-black tracking-widest mt-1 lowercase font-mono">{lead.users?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8 border-y border-white/5 group-hover:border-emerald-500/20">
                    <span className={cn(
                      "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                      getStageColor(lead.stage)
                    )}>
                      {lead.stage}
                    </span>
                  </td>
                  <td className="px-8 py-8 border-y border-white/5 group-hover:border-emerald-500/20">
                    <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest bg-white/5 inline-block px-3 py-1.5 rounded-lg border border-white/5">
                      {lead.last_event?.replace('_', ' ') || "DISCOVERY"}
                    </div>
                  </td>
                  <td className="px-8 py-8 border-y border-white/5 group-hover:border-emerald-500/20">
                    <div className="text-sm text-white font-mono">{new Date(lead.users?.created_at || lead.updated_at).toLocaleDateString()}</div>
                  </td>
                  <td className="px-8 py-8 border-y border-white/5 group-hover:border-emerald-500/20 text-right">
                    <div className="text-sm font-black text-white italic">${(lead.ltv || 0).toLocaleString()}</div>
                  </td>
                  <td className="px-8 py-8 last:rounded-r-[32px] border-y border-r border-white/5 group-hover:border-emerald-500/20 text-right">
                    <button className="w-12 h-12 rounded-xl bg-white/5 text-gray-500 hover:bg-emerald-500 hover:text-black transition-all flex items-center justify-center ml-auto">
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {leads.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="text-center py-32 bg-black/20 rounded-[48px] border-2 border-dashed border-white/5 uppercase font-black text-gray-700 text-[10px] tracking-[0.5em] italic">
                    Funnel Is Awaiting Discovery Signals.
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
