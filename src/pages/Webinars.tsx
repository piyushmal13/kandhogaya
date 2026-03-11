import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Clock, User, Users, ArrowRight, CheckCircle2, X, Zap, ShieldCheck, Activity } from "lucide-react";
import { getWebinars } from "../services/apiHandlers";
import { WebinarCard } from "../components/webinars/WebinarCard";
import { RegistrationModal } from "../components/webinars/RegistrationModal";
import { AttendeeFeed } from "../components/webinars/AttendeeFeed";
import { WebinarCalendar } from "../components/webinars/WebinarCalendar";
import { CountdownTimer } from "../components/webinars/CountdownTimer";
import { ExitIntentPopup } from "../components/webinars/ExitIntentPopup";

import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const Webinars = () => {
  const [webinars, setWebinars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWebinar, setSelectedWebinar] = useState<any | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWebinars();
  }, []);

  const handleRegisterClick = (webinar: any) => {
    if (!user) {
      alert("Please sign in to register for this webinar.");
      navigate("/login");
      return;
    }
    setSelectedWebinar(webinar);
  };

  const fetchWebinars = async () => {
    const data = await getWebinars();
    if (Array.isArray(data)) {
      setWebinars(data);
    }
    setLoading(false);
  };

  const nextWebinar = webinars[0];

  return (
    <div className="min-h-screen bg-[#020202] pt-20 pb-20 relative">
      <AttendeeFeed />

      {/* --- Hero Section --- */}
      <section className="relative py-20 overflow-hidden bg-[#000000]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.15),transparent_70%)] opacity-60" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:120px_120px] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono tracking-widest mb-6"
          >
            <Zap className="w-3 h-3" />
            LIVE TRADING EDUCATION
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tighter"
          >
            Institutional Market <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
              Intelligence
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed mb-12"
          >
            Join our expert analysts for live market breakdowns, algorithmic trading workshops, and macroeconomic strategy sessions.
          </motion.p>
        </div>
      </section>

      {/* --- Featured Webinar (Next Up) --- */}
      {nextWebinar && (
        <section className="max-w-7xl mx-auto px-4 mb-24 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#0a0a0a] border border-emerald-500/30 rounded-3xl overflow-hidden relative shadow-[0_0_50px_rgba(16,185,129,0.1)]"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 animate-gradient-x" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-6">
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse flex items-center gap-1">
                    <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                    UP NEXT
                  </span>
                  <span className="text-emerald-500 text-xs font-mono tracking-widest uppercase">
                    {new Date(nextWebinar.date_time).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </span>
                </div>

                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  {nextWebinar.title}
                </h2>
                
                <div className="mb-10">
                  <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.3em] mb-6">Session Starts In</div>
                  <CountdownTimer targetDate={nextWebinar.date_time} variant="hero" />
                </div>
                
                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                  {nextWebinar.description}
                </p>

                <div className="flex items-center gap-4 mb-8">
                  {nextWebinar.speaker_profile_url ? (
                    <img 
                      src={nextWebinar.speaker_profile_url} 
                      alt={nextWebinar.speaker_name} 
                      className="w-12 h-12 rounded-full object-cover border border-white/10" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-white border border-white/10">
                      {nextWebinar.speaker_name?.charAt(0) || 'S'}
                    </div>
                  )}
                  <div>
                    <div className="text-white font-bold">{nextWebinar.speaker_name || 'Speaker'}</div>
                    <div className="text-emerald-500 text-sm">Expert Analyst</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => handleRegisterClick(nextWebinar)}
                    className="px-8 py-4 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2"
                  >
                    {nextWebinar.is_paid ? `Purchase Access ($${nextWebinar.price})` : "Register Now"}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <div className="px-8 py-4 bg-white/5 text-white font-medium rounded-xl border border-white/10 flex flex-col items-center justify-center gap-1">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-gray-400" />
                      <span>{nextWebinar.registration_count} registered</span>
                    </div>
                    {nextWebinar.max_attendees - nextWebinar.registration_count < 20 && nextWebinar.max_attendees - nextWebinar.registration_count > 0 && (
                      <div className="text-[10px] text-red-400 font-bold uppercase tracking-widest animate-pulse">
                        Only {nextWebinar.max_attendees - nextWebinar.registration_count} seats remaining
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="relative h-[400px] lg:h-auto overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10" />
                {nextWebinar.brand_logo_url && (
                  <div className="absolute top-8 right-8 w-20 h-20 bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/10 z-20">
                    <img src={nextWebinar.brand_logo_url} alt="Brand" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                )}
                <img 
                  src={nextWebinar.webinar_image_url || `https://picsum.photos/seed/${nextWebinar.id}/800/800`} 
                  alt={nextWebinar.title} 
                  className="w-full h-full object-cover opacity-60"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* --- Upcoming Grid & Calendar --- */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Webinar Grid */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-emerald-500" />
              Upcoming Sessions
            </h3>
            
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {webinars.slice(1).map((webinar, i) => (
                  <motion.div
                    key={webinar.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <WebinarCard webinar={webinar} onRegister={handleRegisterClick} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Calendar */}
          <div className="space-y-8">
            <WebinarCalendar webinars={webinars} />
            
            <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Zap className="w-20 h-20 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 relative z-10">Institutional Edge</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 relative z-10">
                Our live sessions provide real-time alpha that isn't available anywhere else. Join the next session to stay ahead of the curve.
              </p>
              <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold uppercase tracking-widest relative z-10">
                <ShieldCheck className="w-4 h-4" />
                Verified Institutional Data
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Registration Modal --- */}
      <AnimatePresence>
        {selectedWebinar && (
          <RegistrationModal 
            webinar={selectedWebinar} 
            onClose={() => setSelectedWebinar(null)} 
            onSuccess={fetchWebinars} 
          />
        )}
      </AnimatePresence>

      <ExitIntentPopup 
        onRegister={() => setSelectedWebinar(nextWebinar)} 
        webinarTitle={nextWebinar?.title}
      />
    </div>
  );
};
