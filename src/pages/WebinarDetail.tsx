import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, ArrowRight, Share2, Play, Star, Zap, 
  ShieldCheck, BarChart3, Check, Calendar, Clock, 
  Lock, HeartHandshake, User, Send, ChevronRight
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { PageMeta } from "../components/site/PageMeta";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { supabase } from "../lib/supabase";
import { useWebinar } from "../hooks/useWebinars";
import { VideoPlayer } from "../components/institutional/VideoPlayer";
import { Webinar } from "../types";

// ── FLOATING LIVE COUNTDOWN TIMER ──
const WebinarCountdown = ({ dateTime }: { dateTime: string }) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(dateTime) - +new Date();
      if (difference <= 0) {
        setTimeLeft(null);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [dateTime]);

  if (!timeLeft) {
    return (
      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest animate-pulse block">
          Session is Currently Live
        </span>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
      <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block text-center">Session Countdown</span>
      <div className="grid grid-cols-4 gap-2 text-center">
        {[
          { label: "Days", value: timeLeft.days },
          { label: "Hours", value: timeLeft.hours },
          { label: "Mins", value: timeLeft.minutes },
          { label: "Secs", value: timeLeft.seconds }
        ].map((item) => (
          <div key={item.label} className="p-2 rounded-xl bg-black/40 border border-white/5">
            <div className="text-base sm:text-lg font-black text-emerald-400 font-mono leading-none">{String(item.value).padStart(2, '0')}</div>
            <div className="text-[8px] font-bold text-gray-500 uppercase tracking-wider mt-1">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Extend representation of Webinar for co-branding support
interface ExtendedWebinar extends Webinar {
  co_brand_name?: string;
  co_brand_logo?: string;
  co_brand_banner?: string;
  metadata?: {
    partner_name?: string;
    co_brand_name?: string;
    learning_points?: string[];
    author_bio?: string;
    sponsors?: any[];
    co_brand_active?: boolean;
    sponsors_active?: boolean;
  };
}

// ── COMING SOON PITCH MODE (REMOVE THIS BLOCK TO RESTORE REAL MODEL) ──
const IS_COMING_SOON_PITCH = true;

export const WebinarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: webinarData, isLoading: loading } = useWebinar(id);
  const webinar = webinarData as ExtendedWebinar | undefined;

  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [realRegCount, setRealRegCount] = useState(0);
  const [activeTab, setActiveTab] = useState("overview"); 
  const [questionText, setQuestionText] = useState("");
  const [submittingQuestion, setSubmittingQuestion] = useState(false);

  // Form states for inline registration page
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");

  const { user } = useAuth();
  const { success, error: toastError } = useToast();

  useEffect(() => {
    const checkReg = async () => {
      if (id && user) {
        const { data, error } = await supabase
          .from("webinar_registrations")
          .select("id")
          .eq("webinar_id", id)
          .eq("user_id", user.id)
          .maybeSingle();

        if (data) setIsRegistered(true);
      }
    };
    checkReg();
  }, [id, user]);

  // Synchronize base count from database entry
  useEffect(() => {
    if (webinar) {
      setRealRegCount(webinar.registration_count || 142);
    }
  }, [webinar]);

  // Fetch real count from Supabase webinar registrations ledger
  useEffect(() => {
    const fetchRealRegCount = async () => {
      if (!id) return;
      try {
        const { count, error } = await supabase
          .from("webinar_registrations")
          .select("id", { count: "exact", head: true })
          .eq("webinar_id", id);
        
        if (!error && count !== null) {
          const baseCount = webinar?.registration_count || 0;
          setRealRegCount(Math.max(baseCount, count));
        }
      } catch (e) {
        console.error("Failed fetching real registrant count", e);
      }
    };
    fetchRealRegCount();
  }, [id, webinar]);

  // Fetch sponsors dynamically from database
  useEffect(() => {
    const fetchSponsors = async () => {
      if (id) {
        try {
          const { data } = await supabase
            .from("webinar_sponsors")
            .select("*")
            .eq("webinar_id", id);
          
          if (data && data.length > 0) {
            setSponsors(data.filter(s => s.active !== false));
          } else if (webinar?.metadata?.sponsors) {
            // Fallback to metadata sponsors if table is empty
            setSponsors(webinar.metadata.sponsors.filter(s => s.active !== false));
          }
        } catch (e) {
          console.error("Sponsor fetch failed", e);
        }
      }
    };
    fetchSponsors();
  }, [id, webinar]);

  // Pre-fill form details if user is authenticated
  useEffect(() => {
    if (user) {
      setRegEmail(user.email || "");
      setRegName(user.user_metadata?.full_name || "");
    }
  }, [user]);

  const handlePostQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim() || !user || !id || !webinar) return;
    setSubmittingQuestion(true);
    try {
      const currentQA = Array.isArray(webinar.q_and_a) ? [...webinar.q_and_a] : [];
      const newQA = [...currentQA, { question: questionText, answer: "Awaiting research desk response...", asked_by: user.email }];
      
      const { error } = await supabase
        .from('webinars')
        .update({ q_and_a: newQA })
        .eq('id', id);

      if (error) throw error;
      
      // Invalidate query to trigger live refresh
      queryClient.invalidateQueries({ queryKey: ['webinar', id] });

      success("Question dispatched to research desk.");
      setQuestionText("");
      webinar.q_and_a = newQA;
    } catch (err: any) {
      console.error(err);
      toastError(err.message);
    } finally {
      setSubmittingQuestion(false);
    }
  };

  const handleInlineRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !regEmail.trim() || !regName.trim()) return;
    setRegistering(true);
    try {
      // 1. Write registration ledger entry
      const { error: regErr } = await supabase
        .from("webinar_registrations")
        .insert({
          webinar_id: id,
          user_id: user?.id || null,
          email: regEmail,
          name: regName,
          payment_status: "free"
        });

      if (regErr) throw regErr;

      // 2. Increment registration count
      if (webinar) {
        await supabase
          .from("webinars")
          .update({ registration_count: (webinar.registration_count || 0) + 1 })
          .eq("id", id);
      }

      // 3. Ingest lead inside CRM pipeline
      try {
        const { data: lead } = await supabase.from('leads').select('id, score, crm_metadata').eq('email', regEmail).maybeSingle();
        if (!lead) {
          await supabase.from('leads').insert({
            email: regEmail,
            source: 'webinar_registration',
            score: 20,
            stage: 'INTERESTED',
            last_action_at: new Date().toISOString(),
            crm_metadata: { registered_webinar_id: id, name: regName }
          });
        } else {
          await supabase.from('leads').update({
            score: (lead.score || 0) + 20,
            stage: 'HIGH_INTENT',
            last_action_at: new Date().toISOString(),
            crm_metadata: { ...(lead.crm_metadata || {}), registered_webinar_id: id, name: regName }
          }).eq('id', lead.id);
        }
      } catch (crmErr) {
        console.error("CRM Lead ingestion skipped during inline register:", crmErr);
      }

      // 4. Enqueue confirmation notification
      try {
        if (webinar) {
          await supabase.from('notification_queue').insert({
            recipient: regEmail,
            channel: 'EMAIL',
            priority: 'HIGH',
            payload: {
              message: `You have successfully registered for the masterclass: "${webinar.title}".`,
              user_name: regName,
              action_link: `/webinars/${id}`
            },
            status: 'PENDING'
          });
        }
      } catch (notifErr) {
        console.error("CRM Notification enqueue skipped during inline register:", notifErr);
      }

      // Invalidate queries to trigger instant reactive state changes
      queryClient.invalidateQueries({ queryKey: ['webinar', id] });
      queryClient.invalidateQueries({ queryKey: ['webinars'] });

      setIsRegistered(true);
      setRealRegCount(prev => prev + 1);
      success("Seat successfully claimed for this session!");
    } catch (err: any) {
      console.error(err);
      toastError(err.message);
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return (
    <div className="pt-32 text-center text-white bg-[#020203] min-h-screen flex items-center justify-center">
      <div className="space-y-4">
        <div className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Retrieving Masterclass Node...</p>
      </div>
    </div>
  );

  if (!webinar) return (
    <div className="pt-32 text-center text-white bg-[#020203] min-h-screen flex items-center justify-center px-4">
      {IS_COMING_SOON_PITCH ? (
        <div className="space-y-6 max-w-md bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 sm:p-10 backdrop-blur-md">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Lock className="w-5 h-5 text-blue-400" />
          </div>
          <div className="space-y-2">
            <span className="text-[8px] font-black text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block font-mono">
              Clearance Required
            </span>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white leading-tight">Clearance Code Pending</h2>
            <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">
              The requested masterclass node is restricted during the broker deployment and co-sponsorship phase. Access keys are required for server routing.
            </p>
          </div>
          <Link to="/webinars" className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer">
            Request Invite Access
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-red-500">Session Not Found</h2>
          <Link to="/webinars" className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-gray-300">
            Return to Schedule
          </Link>
        </div>
      )}
    </div>
  );

  const isLive = webinar.status === "live" && webinar.streaming_url;
  const isRecorded = webinar.status === "past";
  const isUpcoming = webinar.status === "upcoming" || (webinar.status === "live" && !webinar.streaming_url);

  const partnerName = webinar.metadata?.partner_name || webinar.metadata?.co_brand_name || (webinar.brand_logo_url ? "Institutional Partner" : "");
  const partnerLogo = webinar.brand_logo_url;

  return (
    <div className="pt-20 bg-[#09090b] min-h-screen relative overflow-hidden text-white">
      {IS_COMING_SOON_PITCH && (
        <div className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border-b border-blue-500/20 py-3 text-center text-[10px] font-bold uppercase tracking-[0.25em] text-blue-400 relative z-20">
          ⚡ Promotion Desk: Masterclass Commencing Soon — Broker &amp; Sponsorship Allocation Active
        </div>
      )}
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[50%] bg-[radial-gradient(ellipse_at_top,rgba(0,113,227,0.06)_0%,transparent_60%)] blur-3xl opacity-80" />
        <div className="absolute bottom-0 right-0 w-[60%] h-[40%] bg-[radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.03)_0%,transparent_60%)] blur-3xl" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02]" />
      </div>

      <PageMeta
        title={webinar.title}
        description={webinar.description || "IFXTrades webinar details and registration."}
        path={`/webinars/${id}`}
        type="article"
      />
      
      {/* Dynamic Navigation & Title Bar */}
      <div className="bg-[#121214]/60 border-b border-zinc-800 py-6 relative z-10 backdrop-blur-md shadow-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link to="/webinars" className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all border border-zinc-800 shrink-0">
              <ArrowRight className="w-4 h-4 rotate-180" />
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                {isRecorded ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 text-[8px] font-black uppercase tracking-widest">
                    ARCHIVED RECORDING
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#0071e3] text-[8px] font-black uppercase tracking-widest">
                    UPCOMING Masterclass
                  </span>
                )}
                {partnerName && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-500 text-[8px] font-black uppercase tracking-widest">
                    <HeartHandshake className="w-2.5 h-2.5" />
                    COLLABORATION
                  </span>
                )}
              </div>
              <h1 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase leading-snug">{webinar.title}</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4 justify-between sm:justify-end w-full sm:w-auto">
            <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-mono font-bold uppercase tracking-widest">
              <Users className="w-4 h-4 text-[#0071e3]" />
              <span>{realRegCount} Registered</span>
            </div>
            
            <div className="flex items-center gap-2">
              {isUpcoming && !isRegistered && (
                <button 
                  onClick={() => document.getElementById("registration-card")?.scrollIntoView({ behavior: "smooth" })}
                  className="lg:hidden px-4 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 shrink-0"
                >
                  Secure Seat
                </button>
              )}
              
              <button 
                onClick={() => {
                  const url = globalThis.location.href.split('?')[0];
                  navigator.clipboard.writeText(url);
                  success("Attribution link copied to clipboard!");
                }}
                className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all border border-zinc-800"
                title="Copy Attributable Link"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 relative z-10">
        
        {/* Dynamic co-branding partner block (High Visual Priority) */}
        {partnerName && webinar.metadata?.co_brand_active !== false && (
          <div className="mb-8 p-8 md:p-10 rounded-3xl bg-gradient-to-r from-amber-500/[0.02] to-transparent border border-amber-500/15 relative overflow-hidden group shadow-2xl">
             <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
                <HeartHandshake className="w-40 h-40 text-amber-500" />
             </div>
             <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-3 text-center md:text-left">
                   <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest block font-mono">Exclusive Brand Partnership</span>
                   <h3 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase leading-none">
                      IFX Trades <span className="text-amber-500">&amp;</span> {partnerName}
                   </h3>
                   <p className="text-[11px] text-zinc-500 max-w-xl leading-relaxed">
                      A co-branded institutional masterclass engineered for professional clients and brokers. Integrated analysis pipelines and premium execution algorithms.
                   </p>
                </div>
                {partnerLogo && (
                   <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-2xl shrink-0 shadow-lg">
                      <img src={partnerLogo} alt={partnerName} className="h-8 w-auto object-contain opacity-90" />
                   </div>
                )}
             </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
          
          {/* LEFT: Main Content & Media (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Dynamic Media Section */}
            <div className="relative aspect-video bg-zinc-950 rounded-3xl overflow-hidden border border-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.6)] group ring-1 ring-white/5">
              {IS_COMING_SOON_PITCH && (
                <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 z-20">
                  <Clock className="w-12 h-12 text-[#0071e3] mb-4 animate-pulse" />
                  <h3 className="text-base font-black text-white uppercase tracking-tight">Institutional Stream Commencing Soon</h3>
                  <p className="text-[11px] text-zinc-500 max-w-sm mt-2 leading-relaxed">
                    The secure data terminal for this session is scheduled for initialization. Broker promotions and sponsorship allocations are currently active.
                  </p>
                </div>
              )}
              {(() => {
                if (isLive) {
                  const url = webinar.streaming_url || "";
                  const isEmbed = url.includes("youtube.com") || url.includes("youtu.be") || url.includes("embed") || url.includes("vimeo.com");
                  
                  if (isEmbed) {
                    return (
                      <div className="aspect-video bg-black w-full h-full flex items-center justify-center">
                        <iframe 
                          src={url} 
                          title={webinar.title}
                          className="w-full h-full border-none"
                          allowFullScreen
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                      </div>
                    );
                  }

                  return (
                    <VideoPlayer 
                      src={url}
                      title={webinar.title}
                      isLive={true}
                    />
                  );
                }
                if (isRecorded) {
                  return (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-zinc-950 overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,113,227,0.03),transparent_75%)] pointer-events-none" />
                      <div className="relative z-10 space-y-6">
                        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-zinc-800 mx-auto shadow-xl">
                          <BarChart3 className="w-6 h-6 text-[#0071e3]" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase leading-none">
                          Masterclass Archive <br/>
                          <span className="text-[#0071e3]">Clearance Granted</span>
                        </h2>
                        <p className="text-[11px] text-zinc-500 max-w-sm mx-auto leading-relaxed">
                          Click below to stream the recorded session directly from the secure archival desks.
                        </p>
                        {webinar.recording_url ? (
                          <button 
                            onClick={() => globalThis.open(webinar.recording_url, '_blank')}
                            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-black font-black text-[10px] uppercase tracking-wider rounded-xl hover:bg-zinc-200 transition-all shadow-xl"
                          >
                            Analyze Recording
                            <Play className="w-3.5 h-3.5 fill-current" />
                          </button>
                        ) : (
                          <div className="text-[10px] text-amber-500 font-mono uppercase tracking-wider">Archived Signal Transmitted Successfully.</div>
                        )}
                      </div>
                    </div>
                  );
                }
                
                // Upcoming Cover Display
                return (
                  <img 
                    src={webinar.webinar_image_url || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"} 
                    alt={webinar.title} 
                    className="w-full h-full object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-102" 
                  />
                );
              })()}
            </div>

            {/* Dynamic Sponsor Banner space */}
            {sponsors.length > 0 && webinar.metadata?.sponsors_active !== false && (
              <div className="p-6 rounded-3xl bg-neutral-900/40 border border-zinc-800 space-y-5">
                <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block text-center font-mono">Masterclass Headline Sponsors</span>
                <div className="flex flex-wrap items-center justify-center gap-6">
                   {sponsors.map((sponsor) => (
                      <a 
                        key={sponsor.id}
                        href={sponsor.website_url || "#"} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="px-4 py-3 bg-zinc-950/80 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-all flex items-center gap-2.5 group"
                      >
                         {sponsor.logo_url ? (
                            <img src={sponsor.logo_url} alt={sponsor.name} className="h-5 w-auto object-contain opacity-60 group-hover:opacity-100 transition-opacity" />
                         ) : (
                            <span className="text-[9px] font-black text-white uppercase tracking-wider">{sponsor.name}</span>
                         )}
                         <span className="text-[7.5px] font-black uppercase tracking-widest text-[#0071e3] opacity-60 group-hover:opacity-100">{sponsor.tier}</span>
                      </a>
                   ))}
                </div>
              </div>
            )}

            {/* Dynamic Tabs (Overview, Speaker, Q&A) */}
            <div className="space-y-6">
              <ul className="flex border-b border-zinc-800 overflow-x-auto hide-scrollbar gap-2" role="tablist">
                {["Overview", "Speaker", "Q&A"].map((tab) => {
                  const isActive = activeTab === tab.toLowerCase();
                  return (
                    <li key={tab}>
                      <button
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setActiveTab(tab.toLowerCase())}
                        className={`px-5 py-3 text-[10px] font-black uppercase tracking-widest transition-all relative whitespace-nowrap ${
                          isActive ? "text-[#0071e3]" : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        {tab}
                        {isActive && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0071e3] shadow-[0_0_8px_rgba(0,113,227,0.5)]" />}
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="prose prose-invert max-w-none">
                {activeTab === "overview" && (
                  <div className="text-zinc-400 leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
                    <p className="text-sm md:text-base text-zinc-300 font-medium leading-relaxed">{webinar.description}</p>
                    {webinar.about_content && (
                      <p className="text-[11.5px] text-zinc-400 leading-relaxed whitespace-pre-line bg-zinc-900/20 border border-zinc-800 p-5 rounded-2xl font-medium">{webinar.about_content}</p>
                    )}
                    
                    {/* Bento Box Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                      {/* Box 1: Outcomes */}
                      <div className="p-6 rounded-3xl bg-neutral-900/40 border border-zinc-800 backdrop-blur-md flex flex-col justify-between hover:border-zinc-700 transition-all duration-300">
                        <div>
                          <h4 className="text-white font-black text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2 font-mono">
                            <Star className="w-4 h-4 text-emerald-400" />
                            Core Systematic Syllabus
                          </h4>
                          <ul className="space-y-3">
                            {webinar.metadata?.learning_points && webinar.metadata.learning_points.length > 0 ? (
                              webinar.metadata.learning_points.map((pt: string, i: number) => (
                                <li key={i} className="flex items-start gap-2.5 text-[11px] text-zinc-400">
                                  <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                                  <span className="leading-relaxed font-medium">{pt}</span>
                                </li>
                              ))
                            ) : (
                              <li className="flex items-start gap-2.5 text-[11px] text-zinc-500 italic">
                                 <span>Learning points not yet specified for this session.</span>
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>

                      {/* Box 2: Sovereign Compliance */}
                      <div className="p-6 rounded-3xl bg-neutral-900/40 border border-zinc-800 backdrop-blur-md flex flex-col justify-between hover:border-zinc-700 transition-all duration-300">
                        <div>
                          <h4 className="text-white font-black text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2 font-mono">
                            <ShieldCheck className="w-4 h-4 text-[#0071e3]" />
                            Sovereign Risk Protocol
                          </h4>
                          <p className="text-[11px] leading-relaxed text-zinc-400 font-medium">
                            Every algorithmic execution flow, indicator structure, and backtesting scenario conforms strictly to global B2B tier-1 risk frameworks. Zero-custody client protocols are enforced across all signals.
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-zinc-800/40 text-[8.5px] font-mono text-zinc-500 uppercase tracking-wider">
                          Audited By: IFX Risk Desk
                        </div>
                      </div>

                      {/* Box 3: Attendee Profit & Commercial ROI */}
                      <div className="p-6 rounded-3xl bg-neutral-900/40 border border-zinc-800 backdrop-blur-md flex flex-col justify-between hover:border-zinc-700 transition-all duration-300">
                        <div>
                          <h4 className="text-white font-black text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2 font-mono">
                            <Zap className="w-4 h-4 text-amber-500" />
                            Attendee Commercial ROI
                          </h4>
                          <ul className="space-y-3 text-[11px] text-zinc-400 font-medium">
                            <li className="flex items-start gap-2">
                              <span className="text-[#0071e3] font-black font-mono mt-0.5">•</span>
                              <span><strong>Yield Edge</strong>: 12-15% reduction in slippage overhead utilizing matching engine prioritization models.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-[#0071e3] font-black font-mono mt-0.5">•</span>
                              <span><strong>MT5 Binaries</strong>: Direct handover of compiled EX5 files for live client server testing.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-[#0071e3] font-black font-mono mt-0.5">•</span>
                              <span><strong>Latency Edge</strong>: Optimization scripts designed for latency benchmarks &lt;1.2ms.</span>
                            </li>
                          </ul>
                        </div>
                        <div className="mt-4 pt-3 border-t border-zinc-800/40 text-[8.5px] font-mono text-amber-500 uppercase tracking-wider">
                          Est. Value: $1,499.00 / Seat
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === "speaker" && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-8">
                    <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-center bg-neutral-900/40 border border-zinc-800 rounded-3xl p-8">
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden shrink-0 border border-zinc-800 shadow-xl relative group">
                        <img 
                          src={webinar.speaker_profile_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2000?auto=format&fit=crop"} 
                          alt={webinar.speaker_name}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                      </div>
                      <div className="text-center md:text-left space-y-3">
                        <div>
                          <h3 className="text-lg md:text-xl font-black text-white uppercase">{webinar.speaker_name}</h3>
                          {webinar.speaker_role && (
                             <p className="text-[#0071e3] font-black uppercase tracking-widest text-[8.5px] mt-1 font-mono">{webinar.speaker_role}</p>
                          )}
                        </div>
                        {webinar.metadata?.author_bio && (
                          <p className="text-[11.5px] text-zinc-400 leading-relaxed max-w-xl">
                            {webinar.metadata.author_bio}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Additional Speaker Showcase Images */}
                    {Array.isArray(webinar.speaker_images) && webinar.speaker_images.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="text-[8.5px] font-black text-zinc-500 font-mono uppercase tracking-widest">Speaker Showcase &amp; Telemetry</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {webinar.speaker_images.map((imgUrl, idx) => (
                            <div key={idx} className="aspect-square rounded-2xl overflow-hidden border border-zinc-800 bg-neutral-900/20 group hover:border-zinc-700 transition-all duration-300">
                              <img 
                                src={imgUrl} 
                                alt={`${webinar.speaker_name} showcase ${idx + 1}`}
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "qa" && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-8">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                      <h3 className="text-[9px] font-black text-white uppercase tracking-widest font-mono">Intelligence Dispatch Feed</h3>
                      <span className="text-[7.5px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                        Secure Desks Live
                      </span>
                    </div>

                    {user ? (
                      <form onSubmit={handlePostQuestion} className="p-5 rounded-2xl bg-neutral-900/40 border border-zinc-800 space-y-4">
                        <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block font-mono">Submit strategy transmission to quantitative desk</span>
                        <div className="flex gap-4">
                          <input 
                            type="text" 
                            placeholder="State your systematic trading query..." 
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                            disabled={submittingQuestion}
                            className="flex-1 bg-black border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-zinc-700 transition-all placeholder:text-zinc-600"
                          />
                          <button 
                            type="submit" 
                            disabled={submittingQuestion || !questionText.trim()}
                            className="px-6 py-3 bg-white hover:bg-zinc-200 text-black text-[10px] font-black uppercase tracking-widest rounded-xl disabled:opacity-50 transition-all flex items-center gap-2 shrink-0"
                          >
                            {submittingQuestion ? "Transmitting..." : "Submit Question"}
                            <Send className="w-3 h-3" />
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="p-6 rounded-2xl bg-neutral-900/20 border border-zinc-800 text-center">
                        <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest font-mono">Establish client session to transmit strategy queries.</p>
                      </div>
                    )}

                    <div className="space-y-4">
                      {Array.isArray(webinar.q_and_a) && webinar.q_and_a.length > 0 ? webinar.q_and_a.map((qa: any, idx: number) => (
                        <div key={`${qa.question}-${idx}`} className="p-5 rounded-2xl bg-neutral-900/40 border border-zinc-800 hover:border-zinc-700 transition-all duration-300">
                          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                            <h4 className="text-white font-black uppercase text-[11px] flex items-start gap-2.5">
                              <span className="text-[#0071e3] font-mono">Q.</span>
                              {qa.question}
                            </h4>
                            {qa.asked_by && (
                              <span className="text-[7.5px] font-mono text-zinc-600 uppercase">Signature: {qa.asked_by.slice(0, 10)}</span>
                            )}
                          </div>
                          <p className="text-zinc-400 leading-relaxed text-[11px] flex items-start gap-2.5 ml-3">
                            <span className="text-emerald-400 font-bold font-mono">A.</span>
                            {qa.answer}
                          </p>
                        </div>
                      )) : (
                        <div className="py-10 text-center border border-dashed border-zinc-800 rounded-2xl bg-neutral-900/20">
                          <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest font-mono">No strategy queries logged for this cycle.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
 
          {/* RIGHT: Embedded Registration Page Card (4 cols) */}
          <div id="registration-card" className="lg:col-span-4">
            <div className="bg-[#121214]/80 backdrop-blur-md border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden space-y-6 ring-1 ring-white/5">
              <div className="absolute top-0 right-0 p-6 opacity-[0.01] pointer-events-none transform translate-x-4 -translate-y-4">
                 <ShieldCheck className="w-40 h-40 text-emerald-500" />
              </div>
              
              {/* Dynamic Countdown Timer */}
              {(isUpcoming || isLive) && (
                <WebinarCountdown dateTime={webinar.date_time} />
              )}

              {isUpcoming || isLive ? (
                <>
                  {!isRegistered ? (
                    // EMBEDDED REGISTRATION INTERFACE
                    <div className="space-y-5">
                      <div className="space-y-2">
                         <span className="text-[7.5px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider inline-block font-mono">
                            Seat Allocation Active
                         </span>
                         <h3 className="text-lg font-black text-white uppercase tracking-tight">Claim Briefing Seat</h3>
                         <p className="text-[11px] text-zinc-500 leading-relaxed">
                            Complete details to generate execution keys for this masterclass cycle.
                         </p>
                      </div>

                      <form onSubmit={handleInlineRegister} className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[8.5px] font-black text-zinc-500 uppercase tracking-widest block font-mono">Full Name</label>
                          <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
                            <input 
                              type="text" 
                              required
                              placeholder="Sarah Jenkins"
                              value={regName}
                              onChange={(e) => setRegName(e.target.value)}
                              className="w-full bg-black border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white outline-none focus:border-zinc-700 transition-all placeholder:text-zinc-700"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[8.5px] font-black text-zinc-500 uppercase tracking-widest block font-mono">Corporate Email Address</label>
                          <div className="relative">
                            <Send className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
                            <input 
                              type="email" 
                              required
                              placeholder="s.jenkins@brokerage.com"
                              value={regEmail}
                              onChange={(e) => setRegEmail(e.target.value)}
                              className="w-full bg-black border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white outline-none focus:border-zinc-700 transition-all placeholder:text-zinc-700"
                            />
                          </div>
                        </div>

                        <button 
                          type="submit"
                          disabled={registering}
                          className="w-full py-3.5 bg-[#0071e3] hover:bg-[#0077ed] text-white text-[10px] font-black uppercase tracking-[0.15em] rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-1 group"
                        >
                          {registering ? "Processing Seat..." : "Establish Clearance Keys"}
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </form>
                    </div>
                  ) : (
                    // TICKETING AND CLEARANCE CONFIRMED STATE
                    <div className="space-y-5 text-center py-4">
                      {IS_COMING_SOON_PITCH ? (
                        <div className="space-y-4">
                          <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-2 animate-pulse">
                             <Clock className="w-5 h-5 text-blue-400" />
                          </div>
                          <div className="space-y-1.5">
                             <span className="text-[8px] font-black text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block font-mono">
                                Seat Allocations Queued
                             </span>
                             <h3 className="text-base font-black text-white uppercase tracking-tight">Briefing Commencing Soon</h3>
                             <p className="text-[11px] text-zinc-500 leading-relaxed">
                                This session is currently in broker deployment phase. Your seat request is verified and queued for data-sync.
                             </p>
                          </div>
                          <div className="p-3 bg-blue-500/5 border border-blue-500/15 rounded-xl text-left text-[9px] text-blue-400 font-mono">
                            Sponsor allocation: ACTIVE. Clearance keys will synchronize shortly.
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-2">
                             <Check className="w-6 h-6 text-emerald-400" />
                          </div>
                          <div className="space-y-2">
                             <span className="text-[8px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block font-mono">
                                Seat Verified
                             </span>
                             <h3 className="text-base font-black text-white uppercase tracking-tight">Access Confirmed</h3>
                             <p className="text-[11px] text-zinc-500 leading-relaxed">
                                Your seat is successfully reserved. Use the live stream dispatch bridge below to connect.
                             </p>
                          </div>

                          <div className="p-4 bg-black/40 border border-zinc-800 rounded-2xl text-left space-y-2.5 text-[10px]">
                             <div className="text-zinc-500 font-bold uppercase tracking-wider text-[8px] font-mono">Client Credentials:</div>
                             <div className="text-zinc-400 flex justify-between">
                               <span className="text-zinc-600">Client:</span>
                               <span className="font-mono">{regName || user?.email}</span>
                             </div>
                             <div className="text-zinc-400 flex justify-between">
                               <span className="text-zinc-600">Schedule:</span>
                               <span>{new Date(webinar.date_time).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                             </div>
                             <div className="text-zinc-400 flex justify-between">
                               <span className="text-zinc-600">Lead Strategist:</span>
                               <span>{webinar.speaker_name}</span>
                             </div>
                          </div>

                          {isLive && webinar.streaming_url && (
                            <a 
                              href={webinar.streaming_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-3.5 bg-[#0071e3] hover:bg-[#0077ed] text-white text-[10px] font-black uppercase tracking-[0.15em] rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-1.5 group animate-pulse"
                            >
                              Join Live Stream Now
                              <Play className="w-3.5 h-3.5 fill-current" />
                            </a>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </>
              ) : (
                // PAST/RECORDED MASTERCLASS DATA
                <div className="space-y-5">
                  <div className="space-y-2">
                     <span className="text-[8px] font-black text-zinc-500 bg-zinc-900 border border-zinc-850 px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block font-mono">
                        Session Concluded
                     </span>
                     <h3 className="text-lg font-black text-white uppercase tracking-tight">Archived Session</h3>
                     <p className="text-[11px] text-zinc-500 leading-relaxed">
                        This masterclass cycle has fully ended. Archive streaming link is active on the left stage.
                     </p>
                  </div>
                  
                  {webinar.recording_url && (
                    <button 
                      onClick={() => globalThis.open(webinar.recording_url, '_blank')}
                      className="w-full py-3.5 bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-black uppercase tracking-[0.15em] rounded-xl transition-all flex items-center justify-center gap-1.5 group"
                    >
                      Analyze Recording
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>
                  )}
                </div>
              )}

              {/* General Technical Specifications block */}
              <div className="pt-5 border-t border-zinc-800/80 space-y-4">
                 <h4 className="text-[8.5px] font-black text-white uppercase tracking-widest font-mono">Specifications</h4>
                 <div className="space-y-2.5 text-[9px] text-zinc-500 uppercase tracking-wider font-bold">
                    <div className="flex justify-between">
                       <span className="text-zinc-600 font-mono">Format</span>
                       <span className="text-emerald-400 font-mono">Online Stream</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-zinc-600 font-mono">Capacity</span>
                       <span>{webinar.max_attendees} Slots</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-zinc-600 font-mono">Q&amp;A Panel</span>
                       <span>Interactive</span>
                     </div>
                  </div>
               </div>
 
              </div>
            </div>
  
          </div>
        </div>
      </div>
    );
  };
  
  export default WebinarDetail;
