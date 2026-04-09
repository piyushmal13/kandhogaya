import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { tracker } from "@/core/tracker";
import { useDataPulse } from "@/hooks/useDataPulse";
import { BotLicense } from "@/types";
import { PurchaseModal } from "@/components/payments/PurchaseModal";
import { UrgencyBanner } from "@/components/ui/UrgencyBanner";
import { ActivityPulse } from "@/components/dashboard/ActivityPulse";

// Institutional Sub-Components
import { ConsoleHeader } from "@/components/dashboard/ConsoleHeader";
import { MarketTicker } from "@/components/dashboard/MarketTicker";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { TraderChecklist } from "@/components/dashboard/TraderChecklist";
import { ExecutionTerminal } from "@/components/dashboard/ExecutionTerminal";
import { SignalFeed } from "@/components/dashboard/SignalFeed";
import { WebinarSessions } from "@/components/dashboard/WebinarSessions";
import { QuickMatrix } from "@/components/dashboard/QuickMatrix";
import { ProfileBanner } from "@/components/dashboard/ProfileBanner";

export const Dashboard = () => {
  const { user, userProfile, sessionReady, access } = useAuth();
  const navigate = useNavigate();
  const { signals, webinars, performanceStats, marketData, registrations } = useDataPulse();
  const [userLead, setUserLead] = useState<any>(null);
  const isMountedRef = useRef(true);

  const [licenses, setLicenses] = useState<BotLicense[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<{ plan: string, amount: number, productId?: string } | null>(null);

  const fetchLicenses = useCallback(async () => {
    if (!user?.id) {
       setLoading(false);
       return;
    }
    
    try {
      const { data, error } = await supabase.from('bot_licenses')
        .select(`*, algo_bots ( name, version )`)
        .eq('user_id', user.id);
      
      if (error) throw error;
      setLicenses(data || []);
    } catch (err) {
      console.error('Institutional License Discovery Error:', err);
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [user?.id]);

  const fetchUserLead = useCallback(async () => {
    if (!user?.email) return;
    const { data } = await supabase.from('leads').select('*').eq('email', user.email).maybeSingle();
    if (data) setUserLead(data);
  }, [user]);

  useEffect(() => {
    if (sessionReady) {
      fetchLicenses();
      fetchUserLead();
    }
    tracker.track("page_view", { surface: "dashboard" });
  }, [sessionReady, fetchLicenses, fetchUserLead]);

  useEffect(() => {
    const refetch = () => fetchLicenses();
    globalThis.addEventListener("supabase:refresh", refetch);
    globalThis.addEventListener("app:login", refetch);

    return () => {
      globalThis.removeEventListener("supabase:refresh", refetch);
      globalThis.removeEventListener("app:login", refetch);
    };
  }, [fetchLicenses]);

  const isAdmin = access.admin;
  const isPro = access.signals || access.algo;
  const isElite = access.algo && access.webinars; 
  const isProOnly = isPro && !isElite;

  if (!user) {
     return (
       <div className="min-h-screen bg-black flex items-center justify-center">
         <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
       </div>
     );
  }

  const handleUpgrade = (plan: string, amount: number, productId?: string) => {
    setSelectedPlan({ plan, amount, productId });
  };

  return (
    <div className="relative min-h-screen bg-bg-base pt-24 pb-32 px-4 selection:bg-accent/30 overflow-hidden font-sans">
      {/* ── Sovereign Architecture Layer ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(16,185,129,0.08),transparent_70%)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAwOCkiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] opacity-100" />
      </div>
      
      <UrgencyBanner />
      
      <div className="max-w-[1400px] mx-auto relative z-10 space-y-12">
        {/* ── Intelligence Pulse ── */}
        <div className="glass-card p-2 border-white/5 bg-white/[0.01]">
          <MarketTicker data={marketData} />
        </div>

        {/* ── Identity & Access Control ── */}
        {!isElite && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="perspective-container"
          >
            <ProfileBanner 
              userProfile={userProfile}
              user={user}
              userLead={userLead}
              isProOnly={isProOnly}
              onUpgrade={handleUpgrade}
            />
          </motion.div>
        )}

        {/* ── Operational Command ── */}
        <div className="space-y-6">
          <ConsoleHeader 
            sessionReady={sessionReady}
            userProfile={userProfile}
            user={user}
            isAdmin={isAdmin}
            isPro={isPro}
          />
          
          <StatsGrid 
            licenseCount={licenses.filter(l => l.is_active).length}
            winRate={performanceStats.winRate}
            signalCount={signals.length}
            totalPips={performanceStats.totalPips}
          />
        </div>

        {/* ── Primary Operational Matrix ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Execution Core */}
          <div className="lg:col-span-8 space-y-10">
            <ExecutionTerminal 
              licenses={licenses}
              loading={loading}
              isElite={isElite}
              onUpgrade={() => handleUpgrade('elite', 249, 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2')}
            />

            <SignalFeed 
              signals={signals}
              isPro={isPro}
              onUpgrade={() => handleUpgrade('pro', 99, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1')}
            />
          </div>

          {/* Intelligence & Support Grid */}
          <div className="lg:col-span-4 space-y-10">
            <div className="glass-card p-1.5 border-white/[0.03] bg-grad-dark overflow-hidden">
              <WebinarSessions 
                webinars={webinars}
                registrations={registrations}
                isElite={isElite}
                onUpgrade={() => handleUpgrade('elite', 249, 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2')}
              />
            </div>

            <TraderChecklist 
              signalsCount={signals.length}
              hasActiveBot={licenses.some(l => l.is_active)}
            />

            <QuickMatrix navigate={navigate} />

            <div className="glass-card p-10 bg-black/40 border-white/5 relative overflow-hidden group">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/5 blur-[80px] rounded-full group-hover:bg-accent/10 transition-all duration-1000" />
              <div className="relative z-10">
                <h4 className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] font-mono mb-8 border-b border-white/5 pb-4">
                  Sovereign Transmission Pulse
                </h4>
                <ActivityPulse />
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedPlan && (
        <PurchaseModal 
          plan={selectedPlan.plan}
          amount={selectedPlan.amount}
          productId={(selectedPlan as any).productId}
          onClose={() => setSelectedPlan(null)}
        />
      )}
    </div>
  );
};
