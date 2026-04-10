import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import {
  BarChart3, Zap, ShieldCheck, Users, Video, Settings, Star,
  ShoppingCart, Activity, Trophy, DollarSign, FileText, CreditCard,
  Menu, X, TrendingUp, Bell, RefreshCw, LogOut, ChevronRight, Flag
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { cn } from "../utils/cn";
import { supabase } from "../lib/supabase";

// Admin Sub-Modules
import { ContentManager } from "../modules/admin/ContentManager";
import { LicenseManager } from "../modules/admin/LicenseManager";
import { WebinarManager } from "../modules/admin/WebinarManager";
import { ProductManager } from "../modules/admin/ProductManager";
import { ReviewManager } from "../modules/admin/ReviewManager";
import { RevenueAnalytics } from "../modules/admin/RevenueAnalytics";
import { FulfillmentManager } from "../modules/admin/FulfillmentManager";
import { RetentionHub } from "../modules/admin/RetentionHub";
import { AgentSystem } from "../modules/admin/AgentSystem";
import { LeadManager } from "../modules/admin/LeadManager";
import { CEOPanel } from "../modules/admin/CEOPanel";
import { SettingsManager } from "../modules/admin/SettingsManager";
import { ErrorViewer } from "../modules/admin/ErrorViewer";
import { PaymentManager } from "../modules/admin/PaymentManager";
import { FeatureFlagManager } from "../modules/admin/FeatureFlagManager";

interface LiveStats {
  totalUsers: number;
  pendingPayments: number;
  upcomingWebinars: number;
  totalLeads: number;
  pendingReviews: number;
}

const tabs = [
  { id: "ceo",         name: "Executive Overview",  icon: BarChart3,    group: "COMMAND" },
  { id: "revenue",     name: "Revenue Analytics",   icon: DollarSign,   group: "COMMAND" },
  { id: "leads",       name: "CRM Leads",           icon: Users,        group: "GROWTH" },
  { id: "fulfillment", name: "Pending Orders",      icon: ShoppingCart, group: "GROWTH" },
  { id: "payments",    name: "Payment Proofs",      icon: CreditCard,   group: "GROWTH" },
  { id: "agents",      name: "Elite Agents",        icon: Trophy,       group: "GROWTH" },
  { id: "retention",   name: "Retention Hub",       icon: Activity,     group: "GROWTH" },
  { id: "webinars",    name: "Webinar Manager",     icon: Video,        group: "CONTENT" },
  { id: "content",     name: "Content Publishing",  icon: FileText,     group: "CONTENT" },
  { id: "algos",       name: "Product Manager",     icon: Zap,          group: "CONTENT" },
  { id: "reviews",     name: "Review Manager",      icon: Star,         group: "CONTENT" },
  { id: "licenses",    name: "License Vault",       icon: ShieldCheck,  group: "SYSTEM" },
  { id: "flags",       name: "Feature Flags",       icon: Flag,         group: "SYSTEM" },
  { id: "health",      name: "System Health",       icon: Activity,     group: "SYSTEM" },
  { id: "settings",    name: "Settings",            icon: Settings,     group: "SYSTEM" },
];

const GROUPS = ["COMMAND", "GROWTH", "CONTENT", "SYSTEM"];
const GROUP_LABELS: Record<string, string> = {
  COMMAND: "Command Center",
  GROWTH:  "Growth Engine",
  CONTENT: "Content Hub",
  SYSTEM:  "System Control",
};

export const Admin = () => {
  const { user, userProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("ceo");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [liveStats, setLiveStats] = useState<LiveStats>({
    totalUsers: 0,
    pendingPayments: 0,
    upcomingWebinars: 0,
    totalLeads: 0,
    pendingReviews: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // All hooks must be called before any conditional return (Rules of Hooks)
  const isAdmin = userProfile?.role === "admin";

  const fetchLiveStats = async () => {

    setStatsLoading(true);
    try {
      const [users, payments, webinars, leads, reviews] = await Promise.all([
        supabase.from("users").select("*", { count: "exact", head: true }),
        supabase.from("payment_proofs").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("webinars").select("*", { count: "exact", head: true }).eq("status", "upcoming"),
        supabase.from("leads").select("*", { count: "exact", head: true }),
        supabase.from("reviews").select("*", { count: "exact", head: true }).eq("status", "pending"),
      ]);

      setLiveStats({
        totalUsers: users.count ?? 0,
        pendingPayments: payments.count ?? 0,
        upcomingWebinars: webinars.count ?? 0,
        totalLeads: leads.count ?? 0,
        pendingReviews: reviews.count ?? 0,
      });
    } catch (err) {
      console.error("[Admin] Live stats fetch failed:", err);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveStats();
    const interval = setInterval(fetchLiveStats, 60000);
    return () => clearInterval(interval);
  }, []);

  // Guard — must be AFTER all hooks
  if (!user || !isAdmin) return <Navigate to="/dashboard" />;

  const activeTabDef = tabs.find(t => t.id === activeTab);

  return (
    <div className="flex min-h-screen bg-[var(--color10)] pt-20">

      {/* ── Sidebar ── */}
      <aside
        className={cn(
          "fixed top-20 left-0 bottom-0 z-40 flex flex-col bg-[var(--color7)] border-r border-white/5 transition-all duration-300",
          sidebarOpen ? "w-64" : "w-[72px]"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/5">
          {sidebarOpen && (
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">IFX ADMIN</div>
              <div className="text-[9px] text-gray-600 uppercase tracking-widest mt-0.5">Control Center v2</div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl hover:bg-white/5 text-gray-500 hover:text-white transition-all"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Nav Groups */}
        <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
          {GROUPS.map(group => (
            <div key={group} className="mb-2">
              {sidebarOpen && (
                <div className="px-4 py-2 text-[8px] font-black uppercase tracking-[0.4em] text-gray-700">
                  {GROUP_LABELS[group]}
                </div>
              )}
              {tabs.filter(t => t.group === group).map(tab => {
                const isActive = activeTab === tab.id;
                let badge = null;
                if (tab.id === "payments") {
                  badge = liveStats.pendingPayments;
                } else if (tab.id === "reviews") {
                  badge = liveStats.pendingReviews;
                }

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    title={sidebarOpen ? undefined : tab.name}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all group relative",
                      isActive
                        ? "text-emerald-500 bg-emerald-500/10 border-r-2 border-emerald-500"
                        : "text-gray-500 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <tab.icon className={cn("w-4 h-4 shrink-0", isActive ? "text-emerald-500" : "text-gray-600 group-hover:text-white")} />
                    {sidebarOpen && (
                      <>
                        <span className="text-[11px] font-bold uppercase tracking-wider flex-1">{tab.name}</span>
                        {badge != null && badge > 0 && (
                          <span className="bg-red-500 text-white text-[8px] font-black rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                            {badge}
                          </span>
                        )}
                        {isActive && <ChevronRight className="w-3 h-3 text-emerald-500 shrink-0" />}
                      </>
                    )}
                    {!sidebarOpen && badge != null && badge > 0 && (
                      <span className="absolute top-1 right-1 bg-red-500 w-2 h-2 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-white/5 p-3">
          {sidebarOpen ? (
            <div className="flex items-center gap-3 px-1">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-500 text-xs font-black shrink-0">
                {userProfile?.full_name?.charAt(0) || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-black text-white uppercase tracking-wide truncate">
                  {userProfile?.full_name || "Admin"}
                </div>
                <div className="text-[8px] text-emerald-500 uppercase tracking-widest">Super Admin</div>
              </div>
              <button
                onClick={() => logout()}
                className="p-1.5 text-gray-600 hover:text-red-500 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-500 text-xs font-black">
                {userProfile?.full_name?.charAt(0) || "A"}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className={cn(
        "flex-1 min-h-full transition-all duration-300",
        sidebarOpen ? "ml-64" : "ml-[72px]"
      )}>

        {/* Top Stats Bar */}
        <div className="sticky top-20 z-30 bg-[var(--color7)]/95 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center justify-between px-6 py-3">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">IFX Admin</span>
              <ChevronRight className="w-3 h-3 text-gray-700" />
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                {activeTabDef?.name}
              </span>
            </div>

            {/* Live Stats Chips */}
            <div className="hidden md:flex items-center gap-3">
              {[
                { label: "Users", value: liveStats.totalUsers, icon: Users, color: "text-white" },
                { label: "Leads", value: liveStats.totalLeads, icon: TrendingUp, color: "text-cyan-400" },
                { label: "Webinars", value: liveStats.upcomingWebinars, icon: Video, color: "text-purple-400" },
                { label: "Payments", value: liveStats.pendingPayments, icon: CreditCard, color: liveStats.pendingPayments > 0 ? "text-amber-400" : "text-gray-600" },
                { label: "Reviews", value: liveStats.pendingReviews, icon: Bell, color: liveStats.pendingReviews > 0 ? "text-red-400" : "text-gray-600" },
              ].map(stat => (
                <div key={stat.label} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">
                  <stat.icon className={cn("w-3 h-3", stat.color)} />
                  <span className={cn("text-[10px] font-black tabular-nums", stat.color)}>
                    {statsLoading ? "—" : stat.value.toLocaleString()}
                  </span>
                  <span className="text-[8px] text-gray-700 uppercase tracking-widest">{stat.label}</span>
                </div>
              ))}

              <button
                onClick={fetchLiveStats}
                disabled={statsLoading}
                className="p-2 text-gray-600 hover:text-emerald-500 transition-colors"
                title="Refresh Stats"
              >
                <RefreshCw className={cn("w-3.5 h-3.5", statsLoading && "animate-spin")} />
              </button>

              {/* System Status Indicator */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">LIVE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6 lg:p-10">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === "ceo"         && <CEOPanel />}
            {activeTab === "revenue"     && <RevenueAnalytics />}
            {activeTab === "fulfillment" && <FulfillmentManager />}
            {activeTab === "retention"   && <RetentionHub />}
            {activeTab === "agents"      && <AgentSystem />}
            {activeTab === "leads"       && <LeadManager />}
            {activeTab === "payments"    && <PaymentManager />}
            {activeTab === "content"     && <ContentManager />}
            {activeTab === "licenses"    && <LicenseManager />}
            {activeTab === "flags"       && <FeatureFlagManager />}
            {activeTab === "algos"       && <ProductManager />}
            {activeTab === "webinars"    && <WebinarManager />}
            {activeTab === "reviews"     && <ReviewManager />}
            {activeTab === "health"      && <ErrorViewer />}
            {activeTab === "settings"    && <SettingsManager />}
          </div>
        </div>
      </main>
    </div>
  );
};
