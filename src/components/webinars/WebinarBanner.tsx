import React, { useState, useEffect } from "react";
import { ArrowRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { getWebinars } from "../../services/apiHandlers";
import { CountdownTimer } from "./CountdownTimer";
import { Webinar } from '../../types';

export const WebinarBanner = () => {
  const [nextWebinar, setNextWebinar] = useState<Webinar | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNextWebinar = async () => {
      try {
        const data = await getWebinars() as Webinar[];
        if (data && data.length > 0) {
          // Filter for the first upcoming webinar
          const upcoming = data.find((w: Webinar) => w.status === 'upcoming');
          if (upcoming) setNextWebinar(upcoming);
        }
      } catch (err) {
        console.error("Error fetching next webinar:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNextWebinar();
  }, []);

  if (loading || !nextWebinar) return null;

  const seatsLeft = nextWebinar.max_attendees - (nextWebinar.registration_count || 0);

  return (
    <div className="w-full bg-[var(--color6)] border-b border-emerald-500/20 relative overflow-hidden group">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(16,185,129,0.05),transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex w-10 h-10 rounded-full bg-emerald-500/10 items-center justify-center text-emerald-500 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
            <Zap className="w-5 h-5" />
          </div>
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-0.5">
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Next Live Session</span>
              
              {/* Sponsorship Presence */}
              {nextWebinar.sponsors && nextWebinar.sponsors.length > 0 && (
                <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-white/10 opacity-60">
                  <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Presented by</span>
                  <img src={nextWebinar.sponsors[0].logo_url} alt={nextWebinar.sponsors[0].name} className="h-3 w-auto grayscale brightness-200" />
                </div>
              )}

              <span className="w-1 h-1 rounded-full bg-gray-600 mx-1" />
              <span className="text-[10px] font-bold text-red-400 animate-pulse uppercase tracking-widest">
                {seatsLeft} Seats Left
              </span>
            </div>
            <h4 className="text-white font-bold text-sm md:text-base tracking-tight group-hover:text-emerald-400 transition-colors">
              {nextWebinar.title}
            </h4>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
          <CountdownTimer targetDate={nextWebinar.date_time} variant="banner" />

          <Link 
            to={`/webinars/${nextWebinar.id}`}
            className="px-6 py-2 bg-emerald-500 text-black text-xs font-bold rounded-full hover:bg-emerald-400 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-2 group/btn"
          >
            Register Now
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
