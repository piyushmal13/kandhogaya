import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { getReviews } from '../../services/apiHandlers';
import { useFeatureFlag } from '../../hooks/useFeatureFlag';
import { Check, CheckCheck, Smartphone, Send, MessageSquare } from 'lucide-react';

// Color palette for WhatsApp group chat participant names
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

// Map country names/regions to flags for extreme high-fidelity realism
const getFlagEmoji = (region: string) => {
  const norm = region.toLowerCase();
  if (norm.includes('dubai') || norm.includes('uae')) return '🇦🇪';
  if (norm.includes('uk') || norm.includes('london') || norm.includes('united kingdom')) return '🇬🇧';
  if (norm.includes('us') || norm.includes('usa') || norm.includes('united states')) return '🇺🇸';
  if (norm.includes('de') || norm.includes('germany')) return '🇩🇪';
  if (norm.includes('ca') || norm.includes('canada')) return '🇨🇦';
  if (norm.includes('sg') || norm.includes('singapore')) return '🇸🇬';
  if (norm.includes('in') || norm.includes('india')) return '🇮🇳';
  if (norm.includes('ch') || norm.includes('switzerland')) return '🇨🇭';
  if (norm.includes('eu') || norm.includes('europe')) return '🇪🇺';
  if (norm.includes('au') || norm.includes('australia')) return '🇦🇺';
  return '🌐'; // fallback globe
};

