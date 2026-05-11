import React, { useState } from "react";
import { Navigate } from "react-router-dom";
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
  if (!user || !isAdmin) return <Navigate to="/dashboard" />;

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
