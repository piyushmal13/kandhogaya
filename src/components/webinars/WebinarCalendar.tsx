import React from "react";
import { motion } from "motion/react";
import { Calendar, Clock, ArrowRight } from "lucide-react";

import { Webinar } from '../../types';

interface WebinarCalendarProps {
  webinars: Webinar[];
}

export const WebinarCalendar = ({ webinars }: WebinarCalendarProps) => {
  const sortedWebinars = [...webinars].sort((a, b) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime());

  return (
    <div className="bg-[var(--color7)] border border-white/10 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-emerald-500" />
        Upcoming Schedule
      </h3>

      <div className="space-y-4">
        {sortedWebinars.slice(0, 5).map((webinar) => (
          <motion.div
            key={webinar.id}
            whileHover={{ x: 5 }}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
          >
            <div className="w-12 h-12 bg-white/5 rounded-lg flex flex-col items-center justify-center border border-white/5 shrink-0">
              <span className="text-[10px] text-gray-500 uppercase font-bold">
                {new Date(webinar.date_time).toLocaleDateString('en-US', { month: 'short' })}
              </span>
              <span className="text-lg font-bold text-white leading-none">
                {new Date(webinar.date_time).getDate()}
              </span>
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-medium text-sm truncate group-hover:text-emerald-400 transition-colors">
                {webinar.title}
              </h4>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <Clock className="w-3 h-3" />
                {new Date(webinar.date_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                <span className="w-1 h-1 bg-gray-600 rounded-full" />
                {webinar.speaker_name || 'Speaker'}
              </div>
            </div>

            <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-emerald-500 transition-colors opacity-0 group-hover:opacity-100" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
