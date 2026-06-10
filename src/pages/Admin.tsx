import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import {
  BarChart3, Zap, ShieldCheck, Users, Video, Settings, Star,
  ShoppingCart, Activity, Trophy, DollarSign, FileText, CreditCard,
  Flag, Image as ImageIcon, HelpCircle, Briefcase
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
import { HiringManager } from "../modules/admin/HiringManager";

const tabs = [
  { id: "ceo",         name: "Executive Overview",  icon: BarChart3,    group: "COMMAND" },
  { id: "revenue",     name: "Revenue Analytics",   icon: DollarSign,   group: "COMMAND" },
  { id: "leads",       name: "CRM Leads",           icon: Users,        group: "GROWTH" },
  { id: "payments",    name: "Revenue Fulfillment", icon: CreditCard,   group: "GROWTH" },
  { id: "hiring",      name: "Hiring Desk",         icon: Briefcase,    group: "GROWTH" },
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.08)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="site-panel p-8 md:p-12 max-w-md w-full relative overflow-hidden border border-red-500/30 bg-zinc-950/80 backdrop-blur-3xl text-center shadow-[0_0_50px_rgba(239,68,68,0.1)] rounded-3xl group">
          {/* Animated Background scanline */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
             <div className="absolute top-0 left-0 w-full h-[2px] bg-red-500/50 shadow-[0_0_10px_rgba(239,68,68,1)] animate-scan" />
          </div>

          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.05),transparent)]" />
          
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 border border-red-500/30 mx-auto mb-8 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
            <ShieldCheck className="h-10 w-10 animate-pulse" />
            <div className="absolute inset-0 rounded-2xl border border-red-500/50 scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-700" />
          </div>
          
          <span className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/40 bg-red-500/10 text-red-400 text-[10px] font-black uppercase tracking-widest font-mono mb-6 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            Security Protocol Exclusion
          </span>
          
          <h1 className="relative text-2xl md:text-3xl font-extrabold text-white uppercase tracking-tight mb-4 drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]">
            Unauthorized Access Node
          </h1>
          
          <p className="relative text-red-200/60 text-xs leading-relaxed mb-8 font-medium">
            Your current credential signature lacks Level-1 Administrator clearance. Access to this core CRM node has been restricted and logged.
          </p>

          <div className="relative bg-black/80 border border-red-500/20 p-5 rounded-xl font-mono text-[10px] text-left space-y-2 mb-8 shadow-inner overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-red-500/5 blur-2xl pointer-events-none" />
            <div className="text-red-400 font-bold uppercase tracking-wider flex items-center justify-between">
              Diagnostic Log:
              <span className="text-[8px] bg-red-500/20 px-2 py-0.5 rounded text-red-300">SECURE</span>
            </div>
            <div className="text-white/50 border-l border-red-500/30 pl-3">TIMESTAMP: <span className="text-white/80">{new Date().toISOString()}</span></div>
            <div className="text-white/50 border-l border-red-500/30 pl-3">CLIENT_ID: <span className="text-white/80">{user?.id || "anonymous"}</span></div>
            <div className="text-white/50 border-l border-red-500/30 pl-3">CREDENTIAL_ROLE: <span className="text-white/80">{userProfile?.role || "null"}</span></div>
            <div className="text-white/50 border-l border-red-500/30 pl-3">ENCLAVE_NODE: <span className="text-white/80">IFX_CORE_ADMIN</span></div>
          </div>
          
          <Link
            to="/dashboard"
            className="relative group w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-800 px-6 py-4 text-xs font-black text-white uppercase tracking-[0.2em] overflow-hidden shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] transition-all duration-300 border border-red-500/50"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10">Return to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  const activeTabDef = tabs.find(t => t.id === activeTab);

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative z-10">
        {/* Internal Admin Sidebar / Mobile Tabs */}
        <aside className="w-full lg:w-64 shrink-0 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide relative">
           {/* Sidebar Glass Backing (Desktop) */}
           <div className="hidden lg:block absolute inset-0 bg-zinc-950/40 backdrop-blur-3xl border border-white/5 rounded-2xl -z-10 pointer-events-none" />
           <div className="flex lg:flex-col gap-3 min-w-max lg:min-w-0 lg:p-4">
             {GROUPS.map(group => (
               <div key={group} className="flex lg:flex-col gap-1.5 items-center lg:items-stretch relative">
                  <h4 className="hidden lg:block px-3 py-2 text-[9px] font-black uppercase tracking-[0.4em] text-blue-500/50 mt-4 first:mt-0 border-b border-white/5 pb-2 mb-2">{GROUP_LABELS[group]}</h4>
                  {tabs.filter(t => t.group === group).map(tab => {
                     const isActive = activeTab === tab.id;
                     return (
                     <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "group relative flex items-center gap-2 lg:gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 whitespace-nowrap overflow-hidden",
                        isActive 
                          ? "bg-blue-500/10 text-blue-400 font-black border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.1)]" 
                          : "text-gray-500 hover:text-white bg-white/[0.01] hover:bg-white/[0.05] border border-transparent"
                      )}
                     >
                       {isActive && (
                         <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent opacity-50 pointer-events-none" />
                       )}
                       <tab.icon className={cn("w-4 h-4 transition-transform duration-300 relative z-10", isActive ? "scale-110" : "group-hover:scale-110")} />
                       <span className="text-[10px] font-black uppercase tracking-widest relative z-10">{tab.name}</span>
                       {isActive && (
                         <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                       )}
                     </button>
                  )})}
               </div>
             ))}
           </div>
        </aside>

        {/* Admin Content Stage */}
        <div className="flex-1 min-w-0 relative">
          {/* Subtle stage glow */}
          <div className="absolute top-0 left-1/4 w-1/2 h-32 bg-blue-500/5 blur-[100px] pointer-events-none -z-10" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-6 border-b border-white/10 gap-4 relative">
             <div className="absolute bottom-0 left-0 w-1/3 h-[1px] bg-gradient-to-r from-blue-500 to-transparent" />
             <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter italic leading-none text-white drop-shadow-md">
                Admin <span className="text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.4)]">{activeTabDef?.name}</span>
             </h1>
             <div className="flex items-center gap-4">
                <div className="px-4 py-2 bg-blue-500/5 border border-blue-500/20 rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                   <span className="text-[9px] font-black uppercase tracking-widest text-blue-400">Secure Protocol Active</span>
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
            {activeTab === "hiring"      && <HiringManager />}
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
