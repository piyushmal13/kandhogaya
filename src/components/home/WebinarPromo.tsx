import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Calendar, ArrowRight, ShieldCheck, Mic2, Star } from "lucide-react";
import { Link } from "react-router-dom";

import { getWebinars, subscribeToWebinars } from "../../services/apiHandlers";
import { mapWebinar } from "../../utils/dataMapper";

export const WebinarPromo = () => {
  const [webinar, setWebinar] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const fetchNearestWebinar = async () => {
      const webinars = await getWebinars();
      if (Array.isArray(webinars) && webinars.length > 0) {
        const now = Date.now();
        // Priority: Search for the Elite Macro Strategy first
        const eliteWebinar = webinars.find((w: any) => w.title.includes("Elite Macro Strategy") && new Date(w.date_time).getTime() > now);
        
        if (eliteWebinar) {
          setWebinar(eliteWebinar);
        } else {
          const upcoming = webinars.filter((item: any) => new Date(item.date_time).getTime() > now);
          setWebinar(upcoming.length > 0 ? upcoming[0] : webinars.at(-1));
        }
      }
    };

    fetchNearestWebinar();

    const subscription = subscribeToWebinars((payload: any) => {
      if (webinar && payload.new.id === webinar.id) {
        setWebinar(mapWebinar(payload.new));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [webinar?.id]);

  useEffect(() => {
    if (!webinar) return;

    const targetDate = new Date(webinar.date_time).getTime();

    const timer = setInterval(() => {
      const now = Date.now();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ h: 0, m: 0, s: 0 });
        return;
      }

      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) + Math.floor(distance / (1000 * 60 * 60 * 24)) * 24;
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ h, m, s });
    }, 1000);

    return () => clearInterval(timer);
  }, [webinar]);

  const format = (value: number) => value.toString().padStart(2, "0");

  if (!webinar) return null;

  const isSponsored = webinar.metadata?.is_sponsored;
  const sponsors = webinar.metadata?.sponsors || [];
  const isFree = !webinar.is_paid;

  return (
    <section className="py-8 md:py-48 bg-[var(--color10)] relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 items-center">
          <div className="lg:col-span-7 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] md:text-xs font-mono tracking-widest mb-4"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              {' '}LIVE MASTERCLASS
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-2xl sm:text-5xl md:text-8xl font-bold text-white mb-4 md:mb-10 tracking-tighter leading-[0.95]"
            >
              {webinar.title.split(' ').slice(0, -1).join(' ')} <span className="institutional-title text-emerald-400">{webinar.title.split(' ').slice(-1)}</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-sm md:text-lg text-gray-400 mb-8 md:mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed px-2"
            >
              {webinar.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center lg:justify-start gap-8 mb-12"
            >
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full opacity-30 blur group-hover:opacity-50 transition duration-500" />
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-white/10 p-0.5 flex items-center justify-center bg-zinc-900 overflow-hidden relative z-10">
                    {webinar.speaker_images?.[0] ? (
                      <img src={webinar.speaker_images[0]} alt={webinar.speaker} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white font-bold text-xl">{webinar.speaker?.charAt(0) || "S"}</span>
                    )}
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-white font-bold text-sm md:text-base">{webinar.speaker || webinar.speaker_name || "Institutional Lead"}</div>
                  <div className="text-emerald-500 text-[10px] font-mono tracking-wider uppercase">{webinar.metadata?.level || "Executive Strategist"}</div>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-4 border-l border-white/10 pl-8">
                <div className="text-left">
                  <div className="text-gray-500 text-[10px] font-mono uppercase tracking-widest mb-1">Capacity</div>
                  <div className="text-white font-bold text-sm">{webinar.max_attendees || 500} Total Seats</div>
                </div>
              </div>
            </motion.div>

            {isSponsored && sponsors.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center lg:justify-start gap-6 pt-8 border-t border-white/5"
              >
                <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">Institutional Partners:</span>
                <div className="flex flex-wrap gap-6 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                  {sponsors.map((sponsor: string, idx: number) => (
                    <div key={`${sponsor}-${idx}`} className="flex items-center gap-2">
                       {webinar.sponsor_logos?.[idx] ? (
                         <img src={webinar.sponsor_logos[idx]} alt={sponsor} className="h-4 md:h-5 w-auto object-contain" />
                       ) : (
                         <ShieldCheck className="w-4 h-4 text-white" />
                       )}
                      <span className="text-white font-bold tracking-tight text-[10px] md:text-xs">{sponsor}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : null}
          </div>

          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8 md:p-12 relative overflow-hidden group border-white/5 shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className="flex items-center justify-between mb-6 md:mb-8">
                <div className="flex items-center gap-2 text-emerald-500 font-mono text-[10px] md:text-xs tracking-widest">
                  <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span>{new Date(webinar.date_time).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                </div>
                <div className="px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-white/5 border border-white/10 text-[9px] md:text-[10px] font-bold text-white uppercase tracking-wider">
                  {webinar.max_attendees - webinar.registration_count} Seats Left
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
                {[
                  { label: "HOURS", value: timeLeft.h },
                  { label: "MINS", value: timeLeft.m },
                  { label: "SECS", value: timeLeft.s },
                ].map((item, i) => (
                  <div key={`${item.label}-${i}`} className="bg-black border border-white/10 rounded-lg md:rounded-xl py-3 md:py-4 flex flex-col items-center justify-center">
                    <span className="text-2xl md:text-3xl font-bold text-white font-mono tracking-tighter">{format(item.value)}</span>
                    <span className="text-[8px] md:text-[10px] text-gray-500 font-mono mt-1">{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                <div className="flex items-center gap-3 text-xs md:text-sm text-gray-400">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Mic2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </div>
                  <span>Live Q&amp;A Session Included</span>
                </div>
                <div className="flex items-center gap-3 text-xs md:text-sm text-gray-400">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Star className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </div>
                  <span>Exclusive Strategy PDF for Attendees</span>
                </div>
              </div>

              <Link to={`/webinars/${webinar.id}`} className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-full transition-all duration-500 flex items-center justify-center gap-2 group/btn shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:shadow-[0_0_50px_rgba(16,185,129,0.4)] text-base md:text-lg">
                <span className="relative z-10 flex items-center gap-2 tracking-tight">
                  {isFree ? "Secure Priority Access" : `Register for $${webinar.price}`}
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1.5 transition-transform duration-500" />
                </span>
              </Link>

              <div className="text-center mt-4 text-[9px] md:text-[10px] text-gray-600 font-mono">
                {isFree ? "NO CREDIT CARD REQUIRED • INSTANT ACCESS" : "SECURE CHECKOUT • INSTANT ACCESS"}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
