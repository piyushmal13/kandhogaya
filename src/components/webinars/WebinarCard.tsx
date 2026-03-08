import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Clock, User, Users, ArrowRight, CheckCircle2, X } from "lucide-react";

interface WebinarCardProps {
  webinar: any;
  onRegister: (webinar: any) => void;
}

export const WebinarCard = ({ webinar, onRegister }: WebinarCardProps) => {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
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

  const seatsLeft = webinar.max_attendees - webinar.registration_count;
  const isLowSeats = seatsLeft < 50;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden group hover:border-emerald-500/30 transition-all flex flex-col h-full"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={`https://picsum.photos/seed/${webinar.id}/800/450`} 
          alt={webinar.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60 group-hover:opacity-80"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          {timeLeft === "LIVE NOW" ? (
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse flex items-center gap-1">
              <span className="w-2 h-2 bg-white rounded-full animate-ping" />
              LIVE
            </span>
          ) : (
            <span className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/10">
              {timeLeft}
            </span>
          )}
          {webinar.is_paid && (
            <span className="bg-emerald-500 text-black text-xs font-bold px-3 py-1 rounded-full">
              PREMIUM
            </span>
          )}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-2 text-xs text-emerald-500 font-mono mb-3">
          <Calendar className="w-3 h-3" />
          {new Date(webinar.date_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          <span className="text-gray-600">•</span>
          <Clock className="w-3 h-3" />
          {webinar.duration} min
        </div>

        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
          {webinar.title}
        </h3>
        
        <p className="text-gray-400 text-sm line-clamp-2 mb-6 flex-1">
          {webinar.description}
        </p>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">
            {webinar.speaker_name.charAt(0)}
          </div>
          <div>
            <div className="text-white text-sm font-medium">{webinar.speaker_name}</div>
            <div className="text-gray-500 text-xs">{webinar.speaker_role}</div>
          </div>
        </div>

        {isLowSeats && (
          <div className="flex items-center gap-2 text-red-400 text-xs font-bold mb-4 animate-pulse">
            <Users className="w-3 h-3" />
            Only {seatsLeft} seats remaining
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
          <div>
            {webinar.is_paid ? (
              <div className="text-white font-bold">${webinar.price}</div>
            ) : (
              <div className="text-emerald-500 font-bold">Free</div>
            )}
          </div>
          <button 
            onClick={() => onRegister(webinar)}
            className="px-4 py-2 bg-white text-black text-sm font-bold rounded-lg hover:bg-emerald-500 transition-colors flex items-center gap-2"
          >
            Register
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
