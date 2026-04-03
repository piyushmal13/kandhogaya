import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
    <div className="relative min-h-screen bg-[#020202] pt-28 pb-32 px-4 selection:bg-emerald-500/30 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.05),transparent_70%)] pointer-events-none" />
      
      <UrgencyBanner />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-10">
          <MarketTicker data={marketData} />
        </div>

        {!isElite && (
          <div className="mb-12">
            <ProfileBanner 
              userProfile={userProfile}
              user={user}
              userLead={userLead}
              isProOnly={isProOnly}
              onUpgrade={handleUpgrade}
            />
          </div>
        )}

        <div className="mb-14">
          <ConsoleHeader 
            sessionReady={sessionReady}
            userProfile={userProfile}
            user={user}
            isAdmin={isAdmin}
            isPro={isPro}
          />
        </div>

        <StatsGrid 
          licenseCount={licenses.filter(l => l.is_active).length}
          winRate={performanceStats.winRate}
          signalCount={signals.length}
          totalPips={performanceStats.totalPips}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Operative Area */}
          <div className="lg:col-span-8 space-y-8">
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

          {/* Secondary Intelligence Area */}
          <div className="lg:col-span-4 space-y-8">
            <div className="p-1 rounded-[48px] bg-white/[0.02] border border-white/5">
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

            <div className="p-8 rounded-[40px] bg-black border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 blur-xl">
                 <ActivityPulse />
              </div>
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] font-mono mb-6">REAL-TIME ACTIVITY</h4>
              <ActivityPulse />
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
