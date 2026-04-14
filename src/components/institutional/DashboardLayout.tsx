import React from 'react';
import { Breadcrumb } from './Breadcrumb';
import { Footer } from './Footer';
import { useFocusRoute } from '@/hooks/useFocusRoute';
import { cn } from '@/lib/utils';
import { motion } from "motion/react";

// ── TYPES ──
interface DashboardLayoutProps {
  children: React.ReactNode;
  contextPanel?: React.ReactNode;
  showBreadcrumb?: boolean;
}

/**
 * INSTITUTIONAL DASHBOARD LAYOUT (v7.0 - Royale Noir One-Page)
 * Refactored to eliminate sidebar redundancy and align with StandardLayout.
 * Now provides a focused 'One-Page' terminal experience with high-density data support.
 */
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  contextPanel,
  showBreadcrumb = true
}) => {
  // Hardening: Accessibility and focus management
  useFocusRoute();

  return (
    <div className="min-h-screen w-full bg-[#030406] text-white selection:bg-emerald-500/30 overflow-x-hidden relative pt-20">
      
      {/* === CINEMATIC RIG === */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] z-[60] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.06),transparent_70%)] z-[59]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="relative z-10 w-full"
      >
        <div className={cn(
          "mx-auto w-full transition-all duration-700 ease-in-out px-4 sm:px-8 md:px-12",
          contextPanel ? "max-w-[1800px]" : "max-w-[1400px]"
        )}>
          
          <div className="flex flex-col lg:flex-row gap-10 py-10">
            
            {/* === MAIN EXECUTION SURFACE === */}
            <main className="flex-1 flex flex-col outline-none" tabIndex={-1}>
              {showBreadcrumb && (
                <div className="mb-8 p-1 bg-white/[0.02] border border-white/5 inline-flex rounded-xl">
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

          {/* STANDARDIZED FOOTER */}
          <div className="mt-20 border-t border-white/5 pt-10 pb-20">
            <Footer />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
