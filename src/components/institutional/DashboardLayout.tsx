import React from 'react';
import { Breadcrumb } from './Breadcrumb';
import { DashboardNavigation } from './DashboardNavigation';
import { useFocusRoute } from '@/hooks/useFocusRoute';
import { cn } from '@/lib/utils';
import { motion } from "motion/react";

import { DashboardMobileNav } from './DashboardMobileNav';

// ── TYPES ──
interface DashboardLayoutProps {
  children: React.ReactNode;
  contextPanel?: React.ReactNode;
  showBreadcrumb?: boolean;
}

/**
 * INSTITUTIONAL DASHBOARD LAYOUT (v8.0 - Royale Noir Terminal)
 * Provides a persistent sidebar for high-frequency navigation and a 
 * flexible grid for terminal modules.
 */
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  contextPanel,
  showBreadcrumb = true
}) => {
  useFocusRoute();

  return (
    <div className="min-h-screen w-full bg-[#030406] text-white selection:bg-emerald-500/30 overflow-x-hidden relative flex">
      
      {/* === PERSISTENT SIDEBAR === */}
      <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 border-r border-white/5 bg-[#050709] z-50">
        <DashboardNavigation />
      </aside>

      {/* === MOBILE NAVIGATION === */}
      <DashboardMobileNav />

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex-1 flex flex-col min-w-0"
      >
        <div className={cn(
          "w-full transition-all duration-700 ease-in-out px-4 sm:px-8 md:px-12 pt-24",
          contextPanel ? "max-w-[1800px]" : "max-w-[1400px]"
        )}>
          
          <div className="flex flex-col lg:flex-row gap-10 py-10">
            
            {/* === MAIN EXECUTION SURFACE === */}
            <main className="flex-1 flex flex-col outline-none" tabIndex={-1}>
              {showBreadcrumb && (
                <div className="mb-8 p-1 bg-white/[0.02] border border-white/5 inline-flex rounded-xl self-start">
                  <Breadcrumb />
                </div>
              )}
              
              <div className="flex-1">
                {children}
              </div>
            </main>

            {/* === CONTEXT INTELLIGENCE RAIL === */}
            {contextPanel && (
              <aside className="w-full lg:w-96 shrink-0 space-y-8">
                <div className="sticky top-28 space-y-8">
                  <div className="p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/10 backdrop-blur-3xl shadow-2xl relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-500">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:opacity-10 transition-opacity">
                      <div className="w-20 h-20 rounded-full border-4 border-emerald-500 rotate-12" />
                    </div>
                    {contextPanel}
                  </div>
                </div>
              </aside>
            )}
          </div>

          {/* Footer removed to prevent duplication with StandardLayout */}
        </div>
      </motion.div>
    </div>
  );
};
