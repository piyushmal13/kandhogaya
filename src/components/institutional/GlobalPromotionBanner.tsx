import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Calendar, 
  Users, 
  ArrowRight, 
  Zap, 
  ShieldCheck,
  TrendingUp,
  Clock,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';
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
    // Check if user already dismissed a banner in this session
    const dismissedBannerId = sessionStorage.getItem('dismissed_banner_id');
    
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
            
            return isMatch && dismissedBannerId !== b.id;
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
      sessionStorage.setItem('dismissed_banner_id', activeBanner.id);
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
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-6 left-6 right-6 z-[100] max-w-4xl mx-auto"
        >
          <div className="relative group overflow-hidden rounded-[2rem] bg-black/60 backdrop-blur-3xl border border-emerald-500/20 shadow-[0_40px_100px_rgba(0,0,0,0.8),0_0_40px_rgba(16,185,129,0.1)]">
            {/* Animated Glow Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
            
            <div className="flex flex-col md:flex-row items-stretch">
              {/* Image Segment */}
              <div className="relative w-full md:w-56 h-40 md:h-auto overflow-hidden shrink-0">
                <img 
                  src={activeBanner.image_url || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"} 
                  alt={activeBanner.title}
                  className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 to-transparent" />
                <div className="absolute top-4 left-4">
                  <div className="px-2 py-1 rounded bg-emerald-500 text-black text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-xl">
                    <Zap className="w-2.5 h-2.5" />
                    {activeBanner.placement === 'webinar' ? 'Live Transmission' : 'Institutional Protocol'}
                  </div>
                </div>
              </div>

              {/* Content Segment */}
              <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">Institutional Broadcast</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-white tracking-tighter uppercase italic leading-none">
                      {activeBanner.title}
                    </h3>
                  </div>
                  <button 
                    onClick={handleDismiss}
                    className="p-2 rounded-full hover:bg-white/10 text-white/30 hover:text-white transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <p className="text-sm text-white/40 font-medium leading-relaxed mb-6 max-w-xl line-clamp-2">
                  {activeBanner.description}
                </p>

                <div className="flex flex-wrap items-center gap-6">
                  <Link
                    to={activeBanner.link_url}
                    className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-emerald-500 text-black font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/20"
                  >
                    Secure Entry Node
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <div className="flex items-center gap-4 text-[9px] font-black text-white/30 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      <span>{activeBanner.metadata?.registration_count || '1.2K'} Synchronized</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-white/10" />
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified Intel</span>
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
