import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useFeatureFlag } from '../../hooks/useFeatureFlag';
import { CheckCheck, Smartphone, Send, MessageSquare } from 'lucide-react';

// Color palette for participant names in the mock WhatsApp terminal
const PARTICIPANT_COLORS = [
  'text-cyan-400',
  'text-emerald-400',
  'text-amber-400',
  'text-pink-400',
  'text-purple-400',
  'text-indigo-400',
  'text-orange-400',
  'text-rose-400'
];

// Map country names/regions to flags for high-fidelity realism
const getFlagEmoji = (region: string) => {
  const norm = region.toLowerCase();
  if (norm.includes('dubai') || norm.includes('uae')) return '🇦🇪';
  if (norm.includes('india')) return '🇮🇳';
  if (norm.includes('spain') || norm.includes('es')) return '🇪🇸';
  if (norm.includes('uk') || norm.includes('london')) return '🇬🇧';
  if (norm.includes('us') || norm.includes('usa')) return '🇺🇸';
  if (norm.includes('germany')) return '🇩🇪';
  if (norm.includes('singapore')) return '🇸🇬';
  return '🌐';
};

// Hardcoded verified institutional client reviews for absolute trust building
const VERIFIED_TESTIMONIALS = [
  {
    id: "review-1",
    name: "Omar Ali",
    location: "Dubai",
    region: "dubai",
    feedback: "Consistent profits and smooth trading experience.",
    time: "2m ago"
  },
  {
    id: "review-2",
    name: "Rahul Sharma",
    location: "India",
    region: "india",
    feedback: "IFX Trades completely changed my trading discipline. The signals are accurate and risk management is very professional.",
    time: "1h ago"
  },
  {
    id: "review-3",
    name: "Priya Mehta",
    location: "India",
    region: "india",
    feedback: "I started with zero knowledge and now I confidently take trades daily. The platform feels very premium.",
    time: "5h ago"
  },
  {
    id: "review-4",
    name: "Amit Verma",
    location: "India",
    region: "india",
    feedback: "Execution speed and consistency is impressive. Withdrawals are smooth and support is always responsive.",
    time: "1d ago"
  },
  {
    id: "review-5",
    name: "Fatima Noor",
    location: "Dubai",
    region: "dubai",
    feedback: "Very reliable platform. I appreciate the transparency.",
    time: "3d ago"
  },
  {
    id: "review-6",
    name: "Elena Rodriguez",
    location: "Spain",
    region: "spain",
    feedback: "The institutional webinars are worth the subscription alone. The level of detail on order flow is professional grade.",
    time: "5d ago"
  }
];

