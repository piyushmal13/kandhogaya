import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { fetchTravelTrips, TravelTrip } from "../services/travelService";
import { Plane, MapPin, Calendar, Users, ArrowRight, Star, ShieldCheck } from "lucide-react";
import { PageMeta } from "../components/site/PageMeta";

export const TradersTravel = () => {
  const [trips, setTrips] = useState<TravelTrip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrips = async () => {
      setLoading(true);
      const data = await fetchTravelTrips();
      setTrips(data);
      setLoading(false);
    };
    loadTrips();
  }, []);

  return (
    <div className="min-h-screen bg-[#020202] pt-32 pb-48 relative overflow-hidden">
      <PageMeta 
        title="Sovereign Summits | Elite Institutional Mobility 2026"
        description="Join the top 1% syndicate on exclusive institutional retreats in Bali, Dubai, and Thailand. Elite networking & sovereign mastermind sessions for capital operators."
        path="/travel"
        keywords={[
          "elite mobility",
          "institutional retreats Dubai",
          "sovereign mastermind summits",
          "quantitative syndicate retreats 2026",
          "luxury institutional summits Bali",
          "analyst networking events",
        ]}
      />
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.06)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12">
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-emerald-500/[0.04] border border-emerald-500/[0.15] text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em] mb-12"
          >
            Elite Global Mobility
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-shimmer mb-10 leading-[0.9]"
          >
            Sovereign <br />
            <span className="italic font-serif text-gradient-emerald">Summits.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-2xl mx-auto"
          >
            Join the top 1% syndicate on exclusive retreats around the globe. Combine high-level networking, luxury experiences, and sovereign quantitative mastermind sessions.
          </motion.p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-40">
            <div className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          /* Trips Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
            {trips.map((trip, idx) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.1 * idx }}
                className="group relative"
              >
                <div className="relative overflow-hidden rounded-[3rem] bg-[#080B12] border border-white/[0.06] transition-all duration-700 group-hover:border-emerald-500/30 group-hover:bg-[#0C0F18] group-hover:-translate-y-3 group-hover:shadow-2xl">
                  {/* Trip Image */}
                  <div className="relative h-72 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080B12] via-transparent to-transparent z-10" />
                    <img 
                      src={trip.image_url} 
                      alt={trip.destination}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                    />
                    <div className="absolute top-6 left-6 z-20">
                      <span className="px-4 py-1.5 bg-black/60 backdrop-blur-xl border border-emerald-500/20 rounded-full text-[9px] font-black text-emerald-500 uppercase tracking-widest inline-flex items-center gap-2">
                        <Star className="w-3 h-3 fill-emerald-500" />
                        {trip.exclusivity}
                      </span>
                    </div>
                  </div>

                  {/* Trip Details */}
                  <div className="p-10 relative z-20">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h3 className="text-3xl font-black text-white tracking-tighter mb-2 italic">{trip.destination}</h3>
                        <p className="flex items-center gap-2 text-[10px] text-emerald-500/40 font-black uppercase tracking-[0.2em]">
                          <MapPin className="w-3.5 h-3.5" /> {trip.country}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-500 leading-relaxed mb-10 line-clamp-3 font-light">
                      {trip.description}
                    </p>

                    <div className="space-y-4 mb-10">
                      <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/20">
                          <Calendar className="w-4 h-4 text-emerald-500/40" />
                          <span>Expedition Window</span>
                        </div>
                        <span className="text-[11px] font-black text-white font-mono">{trip.date_range}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/20">
                          <Users className="w-4 h-4 text-emerald-500/40" />
                          <span>Node Capacity</span>
                        </div>
                        <span className="text-[11px] font-black text-emerald-500 font-mono italic">
                          {trip.spots_available} / {trip.spots_total} Spots
                        </span>
                      </div>
                    </div>

                    <button className="w-full relative overflow-hidden rounded-2xl bg-white text-black px-8 py-5 font-black uppercase tracking-[0.3em] text-[10px] transition-all hover:scale-[1.02] active:scale-95 group/btn">
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        Request Invitation <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                      </span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Institutional Trust Badges */}
        <div className="mt-48 pt-20 border-t border-white/[0.05]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center text-center opacity-40 hover:opacity-100 transition-opacity duration-700">
             <div className="flex flex-col items-center gap-4">
               <ShieldCheck className="w-10 h-10 text-emerald-500" />
               <div>
                 <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white mb-2">Secure Expedition</div>
                 <div className="text-[9px] font-black text-white/20 uppercase tracking-widest">Global Protocol V4</div>
               </div>
             </div>
             <div className="flex flex-col items-center gap-4">
               <Star className="w-10 h-10 text-emerald-500" />
               <div>
                 <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white mb-2">Top 1% Fidelity</div>
                 <div className="text-[9px] font-black text-white/20 uppercase tracking-widest">Executive Standard</div>
               </div>
             </div>
             <div className="flex flex-col items-center gap-4">
               <Plane className="w-10 h-10 text-emerald-500" />
               <div>
                 <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white mb-2">Concierge Mobility</div>
                 <div className="text-[9px] font-black text-white/20 uppercase tracking-widest">Priority Transit</div>
               </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};
