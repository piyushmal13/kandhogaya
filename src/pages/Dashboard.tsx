import React from 'react';
import { PortfolioValue } from '@/components/institutional/PortfolioValue';
import { SignalFeed } from '@/components/institutional/SignalFeed';
import { QuickActions } from '@/components/institutional/QuickActions';
import { RiskMetrics } from '@/components/institutional/RiskMetrics';
import { RecentActivity } from '@/components/institutional/RecentActivity';
import { tracker } from '@/core/tracker';
import { PageMeta } from '@/components/site/PageMeta';

export const Dashboard = () => {
  React.useEffect(() => {
    tracker.track("page_view", { surface: "dashboard_modern" });
  }, []);

  return (
    <>
      <PageMeta 
        title="Institutional Omni-View"
        description="Real-time systematic intelligence, portfolio tracking, and execution metrics for sovereign capital management."
        path="/dashboard"
      />
      
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
    </>
  );
};
