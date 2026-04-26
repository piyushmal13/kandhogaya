import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Calendar, Clock, ArrowRight, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { Webinar } from "../../types";
import { useAuth } from "../../contexts/AuthContext";

interface WebinarCardProps {
  webinar: Webinar;
  onRegister: (webinar: Webinar) => void;
}

export const WebinarCard = ({ webinar, onRegister }: WebinarCardProps) => {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const { user } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const eventTime = new Date(webinar.date_time).getTime();
      const distance = eventTime - now;

      if (distance < 0) {
        setTimeLeft("LIVE NOW");
        clearInterval(timer);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        setTimeLeft(`${days}d ${hours}h`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [webinar.date_time]);

  const handleRegisterClick = () => {
    onRegister(webinar);
  };

  const seatsLeft = webinar.max_attendees - webinar.registration_count;
  const isLowSeats = seatsLeft < 20;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-[var(--color7)] border border-white/10 rounded-2xl overflow-hidden group hover:border-emerald-500/30 transition-all flex flex-col h-full"
    >
      <Link to={`/webinars/${webinar.id}`} className="relative h-48 overflow-hidden block">
        <img 
          src={webinar.webinar_image_url || `https://picsum.photos/seed/${webinar.id}/800/450`} 
          alt={webinar.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60 group-hover:opacity-80"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <div className="flex gap-2">
            {timeLeft === "LIVE NOW" ? (
              <span className="bg-emerald-500/10 backdrop-blur-md text-emerald-400 text-[10px] font-bold px-3 py-1.5 rounded-full border border-emerald-500/30 flex items-center gap-2 tracking-widest uppercase">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>Live
              </span>
            ) : (
              <span className="bg-black/40 backdrop-blur-xl text-white/90 text-[10px] font-bold px-3 py-1.5 rounded-full border border-white/10 tracking-widest uppercase">
                {timeLeft}
              </span>
            )}
            {webinar.is_paid && (
              <span className="bg-amber-500/10 backdrop-blur-md text-amber-500 text-[10px] font-bold px-3 py-1.5 rounded-full border border-amber-500/30 tracking-widest uppercase">
                Premium
              </span>
            )}
          </div>
          {isLowSeats && seatsLeft > 0 && (
            <span className="bg-white/5 backdrop-blur-md text-white/40 text-[9px] font-bold px-3 py-1 rounded-full border border-white/5 tracking-widest uppercase">
              {seatsLeft} Slots Available
            </span>
          )}
        </div>
        {webinar.brand_logo_url && (
          <div className="absolute bottom-4 right-4 w-10 h-10 bg-black/40 backdrop-blur-md rounded-lg p-1 border border-white/10">
            <img src={webinar.brand_logo_url} alt="Brand" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
          </div>
        )}
      </Link>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-2 text-xs text-emerald-500 font-mono mb-3">
          <Calendar className="w-3 h-3" />
          {new Date(webinar.date_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          <span className="text-gray-600">•</span>
          <Clock className="w-3 h-3" />
          {new Date(webinar.date_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </div>

        <Link to={`/webinars/${webinar.id}`} className="block">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
            {webinar.title}
          </h3>
        </Link>
        
        <p className="text-gray-400 text-sm line-clamp-2 mb-6 flex-1">
          {webinar.description}
        </p>

        <div className="flex items-center gap-3 mb-6">
          {webinar.speaker_profile_url ? (
            <img src={webinar.speaker_profile_url} alt={webinar.speaker_name} className="w-10 h-10 rounded-xl object-cover border border-white/10" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-white/50 uppercase">
              {webinar.speaker_name?.charAt(0) || 'S'}
            </div>
          )}
          <div>
            <div className="text-white text-[13px] font-bold">{webinar.speaker_name || 'Senior Strategist'}</div>
            <div className="text-white/30 text-[10px] uppercase tracking-widest">Market Analyst</div>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] text-white/30 uppercase tracking-[0.2em] mb-0.5">Access Fee</span>
            <div className="text-white font-bold tracking-tight">
              {webinar.is_paid ? `$${webinar.price}` : "Complimentary"}
            </div>
          </div>
          <button 
            onClick={handleRegisterClick}
            className="px-6 py-2.5 bg-white text-black text-[11px] font-bold uppercase tracking-wider rounded-xl hover:bg-emerald-500 transition-all duration-300 flex items-center gap-2 group/btn shadow-xl shadow-white/5"
          >
            {!user && <Lock className="w-3 h-3 text-black/50" />}
            {webinar.is_paid ? "Get Access" : "Register Now"}
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
