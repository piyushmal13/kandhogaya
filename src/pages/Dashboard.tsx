import React from 'react';
import { DashboardLayout } from '@/components/institutional/DashboardLayout';
import { SignalFeed } from '@/components/institutional/SignalFeed';
import { PortfolioValue } from '@/components/institutional/PortfolioValue';
import { QuickActions } from '@/components/institutional/QuickActions';
import { RiskMetrics } from '@/components/institutional/RiskMetrics';
import { RecentActivity } from '@/components/institutional/RecentActivity';
import { DashboardNavigation } from '@/components/institutional/DashboardNavigation';
import { DashboardHeader } from '@/components/institutional/DashboardHeader';
import { MarketIntelligencePanel } from '@/components/institutional/MarketIntelligencePanel';
import { tracker } from '@/core/tracker';

export const Dashboard = () => {
  React.useEffect(() => {
    tracker.track("page_view", { surface: "dashboard_modern" });
  }, []);

  return (
    <DashboardLayout
      leftRail={<DashboardNavigation />}
      topBar={<DashboardHeader />}
      contextPanel={<MarketIntelligencePanel />}
    >
      {/* ── Main Stage Content ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 items-start">
        {/* Primary Alpha Surface */}
        <div className="xl:col-span-2 space-y-10">
          <PortfolioValue />
          <SignalFeed />
        </div>
        
        {/* Secondary Analytics */}
        <div className="space-y-10">
          <QuickActions />
          <RiskMetrics />
          <RecentActivity />
        </div>
      </div>
    </DashboardLayout>
  );
};
