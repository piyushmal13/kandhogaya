import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { BarChart3, Zap, ShieldCheck, Users, Video, Settings, Star } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { cn } from "../utils/cn";

// Sub-components
import { Overview } from "./admin/Overview";
import { ContentManager } from "./admin/ContentManager";
import { LicenseManager } from "./admin/LicenseManager";
import { AgentManager } from "./admin/AgentManager";
import { WebinarManager } from "./admin/WebinarManager";
import { ProductManager } from "./admin/ProductManager";
import { ReviewManager } from "./admin/ReviewManager";
import { SettingsManager } from "./admin/SettingsManager";

import { supabase } from "../lib/supabase";

/**
 * Master Admin CRM Dashboard
 * Centralized control center for IFXTrades administrators.
 * Handles user management, content publishing, license generation, and sales analytics.
 */
export const Admin = () => {
  const { user, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("stats");
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch("/api/admin/stats", {
          headers: { "Authorization": `Bearer ${session?.access_token}` }
        });
        const data = await res.json();
        if (data && !data.error) {
          setStats(data);
        }
      } catch (err) {
        console.error("Error fetching admin stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Security Check: Only allow admins
  const isAdmin = userProfile?.role === 'admin';

  if (!user || !isAdmin) return <Navigate to="/dashboard" />;

  const tabs = [
    { id: "stats", name: "Analytics", icon: BarChart3 },
    { id: "content", name: "Publishing", icon: Zap },
    { id: "licenses", name: "Licenses", icon: ShieldCheck },
    { id: "algos", name: "Algos", icon: Zap },
    { id: "agents", name: "Sales Agents", icon: Users },
    { id: "webinars", name: "Webinars", icon: Video },
    { id: "reviews", name: "Reviews", icon: Star },
    { id: "settings", name: "Settings", icon: Settings },
  ];

  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">IFXTrades Control Center</h1>
          <p className="text-gray-500 text-sm mt-1">Master CRM & Institutional Intelligence Management</p>
        </div>
        
        <div className="flex bg-zinc-900 p-1 rounded-xl border border-white/5 overflow-x-auto max-w-full">
          {tabs.map(tab => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
                activeTab === tab.id ? "bg-emerald-500 text-black shadow-lg" : "text-gray-400 hover:text-white"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="min-h-[600px]">
        {activeTab === "stats" && <Overview stats={stats} />}
        {activeTab === "content" && <ContentManager />}
        {activeTab === "licenses" && <LicenseManager />}
        {activeTab === "algos" && <ProductManager />}
        {activeTab === "agents" && <AgentManager />}
        {activeTab === "webinars" && <WebinarManager />}
        {activeTab === "reviews" && <ReviewManager />}
        {activeTab === "settings" && <SettingsManager />}
      </div>
    </div>
  );
};
