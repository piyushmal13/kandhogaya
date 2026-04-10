import { useState, useEffect } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap } from 'lucide-react';
import { GlobalNavigation } from './GlobalNavigation';

/**
 * Mobile Navigation Bridge for Institutional Surfaces.
 * Provides a high-authority hamburger menu for resolutions < 1024px.
 * Reuses the GlobalNavigation component for logic consistency.
 */
export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  // Enforce session close on route transition
  useEffect(() => setIsOpen(false), [location]);

  return (
    <>
      {/* Sovereign Hamburger Node */}
      <button 
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-6 left-6 z-[60] p-3 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] active:scale-95 transition-all"
        aria-label="Toggle Sovereign Navigation"
      >
        <Menu className="w-6 h-6 text-emerald-500" />
      </button>

      {/* Global Overlay Cluster */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[70] lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 h-full w-[80vw] max-w-[320px] bg-black z-[80] lg:hidden border-r border-white/5 shadow-[20px_0_50px_rgba(0,0,0,1)]"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-grad-primary flex items-center justify-center border border-white/20">
                     <Zap className="w-5 h-5 text-black fill-current" />
                  </div>
                  <span className="font-black italic uppercase tracking-tighter text-white">IFX Node</span>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-white/40" />
                </button>
              </div>
              
              <div className="h-[calc(100%-80px)] overflow-y-auto">
                 <GlobalNavigation />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
