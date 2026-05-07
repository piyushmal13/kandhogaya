import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Users, 
  ArrowRight, 
  Zap, 
  ShieldCheck,
  Clock
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Banner {
  id: string;
  title: string;
  description: string;
  image_url: string;
  link_url: string;
  placement: string;
  priority: number;
  metadata: any;
}

/**
 * Global Promotion Banner — Elite Advertising Hub
 * 
 * Features:
 * 1. Intelligent Placement: Only shows on specific routes or 'global'.
 * 2. Frequency Capping: Respects user dismissal for the duration of the session.
 * 3. Rotational Logic: Fetches prioritized active campaigns from Supabase.
 */
export const GlobalPromotionBanner = () => {
  const location = useLocation();
  const [activeBanner, setActiveBanner] = useState<Banner | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasClosed, setHasClosed] = useState(false);

  useEffect(() => {
    // Check if user already dismissed a banner
    const dismissedAt = localStorage.getItem('dismissed_banner_timestamp');
    const isDismissedRecently = dismissedAt && (Date.now() - parseInt(dismissedAt)) < 1000 * 60 * 60 * 24; // 24 hour silence
    
    const fetchBanner = async () => {
      try {
        const { data, error } = await supabase
          .from('banners')
          .select('*')
          .eq('is_active', true)
          .order('priority', { ascending: false });

        if (data && data.length > 0 && !error) {
          // Filtering logic: 
          // 1. Matches current path (e.g. /webinars)
          // 2. Or is marked as 'global'
          // 3. AND hasn't been dismissed yet
          const currentPath = location.pathname;
          
          const relevantBanner = data.find(b => {
            const isMatch = b.placement === 'global' || 
                           (b.placement === 'webinar' && currentPath.startsWith('/webinar')) ||
                           (b.placement === 'marketplace' && currentPath.startsWith('/marketplace')) ||
                           (b.placement === 'home' && currentPath === '/');
            
            return isMatch && !isDismissedRecently;
          });

          if (relevantBanner) {
            setActiveBanner(relevantBanner);
            // Dynamic delay based on page type
            const delay = currentPath === '/' ? 5000 : 2000;
            const timer = setTimeout(() => setIsVisible(true), delay);
            return () => clearTimeout(timer);
          } else {
            setIsVisible(false);
          }
        }
      } catch (err) {
        console.error("Institutional Ad Server: Connection dropped.", err);
      }
    };

    fetchBanner();
  }, [location.pathname]);

  const handleDismiss = () => {
    if (activeBanner) {
      localStorage.setItem('dismissed_banner_timestamp', Date.now().toString());
    }
    setIsVisible(false);
    setTimeout(() => setHasClosed(true), 500);
  };

  if (!activeBanner || hasClosed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="fixed bottom-6 left-6 right-6 z-[100] max-w-4xl mx-auto"
        >
          <div className="relative group overflow-hidden rounded-2xl md:rounded-[2rem] bg-black/80 backdrop-blur-3xl border border-emerald-500/20 shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
            {/* Animated Glow Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
            
            <div className="flex flex-col md:flex-row items-stretch">
              {/* Image Segment */}
              <div className="relative w-full md:w-48 h-24 md:h-auto overflow-hidden shrink-0">
                <img 
                  src={activeBanner.image_url || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"} 
                  alt={activeBanner.title}
                  className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 to-transparent" />
                <div className="absolute top-3 left-3">
                  <div className="px-1.5 py-0.5 rounded bg-emerald-500 text-black text-[7px] font-black uppercase tracking-widest flex items-center gap-1 shadow-xl">
                    <Zap className="w-2 h-2" />
                    {activeBanner.placement === 'webinar' ? 'Live' : 'Intel'}
                  </div>
                </div>
              </div>

              {/* Content Segment */}
              <div className="flex-1 p-3 md:p-6 flex flex-col justify-center">
                <div className="flex items-start justify-between gap-4 mb-1">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-2.5 h-2.5 text-emerald-500" />
                      <span className="text-[7px] font-black text-emerald-500 uppercase tracking-[0.3em]">Institutional Broadcast</span>
                    </div>
                    <h3 className="text-sm md:text-xl font-black text-white tracking-tighter uppercase italic leading-none">
                      {activeBanner.title}
                    </h3>
                  </div>
                  <button 
                    onClick={handleDismiss}
                    className="p-1.5 rounded-full hover:bg-white/10 text-white/30 hover:text-white transition-all"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                <p className="text-xs text-white/40 font-medium leading-relaxed mb-4 max-w-xl line-clamp-2">
                  {activeBanner.description}
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    to={activeBanner.link_url}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 text-black font-black text-[9px] uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
                  >
                    Secure Entry Node
                    <ArrowRight className="w-3 h-3" />
                  </Link>

                  <div className="hidden sm:flex items-center gap-3 text-[8px] font-black text-white/20 uppercase tracking-widest">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{activeBanner.metadata?.registration_count || '1.2K'}</span>
                    </div>
                    <div className="w-0.5 h-0.5 rounded-full bg-white/10" />
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Progress Line */}
            <motion.div 
              key={activeBanner.id}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 15, ease: "linear" }}
              className="absolute bottom-0 left-0 h-[2px] bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
