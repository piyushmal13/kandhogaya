import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Users, ArrowRight, Zap, ShieldCheck } from "lucide-react";
import { WebinarCard } from "../components/webinars/WebinarCard";
import { RegistrationModal } from "../components/webinars/RegistrationModal";
import { WebinarCalendar } from "../components/webinars/WebinarCalendar";
import { CountdownTimer } from "../components/webinars/CountdownTimer";
import { PageHero } from "../components/site/PageHero";
import { PageMeta } from "../components/site/PageMeta";
import { PageSection } from "../components/site/PageSection";
import { Webinar } from "../types";
import { useDataPulse } from "../hooks/useDataPulse";
import { useAccess } from "../hooks/useAccess";
import { UpgradeModal } from "../components/ui/UpgradeModal";
import { tracker } from "../core/tracker";

export const Webinars = () => {
  const { webinars, loading } = useDataPulse();
  const { isPro } = useAccess();
  const [selectedWebinar, setSelectedWebinar] = useState<Webinar | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleRegisterClick = (webinar: Webinar) => {
    tracker.track("webinar_register", { title: webinar.title, is_paid: webinar.is_paid });
    if (webinar.is_paid && !isPro) {
      setShowUpgrade(true);
      return;
    }
    setSelectedWebinar(webinar);
  };

  const nextWebinar = webinars[0];

  return (
    <div className="min-h-screen pt-20 pb-20 relative overflow-hidden bg-[#020202]">
      <PageMeta
        title="Webinars"
        description="Register for IFXTrades webinars covering market structure, live analysis, algorithmic workflows, and trader education."
        path="/webinars"
        keywords={["trading webinars", "live market analysis", "forex webinar"]}
      />

      <PageHero
        eyebrow="Live Trading Education"
        title={
          <>
            Institutional market <span className="site-title-gradient">intelligence sessions.</span>
          </>
        }
        description="Join IFXTrades analysts for live breakdowns, workflow walkthroughs, and practical execution education across forex, gold, and macro structure."
        metrics={[
          { label: "Formats", value: "Live + Recorded", helper: "Real-time sessions with replay support" },
          { label: "Audience", value: "Global Traders", helper: "Designed for practical decision makers" },
        ]}
        aside={
          nextWebinar ? (
            <div className="space-y-4">
              <div className="text-[11px] uppercase tracking-[0.32em] text-emerald-200/80">Next Session</div>
              <h3 className="text-2xl font-semibold text-white">{nextWebinar.title}</h3>
              <p className="text-sm leading-7 text-slate-300">
                {new Date(nextWebinar.date_time).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}{" "}
                with {nextWebinar.speaker_name || "IFXTrades Analyst Team"}.
              </p>
              <button
                onClick={() => setSelectedWebinar(nextWebinar)}
                className="inline-flex rounded-full bg-emerald-500 px-6 py-3 text-sm font-bold text-black hover:bg-emerald-400 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                Register Now
              </button>
            </div>
          ) : (
            <div className="text-sm leading-7 text-slate-300">
              Loading the current webinar calendar and featured session.
            </div>
          )
        }
      />

      {/* --- Featured Webinar (Next Up) --- */}
      {nextWebinar && (
        <PageSection className="mb-8 pt-0">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#0a0a0a]/80 backdrop-blur-2xl border border-emerald-500/30 rounded-[2.5rem] overflow-hidden relative shadow-[0_0_80px_rgba(16,185,129,0.15)] group"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 animate-gradient-x" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 md:p-14 flex flex-col justify-center relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse flex items-center gap-1">
                    <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                    {" "}UP NEXT
                  </span>
                  <span className="text-emerald-500 text-xs font-mono tracking-widest uppercase">
                    {new Date(nextWebinar.date_time).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </span>
                </div>

                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tighter max-w-2xl">
                  {nextWebinar.title}
                </h2>
                
                <div className="mb-10">
                  <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.3em] mb-6">Session Starts In</div>
                  <CountdownTimer targetDate={nextWebinar.date_time} variant="hero" />
                </div>
                
                <p className="text-gray-400 text-lg mb-10 leading-relaxed font-light">
                  {nextWebinar.description}
                </p>

                <div className="flex items-center gap-4 mb-8">
                  {nextWebinar.speaker_profile_url ? (
                    <img 
                      src={nextWebinar.speaker_profile_url} 
                      alt={nextWebinar.speaker_name} 
                      className="w-14 h-14 rounded-full object-cover border-2 border-white/10" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-lg font-bold text-white border-2 border-white/10">
                      {nextWebinar.speaker_name?.charAt(0) || 'S'}
                    </div>
                  )}
                  <div>
                    <div className="text-white font-bold text-lg">{nextWebinar.speaker_name || 'Speaker'}</div>
                    <div className="text-emerald-500 text-xs font-mono uppercase tracking-widest mt-1">Lead Strategist</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => handleRegisterClick(nextWebinar)}
                    className="px-8 py-4 bg-emerald-500 text-black font-bold rounded-2xl hover:bg-emerald-400 transition-all shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_50px_rgba(16,185,129,0.6)] flex items-center justify-center gap-3 text-lg"
                  >
                    {nextWebinar.is_paid ? `Purchase Access ($${nextWebinar.price})` : "Register Now"}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <div className="px-8 py-4 bg-[#111820]/80 backdrop-blur-xl text-white font-medium rounded-2xl border border-white/10 flex flex-col items-center justify-center gap-1">
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
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/90 via-[#0a0a0a]/50 to-transparent z-10" />
                {nextWebinar.brand_logo_url && (
                  <div className="absolute top-8 right-8 w-20 h-20 bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/10 z-20">
                    <img src={nextWebinar.brand_logo_url} alt="Brand" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                )}
                <img 
                  src={nextWebinar.webinar_image_url || `https://picsum.photos/seed/${nextWebinar.id}/800/800`} 
                  alt={nextWebinar.title} 
                  className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </motion.div>
        </PageSection>
      )}

      {/* --- Upcoming Grid & Calendar --- */}
      <PageSection className="pb-24">
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
      </PageSection>

      <AnimatePresence>
        {selectedWebinar && (
          <RegistrationModal 
            webinar={selectedWebinar} 
            onClose={() => setSelectedWebinar(null)} 
          />
        )}
      </AnimatePresence>

      <UpgradeModal 
        isOpen={showUpgrade} 
        onClose={() => setShowUpgrade(false)} 
        requiredPlan="pro"
        title="Pro Webinar Locked"
        description="Active institutional Masterclasses and premium trading sessions require Pro-tier credentials. Upgrade currently to unlock the research desk's live feeds."
      />
    </div>
  );
};