export const EliteSocialProof = () => {
  const { isEnabled: isReviewsLive } = useFeatureFlag('institutional_reviews_live', true);
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isReviewsLive) {
      setIsLoading(false);
      return;
    }
    const fetchMembers = async () => {
      try {
        const data = await getReviews(6); // Fetch 6 approved reviews
        if (data && data.length > 0) {
          setMembers(data);
        }
      } catch (err) {
        console.error("Institutional Social Proof: Signal lost.", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMembers();
  }, []);

  if (isLoading || !isReviewsLive) return null;
  if (members.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-[#010203] relative overflow-hidden border-t border-white/5">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/[0.015] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Heading & Chat Grid (Takes 7 Cols on desktop) */}
          <div className="lg:col-span-7 space-y-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-[0.25em] w-fit">
                 Global Network Validation
              </div>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-none italic uppercase">
                 Synchronized <br />
                 <span className="text-emerald-400">Social Proof.</span>
              </h2>
              <p className="text-xs sm:text-sm text-white/40 leading-relaxed font-medium max-w-xl">
                 Real-time feedback from our elite network of institutional partners. Verified execution reports, low-latency metrics, and strategy success validated directly on the MT4/MT5 platforms.
              </p>
            </div>
            
            {/* WhatsApp Received Message Bubbles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
               {members.map((member, idx) => {
                 const nameColor = PARTICIPANT_COLORS[idx % PARTICIPANT_COLORS.length];
                 const countryFlag = getFlagEmoji(member.location || member.region || "");
                 return (
                    <motion.div 
                      key={member.id || idx}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex flex-col items-start gap-1 relative group w-full"
                    >
                      {/* WhatsApp Speech Bubble */}
                      <div className="bg-[#1f2c34] text-white p-3.5 rounded-2xl rounded-tl-none border border-white/5 shadow-lg relative w-full flex flex-col gap-1 transition-all group-hover:border-emerald-500/30">
                        {/* Received Message Bubble Tail */}
                        <div className="absolute top-0 left-[-6px] w-0 h-0 border-t-[8px] border-t-[#1f2c34] border-l-[8px] border-l-transparent" />
                        
                        {/* WhatsApp Sender Name & Location */}
                        <div className="flex justify-between items-center gap-2 border-b border-white/[0.04] pb-1">
                          <span className={`text-[10px] font-black tracking-wide ${nameColor}`}>
                            {member.name}
                          </span>
                          <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest flex items-center gap-1">
                            {member.location} {countryFlag}
                          </span>
                        </div>

                        {/* Speech Bubble Feedback Text */}
                        <p className="text-xs text-white/90 leading-relaxed font-medium font-sans py-1">
                          "{member.feedback || member.text}"
                        </p>

                        {/* Timestamp and Blue Delivered ticks */}
                        <div className="flex items-center gap-1 justify-end mt-1 text-[8px] font-bold text-white/20 select-none">
                          <span>Yesterday, {10 + (idx % 2)}:{(20 + idx * 4) % 60} PM</span>
                          <CheckCheck className="w-3 h-3 text-[#53bdeb]" />
                        </div>
                      </div>
                    </motion.div>
                 );
               })}
            </div>
          </div>

          {/* Right Column: Live Rendered Interactive WhatsApp Mockup (Takes 5 Cols on desktop) */}
          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 bg-emerald-500/5 blur-[100px] rounded-full opacity-35" aria-hidden="true" />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative rounded-[2.5rem] overflow-hidden border border-white/10 bg-[#0b141a] shadow-2xl flex flex-col h-[520px] max-w-sm mx-auto"
            >
              {/* WhatsApp Header */}
              <div className="bg-[#202c33] p-4 border-b border-white/5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black tracking-wider text-sm shadow-inner shadow-black relative">
                    IFX
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#202c33] rounded-full" />
                  </div>
                  <div>
                    <h3 className="text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                      IFX Quant Desk
                      <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                    </h3>
                    <p className="text-[8px] font-bold text-emerald-400 tracking-widest uppercase">Active Members: 1,420</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-white/40">
                  <Smartphone className="w-4 h-4" />
                  <MessageSquare className="w-4 h-4" />
                </div>
              </div>

              {/* Chat Thread Body (Styled exactly like WhatsApp Dark Wallpaper) */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 relative bg-[#0b141a] select-none" style={{ backgroundImage: 'radial-gradient(#1c2c36 1px, transparent 1px)', backgroundSize: '16px 16px' }}>
                
                {/* System Notice */}
                <div className="flex justify-center my-2">
                  <div className="bg-[#182229] border border-white/5 rounded-lg px-3 py-1.5 text-[8px] font-black uppercase tracking-widest text-[#8696a0]">
                    🛡️ ENCRYPTED CLIENT TELEMETRY NODE
                  </div>
                </div>

                {/* Sent message (CEO/デスク側 - Green Bubble) */}
                <div className="flex flex-col items-end gap-1 w-full pl-8 animate-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-[#005c4b] text-white p-3 rounded-2xl rounded-tr-none border border-emerald-500/20 shadow-md relative max-w-[85%] text-left">
                    {/* Speech Tail */}
                    <div className="absolute top-0 right-[-6px] w-0 h-0 border-t-[8px] border-t-[#005c4b] border-r-[8px] border-r-transparent" />
                    <p className="text-[11px] text-white/95 leading-relaxed font-sans font-medium">
                      All MT5 binaries compiled for this week. Execution latencies optimized to &lt;1.2ms. Please test and report results.
                    </p>
                    <div className="flex items-center gap-1 justify-end mt-1 text-[7px] text-white/40 font-bold font-mono">
                      <span>10:14 AM</span>
                      <CheckCheck className="w-3 h-3 text-[#53bdeb]" />
                    </div>
                  </div>
                </div>

                {/* Received message 1 (UAE Client - Dark Grey Bubble) */}
                <div className="flex flex-col items-start gap-1 w-full pr-8 animate-in slide-in-from-bottom-3 duration-500">
                  <div className="bg-[#202c33] text-white p-3 rounded-2xl rounded-tl-none border border-white/5 shadow-md relative max-w-[85%] text-left">
                    <div className="absolute top-0 left-[-6px] w-0 h-0 border-t-[8px] border-t-[#202c33] border-l-[8px] border-l-transparent" />
                    
                    <div className="flex justify-between items-center gap-2 pb-0.5 border-b border-white/[0.04]">
                      <span className="text-[9px] font-black tracking-wide text-cyan-400">Tareq K.</span>
                      <span className="text-[7px] font-bold text-white/30 tracking-widest">DUBAI 🇦🇪</span>
                    </div>
                    
                    <p className="text-[11px] text-white/90 leading-relaxed font-sans font-medium">
                      Confirming latencies in Dubai! Apex Alpha V4 is executing gold trades flawlessly on MT5. Zero slippage detected today. Excellent! 🚀
                    </p>
                    <div className="flex items-center gap-1 justify-end mt-1 text-[7px] text-white/30 font-bold font-mono">
                      <span>10:16 AM</span>
                    </div>
                  </div>
                </div>

                {/* Received message 2 (Germany Client) */}
                <div className="flex flex-col items-start gap-1 w-full pr-8 animate-in slide-in-from-bottom-4 duration-700">
                  <div className="bg-[#202c33] text-white p-3 rounded-2xl rounded-tl-none border border-white/5 shadow-md relative max-w-[85%] text-left">
                    <div className="absolute top-0 left-[-6px] w-0 h-0 border-t-[8px] border-t-[#202c33] border-l-[8px] border-l-transparent" />
                    
                    <div className="flex justify-between items-center gap-2 pb-0.5 border-b border-white/[0.04]">
                      <span className="text-[9px] font-black tracking-wide text-amber-400">Christian W.</span>
                      <span className="text-[7px] font-bold text-white/30 tracking-widest">FRANKFURT 🇩🇪</span>
                    </div>
                    
                    <p className="text-[11px] text-white/90 leading-relaxed font-sans font-medium">
                      Macro Systematic Desk just triggered EURUSD short. Execution completed under 1ms. Capital allocations syncing nicely. Best quant software we have tested.
                    </p>
                    <div className="flex items-center gap-1 justify-end mt-1 text-[7px] text-white/30 font-bold font-mono">
                      <span>10:22 AM</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Chat Input Mock (Footer) */}
              <div className="bg-[#202c33] p-3 border-t border-white/5 flex items-center gap-2 shrink-0 select-none">
                <div className="flex-1 bg-[#2a3942] rounded-xl px-4 py-2 text-[10px] text-white/30 uppercase tracking-widest font-black flex items-center justify-between">
                  Secure Message...
                  <Send className="w-3.5 h-3.5 text-white/20" />
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
