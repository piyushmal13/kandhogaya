import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Video, Lock } from "lucide-react";
import { cn } from "@/utils/cn";

interface WebinarSessionsProps {
  webinars: any[];
  registrations: any[];
  isElite: boolean;
  onUpgrade: () => void;
}

export const WebinarSessions: React.FC<WebinarSessionsProps> = ({
  webinars,
  registrations,
  isElite,
  onUpgrade
}) => {
  const registeredWebinars = webinars.filter(w => 
    registrations.some(r => r.webinar_id === w.id)
  );

  const renderWebinars = () => {
    if (registeredWebinars.length === 0) {
      return (
        <div className="text-center py-12 px-6 border border-dashed border-white/5 rounded-3xl bg-black/20">
          <p className="text-[10px] uppercase font-black text-gray-500 tracking-[0.2em] mb-4 italic">
            NO SESSIONS REGISTERED
          </p>
          <Link to="/webinars" className="inline-flex py-3 px-6 bg-white/5 text-xs font-bold text-white rounded-xl hover:bg-emerald-500 hover:text-black transition-all">
            Join a Webinar
          </Link>
        </div>
      );
    }

    return (
      <AnimatePresence mode="popLayout">
        <div className="space-y-4">
          {registeredWebinars.map(w => (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              key={w.id} 
              className="p-6 rounded-[32px] bg-emerald-500/5 border border-emerald-500/20 hover:border-emerald-500 transition-all group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Enrolled Session</span>
              </div>
              <div className="text-sm font-black text-white mb-4 uppercase tracking-tighter leading-snug group-hover:text-emerald-400 transition-colors">
                {w.title}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest font-mono">
                  {new Date(w.date_time).toLocaleDateString()} at {new Date(w.date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <Link to="/webinar-feed" className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-emerald-500 hover:text-black transition-all">
                  <Video className="w-5 h-5 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    );
  };

  return (
    <section className="p-10 rounded-[48px] bg-emerald-500/5 border border-emerald-500/10 backdrop-blur-3xl relative group">
      <h2 className="text-xl font-black text-white mb-8 flex items-center gap-3 uppercase tracking-tighter italic">
        <Video className="w-6 h-6 text-emerald-500" />
        Live Sessions
      </h2>

      {!isElite && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-8 bg-black/80 backdrop-blur-sm rounded-[48px] text-center">
          <Lock className="w-10 h-10 text-emerald-500/50 mb-4" />
          <div className="text-[11px] font-black uppercase tracking-[0.15em] text-white/80 mb-6 leading-relaxed">
            Elite Tier Required <br/> For Live Webinars
          </div>
          <button 
            onClick={onUpgrade}
            className="px-8 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-black text-[9px] uppercase tracking-[0.25em] rounded-xl hover:bg-emerald-500 hover:text-black transition-all"
          >
            Upgrade Now
          </button>
        </div>
      )}
      
      <div className={cn("transition-all duration-700", !isElite && "blur-xl select-none pointer-events-none")}>
        {renderWebinars()}
      </div>
    </section>
  );
};