export const EliteSocialProof = () => {
  const { isEnabled: isReviewsLive } = useFeatureFlag('institutional_reviews_live', true);
  const [typingStatus, setTypingStatus] = useState("Active (1,420 online)");

  useEffect(() => {
    const interval = setInterval(() => {
      setTypingStatus((prev) => 
        prev === "Active (1,420 online)" ? "Tareq K. is typing..." : "Active (1,420 online)"
      );
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  if (!isReviewsLive) return null;

  return (
    <section className="py-16 sm:py-24 md:py-28 bg-[#010203] relative overflow-hidden border-t border-zinc-900 w-full">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/[0.012] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Column: Heading & Chat Grid (Takes 6 Cols on desktop) */}
          <div className="lg:col-span-6 space-y-8 md:space-y-10 text-left">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.25em] w-fit">
                 Global Network Validation
              </div>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[0.95] italic uppercase">
                 Synchronized <br />
                 <span className="text-emerald-400">Social Proof.</span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed font-medium max-w-xl">
                 Real-time feedback from our elite network of institutional partners. Verified execution reports, low-latency metrics, and strategy success validated directly on the MT4/MT5 platforms.
              </p>
            </div>
            
            {/* WhatsApp Received Message Bubbles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
               {VERIFIED_TESTIMONIALS.map((member, idx) => {
                 const nameColor = PARTICIPANT_COLORS[idx % PARTICIPANT_COLORS.length];
                 const countryFlag = getFlagEmoji(member.location || member.region || "");
                 return (
                    <motion.div 
                      key={member.id}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05, duration: 0.3 }}
                      className="flex flex-col items-start gap-1 relative group w-full"
                    >
                      {/* WhatsApp Speech Bubble */}
                      <div className="bg-[#182229]/80 backdrop-blur-md text-white p-4 rounded-2xl rounded-tl-none border border-zinc-800/80 shadow-lg relative w-full flex flex-col gap-1.5 transition-all duration-300 group-hover:border-emerald-500/35">
                        {/* Received Message Bubble Tail */}
                        <div className="absolute top-0 left-[-6px] w-0 h-0 border-t-[8px] border-t-[#182229] border-l-[8px] border-l-transparent" />
                        
                        {/* WhatsApp Sender Name & Location */}
                        <div className="flex justify-between items-center gap-2 border-b border-zinc-800/50 pb-1.5">
                          <span className={`text-[10px] font-black tracking-wide ${nameColor}`}>
                            {member.name}
                          </span>
                          <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                            {member.location} {countryFlag}
                          </span>
                        </div>

                        {/* Speech Bubble Feedback Text */}
                        <p className="text-[11px] text-zinc-300 leading-relaxed font-sans font-medium py-1">
                          "{member.feedback}"
                        </p>

                        {/* Timestamp and Blue Delivered ticks */}
                        <div className="flex items-center gap-1 justify-end mt-1 text-[7.5px] font-bold text-zinc-600 select-none">
                          <span>{member.time}</span>
                          <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                        </div>
                      </div>
                    </motion.div>
                 );
               })}
            </div>
          </div>

          {/* Right Column: Live Rendered Interactive WhatsApp Desktop mockup (Takes 6 Cols on desktop) */}
          <div className="lg:col-span-6 relative w-full hidden sm:block">
            <div className="absolute inset-0 bg-emerald-500/5 blur-[100px] rounded-full opacity-35" aria-hidden="true" />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="relative w-full rounded-3xl overflow-hidden border border-zinc-800/80 bg-[#0c0f12] shadow-2xl flex flex-col h-[520px]"
            >
              {/* Window Desktop Header Bar (macOS Mockup) */}
              <div className="bg-[#181d22] px-4 py-3 flex items-center border-b border-zinc-800/80 relative shrink-0">
                <div className="flex gap-1.5 z-10">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-600">
                    IFX Sovereign Terminal - Node 04
                  </span>
                </div>
              </div>

              {/* Side-by-Side Windows */}
              <div className="flex-1 flex overflow-hidden">
                {/* Desktop Left Sidebar: Channels List */}
                <div className="w-[180px] sm:w-[200px] bg-[#11161a] border-r border-zinc-800/80 flex flex-col select-none shrink-0">
                  <div className="p-3 border-b border-zinc-800/50 shrink-0">
                    <div className="bg-black/40 border border-zinc-800/60 px-3 py-1.5 rounded-lg text-[8px] font-black text-zinc-600 uppercase tracking-wider text-left">
                      Search...
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto space-y-0.5 p-1">
                    {/* Chat Item 1 (Active) */}
                    <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.04] flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-[10px] font-black tracking-wider shrink-0">
                        QD
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-black text-white uppercase truncate">IFX Quant Desk</span>
                          <span className="text-[7px] text-zinc-600 font-bold font-mono">10:16</span>
                        </div>
                        <p className="text-[7px] text-emerald-400 font-bold uppercase truncate font-mono">Tareq K: zero slippage...</p>
                      </div>
                    </div>

                    {/* Chat Item 2 */}
                    <div className="p-2 rounded-xl hover:bg-white/[0.01] flex items-center gap-2 transition-all cursor-pointer">
                      <div className="w-7 h-7 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-[10px] font-black tracking-wider shrink-0">
                        EB
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-black text-zinc-400 uppercase truncate">Execution Bridge</span>
                          <span className="text-[7px] text-zinc-600 font-bold font-mono">10:10</span>
                        </div>
                        <p className="text-[7px] text-zinc-600 truncate font-mono">Bridge telemetry online...</p>
                      </div>
                    </div>

                    {/* Chat Item 3 */}
                    <div className="p-2 rounded-xl hover:bg-white/[0.01] flex items-center gap-2 transition-all cursor-pointer">
                      <div className="w-7 h-7 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 text-[10px] font-black tracking-wider shrink-0">
                        SS
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-black text-zinc-400 uppercase truncate">Sovereign Signals</span>
                          <span className="text-[7px] text-zinc-600 font-bold font-mono">09:45</span>
                        </div>
                        <p className="text-[7px] text-zinc-600 truncate font-mono">XAUUSD Target 2 Hit...</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Active Chat Pane */}
                <div className="flex-1 flex flex-col bg-[#0b141a]">
                  {/* WhatsApp Desk Active Chat Header */}
                  <div className="bg-[#202c33] p-3 border-b border-zinc-800/80 flex items-center justify-between shrink-0 select-none">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black tracking-wider text-xs shadow-inner relative shrink-0">
                        IFX
                        <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 border border-[#202c33] rounded-full" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-white text-[10px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-1">
                          IFX Quant Desk
                          <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                        </h3>
                        <p className="text-[7px] sm:text-[8px] font-bold text-emerald-400 tracking-wider uppercase">
                          {typingStatus}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-zinc-500">
                      <Smartphone className="w-4 h-4" />
                      <MessageSquare className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Chat Wallpaper Thread */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-3 relative bg-[#0b141a] select-none" style={{ backgroundImage: 'radial-gradient(#1c2c36 1px, transparent 1px)', backgroundSize: '16px 16px' }}>
                    {/* System Notice */}
                    <div className="flex justify-center my-1.5">
                      <div className="bg-[#182229] border border-zinc-800/50 rounded-lg px-3 py-1 text-[7px] font-black uppercase tracking-widest text-[#8696a0]">
                        🛡️ ENCRYPTED CLIENT TELEMETRY NODE
                      </div>
                    </div>

                    {/* Sent message (Green Bubble) */}
                    <div className="flex flex-col items-end gap-1 w-full pl-6">
                      <div className="bg-[#005c4b] text-white p-3 rounded-2xl rounded-tr-none border border-emerald-500/20 shadow-md relative max-w-[85%] text-left">
                        {/* Speech Tail */}
                        <div className="absolute top-0 right-[-6px] w-0 h-0 border-t-[8px] border-t-[#005c4b] border-r-[8px] border-r-transparent" />
                        <p className="text-[10px] text-white/95 leading-relaxed font-sans font-medium">
                          All MT5 binaries compiled for this week. Execution latencies optimized to &lt;1.2ms. Please test and report results.
                        </p>
                        <div className="flex items-center gap-1 justify-end mt-1 text-[6px] text-white/40 font-bold font-mono">
                          <span>10:14 AM</span>
                          <CheckCheck className="w-2.5 h-2.5 text-[#53bdeb]" />
                        </div>
                      </div>
                    </div>

                    {/* Received message 1 (Dark Grey Bubble) */}
                    <div className="flex flex-col items-start gap-1 w-full pr-6">
                      <div className="bg-[#202c33] text-white p-3 rounded-2xl rounded-tl-none border border-zinc-800/60 shadow-md relative max-w-[85%] text-left">
                        <div className="absolute top-0 left-[-6px] w-0 h-0 border-t-[8px] border-t-[#202c33] border-l-[8px] border-l-transparent" />
                        
                        <div className="flex justify-between items-center gap-2 pb-0.5 border-b border-zinc-800/50 mb-0.5">
                          <span className="text-[8px] font-black tracking-wide text-cyan-400">Tareq K.</span>
                          <span className="text-[6px] font-bold text-zinc-500 tracking-widest">DUBAI 🇦🇪</span>
                        </div>
                        
                        <p className="text-[10px] text-white/90 leading-relaxed font-sans font-medium">
                          Confirming latencies in Dubai! Apex Alpha V4 is executing gold trades flawlessly on MT5. Zero slippage detected today. Excellent! 🚀
                        </p>
                        <div className="flex items-center justify-end mt-1 text-[6px] text-zinc-500 font-bold font-mono">
                          <span>10:16 AM</span>
                        </div>
                      </div>
                    </div>

                    {/* Received message 2 (Frankfurt Client) */}
                    <div className="flex flex-col items-start gap-1 w-full pr-6">
                      <div className="bg-[#202c33] text-white p-3 rounded-2xl rounded-tl-none border border-zinc-800/60 shadow-md relative max-w-[85%] text-left">
                        <div className="absolute top-0 left-[-6px] w-0 h-0 border-t-[8px] border-t-[#202c33] border-l-[8px] border-l-transparent" />
                        
                        <div className="flex justify-between items-center gap-2 pb-0.5 border-b border-zinc-800/50 mb-0.5">
                          <span className="text-[8px] font-black tracking-wide text-amber-400">Christian W.</span>
                          <span className="text-[6px] font-bold text-zinc-500 tracking-widest">FRANKFURT 🇩🇪</span>
                        </div>
                        
                        <p className="text-[10px] text-white/90 leading-relaxed font-sans font-medium">
                          Macro Systematic Desk just triggered EURUSD short. Execution completed under 1ms. Capital allocations syncing nicely. Best quant software we have tested.
                        </p>
                        <div className="flex items-center justify-end mt-1 text-[6px] text-zinc-500 font-bold font-mono">
                          <span>10:22 AM</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chat Input Mock (Footer) */}
                  <div className="bg-[#202c33] p-2.5 border-t border-zinc-800/80 flex items-center gap-2 shrink-0 select-none">
                    <div className="flex-1 bg-[#2a3942] rounded-xl px-4 py-2 text-[8px] sm:text-[9px] text-zinc-500 uppercase tracking-widest font-black flex items-center justify-between">
                      Secure Message...
                      <Send className="w-3 h-3 text-zinc-600" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
