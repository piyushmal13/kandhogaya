import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { useWebinars } from '@/hooks/useWebinars';
import { WebinarCard } from '@/components/institutional/WebinarCard';
import { WebinarCardSkeleton } from '@/components/ui/Skeleton';
import { PageMeta } from '@/components/site/PageMeta';
import { AdBanner } from '@/components/ui/AdBanner';
import { 
  Video, Award, BookOpen, ShieldCheck, HelpCircle, 
  Send, ChevronRight, Check, Clock, Building, Globe, Sparkles 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/contexts/ToastContext';

// ── COMING SOON PITCH MODE (REMOVE THIS BLOCK TO RESTORE REAL MODEL) ──
const IS_COMING_SOON_PITCH = true;

export const Webinars = () => {
  const { data: webinars, isLoading } = useWebinars();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const { success, error: toastError } = useToast();

  // Form states for Priority invite capture
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [clearanceKey, setClearanceKey] = useState("");

  // Persist registration key on refresh
  useEffect(() => {
    const savedKey = localStorage.getItem("ifx_webinar_clearance_key");
    const savedName = localStorage.getItem("ifx_webinar_clearance_name");
    if (savedKey && savedName) {
      setIsRegistered(true);
      setClearanceKey(savedKey);
      setRegName(savedName);
    }
  }, []);

  const handleRequestAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regEmail.trim() || !regName.trim()) return;
    setRegistering(true);

    try {
      // 1. Generate clearance key representation
      const randomKey = "IFX-SEC-" + Math.floor(100000 + Math.random() * 900000);

      // 2. Ingest lead inside CRM pipeline
      const { data: lead } = await supabase
        .from('leads')
        .select('id, score, crm_metadata')
        .eq('email', regEmail)
        .maybeSingle();

      if (!lead) {
        await supabase.from('leads').insert({
          email: regEmail,
          source: 'webinar_coming_soon_pitch',
          score: 15,
          stage: 'INTERESTED',
          last_action_at: new Date().toISOString(),
          crm_metadata: { name: regName, pitch_mode: true, clearance_key: randomKey }
        });
      } else {
        await supabase.from('leads').update({
          score: (lead.score || 0) + 15,
          stage: 'HIGH_INTENT',
          last_action_at: new Date().toISOString(),
          crm_metadata: { 
            ...(lead.crm_metadata || {}), 
            name: regName, 
            pitch_mode: true, 
            clearance_key: randomKey 
          }
        }).eq('id', lead.id);
      }

      // 3. Enqueue notification in queue
      await supabase.from('notification_queue').insert({
        recipient: regEmail,
        channel: 'EMAIL',
        priority: 'HIGH',
        payload: {
          message: `Your priority pass for the IFX Trades Institutional Masterclass Series is verified. Clearance Code: ${randomKey}.`,
          user_name: regName,
          action_link: '/webinars'
        },
        status: 'PENDING'
      });

      // Store state
      localStorage.setItem("ifx_webinar_clearance_key", randomKey);
      localStorage.setItem("ifx_webinar_clearance_name", regName);
      setClearanceKey(randomKey);
      setIsRegistered(true);
      success("Priority access requested! Clearance keys queued.");
    } catch (err: any) {
      console.error(err);
      toastError("Clearance dispatch offline. Please try again.");
    } finally {
      setRegistering(false);
    }
  };

  const filteredWebinars = webinars?.filter(w => 
    activeTab === 'upcoming' ? w.status !== 'past' : w.status === 'past'
  );

  return (
    <div className="relative pt-24 md:pt-32 pb-16 md:pb-24 min-h-screen overflow-hidden bg-[#07070a] text-white">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[50%] bg-[radial-gradient(ellipse_at_top,rgba(0,113,227,0.06)_0%,transparent_60%)] blur-3xl opacity-80" />
        <div className="absolute bottom-0 right-0 w-[55%] h-[40%] bg-[radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.04)_0%,transparent_60%)] blur-3xl" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02]" />
      </div>
      
      <PageMeta
        title="Institutional Webinars & Masterclasses | IFX Trades"
        description="Access live trading webinars, macro research briefings, and recorded past sessions from IFX Trades lead strategists."
        path="/webinars"
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 w-full space-y-16">
        
        {/* Render Pitch/Coming Soon layout when enabled */}
        {IS_COMING_SOON_PITCH ? (
          <div className="space-y-12">
            
            {/* Split layout: Info & Form */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
              
              {/* Left Column: Headline, Subtitle, Status, Features (7 cols) */}
              <div className="lg:col-span-7 space-y-8 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-black uppercase tracking-wider">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                  </span>
                  System status: In Deployment &amp; Co-Sponsorship Phase
                </div>
                
                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight uppercase leading-[0.9] text-white">
                  Institutional <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-[#60CDFF] to-emerald-400">Masterclass Series</span>
                </h1>
                
                <p className="text-xs sm:text-sm md:text-base text-zinc-400 leading-relaxed font-medium max-w-2xl">
                  Deploying high-performance educational models in collaboration with top-tier brokers and liquidity providers. Get priority clearance keys to decode volatility and access MT5 binary distributions.
                </p>

                {/* Scope Cards Bento Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-4">
                  {[
                    { title: "ATR Volatility Filtering", desc: "Dynamically adjusting systematic execution targets based on volatility curves." },
                    { title: "Compiled Binary Handover", desc: "Deploying secure custom indicator libraries and EX5 modules for direct server integration." },
                    { title: "Sovereign Compliance", desc: "Auditing structures to support zero client capital custody models for risk management." },
                    { title: "Order Book Liquidity", desc: "Tracking matching engine queue prioritizations directly within Equinix host centers." }
                  ].map((item, idx) => (
                    <div key={idx} className="p-5 bg-zinc-900/30 border border-zinc-800/80 rounded-2xl flex flex-col justify-between hover:border-zinc-700 transition-all duration-300">
                      <span className="text-[7.5px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">Protocol Scope 0{idx+1}</span>
                      <h4 className="text-[10px] font-mono font-black text-white uppercase tracking-wider mb-2">{item.title}</h4>
                      <p className="text-[9.5px] text-zinc-500 leading-normal font-bold uppercase tracking-wider">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Dynamic Form box (5 cols) */}
              <div className="lg:col-span-5 bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
                  <Building className="w-40 h-40 text-blue-500" />
                </div>
                
                {!isRegistered ? (
                  <div className="space-y-6">
                    <div className="space-y-2 text-center sm:text-left">
                      <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest font-mono">Invite Desk</span>
                      <h3 className="text-xl font-black text-white uppercase tracking-tight">Request Access Key</h3>
                      <p className="text-[10.5px] text-zinc-500 leading-relaxed">
                        Enter your professional credentials below to request invite codes and co-sponsor specifications.
                      </p>
                    </div>

                    <form onSubmit={handleRequestAccess} className="space-y-4">
                      <div className="space-y-1.5 text-left">
                        <label className="text-[8.5px] font-black text-zinc-500 uppercase tracking-widest block font-mono">Full Name</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Richard Hendricks"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          className="w-full bg-black border border-zinc-800 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-zinc-700 transition-all placeholder:text-zinc-700 font-medium"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="text-[8.5px] font-black text-zinc-500 uppercase tracking-widest block font-mono">Professional Email</label>
                        <input 
                          type="email" 
                          required
                          placeholder="e.g. r.hendricks@brokerage.com"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          className="w-full bg-black border border-zinc-800 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-zinc-700 transition-all placeholder:text-zinc-700 font-medium"
                        />
                      </div>

                      <button 
                        type="submit"
                        disabled={registering}
                        className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-[0.15em] rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-1 group cursor-pointer"
                      >
                        {registering ? "Requesting Clearance..." : "Request Priority Access"}
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="space-y-5 text-center py-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-2 animate-pulse">
                      <Clock className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="space-y-2">
                      <span className="text-[8px] font-black text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block font-mono">
                        Registration Queued
                      </span>
                      <h3 className="text-base font-black text-white uppercase tracking-tight">Deployment Access Pending</h3>
                      <p className="text-[10.5px] text-zinc-500 leading-relaxed max-w-sm mx-auto">
                        Hi {regName}, your invitation credentials have been generated and queued for partner database routing.
                      </p>
                    </div>

                    <div className="p-4 bg-black/40 border border-zinc-800 rounded-2xl text-left space-y-2 text-[10px]">
                      <div className="text-zinc-500 font-bold uppercase tracking-wider text-[8px] font-mono">Clearance Credentials:</div>
                      <div className="text-zinc-400 flex justify-between">
                        <span className="text-zinc-600">Requestor:</span>
                        <span>{regName}</span>
                      </div>
                      <div className="text-zinc-400 flex justify-between">
                        <span className="text-zinc-600">Access Key:</span>
                        <span className="font-mono text-blue-400 font-bold">{clearanceKey}</span>
                      </div>
                      <div className="text-zinc-400 flex justify-between">
                        <span className="text-zinc-600">Status:</span>
                        <span className="text-blue-500 font-bold">QUEUED FOR VALIDATION</span>
                      </div>
                    </div>

                    <div className="pt-2 text-[9px] text-zinc-600 font-medium">
                      Co-sponsor allocation desk will contact you via email shortly.
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Broadcast Feed Section for dynamic live status updates */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#04060A]/80 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
              <div className="lg:col-span-8 space-y-4 text-left">
                <span className="text-[8.5px] font-mono font-black text-blue-400 uppercase tracking-widest">Broker Promotion Desk</span>
                <h3 className="text-xl sm:text-2xl font-black text-white uppercase italic">Sponsorship Allocations Active</h3>
                <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">
                  We are actively allocating presentation slots, marketing spots, and lead-attribution parameters to licensed brokerage sponsors. Partner brokers will benefit from direct client data ingestion, custom EX5 indicator allocations, and exclusive branding positioning.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-zinc-500">
                    <Globe className="w-3.5 h-3.5 text-blue-400" />
                    <span>EQUINIX CROSS-CONNECTS</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-zinc-500">
                    <Building className="w-3.5 h-3.5 text-blue-400" />
                    <span>MT5 ENDPOINT INTEGRATION</span>
                  </div>
                </div>
              </div>

              {/* Feed updates sidepanel */}
              <div className="lg:col-span-4 bg-black/40 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between min-h-[180px]">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                      </span>
                      <span className="text-[9px] font-mono font-black text-white uppercase tracking-wider">Broadcast Feeds</span>
                    </div>
                    <span className="text-[7.5px] font-mono text-zinc-600 uppercase font-black">SYS: DEPLOYED</span>
                  </div>
                  <div className="space-y-3 font-mono text-[9px] text-left leading-normal">
                    <div className="border-l border-blue-500/50 pl-2">
                      <p className="text-[7.5px] text-zinc-600 font-bold">07:22 UTC - COMPLIANCE</p>
                      <p className="text-white/80">Sovereignty models updated. Zero-custody signal structures active.</p>
                    </div>
                    <div className="border-l border-emerald-500/50 pl-2">
                      <p className="text-[7.5px] text-zinc-600 font-bold">06:15 UTC - CONNECTIVITY</p>
                      <p className="text-white/80">Equinix SG1 cross-connect active. Signal latency averages &lt;1.2ms.</p>
                    </div>
                  </div>
                </div>
                <div className="pt-3 border-t border-zinc-800/50 text-[7.5px] font-mono text-zinc-600 uppercase tracking-widest text-center font-bold">
                  Sponsors Refreshing: Live
                </div>
              </div>
            </div>

          </div>
        ) : (
          // ── ORIGINAL FULL LISTING MODEL (RESTORED WHEN IS_COMING_SOON_PITCH = FALSE) ──
          <div className="space-y-16">
            {/* Executive Header */}
            <div className="space-y-6 text-center max-w-4xl mx-auto pt-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                <Award className="w-3.5 h-3.5" />
                IFX Systematic Platform
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-tight uppercase">
                Institutional <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Masterclass Series</span>
              </h1>
              <p className="text-sm md:text-base text-gray-400 font-medium leading-relaxed max-w-2xl mx-auto">
                Accelerate your trading performance with premium systematic insights. Access real-time briefings, macro research breakdowns, and advanced algorithmic model tutorials from our global strategy desk.
              </p>
            </div>

            {/* Executive Webinar Schedule & Operational Status Desk */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto bg-[#04060A]/80 border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
              {/* Column 1 & 2: Syllabus & Structure */}
              <div className="lg:col-span-2 space-y-6 text-left">
                <div className="border-b border-white/5 pb-4">
                  <span className="text-[8px] font-mono font-black text-[#00A3FF] uppercase tracking-widest">Masterclass Protocol Scope</span>
                  <h3 className="text-xl font-black text-white uppercase italic mt-1">Structured Systematic Syllabus</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-4 bg-white/[0.01] border border-white/[0.03] rounded-2xl">
                    <h4 className="text-[10px] font-black text-white uppercase tracking-wider mb-2">ATR Volatility Filtering</h4>
                    <p className="text-[10px] text-gray-500 leading-relaxed uppercase tracking-wider font-bold">
                      Classifying average true range parameters to adjust systematic targets dynamically.
                    </p>
                  </div>
                  <div className="p-4 bg-white/[0.01] border border-white/[0.03] rounded-2xl">
                    <h4 className="text-[10px] font-black text-white uppercase tracking-wider mb-2">Compiled Binary Handover</h4>
                    <p className="text-[10px] text-gray-500 leading-relaxed uppercase tracking-wider font-bold">
                      Direct integration of MT5 EX5 files and custom API endpoints on client hosting servers.
                    </p>
                  </div>
                  <div className="p-4 bg-white/[0.01] border border-white/[0.03] rounded-2xl">
                    <h4 className="text-[10px] font-black text-white uppercase tracking-wider mb-2">Sovereign Compliance</h4>
                    <p className="text-[10px] text-gray-500 leading-relaxed uppercase tracking-wider font-bold">
                      Enforcing zero client capital custody models across all signal and webinar pipelines.
                    </p>
                  </div>
                  <div className="p-4 bg-white/[0.01] border border-white/[0.03] rounded-2xl">
                    <h4 className="text-[10px] font-black text-white uppercase tracking-wider mb-2">Order Book Liquidity</h4>
                    <p className="text-[10px] text-gray-500 leading-relaxed uppercase tracking-wider font-bold">
                      Mapping matching engine queue prioritizations inside Equinix NY4 and LD4 centers.
                    </p>
                  </div>
                </div>
              </div>

              {/* Column 3: Live Emergency / Update Feed */}
              <div className="bg-black/40 border border-white/5 rounded-2xl p-6 flex flex-col justify-between min-h-[240px]">
                <div>
                  <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                      </span>
                      <span className="text-[10px] font-mono font-black text-white uppercase tracking-wider">Broadcast Feeds</span>
                    </div>
                    <span className="text-[8px] font-mono text-gray-500 uppercase">SYS: ACTIVE</span>
                  </div>
                  <div className="space-y-4 font-mono text-[9px] text-[#00E5FF] text-left leading-normal">
                    <div className="border-l-2 border-red-500/50 pl-2">
                      <p className="text-[8px] text-gray-500 font-bold">07:22 UTC - URGENT</p>
                      <p className="text-white/80">Sovereignty models updated. Verify sitemap and sitemap.xml endpoints.</p>
                    </div>
                    <div className="border-l-2 border-blue-500/50 pl-2">
                      <p className="text-[8px] text-gray-500 font-bold">06:15 UTC - UPDATE</p>
                      <p className="text-white/80">Equinix SG1 cross-connect active. Signal latency averages &lt;1.2ms.</p>
                    </div>
                    <div className="border-l-2 border-green-500/50 pl-2">
                      <p className="text-[8px] text-gray-500 font-bold">04:30 UTC - SYNC</p>
                      <p className="text-white/80">Bespoke MT5 compiled indicator distributions successfully synchronized.</p>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/5 text-[8px] font-mono text-gray-500 uppercase tracking-widest text-center">
                  Last Refresh: Just Now
                </div>
              </div>
            </div>

            {/* Institutional Trust Badges */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] bg-white/[0.01] border border-white/5 backdrop-blur-sm">
              {[
                { icon: ShieldCheck, title: "Curriculum", desc: "Curated syllabus" },
                { icon: BookOpen, title: "Integrated", desc: "Liquidity designs" },
                { icon: Video, title: "On-Demand", desc: "Micro classes" },
                { icon: HelpCircle, title: "Interactive Q&A", desc: "Strategy queries" }
              ].map((metric) => (
                <div key={metric.title} className="p-2 sm:p-4 flex flex-col items-center text-center space-y-1.5 group hover:bg-white/[0.01] rounded-2xl transition-all border border-transparent hover:border-white/5">
                  <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:scale-105 transition-transform">
                    <metric.icon className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-emerald-400" />
                  </div>
                  <h4 className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-wider leading-none">{metric.title}</h4>
                  <p className="text-[8px] sm:text-[10px] text-gray-400 leading-tight">{metric.desc}</p>
                </div>
              ))}
            </div>

            <AdBanner placement="webinar" />

            {/* Webinars Grid Section */}
            <div className="space-y-8 relative z-10">
              <div className="flex flex-wrap gap-6 md:gap-10 border-b border-white/5 pb-2">
                {(['upcoming', 'past'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-xs font-bold uppercase tracking-wider transition-all relative ${
                      activeTab === tab ? 'text-emerald-400' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab === 'upcoming' ? 'Upcoming Sessions' : 'Archived Webinars'}
                    {activeTab === tab && (
                      <motion.div 
                        layoutId="activeTabWebinars"
                        className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-emerald-400" 
                      />
                    )}
                  </button>
                ))}
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {["sk1", "sk2", "sk3"].map((key) => (
                    <WebinarCardSkeleton key={key} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredWebinars?.length ? (
                    filteredWebinars.map((webinar) => (
                      <WebinarCard key={webinar.id} webinar={webinar} />
                    ))
                  ) : (
                    <div className="col-span-full py-20 text-center border border-white/5 rounded-3xl bg-white/[0.01]">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">No webinars currently scheduled in this category.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default Webinars;

