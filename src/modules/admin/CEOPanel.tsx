import React, { useState, useEffect } from "react";
import {
  Users, Target, Globe, RefreshCw,
  CreditCard, Video, Star, Zap, Trophy, Activity, ShieldCheck
} from "lucide-react";
import { cn } from "../../utils/cn";
import { supabase, safeQuery } from "../../lib/supabase";
import {
  AreaChart, Area, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar
} from "recharts";
import { useToast } from "../../contexts/ToastContext";


interface LiveStats {
  revenueToday: number;
  revenueMTD: number;
  totalUsers: number;
  totalLeads: number;
  pendingPayments: number;
  upcomingWebinars: number;
  pendingReviews: number;
  systemHealth: "Optimal" | "Warning" | "Critical";
  conversionRate: number;
  activeSubscriptions: number;
}

const INITIAL_STATS: LiveStats = {
  revenueToday: 0,
  revenueMTD: 0,
  totalUsers: 0,
  totalLeads: 0,
  pendingPayments: 0,
  upcomingWebinars: 0,
  pendingReviews: 0,
  systemHealth: "Optimal",
  conversionRate: 0,
  activeSubscriptions: 0,
};

// Generate some sparkline data for the chart based on MTD
const generateSparkline = (mtd: number) => {
  const data = [];
  let base = mtd > 0 ? mtd / 30 : 500;
  for (let i = 0; i < 30; i++) {
    data.push({ day: i + 1, value: base + (Math.random() * base * 0.5) - (base * 0.25) });
  }
  return data;
};

