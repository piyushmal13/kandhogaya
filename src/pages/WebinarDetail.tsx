import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, ArrowRight, Share2, Play, Star, Zap, 
  ShieldCheck, BarChart3, Check, Calendar, Clock, 
  Lock, HeartHandshake, User, Send, ChevronRight
} from "lucide-react";
import { PageMeta } from "../components/site/PageMeta";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { supabase } from "../lib/supabase";
import { useWebinar } from "../hooks/useWebinars";
import { VideoPlayer } from "../components/institutional/VideoPlayer";

// Extend representation of Webinar for co-branding support
interface ExtendedWebinar {
  id: string;
  title: string;
  description: string;
  date_time: string;
  status: string;
  speaker_name: string;
  speaker_role?: string;
  speaker_profile_url?: string;
  webinar_image_url?: string;
  recording_url?: string;
  streaming_url?: string;
  registration_count: number;
  max_attendees: number;
  q_and_a?: any[];
  co_brand_name?: string;
  co_brand_logo?: string;
  co_brand_banner?: string;
  about_content?: string;
  metadata?: {
    partner_name?: string;
    learning_points?: string[];
    author_bio?: string;
  };
}

export const WebinarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: webinarData, isLoading: loading } = useWebinar(id);
  const webinar = webinarData as ExtendedWebinar | undefined;

  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [sponsors, setSponsors] = useState<any[]>([]);
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

  // Fetch sponsors dynamically from database
  useEffect(() => {
    const fetchSponsors = async () => {
      if (id) {
        const { data } = await supabase
          .from("webinar_sponsors")
          .select("*")
          .eq("webinar_id", id);
        if (data) setSponsors(data);
      }
    };
    fetchSponsors();
  }, [id]);

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

      setIsRegistered(true);
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
    <div className="pt-32 text-center text-white bg-[#020203] min-h-screen flex items-center justify-center">
      <div className="space-y-6">
        <h2 className="text-3xl font-black uppercase tracking-tighter text-red-500">Session Not Found</h2>
        <Link to="/webinars" className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-gray-300">
          Return to Schedule
        </Link>
      </div>
    </div>
  );

  const isLive = webinar.status === "live" && webinar.streaming_url;
  const isRecorded = webinar.status === "past";
  const isUpcoming = webinar.status === "upcoming" || (webinar.status === "live" && !webinar.streaming_url);

  return (
    <div className="pt-20 bg-[#000000] min-h-screen relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[60%] bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)] blur-3xl opacity-60" />
        <div className="absolute bottom-0 right-0 w-[80%] h-[50%] bg-[radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.03)_0%,transparent_60%)] blur-3xl" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
      </div>

      <PageMeta
        title={webinar.title}
        description={webinar.description || "IFXTrades webinar details and registration."}
        path={`/webinars/${id}`}
        type="article"
      />
      
      {/* Dynamic Navigation & Title Bar */}
      <div className="bg-white/[0.02] border-b border-white/10 py-6 relative z-10 backdrop-blur-3xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link to="/webinars" className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 transition-colors border border-white/5 shrink-0">
              <ArrowRight className="w-5 h-5 rotate-180" />
            </Link>
            <div>
              <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                {isRecorded ? (
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-[9px] font-black uppercase tracking-widest">
                    ARCHIVED RECORDING
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[9px] font-black uppercase tracking-widest">
                    UPCOMING BRIEFING
                  </span>
                )}
                {webinar.co_brand_name && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-[8px] font-black uppercase tracking-widest">
                    <HeartHandshake className="w-2.5 h-2.5" />
                    B2B COLLABORATION
                  </span>
                )}
              </div>
              <h1 className="text-xl md:text-3xl font-black text-white tracking-tight uppercase italic">{webinar.title}</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4 justify-between sm:justify-end w-full sm:w-auto">
            <div className="flex items-center gap-2 text-gray-400 text-xs font-mono font-bold uppercase tracking-widest">
              <Users className="w-4 h-4 text-emerald-500" />
              <span>{webinar.registration_count}+ Registered</span>
            </div>
            
            <div className="flex items-center gap-2">
              {isUpcoming && !isRegistered && (
                <button 
                  onClick={() => document.getElementById("registration-card")?.scrollIntoView({ behavior: "smooth" })}
                  className="lg:hidden px-4 py-2 bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-400 transition-all active:scale-95 shrink-0"
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
                className="p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 transition-colors border border-emerald-500/20"
                title="Copy Attributable Link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 relative z-10">
        
        {/* Dynamic co-branding partner block (High Visual Priority) */}
        {webinar.co_brand_name && (
          <div className="mb-8 p-6 md:p-12 rounded-[2.5rem] bg-gradient-to-r from-amber-500/[0.03] to-transparent border border-amber-500/20 relative overflow-hidden group shadow-2xl">
             <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <HeartHandshake className="w-48 h-48 text-amber-500" />
             </div>
             <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4 text-center md:text-left">
                   <span className="text-[10px] font-black text-amber-400 uppercase tracking-[0.3em] block">Exclusive Brand Collaboration</span>
                   <h3 className="text-2xl md:text-4xl font-black text-white tracking-tight uppercase leading-none">
                      IFX Trades <span className="text-amber-500">&amp;</span> {webinar.co_brand_name}
                   </h3>
                   <p className="text-xs text-white/40 max-w-xl">
                      A co-branded institutional masterclass engineered for professional clients and brokers. Integrated analysis pipelines and premium execution algorithms.
                   </p>
                </div>
                {webinar.co_brand_logo && (
                   <div className="p-4 bg-black/40 border border-white/10 rounded-2xl shrink-0 shadow-lg">
                      <img src={webinar.co_brand_logo} alt={webinar.co_brand_name} className="h-10 w-auto object-contain" />
                   </div>
                )}
             </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          
          {/* LEFT: Main Content & Media (8 cols) */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Dynamic Media Section */}
            <div className="relative aspect-video bg-[#010203] rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] group ring-1 ring-white/5">
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
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-[#07070a] overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.04),transparent_75%)] pointer-events-none" />
                      <div className="relative z-10 space-y-6">
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20 mx-auto shadow-xl">
                          <BarChart3 className="w-10 h-10 text-emerald-500" />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase leading-none">
                          Masterclass Archive <br/>
                          <span className="text-emerald-500">Clearance Granted</span>
                        </h2>
                        <p className="text-xs text-white/30 max-w-md mx-auto">
                          Click below to stream the recorded session directly from the secure archival desks.
                        </p>
                        {webinar.recording_url ? (
                          <button 
                            onClick={() => globalThis.open(webinar.recording_url, '_blank')}
                            className="inline-flex items-center gap-2 px-10 py-4 bg-emerald-500 text-black font-black text-xs uppercase tracking-wider rounded-xl hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/25"
                          >
                            Analyze Recording
                            <Play className="w-4 h-4 fill-current" />
                          </button>
                        ) : (
                          <div className="text-xs text-amber-400/75 uppercase tracking-widest font-mono">Archived Signal Transmitted Successfully.</div>
                        )}
                      </div>
                    </div>
                  );
                }
                
                // Upcoming Cover Display
                return (
                  <>
                    <img 
                      src={webinar.webinar_image_url || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"} 
                      alt="Session Cover" 
                      className="w-full h-full object-cover opacity-35" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020203] via-transparent to-transparent" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                       <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-[9px] font-black uppercase tracking-widest mb-4">
                          <Clock className="w-3.5 h-3.5 text-emerald-400" />
                          Masterclass Briefing Protocol
                       </span>
                       <h2 className="text-2xl md:text-4xl font-black text-white uppercase italic tracking-tighter leading-none mb-6">
                          Transmission Schedule Confirmed
                       </h2>
                       <p className="text-xs text-white/35 max-w-sm">
                          Use the registration module on the right to secure your session transmission credentials.
                       </p>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Dynamic Sponsor Banner space */}
            {sponsors.length > 0 && (
              <div className="p-8 rounded-[2.5rem] bg-white/[0.01] border border-white/5 space-y-6">
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] block text-center">Masterclass Headline Sponsors</span>
                <div className="flex flex-wrap items-center justify-center gap-8">
                   {sponsors.map((sponsor) => (
                      <a 
                        key={sponsor.id}
                        href={sponsor.website_url || "#"} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="px-6 py-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-emerald-500/25 transition-all flex items-center gap-3 group"
                      >
                         {sponsor.logo_url ? (
                            <img src={sponsor.logo_url} alt={sponsor.name} className="h-6 w-auto object-contain opacity-50 group-hover:opacity-100 transition-opacity" />
                         ) : (
                            <span className="text-[10px] font-black text-white uppercase tracking-wider">{sponsor.name}</span>
                         )}
                         <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400/50 group-hover:text-emerald-400">{sponsor.tier}</span>
                      </a>
                   ))}
                </div>
              </div>
            )}

            {/* Dynamic Tabs (Overview, Speaker, Q&A) */}
            <div className="space-y-8">
              <ul className="flex border-b border-white/5 overflow-x-auto hide-scrollbar gap-2" role="tablist">
                {["Overview", "Speaker", "Q&A"].map((tab) => {
                  const isActive = activeTab === tab.toLowerCase();
                  return (
                    <li key={tab}>
                      <button
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setActiveTab(tab.toLowerCase())}
                        className={`px-6 py-4 text-xs font-black uppercase tracking-widest transition-all relative whitespace-nowrap ${
                          isActive ? "text-emerald-500" : "text-gray-500 hover:text-gray-300"
                        }`}
                      >
                        {tab}
                        {isActive && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />}
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="prose prose-invert max-w-none">
                {activeTab === "overview" && (
                  <div className="text-white/60 leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-6">
                    <p className="text-base md:text-lg text-white/80 font-medium leading-relaxed">{webinar.description}</p>
                    {webinar.about_content && (
                      <p className="text-xs md:text-sm text-white/45 leading-relaxed whitespace-pre-line bg-white/[0.01] border border-white/5 p-6 rounded-2xl font-medium">{webinar.about_content}</p>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                        <h4 className="text-white font-black text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Star className="w-4 h-4 text-emerald-500" />
                          Key Outcomes &amp; Topics
                        </h4>
                        <ul className="space-y-3">
                          {webinar.metadata?.learning_points && webinar.metadata.learning_points.length > 0 ? (
                            webinar.metadata.learning_points.map((pt: string, i: number) => (
                              <li key={i} className="flex items-start gap-3 text-[11px] text-white/40">
                                <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                                <span className="leading-relaxed">{pt}</span>
                              </li>
                            ))
                          ) : (
                            <li className="flex items-start gap-3 text-[11px] text-white/40">
                               <span className="leading-relaxed italic">Learning points not yet specified for this session.</span>
                            </li>
                          )}
                        </ul>
                      </div>
                      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                        <h4 className="text-white font-black text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-500" />
                          Risk Protocol Compliance
                        </h4>
                        <p className="text-[11px] leading-relaxed text-white/35">
                           Every strategy, algorithmic asset, or backtesting logic shown conforms rigorously with global macro risk criteria to shield corporate equity structures.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === "speaker" && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center bg-white/[0.01] border border-white/5 rounded-3xl p-8 md:p-12">
                      <div className="w-28 h-28 md:w-44 md:h-44 rounded-2xl overflow-hidden shrink-0 border border-emerald-500/20 shadow-2xl relative group">
                        <img 
                          src={webinar.speaker_profile_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2000?auto=format&fit=crop"} 
                          alt={webinar.speaker_name}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                      </div>
                      <div className="text-center md:text-left space-y-4">
                        <div>
                          <h3 className="text-xl md:text-3xl font-black text-white uppercase">{webinar.speaker_name}</h3>
                          {webinar.speaker_role && (
                             <p className="text-emerald-500 font-black uppercase tracking-[0.25em] text-[9px] mt-1">{webinar.speaker_role}</p>
                          )}
                        </div>
                        {webinar.metadata?.author_bio && (
                          <p className="text-xs md:text-sm text-white/40 leading-relaxed max-w-xl">
                            {webinar.metadata.author_bio}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "qa" && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-8">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Intelligence Retrieval Feed</h3>
                      <span className="text-[8px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Dynamic Cache Sync
                      </span>
                    </div>

                    {user ? (
                      <form onSubmit={handlePostQuestion} className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 space-y-4">
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block">Dispatch transmission query to quantitative desks</span>
                        <div className="flex gap-4">
                          <input 
                            type="text" 
                            placeholder="Submit your strategy query..." 
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                            disabled={submittingQuestion}
                            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white outline-none focus:border-emerald-500/30 transition-all placeholder-white/20"
                          />
                          <button 
                            type="submit" 
                            disabled={submittingQuestion || !questionText.trim()}
                            className="px-6 py-3.5 bg-emerald-500 text-black text-xs font-black uppercase tracking-wider rounded-xl hover:bg-emerald-400 disabled:opacity-50 transition-all flex items-center gap-2"
                          >
                            {submittingQuestion ? "Transmitting..." : "Submit Query"}
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 text-center">
                        <p className="text-xs text-white/30 uppercase font-black tracking-widest">Login to establish transmission query clearance.</p>
                      </div>
                    )}

                    <div className="space-y-4">
                      {Array.isArray(webinar.q_and_a) && webinar.q_and_a.length > 0 ? webinar.q_and_a.map((qa: any, idx: number) => (
                        <div key={`${qa.question}-${idx}`} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 transition-all">
                          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                            <h4 className="text-white font-black uppercase text-xs flex items-start gap-3">
                              <span className="text-emerald-500">Q.</span>
                              {qa.question}
                            </h4>
                            {qa.asked_by && (
                              <span className="text-[8px] font-mono text-white/20 uppercase">Signature: {qa.asked_by.slice(0, 10)}</span>
                            )}
                          </div>
                          <p className="text-white/40 leading-relaxed text-xs flex items-start gap-3 ml-4">
                            <span className="text-cyan-400 font-bold">A.</span>
                            {qa.answer}
                          </p>
                        </div>
                      )) : (
                        <div className="py-12 text-center border border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
                          <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">No intelligence nodes resolved for this session.</p>
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
            <div className="bg-[#050505]/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-[0_0_40px_rgba(16,185,129,0.05)] relative overflow-hidden space-y-8 ring-1 ring-white/5">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none transform translate-x-4 -translate-y-4">
                 <ShieldCheck className="w-48 h-48 text-emerald-500" />
              </div>
              
              {isUpcoming || isLive ? (
                <>
                  {!isRegistered ? (
                    // EMBEDDED REGISTRATION INTERFACE
                    <div className="space-y-6">
                      <div className="space-y-2">
                         <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                            Seat Allocation Active
                         </span>
                         <h3 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter">Claim Briefing Seat</h3>
                         <p className="text-xs text-white/35 leading-relaxed">
                            Complete details to generate execution keys for this masterclass cycle.
                         </p>
                      </div>

                      <form onSubmit={handleInlineRegister} className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block">Full Name</label>
                          <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                            <input 
                              type="text" 
                              required
                              placeholder="Sarah Jenkins"
                              value={regName}
                              onChange={(e) => setRegName(e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-xs text-white outline-none focus:border-emerald-500/30 transition-all placeholder-white/15"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block">Corporate Email Address</label>
                          <div className="relative">
                            <Send className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                            <input 
                              type="email" 
                              required
                              placeholder="s.jenkins@brokerage.com"
                              value={regEmail}
                              onChange={(e) => setRegEmail(e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-xs text-white outline-none focus:border-emerald-500/30 transition-all placeholder-white/15"
                            />
                          </div>
                        </div>

                        <button 
                          type="submit"
                          disabled={registering}
                          className="w-full py-4 bg-emerald-500 text-black text-xs font-black uppercase tracking-[0.2em] rounded-xl hover:bg-emerald-400 shadow-xl shadow-emerald-500/10 transition-all flex items-center justify-center gap-2 group"
                        >
                          {registering ? "Processing Seat..." : "Establish Clearance Keys"}
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </form>
                    </div>
                  ) : (
                    // TICKETING AND CLEARANCE CONFIRMED STATE
                    <div className="space-y-6 text-center py-6">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
                         <ShieldCheck className="w-8 h-8 text-emerald-400" />
                      </div>
                      <div className="space-y-2">
                         <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                            Clearance Active
                         </span>
                         <h3 className="text-xl font-black text-white uppercase">Seat Fully Claimed</h3>
                         <p className="text-xs text-white/35 leading-normal">
                            Cryptographic keys issued. We have assigned a node and will notify you when transmission starts.
                         </p>
                      </div>

                      <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-left space-y-2 font-mono text-[9px]">
                         <div className="text-gray-500 uppercase font-black">Ledger Details:</div>
                         <div className="text-white/60">TICKET_ID: {id?.slice(0, 16).toUpperCase()}</div>
                         <div className="text-white/60">ROLE_TIER: Co-Branded Clearance</div>
                         <div className="text-white/60">NODE_STATUS: Sync Complete</div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                // PAST/RECORDED MASTERCLASS DATA
                <div className="space-y-6">
                  <div className="space-y-2">
                     <span className="text-[9px] font-black text-white/40 bg-white/5 border border-white/10 px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                        Session Concluded
                     </span>
                     <h3 className="text-xl font-black text-white uppercase italic">Archived Records</h3>
                     <p className="text-xs text-white/35 leading-relaxed">
                        This masterclass cycle has fully ended. Archive streaming link is active on the left stage.
                     </p>
                  </div>
                  
                  {webinar.recording_url && (
                    <button 
                      onClick={() => globalThis.open(webinar.recording_url, '_blank')}
                      className="w-full py-4 bg-white text-black text-xs font-black uppercase tracking-[0.2em] rounded-xl hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 group"
                    >
                      Analyze Recording
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </button>
                  )}
                </div>
              )}

              {/* General Technical Specifications block */}
              <div className="pt-6 border-t border-white/5 space-y-4">
                 <h4 className="text-[10px] font-black text-white uppercase tracking-widest italic">Technical Briefing Specs</h4>
                 <div className="space-y-3 font-mono text-[9px] text-white/30 uppercase tracking-wider">
                    <div className="flex justify-between">
                       <span>Clearance Level</span>
                       <span className="text-emerald-400">Standard Desk</span>
                     </div>
                     <div className="flex justify-between">
                       <span>Max Allocation</span>
                       <span>{webinar.max_attendees} Slots</span>
                     </div>
                     <div className="flex justify-between">
                       <span>Compliant Risk Code</span>
                       <span>IFX-MACRO-V2</span>
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
