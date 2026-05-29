import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useWebinars } from '@/hooks/useWebinars';
import { WebinarCard } from '@/components/institutional/WebinarCard';
import { WebinarCardSkeleton } from '@/components/ui/Skeleton';
import { PageMeta } from '@/components/site/PageMeta';
import { AdBanner } from '@/components/ui/AdBanner';
import { Video, Award, BookOpen, ShieldCheck, HelpCircle } from 'lucide-react';

export const Webinars = () => {
  const { data: webinars, isLoading } = useWebinars();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const filteredWebinars = webinars?.filter(w => 
    activeTab === 'upcoming' ? w.status !== 'past' : w.status === 'past'
  );

  // Strictly check if there is an ACTUAL live webinar running with active streaming URL
  const liveWebinar = webinars?.find(w => w.status === 'live' && w.streaming_url);

  return (
    <div className="relative pt-24 md:pt-32 pb-16 md:pb-24 min-h-screen overflow-hidden bg-[#07070a] text-white">
        {/* Soft Background Radial Glows */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[50%] bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.05)_0%,transparent_60%)] blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[50%] h-[30%] bg-[radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.03)_0%,transparent_70%)] blur-3xl" />
        </div>
        
        <PageMeta
          title="Institutional Webinars & Masterclasses | IFX Trades"
          description="Access live trading webinars, macro research briefings, and recorded past sessions from IFX Trades lead strategists."
          path="/webinars"
        />

        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-16 relative z-10">
          
          {/* Executive Header */}
          <div className="space-y-6 text-center max-w-4xl mx-auto pt-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              IFX Systematic Platform
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-tight uppercase">
              Institutional <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Masterclass Series</span>
            </h1>
            <p className="text-sm md:text-base text-gray-400 font-medium leading-relaxed max-w-2xl mx-auto">
              Accelerate your trading performance with premium systematic insights. Access real-time briefings, macro research breakdowns, and advanced algorithmic model tutorials from our global strategy desk.
            </p>
          </div>

          {/* Institutional Trust Badges */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] bg-white/[0.01] border border-white/5 backdrop-blur-sm">
            {[
              { icon: ShieldCheck, title: "Curriculum", desc: "Curated syllabus" },
              { icon: BookOpen, title: "Integrated", desc: "Liquidity designs" },
              { icon: Video, title: "On-Demand", desc: "Micro classes" },
              { icon: HelpCircle, title: "Interactive Q&A", desc: "Strategy queries" }
            ].map((metric) => (
              <div key={metric.title} className="p-2 sm:p-4 flex flex-col items-center text-center space-y-1.5 group hover:bg-white/[0.01] rounded-2xl transition-all border border-transparent hover:border-white/5">
                <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:scale-105 transition-transform">
                  <metric.icon className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-emerald-400" />
                </div>
                <h4 className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-wider leading-none">{metric.title}</h4>
                <p className="text-[8px] sm:text-[10px] text-gray-400 leading-tight">{metric.desc}</p>
              </div>
            ))}
          </div>

          <AdBanner placement="webinar" />

          {/* Webinars Grid Section */}
          <div className="space-y-8 relative z-10">
            <div className="flex flex-wrap gap-6 md:gap-10 border-b border-white/5 pb-2">
              {(['upcoming', 'past'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-xs font-bold uppercase tracking-wider transition-all relative ${
                    activeTab === tab ? 'text-emerald-400' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab === 'upcoming' ? 'Upcoming Sessions' : 'Archived Webinars'}
                  {activeTab === tab && (
                    <motion.div 
                      layoutId="activeTabWebinars"
                      className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-emerald-400" 
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
                  <div className="col-span-full py-20 text-center border border-white/5 rounded-3xl bg-white/[0.01]">
                     <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">No webinars currently scheduled in this category.</p>
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
