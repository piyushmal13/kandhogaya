import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, ArrowRight,
  MessageSquare, Send, Share2, Download, 
  Play, Volume2, Maximize2, Star, Zap, ShieldCheck, BarChart3
} from "lucide-react";
import { getWebinarById, checkWebinarRegistration } from "../services/apiHandlers";
import { RegistrationModal } from "../components/webinars/RegistrationModal";
import { CountdownTimer } from "../components/webinars/CountdownTimer";
import { WebinarSponsors } from "../components/webinars/WebinarSponsors";
import { PageMeta } from "../components/site/PageMeta";
import { useAuth } from "../contexts/AuthContext";
import { ResizedImage } from "../components/ui/ResizedImage";

export const WebinarDetail = () => {
  const { id } = useParams();
  const [webinar, setWebinar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showRegModal, setShowRegModal] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState("overview"); // chat, agenda, resources
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchWebinar = async () => {
      if (!id) return;
      const data = await getWebinarById(id);
      if (data) {
        setWebinar(data);
        if (user) {
          const registered = await checkWebinarRegistration(id, user.id);
          setIsRegistered(registered);
        }
      }
      setLoading(false);
    };

    fetchWebinar();
  }, [id, user]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const msg = {
      id: Date.now(),
      user: "You",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, msg]);
    setNewMessage("");
  };

  if (loading) return <div className="pt-32 text-center text-white">
    <PageMeta
      title="Webinar"
      description="Loading IFXTrades webinar details."
      path={id ? `/webinars/${id}` : "/webinars"}
    />
    Loading...
  </div>;
  if (!webinar) return <div className="pt-32 text-center text-white">
    <PageMeta
      title="Webinar Not Found"
      description="The requested IFXTrades webinar could not be found."
      path={id ? `/webinars/${id}` : "/webinars"}
      robots="noindex,follow"
    />
    Webinar not found.
  </div>;

  const isLive = webinar.status === "live";
  const isRecorded = webinar.status === "recorded" || webinar.status === "completed" || webinar.status === "past";
  const isUpcoming = webinar.status === "upcoming";

  return (
    <div className="pt-20 bg-[#020202] min-h-screen">
      <PageMeta
        title={webinar.title}
        description={webinar.description || "IFXTrades webinar details and registration."}
        path={id ? `/webinars/${id}` : "/webinars"}
        type="article"
        keywords={["trading webinar", webinar.speaker || "IFXTrades", webinar.status || "webinar"]}
      />
      
      <div className="bg-[#050505] border-b border-white/5 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/webinars" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 transition-colors">
              <ArrowRight className="w-5 h-5 rotate-180" />
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-1">
                {isLive && (
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    LIVE SESSION
                  </span>
                )}
                {isRecorded && (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] font-bold uppercase tracking-widest">
                    SESSION RECORDING
                  </span>
                )}
                <span className="text-gray-500 text-[10px] font-mono uppercase tracking-widest">{webinar.speaker_name || webinar.speaker || 'Institutional Lead'}</span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">{webinar.title}</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Users className="w-4 h-4 text-emerald-500" />
              <span>{webinar.registration_count}+ Attended</span>
            </div>
            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Presented By Section */}
        {webinar.sponsors && webinar.sponsors.length > 0 && (
          <div className="mb-12">
            <WebinarSponsors sponsors={webinar.sponsors} />
          </div>
        )}

        {isUpcoming && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 p-8 md:p-12 bg-[#0a0a0a] border border-emerald-500/20 rounded-3xl relative overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.05)]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_70%)]" />
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-8">
                <Zap className="w-3 h-3" />
                Live Session Countdown
              </div>
              
              <CountdownTimer targetDate={webinar.date_time} variant="hero" />
              
              {!isRegistered && (
                <div className="mt-10 flex flex-col items-center">
                  <p className="text-gray-400 text-sm mb-6 max-w-md">
                    Don't miss out on this institutional breakdown. Secure your seat before the countdown hits zero.
                  </p>
                  <button 
                    onClick={() => setShowRegModal(true)}
                    className="px-10 py-4 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] flex items-center gap-2 group"
                  >
                    Register for Free Access
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
              
              {isRegistered && (
                <div className="mt-10 flex items-center gap-3 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 font-bold">
                  <ShieldCheck className="w-5 h-5" />
                  <span>You're Registered! We'll notify you when we go live.</span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
              {(() => {
                if (isRecorded) {
                  return (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-[#050505] overflow-hidden">
                      <div className="absolute inset-0">
                        <motion.div 
                          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px]" 
                        />
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                        {new Array(20).fill(null).map((_, i) => (
                          <motion.div
                            key={`p-${i}`}
                            initial={{ x: Math.random() * 1000 - 500, y: Math.random() * 1000 - 500, opacity: 0 }}
                            animate={{ y: [0, -100, 0], opacity: [0, 0.5, 0] }}
                            transition={{ duration: 3 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 5 }}
                            className="absolute w-1 h-1 bg-emerald-500 rounded-full"
                          />
                        ))}
                      </div>
                      <div className="relative z-10">
                        <motion.div 
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-8 border border-emerald-500/20 mx-auto"
                        >
                          <BarChart3 className="w-12 h-12 text-emerald-500" />
                        </motion.div>
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter uppercase italic leading-none">
                          Institutional Alpha <br/>
                          <span className="text-emerald-500">Successfully Unlocked</span>
                        </h2>
                        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-12">
                          {[
                            { label: "Accuracy", value: "94.2%" },
                            { label: "Volume Analyzed", value: "1.4M+" },
                            { label: "Latency", value: "0.1ms" }
                          ].map((stat) => (
                            <div key={stat.label} className="text-center p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                              <div className="text-2xl md:text-3xl font-bold text-emerald-500 font-mono">{stat.value}</div>
                              <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">{stat.label}</div>
                            </div>
                          ))}
                        </div>
                        <Link to="/webinars" className="inline-flex items-center gap-2 px-10 py-4 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all">
                          View Upcoming Sessions
                          <ArrowRight className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>
                  );
                }
                if (isUpcoming && !isRegistered) {
                  return (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-black/60 to-black">
                      <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20">
                        <Lock className="w-10 h-10 text-emerald-500" />
                      </div>
                      <h2 className="text-2xl font-bold text-white mb-4">Registration Required</h2>
                      <p className="text-gray-400 max-w-md mb-8">This session is exclusive to registered members.</p>
                      <button onClick={() => setShowRegModal(true)} className="px-8 py-4 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400">
                        Register for Free Access
                      </button>
                    </div>
                  );
                }
                return (
                  <>
                    <ResizedImage 
                      src={webinar.webinar_image_url || "https://picsum.photos/seed/webinar/1280/720"} 
                      alt="Cover" 
                      className="w-full h-full object-cover opacity-40" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button className="w-20 h-20 bg-emerald-500 text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_40px_rgba(16,185,129,0.4)]">
                        <Play className="w-8 h-8 fill-current ml-1" />
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>

            <div className="mt-12">
              <div className="flex border-b border-white/5 mb-8">
                {["Overview", "Agenda", "Resources"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`px-6 py-4 text-sm font-bold transition-all relative ${
                      activeTab === tab.toLowerCase() ? "text-emerald-500" : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    {tab}
                    {activeTab === tab.toLowerCase() && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />}
                  </button>
                ))}
              </div>

              <div className="prose prose-invert max-w-none">
                {activeTab === "overview" && (
                  <div className="text-gray-400 leading-relaxed">
                    <p className="mb-6 text-lg text-white/80">{webinar.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                      <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                        <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                          <Star className="w-4 h-4 text-emerald-500" />
                          What You'll Learn
                        </h4>
                        <ul className="space-y-3 text-sm">
                          {webinar.advanced_features?.learning_points?.map((point: string) => (
                            <li key={point} className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                              <span>{point}</span>
                            </li>
                          )) || <li className="text-gray-500 italic">No learning points specified.</li>}
                        </ul>
                      </div>
                      <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                        <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-500" />
                          Institutional Security
                        </h4>
                        <p className="text-sm">All methods shared are compliant with institutional risk management standards.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl flex flex-col h-[600px] shadow-xl">
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-500" />
                  <span className="text-white font-bold text-sm">Live Chat</span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="bg-white/5 rounded-lg p-2.5 text-gray-300 text-sm">
                    <span className="text-emerald-500 font-bold mr-2 uppercase text-[10px]">{msg.user}</span>
                    {msg.text}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5">
                <div className="relative">
                  <input type="text" placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:border-emerald-500 outline-none" />
                  <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-emerald-500"><Send className="w-4 h-4" /></button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showRegModal && (
          <RegistrationModal 
            onClose={() => setShowRegModal(false)} 
            webinar={webinar} 
            onSuccess={() => setIsRegistered(true)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const Lock = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const Check = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);
