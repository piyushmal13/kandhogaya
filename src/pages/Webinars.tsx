import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useWebinars } from '@/hooks/useWebinars';
import { WebinarCard } from '@/components/institutional/WebinarCard';
import { VideoPlayer } from '@/components/institutional/VideoPlayer';
import { WebinarCardSkeleton } from '@/components/ui/Skeleton';
import { WebinarOperationsMonitor } from '@/components/institutional/WebinarOperationsMonitor';
import { PageMeta } from '@/components/site/PageMeta';
import { AdBanner } from '@/components/ui/AdBanner';
import { Video, ShieldCheck, Globe, Zap, Users } from 'lucide-react';

export const Webinars = () => {
  const { data: webinars, isLoading } = useWebinars();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const filteredWebinars = webinars?.filter(w => 
    activeTab === 'upcoming' ? w.status !== 'past' : w.status === 'past'
  );

  // Strictly check if there is an ACTUAL live webinar running with active streaming URL
  const liveWebinar = webinars?.find(w => w.status === 'live' && w.streaming_url);

  return (
    <div className="relative pt-24 md:pt-32 pb-16 md:pb-24 min-h-screen overflow-hidden bg-[#020203]">
        {/* Background Ambience */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[60%] bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08)_0%,transparent_65%)] blur-3xl" />
          <div className="dot-grid absolute inset-0 opacity-[0.03]" />
        </div>
        
        <PageMeta
          title="Institutional Masterclasses | IFX Terminal"
          description="Live algorithmic trading sessions and recorded deep-dives from the IFX research desk. Access institutional intelligence sessions."
          path="/webinars"
        />

        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-16 relative z-10">
          
          {/* Elite Header */}
          <div className="relative z-10 space-y-6 pt-8 md:pt-12 text-center md:text-left">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.25em] mx-auto md:mx-0">
              <Zap className="w-3.5 h-3.5" />
              IFX Global Research Desk
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-none">
              Institutional <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Research Terminal.</span>
            </h1>
            <p className="text-sm md:text-lg text-white/40 max-w-3xl font-medium leading-relaxed mx-auto md:mx-0">
              Real-time synchronization with the IFX Global Research Desk. Masterclass sessions detailing advanced algorithmic models, execution infrastructure, and brand co-collaborations.
            </p>
          </div>

          {/* Broker/Partner Trust Panel for pitches */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-md">
            {[
              { icon: ShieldCheck, title: "Audit Compliant", desc: "Regulated risk criteria model" },
              { icon: Globe, title: "Co-Branded Nodes", desc: "Collaborations with tier-1 brokers" },
              { icon: Zap, title: "Execution Speed", desc: "Under 50ms processing signals" },
              { icon: Users, title: "1.4M+ Data Points", desc: "Calculated market metrics" }
            ].map((metric) => (
              <div key={metric.title} className="space-y-2 flex flex-col items-center md:items-start text-center md:text-left">
                <metric.icon className="w-5 h-5 text-emerald-400" />
                <h4 className="text-xs font-black text-white uppercase tracking-wider">{metric.title}</h4>
                <p className="text-[10px] text-white/30 font-medium">{metric.desc}</p>
              </div>
            ))}
          </div>

          <AdBanner placement="webinar" />

          <WebinarOperationsMonitor />

          {/* Dynamic Live Section */}
          <AnimatePresence mode="wait">
            {liveWebinar && (
              <motion.section 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6 bg-red-500/[0.02] border border-red-500/25 p-8 rounded-[3rem] shadow-[0_0_50px_rgba(239,68,68,0.05)] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.05),transparent_70%)] pointer-events-none" />
                <div className="flex items-center justify-between relative z-10 flex-wrap gap-4">
                  <h2 className="text-[10px] font-black text-red-400 uppercase tracking-[0.3em] flex items-center gap-3">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                    </span> Direct Link Active 
                  </h2>
                  <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-mono text-white/40 uppercase">
                    Session ID: {liveWebinar.id.slice(0, 8)}
                  </div>
                </div>
                <div className="relative z-10 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                  <VideoPlayer 
                    src={liveWebinar.streaming_url}
                    title={liveWebinar.title}
                    isLive={true}
                  />
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* Webinars Selector Tabs */}
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
  );
};

export default Webinars;
