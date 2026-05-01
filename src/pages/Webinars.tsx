import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useWebinars } from '@/hooks/useWebinars';
import { WebinarCard } from '@/components/institutional/WebinarCard';
import { VideoPlayer } from '@/components/institutional/VideoPlayer';
import { WebinarCardSkeleton } from '@/components/ui/Skeleton';
import { PageMeta } from '@/components/site/PageMeta';
import { StandardLayout } from '@/components/site/StandardLayout';

export const Webinars = () => {
  const { data: webinars, isLoading } = useWebinars();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const filteredWebinars = webinars?.filter(w => 
    activeTab === 'upcoming' ? w.status !== 'past' : w.status === 'past'
  );

  const liveWebinar = webinars?.find(w => w.status === 'live');

  return (
    <>
      <div className="relative pt-32 pb-24 min-h-screen overflow-hidden">
        {/* Background Ambience */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[60%] bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06)_0%,transparent_60%)] blur-3xl" />
          <div className="dot-grid absolute inset-0 opacity-[0.03]" />
        </div>
        <PageMeta
          title="Institutional Masterclasses | Sovereign Terminal"
          description="Live algorithmic trading sessions and recorded deep-dives from sovereign desks. Access institutional intelligence sessions."
          path="/webinars"
        />

        <div className="max-w-7xl mx-auto px-4 space-y-12">
          <div className="relative z-10 space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Institutional Masterclasses
            </h1>
            <p className="text-sm text-white/40 max-w-2xl font-medium uppercase tracking-widest leading-relaxed">
              Participate in sovereign market breakdowns, systematic workflow walkthroughs, and quantitative execution masterclasses led by the IFX research desk.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {liveWebinar && (
              <motion.section 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                    </span> Direct Link Active 
                  </h2>
                  <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-mono text-white/40 uppercase">
                    Session ID: {liveWebinar.id.slice(0, 8)}
                  </div>
                </div>
                <VideoPlayer 
                  src={liveWebinar.streaming_url || ''}
                  title={liveWebinar.title}
                  isLive={true}
                />
              </motion.section>
            )}
          </AnimatePresence>

          <div className="relative z-10 space-y-10">
            <div className="flex flex-wrap gap-6 md:gap-10 border-b border-white/5 pb-2">
              {(['upcoming', 'past'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative ${
                    activeTab === tab ? 'text-[#58F2B6]' : 'text-white/30 hover:text-white'
                  }`}
                >
                  {tab === 'upcoming' ? 'Cycle Schedule' : 'Intelligence Archive'}
                  {activeTab === tab && (
                    <motion.div 
                      layoutId="activeTabWebinars"
                      className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#58F2B6] shadow-[0_0_10px_#58F2B6]" 
                    />
                  )}
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {["sk1", "sk2", "sk3"].map((key) => (
                  <WebinarCardSkeleton key={key} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredWebinars?.length ? (
                  filteredWebinars.map((webinar) => (
                    <WebinarCard key={webinar.id} webinar={webinar} />
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center border border-white/5 rounded-[2.5rem] bg-white/[0.02]">
                     <p className="text-sm font-black text-white/20 uppercase tracking-[0.3em]">No archive nodes located for this cycle.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Webinars;

