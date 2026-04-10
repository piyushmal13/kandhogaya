import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWebinars } from '@/hooks/useWebinars';
import { WebinarCard } from '@/components/institutional/WebinarCard';
import { VideoPlayer } from '@/components/institutional/VideoPlayer';
import { Skeleton, WebinarCardSkeleton } from '@/components/ui/Skeleton';
import { DashboardLayout } from '@/components/institutional/DashboardLayout';
import { DashboardNavigation } from '@/components/institutional/DashboardNavigation';
import { DashboardHeader } from '@/components/institutional/DashboardHeader';
import { MarketIntelligencePanel } from '@/components/institutional/MarketIntelligencePanel';
import { PageMeta } from '@/components/site/PageMeta';

export const Webinars = () => {
  const { data: webinars, isLoading } = useWebinars();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'recorded'>('upcoming');

  const filteredWebinars = webinars?.filter(w => 
    activeTab === 'upcoming' ? w.status !== 'recorded' : w.status === 'recorded'
  );

  const liveWebinar = webinars?.find(w => w.status === 'live');

  return (
    <DashboardLayout
      leftRail={<DashboardNavigation />}
      topBar={<DashboardHeader />}
      contextPanel={<MarketIntelligencePanel />}
    >
      <PageMeta
        title="Institutional Masterclasses"
        description="Live algorithmic trading sessions and recorded deep-dives from sovereign desks. Access institutional intelligence sessions."
        path="/webinars"
      />

      <div className="space-y-12">
        {/* Header Section */}
        <div className="space-y-4">
          <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-[0.8] mb-4">
            Institutional <span className="text-emerald-500">Masterclasses</span>
          </h1>
          <p className="text-sm text-white/40 max-w-2xl font-medium uppercase tracking-widest leading-relaxed">
            Participate in sovereign market breakdowns, systematic workflow walkthroughs, and quantitative execution masterclasses led by the IFX research desk.
          </p>
        </div>

        {/* Live Stream Surface */}
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
                  </span>
                  Direct Link Active
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

        {/* Intelligence Archive Filters */}
        <div className="space-y-10">
          <div className="flex gap-10 border-b border-white/5">
            {(['upcoming', 'recorded'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative ${
                  activeTab === tab ? 'text-emerald-500' : 'text-white/30 hover:text-white'
                }`}
              >
                {tab === 'upcoming' ? 'Cycle Schedule' : 'Intelligence Archive'}
                {activeTab === tab && (
                  <motion.div 
                    layoutId="activeTabWebinars"
                    className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-emerald-500 shadow-[0_0_10px_#10b981]" 
                  />
                )}
              </button>
            ))}
          </div>

          {/* Masterclass Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <WebinarCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredWebinars?.length ? (
                filteredWebinars.map((webinar, index) => (
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
    </DashboardLayout>
  );
};

export default Webinars;
