import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Calendar, ArrowRight, ShieldCheck, Mic2, Star } from "lucide-react";
import { Link } from "react-router-dom";

import { getWebinars, subscribeToWebinars } from "../../services/apiHandlers";

export const WebinarPromo = () => {
  const [webinar, setWebinar] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const fetchNearestWebinar = async () => {
      const webinars = await getWebinars();
      if (Array.isArray(webinars) && webinars.length > 0) {
        const now = Date.now();
        const upcoming = webinars.filter((item: any) => new Date(item.date_time).getTime() > now);
        setWebinar(upcoming.length > 0 ? upcoming[0] : webinars.at(-1));
      }
    };

    fetchNearestWebinar();

    const subscription = subscribeToWebinars((payload: any) => {
      if (webinar && payload.new.id === webinar.id) {
        setWebinar(payload.new);
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
    <section className="py-16 md:py-24 bg-[#020202] relative overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[800px] h-[300px] md:h-[800px] bg-emerald-500/5 blur-[80px] md:blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 items-center">
          <div className="lg:col-span-7 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] md:text-xs font-mono tracking-widest mb-6"
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
              className="text-2xl sm:text-4xl md:text-6xl font-bold text-white mb-4 md:mb-6 tracking-tighter leading-[1.1]"
            >
              {webinar.title}
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
              className="flex flex-wrap justify-center lg:justify-start gap-6 md:gap-8 mb-12"
            >
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-emerald-500/30 p-0.5 flex items-center justify-center bg-white/5 text-white font-bold text-xl">
                  {webinar.speaker?.charAt(0) || "S"}
                </div>
                <div className="text-left">
                  <div className="text-white font-bold text-xs md:text-sm">{webinar.speaker || "Speaker"}</div>
                  <div className="text-emerald-500 text-[9px] md:text-[10px] font-mono tracking-wider uppercase">{webinar.metadata?.level || "Expert"}</div>
                </div>
              </div>
            </motion.div>

            {isSponsored && sponsors.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center lg:justify-start gap-4 md:gap-6 pt-8 border-t border-white/5"
              >
                <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">Sponsored By:</span>
                <div className="flex gap-4 md:gap-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                  {sponsors.map((sponsor: string, idx: number) => (
                    <div key={`${sponsor}-${idx}`} className="flex items-center gap-1.5 md:gap-2">
                      <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-white" />
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
              className="bg-[#0a0a0a] border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 relative overflow-hidden group shadow-2xl"
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

              <Link to={`/webinars/${webinar.id}`} className="w-full py-3.5 md:py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] text-sm md:text-base">
                {isFree ? "Reserve Free Seat" : `Register for $${webinar.price}`}
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover/btn:translate-x-1 transition-transform" />
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
