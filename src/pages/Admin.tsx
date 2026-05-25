import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import {
  BarChart3, Zap, ShieldCheck, Users, Video, Settings, Star,
  ShoppingCart, Activity, Trophy, DollarSign, FileText, CreditCard,
  Flag, Image as ImageIcon, HelpCircle
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
import { BannerManager } from "../modules/admin/BannerManager";
import { FAQManager } from "../modules/admin/FAQManager";

const tabs = [
  { id: "ceo",         name: "Executive Overview",  icon: BarChart3,    group: "COMMAND" },
  { id: "revenue",     name: "Revenue Analytics",   icon: DollarSign,   group: "COMMAND" },
  { id: "leads",       name: "CRM Leads",           icon: Users,        group: "GROWTH" },
  { id: "payments",    name: "Revenue Fulfillment", icon: CreditCard,   group: "GROWTH" },
  { id: "agents",      name: "Elite Agents",        icon: Trophy,       group: "GROWTH" },
  { id: "retention",   name: "Retention Hub",       icon: Activity,     group: "GROWTH" },
  { id: "webinars",    name: "Webinar Manager",     icon: Video,        group: "CONTENT" },
  { id: "banners",     name: "Banners",            icon: ImageIcon,    group: "CONTENT" },
  { id: "content",     name: "Content Publishing",  icon: FileText,     group: "CONTENT" },
  { id: "algos",       name: "Product Manager",     icon: Zap,          group: "CONTENT" },
  { id: "reviews",     name: "Review Manager",      icon: Star,         group: "CONTENT" },
  { id: "licenses",    name: "License Vault",       icon: ShieldCheck,  group: "SYSTEM" },
  { id: "flags",       name: "Feature Flags",       icon: Flag,         group: "SYSTEM" },
  { id: "health",      name: "System Health",       icon: Activity,     group: "SYSTEM" },
  { id: "faqs",        name: "FAQ Manager",         icon: HelpCircle,   group: "CONTENT" },
  { id: "settings",    name: "Settings",            icon: Settings,     group: "SYSTEM" },
];

const GROUPS = ["COMMAND", "GROWTH", "CONTENT", "SYSTEM"];
const GROUP_LABELS: Record<string, string> = {
  COMMAND: "Command Center",
  GROWTH:  "Growth Engine",
  CONTENT: "Content Hub",
  SYSTEM:  "System Control",
};

import { DashboardLayout } from "@/components/institutional/DashboardLayout";

export const Admin = () => {
  const { user, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("ceo");

  // All hooks must be called before any conditional return (Rules of Hooks)
  const isAdmin = userProfile?.role === "admin";

  // Guard — must be AFTER all hooks
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#010203] text-[#BAC9CC] flex items-center justify-center p-6 relative overflow-hidden font-sans">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.05)_0%,transparent_70%)] pointer-events-none" />
        <div className="site-panel p-8 md:p-12 max-w-md w-full relative overflow-hidden border border-red-500/20 bg-gradient-to-b from-[#050404] to-[#020202] text-center shadow-2xl rounded-3xl">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.02),transparent)]" />
          
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500 border border-red-500/20 mx-auto mb-6 animate-pulse">
            <ShieldCheck className="h-8 w-8" />
          </div>
          
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-[9px] font-black uppercase tracking-widest font-mono mb-4">
            Security Protocol Exclusion
          </span>
          
          <h1 className="text-xl md:text-2xl font-extrabold text-white uppercase tracking-tight mb-3">
            Unauthorized Access Node
          </h1>
          
          <p className="text-white/40 text-xs leading-relaxed mb-8">
            Your current credential signature lacks Level-1 Administrator clearance. Access to this core CRM node has been restricted and logged.
          </p>

          <div className="bg-black/60 border border-white/5 p-4 rounded-xl font-mono text-[10px] text-left space-y-1 mb-8">
            <div className="text-red-400 font-bold uppercase tracking-wider">Diagnostic Log:</div>
            <div className="text-white/50">TIMESTAMP: {new Date().toISOString()}</div>
            <div className="text-white/50">CLIENT_ID: {user?.id || "anonymous"}</div>
            <div className="text-white/50">CREDENTIAL_ROLE: {userProfile?.role || "null"}</div>
            <div className="text-white/50">ENCLAVE_NODE: IFX_CORE_ADMIN</div>
          </div>
          
          <Link
            to="/dashboard"
            className="group w-full relative inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-xs font-black text-black uppercase tracking-[0.2em] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const activeTabDef = tabs.find(t => t.id === activeTab);

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Internal Admin Sidebar / Mobile Tabs */}
        <aside className="w-full lg:w-64 shrink-0 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide">
           <div className="flex lg:flex-col gap-2 min-w-max lg:min-w-0">
             {GROUPS.map(group => (
               <div key={group} className="flex lg:flex-col gap-1 items-center lg:items-stretch">
                  <h4 className="hidden lg:block px-4 py-2 text-[8px] font-black uppercase tracking-[0.4em] text-gray-700 mt-4 first:mt-0">{GROUP_LABELS[group]}</h4>
                  {tabs.filter(t => t.group === group).map(tab => (
                     <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "flex items-center gap-2 lg:gap-3 px-4 py-2.5 rounded-xl text-left transition-all whitespace-nowrap",
                        activeTab === tab.id ? "bg-emerald-500/10 text-emerald-400 font-black border border-emerald-500/20" : "text-gray-500 hover:text-white bg-white/[0.02] border border-transparent"
                      )}
                     >
                       <tab.icon className="w-4 h-4" />
                       <span className="text-[10px] font-black uppercase tracking-widest">{tab.name}</span>
                     </button>
                  ))}
               </div>
             ))}
           </div>
        </aside>

        {/* Admin Content Stage */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-6 border-b border-white/5 gap-4">
             <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter italic leading-none">
                Admin <span className="text-emerald-500">{activeTabDef?.name}</span>
             </h1>
             <div className="flex items-center gap-4">
                <div className="px-4 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Protocol Sync</span>
                </div>
             </div>
          </div>

        {/* Page Content */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === "ceo"         && <CEOPanel />}
            {activeTab === "revenue"     && <RevenueAnalytics />}
            {activeTab === "retention"   && <RetentionHub />}
            {activeTab === "agents"      && <AgentSystem />}
            {activeTab === "leads"       && <LeadManager />}
            {activeTab === "payments"    && <FulfillmentManager />}
            {activeTab === "content"     && <ContentManager />}
            {activeTab === "banners"     && <BannerManager />}
            {activeTab === "licenses"    && <LicenseManager />}
            {activeTab === "flags"       && <FeatureFlagManager />}
            {activeTab === "algos"       && <ProductManager />}
            {activeTab === "webinars"    && <WebinarManager />}
            {activeTab === "reviews"     && <ReviewManager />}
            {activeTab === "faqs"        && <FAQManager />}
            {activeTab === "health"      && <ErrorViewer />}
            {activeTab === "settings"    && <SettingsManager />}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