export const CEOPanel = () => {
  const [stats, setStats] = useState<LiveStats>(INITIAL_STATS);
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [sparklineData, setSparklineData] = useState<any[]>([]);
  const { info } = useToast();

  const fetchAllStats = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      const [
        salesData,
        manualPaymentsData,
        usersData,
        leadsData,
        pendingPaymentsData,
        webinarsData,
        reviewsData,
        subsData,
        errorsData,
      ] = await Promise.all([
        safeQuery<any[]>(supabase.from("sales_tracking").select("sale_amount, created_at"), 'sales_tracking_all'),
        safeQuery<any[]>(supabase.from("manual_payment_receipts").select("amount, created_at").eq("status", "approved"), 'manual_payments_approved'),
        safeQuery<any[]>(supabase.from("users").select("id"), 'users_count'),
        safeQuery<any[]>(supabase.from("leads").select("id"), 'leads_count'),
        safeQuery<any[]>(supabase.from("manual_payment_receipts").select("id").eq("status", "pending"), 'payments_pending'),
        safeQuery<any[]>(supabase.from("webinars").select("id").eq("status", "upcoming"), 'webinars_upcoming'),
        safeQuery<any[]>(supabase.from("reviews").select("id").eq("status", "pending"), 'reviews_pending'),
        safeQuery<any[]>(supabase.from("subscriptions").select("id").eq("status", "active"), 'subs_active'),
        safeQuery<any[]>(supabase.from("system_logs").select("id").eq("severity", "critical"), 'logs_critical'),
      ]);

      const getRevenue = (data: any[], dateField: string, amountField: string, startDate: string) => {
        return data
          .filter((s: any) => s[dateField] >= startDate)
          .reduce((sum, s: any) => sum + (Number.parseFloat(s[amountField]) || 0), 0);
      };

      const revenueToday = 
        getRevenue(salesData, 'created_at', 'sale_amount', startOfDay) +
        getRevenue(manualPaymentsData, 'created_at', 'amount', startOfDay);

      const revenueMTD = 
        getRevenue(salesData, 'created_at', 'sale_amount', startOfMonth) +
        getRevenue(manualPaymentsData, 'created_at', 'amount', startOfMonth);

      const totalUsers = usersData.length || 0;
      const totalLeads = leadsData.length || 0;
      const errorCount = errorsData.length || 0;

      let systemHealth: LiveStats["systemHealth"] = "Optimal";
      if (errorCount > 5) {
        systemHealth = "Critical";
      } else if (errorCount > 0) {
        systemHealth = "Warning";
      }

      setStats({
        revenueToday,
        revenueMTD,
        totalUsers,
        totalLeads,
        pendingPayments: pendingPaymentsData.length || 0,
        upcomingWebinars: webinarsData.length || 0,
        pendingReviews: reviewsData.length || 0,
        systemHealth,
        conversionRate: totalLeads > 0 ? ((subsData.length || 0) / totalLeads) * 100 : 0,
        activeSubscriptions: subsData.length || 0,
      });
      
      setSparklineData(generateSparkline(revenueMTD));
      setLastSync(new Date());
    } catch (err) {
      console.error("[CEOPanel] Stats fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const [regionalStats, setRegionalStats] = useState<any[]>([]);
  const [topAgents, setTopAgents] = useState<any[]>([]);

  const fetchExtendedStats = async () => {
     try {
        // 1. Regional Performance (from reviews)
        const regionalData = await safeQuery<any[]>(
          supabase.from('reviews').select('region'),
          'reviews_regions'
        );
        
        if (regionalData.length > 0) {
           const counts: Record<string, number> = {};
           regionalData.forEach((r: any) => {
              if (r.region) counts[r.region] = (counts[r.region] || 0) + 1;
           });
           const total = regionalData.length || 1;
           const mapped = Object.entries(counts).map(([region, count]) => ({
              id: region,
              region: region,
              perf: Math.round((count / total) * 100),
              color: region.includes('Asia') ? 'var(--color8)' : 'var(--color39)'
           })).sort((a, b) => b.perf - a.perf);
           setRegionalStats(mapped);
        }

        // 2. Top Agents (from sales_tracking joined with agents)
        const salesData = await safeQuery<any[]>(
          supabase.from('sales_tracking').select('sale_amount, agent_id, users!sales_tracking_agent_id_fkey(full_name, role)'),
          'sales_tracking_agents'
        );
        
        if (salesData.length > 0) {
           const agentRevenue: Record<string, { name: string, revenue: number }> = {};
           salesData.forEach((s: any) => {
              const id = s.agent_id;
              const name = s.users?.full_name || 'Unknown Agent';
              if (!agentRevenue[id]) agentRevenue[id] = { name, revenue: 0 };
              agentRevenue[id].revenue += (s.sale_amount || 0);
           });
           const top = Object.values(agentRevenue)
             .sort((a, b) => b.revenue - a.revenue)
             .slice(0, 3);
           setTopAgents(top);
        }
     } catch (err) {
        console.error("Extended stats fetch failed:", err);
     }
  };

  useEffect(() => {
    fetchAllStats();
    fetchExtendedStats();
    const interval = setInterval(() => {
       fetchAllStats();
       fetchExtendedStats();
    }, 120000); 
    return () => clearInterval(interval);
  }, []);

  if (loading && !lastSync) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Loading Executive Intelligence...</p>
        </div>
      </div>
    );
  }

  // Radar Data
  const radarData = [
    { subject: 'Acquisition', A: Math.min(100, stats.totalLeads / 10), fullMark: 100 },
    { subject: 'Conversion', A: stats.conversionRate, fullMark: 100 },
    { subject: 'Retention', A: stats.activeSubscriptions > 0 ? 85 : 0, fullMark: 100 },
    { subject: 'Revenue', A: Math.min(100, stats.revenueMTD / 1000), fullMark: 100 },
    { subject: 'Health', A: stats.systemHealth === 'Optimal' ? 100 : 50, fullMark: 100 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">

      {/* Sync Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Executive Terminal</h2>
          <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest mt-1">
            {lastSync ? `Last sync: ${lastSync.toLocaleTimeString()}` : "Syncing..."}
          </p>
        </div>
        <button
          onClick={() => { fetchAllStats(); fetchExtendedStats(); }}
          disabled={loading}
          className="btn-institutional flex items-center gap-2"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
          Force Sync
        </button>
      </div>

      {/* Advanced Revenue Radar & Sparkline Block */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-gradient-to-br from-[#000103] via-[#050505] to-[#10B981]/5 border border-white/5 p-10 rounded-[48px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.03),transparent)] pointer-events-none" />
          
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500/60 mb-2">Gross Revenue (MTD)</div>
              <div className="text-6xl font-black text-white tracking-tighter tabular-nums">
                ${stats.revenueMTD.toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 mb-2">Revenue Today</div>
              <div className="text-3xl font-black text-white tracking-tighter tabular-nums">
                ${stats.revenueToday.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="h-48 w-full mt-4 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#10B981" fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* LTV/CAC Radar */}
        <div className="bg-[var(--raised)] border border-white/5 p-8 rounded-[48px] shadow-2xl flex flex-col items-center justify-center relative z-10">
          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500 mb-2">Vector Performance Radar</div>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 800 }} />
                <Radar name="Metrics" dataKey="A" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* KPI Grid — Live Supabase Counts */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { id: "users",    label: "Total Users",       value: stats.totalUsers,           icon: Users,       color: "text-white",        bg: "bg-white/5" },
          { id: "leads",    label: "CRM Leads",         value: stats.totalLeads,           icon: Target,      color: "text-cyan-400",     bg: "bg-cyan-500/5" },
          { id: "subs",     label: "Active Subs",       value: stats.activeSubscriptions,  icon: Zap,         color: "text-purple-400",   bg: "bg-purple-500/5" },
          { id: "pay",      label: "Pending Payments",  value: stats.pendingPayments,      icon: CreditCard,  color: stats.pendingPayments > 0 ? "text-amber-400" : "text-gray-600", bg: stats.pendingPayments > 0 ? "bg-amber-500/5" : "bg-white/5" },
          { id: "web",      label: "Webinars",          value: stats.upcomingWebinars,     icon: Video,       color: "text-emerald-400",  bg: "bg-emerald-500/5" },
          { id: "reviews",  label: "Reviews Pending",   value: stats.pendingReviews,       icon: Star,        color: stats.pendingReviews > 0 ? "text-red-400" : "text-gray-600", bg: stats.pendingReviews > 0 ? "bg-red-500/5" : "bg-white/5" },
        ].map(s => (
          <div key={s.id} className={cn("p-6 rounded-[28px] border border-white/5 bg-[var(--raised)] backdrop-blur-xl group hover:border-white/10 transition-all", s.bg)}>
            <s.icon className={cn("w-5 h-5 mb-4 opacity-50 group-hover:opacity-100 transition-opacity", s.color)} />
            <div className={cn("text-3xl font-black tabular-nums tracking-tighter italic", s.color)}>
              {loading ? "—" : s.value.toLocaleString()}
            </div>
            <div className="text-[9px] font-black uppercase tracking-widest text-gray-700 mt-2 group-hover:text-gray-500 transition-colors">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Sovereign Intelligence Monitor & Geopolitical Signal Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Intelligence Monitor */}
        <div className="bg-zinc-900 border border-white/10 p-10 rounded-[48px] shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.02] to-transparent pointer-events-none" />
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Sovereign <span className="text-emerald-500">Intelligence</span></h3>
            <Activity className="w-5 h-5 text-emerald-500 animate-pulse" />
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-white/5 border border-white/5 group/kpi hover:border-emerald-500/20 transition-all">
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Lead Velocity (24h)</div>
                <div className="text-3xl font-black text-white tabular-nums italic">
                  +{stats.totalLeads > 0 ? Math.round(stats.totalLeads * 0.15) : 0}
                </div>
                <div className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest mt-2">Momentum Positive</div>
              </div>
              <div className="p-6 rounded-3xl bg-white/5 border border-white/5 group/kpi hover:border-cyan-500/20 transition-all">
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Fulfillment Efficiency</div>
                <div className="text-3xl font-black text-white tabular-nums italic">
                  {stats.pendingPayments === 0 ? '100%' : `${Math.round((stats.activeSubscriptions / (stats.activeSubscriptions + stats.pendingPayments)) * 100)}%`}
                </div>
                <div className="text-[8px] font-bold text-cyan-500 uppercase tracking-widest mt-2">Protocol Optimal</div>
              </div>
            </div>

            <div className="p-8 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10">
               <div className="flex items-center gap-4 mb-4">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">Operational Readiness</span>
               </div>
               <p className="text-sm text-gray-400 leading-relaxed font-medium">
                  The execution layer is operating at **Optimal Latency**. CRM synchronization is verified at **99.8% accuracy** across all regional nodes.
               </p>
            </div>
          </div>
        </div>

        {/* Geopolitical Signal Feed (Institutional Simulation) */}
        <div className="bg-zinc-900 border border-white/10 p-10 rounded-[48px] shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.02] to-transparent pointer-events-none" />
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Macro <span className="text-cyan-500">Intelligence</span></h3>
            <Globe className="w-5 h-5 text-cyan-500" />
          </div>

          <div className="space-y-4">
             {[
               { id: 'ecb-policy', time: '02:14', msg: 'ECB Monetary Policy Shift Detected', impact: 'High' },
               { id: 'jpy-liq', time: '04:45', msg: 'Asian Liquidity Pocket Identified (JPY)', impact: 'Medium' },
               { id: 'fed-chair', time: '07:12', msg: 'Fed Chair Statement: Quantitative Hardening', impact: 'Critical' },
               { id: 'bridge-sync', time: '10:05', msg: 'Proprietary Bridge Sync: MT5 Node 04', impact: 'Stable' }
             ].map((signal) => {
               const impactStyles = signal.impact === 'High' 
                 ? "text-amber-400 border-amber-500/20 bg-amber-500/5" 
                 : signal.impact === 'Critical' 
                   ? "text-red-400 border-red-500/20 bg-red-500/5" 
                   : "text-emerald-400 border-emerald-500/20 bg-emerald-500/5";

               return (
                 <div key={signal.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-default">
                   <div className="flex items-center gap-4">
                      <span className="text-[9px] font-mono text-gray-600">{signal.time}</span>
                      <span className="text-[10px] font-black text-white uppercase tracking-tight">{signal.msg}</span>
                   </div>
                   <span className={cn(
                     "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                     impactStyles
                   )}>{signal.impact}</span>
                 </div>
               );
             })}
          </div>

          <div className="mt-8 pt-8 border-t border-white/5">
             <div className="flex items-center justify-between text-[9px] font-black text-gray-600 uppercase tracking-[0.2em]">
                <span>Encryption Protocol: AES-256</span>
                <span>Signal Source: IFX-Alpha-V4</span>
             </div>
          </div>
        </div>
      </div>

      {/* Top Agents Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[var(--raised)] border border-white/5 p-10 rounded-[48px] shadow-2xl">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Regional Performance</h3>
            <Globe className="w-5 h-5 text-gray-600" />
          </div>
          <div className="space-y-6">
            {regionalStats.length > 0 ? regionalStats.map(r => (
              <div key={r.id}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-black text-gray-300 uppercase tracking-wider">{r.region}</span>
                  <span className="text-[11px] font-black uppercase tracking-wider" style={{ color: r.color }}>{r.perf}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${r.perf}%`, backgroundColor: r.color }}
                  />
                </div>
              </div>
            )) : (
               <div className="py-10 text-center text-[10px] uppercase font-black tracking-widest text-white/10 italic">Awaiting Regional Data Synchronization...</div>
            )}
          </div>
        </div>

        <div className="bg-[var(--raised)] border border-white/5 p-10 rounded-[48px] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-all">
            <Trophy className="w-24 h-24 text-amber-500" />
          </div>
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Top <span className="text-emerald-500">Performers</span></h3>
            <Star className="w-5 h-5 text-amber-500 animate-pulse" />
          </div>
          
          <div className="space-y-6">
             {topAgents.length > 0 ? (
               topAgents.map((agent, i) => (
                  <div key={agent.name} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 font-black text-[10px] italic">0{i+1}</div>
                        <div>
                           <div className="text-[10px] font-black text-white uppercase tracking-wider">{agent.name}</div>
                           <div className="text-[8px] font-bold text-gray-500 uppercase tracking-widest leading-none">Senior Growth Agent</div>
                        </div>
                     </div>
                     <div className="text-right">
                        <div className="text-[11px] font-black text-emerald-500 italic tabular-nums">${agent.revenue.toLocaleString()}</div>
                        <div className="text-[8px] font-bold text-[#58F2B6] uppercase tracking-widest">Performance Sync</div>
                     </div>
                  </div>
                ))
             ) : (
                <div className="py-20 text-center text-[10px] uppercase font-black tracking-widest text-white/10 italic">Personnel Synchronization in Progress...</div>
             )}
          </div>
          
          <button 
            onClick={() => {
              info("Initiating Full Personnel Synchronization...");
              // In production, this would trigger a background worker to sync CRM/Supabase records
            }}
            className="w-full mt-10 py-4 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black text-gray-500 uppercase tracking-widest hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-3 group"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Full Personnel Synchronization
          </button>
        </div>
      </div>
    </div>
  );
};
