import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * StickyCTA — Scroll-aware conversion bar.
 * Fades in at 300px scroll depth. Desktop-only by design.
 * Placed at the end of DashboardLayout / public page layouts.
 */
export function StickyCTA() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [200, 400], [0, 1]);
  const y = useTransform(scrollY, [200, 400], [20, 0]);
  const navigate = useNavigate();

  return (
    <motion.div
      style={{ opacity, y }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 hidden lg:block pointer-events-none"
      aria-hidden="true"
    >
      <div className="pointer-events-auto px-6 py-4 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_40px_rgba(16,185,129,0.1)] flex items-center gap-6">
        {/* Live dot */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.3em] font-mono">Live</span>
        </div>

        {/* Copy */}
        <div className="text-white border-l border-white/10 pl-6">
          <div className="text-sm font-black uppercase tracking-widest">Deploy Your Terminal</div>
          <div className="text-[10px] text-white/40 uppercase tracking-widest font-mono mt-0.5">
            Join 12,400+ institutional analysts
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate('/marketplace')}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-[11px] font-black uppercase tracking-widest rounded-xl transition-all duration-200 hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]"
        >
          <TrendingUp className="w-3.5 h-3.5" />
          Access Platform
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
