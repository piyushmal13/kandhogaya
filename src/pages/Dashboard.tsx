import React from 'react';
import { DashboardLayout } from '@/components/institutional/DashboardLayout';
import { MarketIntelligencePanel } from '@/components/institutional/MarketIntelligencePanel';
import { PortfolioValue } from '@/components/institutional/PortfolioValue';
import { SignalFeed } from '@/components/institutional/SignalFeed';
import { QuickActions } from '@/components/institutional/QuickActions';
import { RiskMetrics } from '@/components/institutional/RiskMetrics';
import { RecentActivity } from '@/components/institutional/RecentActivity';
import { LicenseVault } from '@/components/institutional/LicenseVault';
import { PageMeta } from '@/components/site/PageMeta';
import { tracker } from '@/core/tracker';

/**
 * Dashboard (v2.0) - The Elite Terminal
 * 
 * High-density command center for institutional capital management.
 * Features: Asymmetric data grid, real-time Alpha pulses, and integrated Risk Shield.
 */
export const Dashboard = () => {
  React.useEffect(() => {
    tracker.track("page_view", { surface: "elite_terminal_v2" });
  }, []);

  return (
    <>
      <PageMeta 
        title="Master Terminal | Institutional Hub"
        description="Asia's #1 high-frequency execution surface. Real-time alpha stream, verified equity tracking, and institutional risk governance."
        path="/dashboard"
      />
      
      <DashboardLayout
        contextPanel={<MarketIntelligencePanel />}
      >
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* PRIMARY ALPHA SURFACE (2/3) */}
          <div className="xl:col-span-2 space-y-8">
            <PortfolioValue />
            <SignalFeed />
          </div>
          
          {/* INTELLIGENCE RAIL (1/3) */}
          <div className="space-y-8">
            <QuickActions />
            <LicenseVault />
            <RiskMetrics />
            <RecentActivity />
          </div>
          
        </div>
      </DashboardLayout>
    </>
  );
};
