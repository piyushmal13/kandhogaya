import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Compass, BookOpen, Zap, ArrowRight } from 'lucide-react';
import { PageMeta } from '../components/site/PageMeta';
import { EliteButton } from '../components/ui/Button';

/**
 * Institutional Error Surface (404 / 500).
 * High-authority public page inspired by VT Markets design aesthetics.
 * Elegant dark theme, glowing ambient backdrops, clean typography, and interactive navigation tiles.
 */
export function InstitutionalError() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-[#020203] text-white flex items-center justify-center px-4 overflow-hidden pt-24 md:pt-32 pb-16">
      {/* Background Ambience inspired by VT Markets */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[140%] h-[50%] bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.06)_0%,transparent_60%)] blur-3xl opacity-60" />
        <div className="absolute bottom-0 right-0 w-[40%] h-[30%] bg-[radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.04)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:30px_30px] opacity-15" />
      </div>

      <PageMeta
        title="Page Not Found"
        description="The requested page could not be located on IFX Trades. Return to our base omni-view or explore active strategies."
        path="/404"
        robots="noindex,follow"
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-xl text-center space-y-10"
      >
        <div className="relative inline-flex">
          <div className="absolute inset-0 blur-3xl bg-emerald-500/10 rounded-full animate-pulse" />
          <div className="relative w-20 h-20 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Compass className="w-10 h-10" style={{ animation: 'spin 20s linear infinite' }} />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-7xl sm:text-8xl font-black italic uppercase tracking-tighter text-white leading-none">
            404 <span className="text-emerald-500">Lost</span>
          </h1>
          <p className="text-lg sm:text-xl font-black text-white/40 uppercase tracking-[0.2em] font-sans">
             This Route is Off the Grid
          </p>
          <p className="max-w-md mx-auto text-xs text-gray-400 leading-relaxed font-medium">
             The page you are looking for has been relocated or does not exist. Explore our premier institutional algorithms, webinars, or platforms below.
          </p>
        </div>

        {/* Cinematic Navigation Tiles inspired by VT Markets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
          {[
            { title: "Home Surface", path: "/", icon: Compass, desc: "Omni Overview" },
            { title: "Masterclasses", path: "/webinars", icon: BookOpen, desc: "Trading Webinars" },
            { title: "QuantX Algos", path: "/quantx", icon: Zap, desc: "Algorithmic Logic" }
          ].map((item) => (
            <button
              key={item.title}
              onClick={() => navigate(item.path)}
              className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-emerald-500/30 hover:bg-white/[0.02] transition-all text-left flex flex-col justify-between h-28 group"
            >
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 group-hover:text-emerald-400 transition-colors">
                <item.icon className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-white block tracking-wider leading-none">{item.title}</span>
                <span className="text-[8px] text-gray-500 uppercase tracking-widest block mt-1">{item.desc}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="pt-4">
          <EliteButton
            variant="gemini"
            glowEffect={true}
            size="lg"
            onClick={() => navigate('/')}
            className="px-10 uppercase tracking-widest font-black text-xs"
          >
            Go to Platform Home
            <ArrowRight className="w-4 h-4 ml-2" />
          </EliteButton>
        </div>
      </motion.div>
    </div>
  );
}
