import React from 'react';
import { DashboardLayout } from '@/components/institutional/DashboardLayout';
import { PortfolioValue } from '@/components/institutional/PortfolioValue';
import { DashboardPromo } from '@/components/institutional/DashboardPromo';
import { QuickActions } from '@/components/institutional/QuickActions';
import { AffiliateSnapshot } from '@/components/institutional/AffiliateSnapshot';
import { RecentActivity } from '@/components/institutional/RecentActivity';
import { WebinarAccessPanel } from '@/components/institutional/WebinarAccessPanel';
import { LicenseVault } from '@/components/institutional/LicenseVault';
import { PendingOrders } from '@/components/institutional/PendingOrders';
import { PageMeta } from '@/components/site/PageMeta';
import { tracker } from '@/core/tracker';

/**
 * Dashboard (v2.0) - The Client Portal
 * 
 * Centralized hub for clients to manage their assets, active licenses,
 * pending orders, and affiliate program statistics.
 */
export const Dashboard = () => {
  React.useEffect(() => {
    tracker.track("page_view", { surface: "client_portal_dashboard" });
  }, []);

  return (
    <>
      <PageMeta 
        title="Client Portal | IFX Trades"
        description="Your institutional hub for asset management, performance tracking, and partnership tools."
        path="/dashboard"
      />
      
      <DashboardLayout>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* PRIMARY SURFACE (2/3) */}
          <div className="xl:col-span-2 space-y-8">
            <PendingOrders />
            <PortfolioValue />
            <DashboardPromo />
          </div>
          
          {/* RIGHT RAIL (1/3) */}
          <div className="space-y-8">
            <QuickActions />
            <AffiliateSnapshot />
            <WebinarAccessPanel />
            <LicenseVault />
            <RecentActivity />
          </div>
          
        </div>
      </DashboardLayout>
    </>
  );
};

