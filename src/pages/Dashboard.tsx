import React from 'react';
import { DashboardLayout } from '@/components/institutional/DashboardLayout';
import { PortfolioValue } from '@/components/institutional/PortfolioValue';
import { DashboardPromo } from '@/components/institutional/DashboardPromo';
import { QuickActions } from '@/components/institutional/QuickActions';
import { RiskMetrics } from '@/components/institutional/RiskMetrics';
import { RecentActivity } from '@/components/institutional/RecentActivity';
import { WebinarAccessPanel } from '@/components/institutional/WebinarAccessPanel';
import { LicenseVault } from '@/components/institutional/LicenseVault';
import { PendingOrders } from '@/components/institutional/PendingOrders';
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
      
      <DashboardLayout>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* PRIMARY ALPHA SURFACE (2/3) */}
          <div className="xl:col-span-2 space-y-8">
            <PendingOrders />
            <PortfolioValue />
            <DashboardPromo />
          </div>
          
          {/* INTELLIGENCE RAIL (1/3) */}
          <div className="space-y-8">
            <QuickActions />
            <WebinarAccessPanel />
            <LicenseVault />
            <RiskMetrics />
            <RecentActivity />
          </div>
          
        </div>
      </DashboardLayout>
    </>
  );
};
