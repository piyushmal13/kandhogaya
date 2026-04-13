import React from 'react';
import { GlobalNavigation } from './GlobalNavigation';
import { MobileNavigation } from './MobileNavigation';
import { Breadcrumb } from './Breadcrumb';
import { Footer } from './Footer';
import { DashboardHeader } from './DashboardHeader';
import { useFocusRoute } from '@/hooks/useFocusRoute';
import { cn } from '@/lib/utils';

// ── TYPES ──
interface DashboardLayoutProps {
  children: React.ReactNode;
  leftRail?: React.ReactNode; 
  topBar?: React.ReactNode;
  contextPanel?: React.ReactNode;
  showBreadcrumb?: boolean;
}

/**
 * INSTITUTIONAL DASHBOARD LAYOUT (v6.1 - Sovereign Hardened)
 * Unified architecture for Dashboard, Marketplace, Academy, and Webinars.
 * Optimized for both high-density desktop and responsive mobile execution.
 */
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  leftRail = <GlobalNavigation />, 
  topBar = <DashboardHeader />, 
  contextPanel,
  showBreadcrumb = true
}) => {
  // Hardening: Accessibility and focus management
  useFocusRoute();

  return (
    <div className="flex min-h-screen w-full bg-[#050505] text-white selection:bg-emerald-500/30 overflow-x-hidden relative">
      {/* ── CINEMATIC OVERLAYS ── */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-tr from-cyan-500/[0.02] to-transparent z-[99]" />

      {/* ── MOBILE BRIDGE ── */}
      <MobileNavigation />

      {/* ── LEFT RAIL: Navigation (Fixed Aside) ── */}
      <aside className="w-72 fixed h-screen hidden lg:block z-50">
        {leftRail}
      </aside>
      
      {/* ── MAIN EXECUTION TRACK ── */}
      <div className={cn(
        "flex-1 flex flex-col min-h-screen transition-all duration-500 ease-out",
        "lg:ml-72", // Space for fixed left rail
        contextPanel ? "xl:mr-80" : "" // Alternative: space for right rail if present
      )}>
        {/* TOP BAR: Universal Telemetry */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-6 md:px-10 bg-black/40 backdrop-blur-3xl sticky top-0 z-40">
          {topBar}
        </header>

        {/* MAIN STAGE: Content Matrix */}
        <main className="flex-1 flex flex-col pt-6 md:pt-10 pb-20 px-4 md:px-10 max-w-7xl w-full mx-auto outline-none" tabIndex={-1}>
          {showBreadcrumb && <Breadcrumb />}
          <div className="flex-1 animate-in fade-in slide-in-from-bottom-2 duration-700">
            {children}
          </div>
        </main>

        {/* FOOTER: Organization Authority */}
        <Footer />
      </div>

      {/* ── RIGHT RAIL: Context Intelligence (Optional) ── */}
      {contextPanel && (
        <aside className="w-80 fixed right-0 h-screen hidden xl:block z-40 border-l border-white/5 bg-black/40 backdrop-blur-3xl">
          {contextPanel}
        </aside>
      )}
    </div>
  );
};
