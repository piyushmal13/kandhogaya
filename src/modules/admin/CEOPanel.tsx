import React, { useState, useEffect } from "react";
import {
  TrendingUp, Users, Target, DollarSign, Activity,
  Globe, Clock, ShieldAlert, RefreshCw,
  ArrowUpRight, CreditCard, Video, Star, Zap
} from "lucide-react";
import { cn } from "../../utils/cn";
import { supabase } from "../../lib/supabase";

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

export const CEOPanel = () => {
  const [stats, setStats] = useState<LiveStats>(INITIAL_STATS);
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const fetchAllStats = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      const [
        salesRes,
        usersRes,
        leadsRes,
        paymentsRes,
        webinarsRes,
        reviewsRes,
        subsRes,
        errorsRes,
      ] = await Promise.all([
        supabase.from("sales_tracking").select("sale_amount, created_at"),
        supabase.from("users").select("*", { count: "exact", head: true }),
        supabase.from("leads").select("*", { count: "exact", head: true }),
        supabase.from("payment_proofs").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("webinars").select("*", { count: "exact", head: true }).eq("status", "upcoming"),
        supabase.from("reviews").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("subscriptions").select("*", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("system_logs").select("*", { count: "exact", head: true }).eq("severity", "critical"),
      ]);

      const salesData = salesRes.data || [];
      const revenueToday = salesData
        .filter(s => s.created_at >= startOfDay)
        .reduce((sum, s) => sum + (s.sale_amount || 0), 0);
      const revenueMTD = salesData
        .filter(s => s.created_at >= startOfMonth)
        .reduce((sum, s) => sum + (s.sale_amount || 0), 0);

      const totalUsers = usersRes.count ?? 0;
      const totalLeads = leadsRes.count ?? 0;

      const errorCount = errorsRes.count ?? 0;
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
        pendingPayments: paymentsRes.count ?? 0,
        upcomingWebinars: webinarsRes.count ?? 0,
        pendingReviews: reviewsRes.count ?? 0,
        systemHealth,
        conversionRate: totalLeads > 0 ? ((subsRes.count ?? 0) / totalLeads) * 100 : 0,
        activeSubscriptions: subsRes.count ?? 0,
      });
      setLastSync(new Date());
    } catch (err) {
      console.error("[CEOPanel] Stats fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllStats();
    const interval = setInterval(fetchAllStats, 120000); // refresh every 2 min
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

  const healthColor = {
    Optimal: "text-emerald-500",
    Warning:  "text-amber-500",
    Critical: "text-red-500",
  }[stats.systemHealth];

  const healthBg = {
    Optimal: "bg-emerald-500/10 border-emerald-500/20",
    Warning:  "bg-amber-500/10 border-amber-500/20",
    Critical: "bg-red-500/10 border-red-500/20",
  }[stats.systemHealth];

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
          onClick={fetchAllStats}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
          Refresh
        </button>
      </div>

      {/* Revenue Hero Block */}
      <div className="bg-gradient-to-br from-emerald-500/15 via-black to-black border border-emerald-500/20 p-10 lg:p-16 rounded-[56px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-16 opacity-[0.04] pointer-events-none">
          <DollarSign className="w-72 h-72 text-emerald-500" />
        </div>
        <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Live Supabase Feed</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10 mt-4">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500/60 mb-4">Gross Revenue (MTD)</div>
            <div className="text-7xl lg:text-8xl font-black text-white tracking-tighter tabular-nums">
              ${stats.revenueMTD.toLocaleString()}
            </div>
            <div className="flex items-center gap-3 mt-8">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                  {stats.activeSubscriptions} Active Subscriptions
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-end lg:items-end gap-6">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 mb-3 lg:text-right">Revenue Today</div>
              <div className="text-5xl font-black text-white tracking-tighter tabular-nums">
                ${stats.revenueToday.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 mb-3 lg:text-right">Conversion Rate</div>
              <div className="text-4xl font-black text-cyan-500 tracking-tighter tabular-nums">
                {stats.conversionRate.toFixed(1)}%
              </div>
            </div>
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
          <div key={s.id} className={cn("p-6 rounded-[28px] border border-white/5", s.bg)}>
            <s.icon className={cn("w-5 h-5 mb-4", s.color)} />
            <div className={cn("text-3xl font-black tabular-nums tracking-tighter", s.color)}>
              {loading ? "—" : s.value.toLocaleString()}
            </div>
            <div className="text-[9px] font-black uppercase tracking-widest text-gray-600 mt-2">{s.label}</div>
          </div>
        ))}
      </div>

      {/* System Health + Regional Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Regional Performance */}
        <div className="lg:col-span-2 bg-zinc-900 border border-white/10 p-10 rounded-[48px] shadow-2xl">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Regional Performance</h3>
            <Globe className="w-5 h-5 text-gray-600" />
          </div>
          <div className="space-y-6">
            {[
              { id: "sea",  region: "South & East Asia",     color: "var(--color8)", perf: 78 },
              { id: "me",   region: "Middle East & Gulf",    color: "var(--color39)", perf: 65 },
              { id: "eea",  region: "European Economic Area",color: "var(--color41)", perf: 52 },
              { id: "us",   region: "North America",         color: "var(--color38)", perf: 40 },
            ].map(r => (
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
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-zinc-900 border border-white/10 p-10 rounded-[48px] shadow-2xl space-y-6">
          <h3 className="text-xl font-black text-white uppercase tracking-tighter">System Health</h3>

          <div className={cn("p-6 rounded-3xl border", healthBg)}>
            <div className={cn("flex items-center gap-3 mb-3", healthColor)}>
              <Activity className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Platform Status</span>
            </div>
            <div className={cn("text-2xl font-black uppercase tracking-tight", healthColor)}>
              {stats.systemHealth}
            </div>
            <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest mt-2">
              <Clock className="inline w-3 h-3 mr-1" />
              {lastSync ? lastSync.toLocaleTimeString() : "—"}
            </div>
          </div>

          {stats.pendingPayments > 0 && (
            <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/20">
              <div className="flex items-center gap-3 text-amber-400 mb-2">
                <ShieldAlert className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Action Required</span>
              </div>
              <div className="text-lg font-black text-white uppercase tracking-tight">
                {stats.pendingPayments} Pending Payment{stats.pendingPayments > 1 ? "s" : ""}
              </div>
              <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest mt-1">
                Review & fulfill in Payments tab
              </div>
            </div>
          )}

          <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Top Metric</div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white tabular-nums">{stats.activeSubscriptions}</span>
              <ArrowUpRight className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1">Active Subscribers</div>
          </div>
        </div>
      </div>

      {/* Quick Action Flags */}
      {(stats.pendingPayments > 0 || stats.pendingReviews > 0) && (
        <div className="p-6 bg-black border border-amber-500/20 rounded-3xl">
          <div className="text-[9px] font-black text-amber-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            Action Queue
          </div>
          <div className="flex flex-wrap gap-3">
            {stats.pendingPayments > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">
                  {stats.pendingPayments} payment proof{stats.pendingPayments > 1 ? "s" : ""} waiting
                </span>
              </div>
            )}
            {stats.pendingReviews > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl">
                <Star className="w-3.5 h-3.5 text-red-400" />
                <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">
                  {stats.pendingReviews} review{stats.pendingReviews > 1 ? "s" : ""} pending moderation
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
