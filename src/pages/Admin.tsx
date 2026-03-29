import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { BarChart3, Zap, ShieldCheck, Users, Video, Settings, Star, ShoppingCart, Activity, Trophy, DollarSign } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { cn } from "../utils/cn";

// Sub-components (Modularized)
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

/**
 * Master Admin CRM Dashboard
 * Centralized control center for IFXTrades administrators.
 * Handles user management, content publishing, license generation, and sales analytics.
 */
export const Admin = () => {
  const { user, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("ceo");

  const fetchStats = async () => {
    // Analytics discovery delegated to sub-modules
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Security Check: Only allow admins
  const isAdmin = userProfile?.role === 'admin';

  if (!user || !isAdmin) return <Navigate to="/dashboard" />;

  const tabs = [
    { id: "ceo", name: "Executive Terminal", icon: BarChart3 },
    { id: "revenue", name: "Revenue Hub", icon: DollarSign },
    { id: "fulfillment", name: "Pending Orders", icon: ShoppingCart },
    { id: "retention", name: "Retention Hub", icon: Activity },
    { id: "agents", name: "Elite Agents", icon: Trophy },
    { id: "leads", name: "CRM Leads", icon: Users },
    { id: "content", name: "Publishing", icon: Zap },
    { id: "licenses", name: "Licenses", icon: ShieldCheck },
    { id: "algos", name: "Algos", icon: Zap },
    { id: "webinars", name: "Webinars", icon: Video },
    { id: "reviews", name: "Reviews", icon: Star },
    { id: "health", name: "System Health", icon: Activity },
    { id: "settings", name: "Settings", icon: Settings },
  ];

  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto selection:bg-emerald-500/30">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">Control <span className="text-emerald-500">Center</span></h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Master Terminal & Institutional Intelligence</p>
        </div>
        
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 overflow-x-auto max-w-full backdrop-blur-xl">
          {tabs.map(tab => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                activeTab === tab.id 
                  ? "bg-emerald-500 text-black shadow-xl shadow-emerald-500/20" 
                  : "text-gray-500 hover:text-white"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="min-h-[600px] animate-in fade-in duration-700">
        {activeTab === "ceo" && <CEOPanel />}
        {activeTab === "revenue" && <RevenueAnalytics />}
        {activeTab === "fulfillment" && <FulfillmentManager />}
        {activeTab === "retention" && <RetentionHub />}
        {activeTab === "agents" && <AgentSystem />}
        {activeTab === "leads" && <LeadManager />}
        {activeTab === "content" && <ContentManager />}
        {activeTab === "licenses" && <LicenseManager />}
        {activeTab === "algos" && <ProductManager />}
        {activeTab === "webinars" && <WebinarManager />}
        {activeTab === "reviews" && <ReviewManager />}
        {activeTab === "health" && <ErrorViewer />}
        {activeTab === "settings" && <SettingsManager />}
      </div>
    </div>
  );
};
