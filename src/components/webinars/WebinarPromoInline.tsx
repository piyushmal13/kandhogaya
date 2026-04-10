import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Calendar, Users, ArrowRight, Video, Timer } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

import { Webinar } from '../../types';

export const WebinarPromoInline = () => {
  const [nextWebinar, setNextWebinar] = useState<Webinar | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNextWebinar = async () => {
      try {
        const { data } = await supabase
          .from("webinars")
          .select("*")
          .eq("status", "upcoming")
          .order("date_time", { ascending: true })
          .limit(1)
          .single();

        if (data) {
          setNextWebinar(data);
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-[var(--color7)] to-[var(--color6)] border border-emerald-500/20 rounded-2xl p-6 md:p-8 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Video className="w-24 h-24 text-emerald-500" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-widest">
            Upcoming Masterclass
          </div>
          <div className="flex items-center gap-1 text-gray-500 text-[10px] font-mono">
            <Users className="w-3 h-3" />
            <span>{nextWebinar.registration_count}+ Registered</span>
          </div>
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-white mb-3 tracking-tight">
          {nextWebinar.title}
        </h3>
        
        <p className="text-gray-400 text-sm mb-6 max-w-lg leading-relaxed">
          {nextWebinar.description.length > 120 
            ? nextWebinar.description.substring(0, 120) + "..." 
            : nextWebinar.description}
        </p>

        <div className="flex flex-wrap items-center gap-6 mb-8">
          <div className="flex items-center gap-2 text-gray-300 text-sm">
            <Calendar className="w-4 h-4 text-emerald-500" />
            <span>{new Date(nextWebinar.date_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })} GMT</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300 text-sm">
            <Timer className="w-4 h-4 text-emerald-500" />
            <span>60 Minutes</span>
          </div>
        </div>

        <Link 
          to="/webinars"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] group/btn"
        >
          Reserve My Free Seat
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
};
