import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { fetchTravelTrips, TravelTrip } from "../services/travelService";
import { Plane, MapPin, Calendar, Users, ArrowRight, Star, ShieldCheck } from "lucide-react";
import { PageMeta } from "../components/site/PageMeta";
import { breadcrumbSchema } from "../utils/structuredData";

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
    <div className="min-h-screen bg-[#020202] pt-24 pb-32 relative overflow-hidden">
      <PageMeta 
        title="Traders Travel | Exclusive Forex & Algo Trader Retreats 2026"
        description="Join the top 1% community on exclusive trader retreats in Bali, Dubai, and Thailand. Elite networking & institutional mastermind sessions for professional traders."
        path="/travel"
        keywords={[
          "traders travel",
          "forex trader retreat India",
          "institutional trading mastermind Dubai",
          "best trading community retreats 2026",
          "luxury trading vacation Bali",
          "elite trader networking event",
          "high net worth trader community",
        ]}
        structuredData={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Traders Travel", path: "/travel" }
          ])
        ]}
      />
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.05),transparent_70%)] pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20 mt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--brand)]/10 border border-[var(--brand)]/20 rounded-full mb-8"
          >
            <Plane className="w-4 h-4 text-[var(--brand)]" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--brand)] font-bold">
              Exclusive Access
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-6"
          >
            Traders <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Travel</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-400 font-medium leading-relaxed max-w-2xl mx-auto"
          >
            Join the top 1% community on exclusive retreats around the globe. Combine high-level networking, luxury experiences, and elite trading mastermind sessions.
          </motion.p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-[var(--brand)]/30 border-t-[var(--brand)] rounded-full animate-spin" />
          </div>
        ) : (
          /* Trips Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trips.map((trip, idx) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="group relative rounded-3xl overflow-hidden border border-white/10 bg-[#0a0a0a] hover:border-[var(--brand)]/30 transition-all duration-500 hover:shadow-[0_0_40px_rgba(16,185,129,0.1)]"
              >
                {/* Trip Image */}
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/20 to-transparent z-10" />
                  <img 
                    src={trip.image_url} 
                    alt={trip.destination}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-[var(--brand)]/20 rounded-full text-[10px] font-bold text-[var(--brand)] uppercase tracking-widest inline-flex items-center gap-1">
                      <Star className="w-3 h-3 fill-[var(--brand)]" />
                      {trip.exclusivity}
                    </span>
                  </div>
                </div>

                {/* Trip Details */}
                <div className="p-8 relative z-20">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-3xl font-black text-white tracking-tight">{trip.destination}</h3>
                      <p className="flex items-center gap-1 text-sm text-gray-500 font-bold uppercase tracking-wider mt-1">
                        <MapPin className="w-4 h-4" /> {trip.country}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-400 leading-relaxed mb-8 h-20">
                    {trip.description}
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="w-4 h-4 text-emerald-500/80" />
                        <span>Date</span>
                      </div>
                      <span className="text-sm font-bold text-white">{trip.date_range}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Users className="w-4 h-4 text-emerald-500/80" />
                        <span>Availability</span>
                      </div>
                      <span className="text-sm font-bold text-white">
                        {trip.spots_available} / {trip.spots_total} spots
                      </span>
                    </div>
                  </div>

                  <button className="w-full relative overflow-hidden rounded-xl bg-white text-black px-6 py-4 font-bold uppercase tracking-widest text-xs transition-all hover:scale-[1.02] active:scale-95 group/btn">
                    <div className="absolute inset-0 bg-[var(--brand)] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-out" />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Secure Your Spot <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Institutional Trust Badges */}
        <div className="mt-32 pt-16 border-t border-white/5">
          <div className="flex flex-wrap justify-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="flex items-center gap-3">
               <ShieldCheck className="w-8 h-8 text-[var(--brand)]" />
               <div className="text-left">
                 <div className="text-[10px] font-black uppercase tracking-widest text-white">Secure Booking</div>
                 <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">Encrypted Gateway</div>
               </div>
             </div>
             <div className="flex items-center gap-3">
               <Star className="w-8 h-8 text-[var(--brand)]" />
               <div className="text-left">
                 <div className="text-[10px] font-black uppercase tracking-widest text-white">Top 1% Rated</div>
                 <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">Excellence Award</div>
               </div>
             </div>
             <div className="flex items-center gap-3">
               <Plane className="w-8 h-8 text-[var(--brand)]" />
               <div className="text-left">
                 <div className="text-[10px] font-black uppercase tracking-widest text-white">Premium Travel</div>
                 <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">Concierge Service</div>
               </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};
