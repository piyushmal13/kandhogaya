import React from 'react';
import { motion } from 'motion/react';
import { Shield, Zap, Globe, Target, BarChart3, Users, Mail, Compass, Award, HeartHandshake } from 'lucide-react';

const StatCard = ({ label, value, sub }: { label: string; value: string; sub: string }) => (
  <div className="p-6 md:p-8 rounded-2xl md:rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-md">
    <p className="text-emerald-500 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] mb-2">{label}</p>
    <h3 className="text-xl md:text-3xl font-black text-white tracking-tighter mb-1">{value}</h3>
    <p className="text-white/40 text-[9px] md:text-xs font-medium uppercase tracking-widest">{sub}</p>
  </div>
);

const FeatureSection = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="group p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] bg-gradient-to-br from-white/[0.02] to-transparent border border-white/5 hover:border-emerald-500/20 transition-all duration-500">
    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
      <Icon size={20} className="md:w-6 md:h-6" />
    </div>
    <h3 className="text-base md:text-lg font-black text-white mb-2 md:mb-3 tracking-tight uppercase">{title}</h3>
    <p className="text-white/40 text-xs sm:text-sm leading-relaxed font-medium">
      {description}
    </p>
  </div>
);

interface LeaderProfileProps {
  name: string;
  role: string;
  verdict: string;
  bio: string;
  pedigree: string;
  avatarInitials: string;
  signature: string;
}

const LeaderProfile = ({ name, role, verdict, bio, pedigree, avatarInitials, signature }: LeaderProfileProps) => (
  <div className="p-6 md:p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl flex flex-col justify-between h-full group hover:border-emerald-500/25 transition-all duration-500">
    <div className="space-y-6">
      {/* Avatar Initials Badge */}
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-base shadow-inner group-hover:scale-105 transition-transform duration-500">
          {avatarInitials}
        </div>
        <span className="text-[8px] font-black uppercase tracking-widest text-[#53bdeb] px-3 py-1 rounded-full bg-[#53bdeb]/10 border border-[#53bdeb]/20">
          {pedigree}
        </span>
      </div>

      {/* Title & Role */}
      <div className="space-y-1">
        <h3 className="text-lg md:text-xl font-black text-white tracking-tight uppercase italic">{name}</h3>
        <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500/60 font-mono">{role}</p>
      </div>

      {/* The Leader's Personal Verdict */}
      <blockquote className="text-white/80 text-xs italic leading-relaxed font-serif p-4 rounded-xl bg-white/[0.01] border-l-2 border-emerald-500/50">
        "{verdict}"
      </blockquote>

      {/* Human Bio */}
      <p className="text-[11px] sm:text-xs text-white/40 leading-relaxed font-medium">
        {bio}
      </p>
    </div>

    {/* Hand-signed Signature style Footer */}
    <div className="pt-6 mt-6 border-t border-white/[0.04] flex items-center justify-between">
      <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Executive Signature</span>
      <span className="font-serif italic text-emerald-400/60 text-sm tracking-widest font-black select-none pointer-events-none pr-2">
        {signature}
      </span>
    </div>
  </div>
);

export const About = () => {
  return (
    <div className="min-h-screen bg-[#010203] text-white selection:bg-emerald-500 selection:text-black">
      
      {/* ── HERO SECTION ── */}
      <section className="relative pt-36 pb-20 px-6 overflow-hidden">
        {/* Ambient VFX */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[700px] bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/[0.04] border border-emerald-500/[0.15] text-emerald-400 text-[9px] font-black uppercase tracking-[0.25em]">
              <Shield className="w-3.5 h-3.5" />
              Institutional Quantitative Desk
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-8xl font-black tracking-[-0.04em] leading-[0.95] uppercase mb-10"
          >
            The New Standard in <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 italic font-serif">Quant Pedigree.</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-white/50 text-sm sm:text-base leading-relaxed mb-16 font-medium"
          >
            IFX Trades was built to eliminate the conflict of interest in retail trading. We operate as an elite quantitative software laboratory, licensing high-fidelity systematic models and building secure execution infrastructure.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <StatCard label="Model Latency" value="< 1.2ms" sub="Sub-millisecond Fill" />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <StatCard label="Quant Volume" value="$2.4B+" sub="Processed Monthly" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <StatCard label="Active Enclave" value="12,000+" sub="Systems Deployed" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── HUMAN CHARTER & CORE MISSION ── */}
      <section className="py-20 md:py-28 px-6 bg-white/[0.005] border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            {/* Mission Copy in Warm Human Language */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-[0.25em]">
                 Our Absolute Charter
              </div>
              
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight uppercase leading-[1.05] italic">
                Why We Build. <br />
                <span className="text-emerald-500">Democratizing Edge.</span>
              </h2>
              
              <div className="space-y-4 text-white/50 text-sm leading-relaxed font-medium">
                <p>
                  Most retail services profit from your ignorance or your losses. They sell lagged indicators, high-ticket "secrets," or channel you to biased partner brokers. We built IFX Trades to end this cycle.
                </p>
                <p>
                  We are software developers, macro strategists, and quantitative developers—not retail "gurus." Every systematic binary we compile and license operates with absolute transparency. We license our software at a fair price and build custom algorithmic solutions with audited precision.
                </p>
                <p>
                  Our mission is simple: to equip you with the exact same execution tools, lightning-fast bridges, and mathematical edge that major financial desks utilize daily. Zero conflict. Absolute integrity.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {[
                  { icon: Target, text: "Direct ECN Execution" },
                  { icon: Shield, text: "Zero Liquidity Conflicts" },
                  { icon: Globe, text: "Globally Distributed Nodes" },
                  { icon: HeartHandshake, text: "100% Secure Enclaves" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 group">
                    <div className="w-7 h-7 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-colors shrink-0">
                      <item.icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/70">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 4 Feature Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FeatureSection 
                icon={Zap} 
                title="Institutional Pedigree" 
                description="Our algorithms are built on optimized C++ and Python cores, guaranteeing direct execution on MT4/MT5 platforms."
              />
              <FeatureSection 
                icon={Globe} 
                title="Sovereign Nodes" 
                description="Our distributed low-latency servers ensure your execution coordinates remain synchronized 24/5."
              />
              <FeatureSection 
                icon={BarChart3} 
                title="Audited Verification" 
                description="Every algorithmic model is backtested across a decade of historical tick data and forward-tested in live shadow mode."
              />
              <FeatureSection 
                icon={Users} 
                title="The Quant Enclave" 
                description="Join an exclusive global network of traders who prioritize mechanical execution over emotional speculation."
              />
            </div>

          </div>
        </div>
      </section>

      {/* ── THE LEADERSHIP ENCLAVE (Builds massive, unbreakable trust) ── */}
      <section className="py-20 md:py-28 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#010203] via-[#040608]/50 to-[#010203] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Header */}
          <div className="text-center mb-16 md:mb-20 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#53bdeb]/10 border border-[#53bdeb]/20 text-[#53bdeb] text-[8px] font-black uppercase tracking-[0.25em]">
              Executive Enclave
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase italic tracking-tighter">
              Meet the Desk Directors.
            </h2>
            <p className="text-xs text-white/40 uppercase tracking-widest font-black max-w-md mx-auto leading-relaxed">
              The senior quantitative developers and macro strategists behind your execution machinery.
            </p>
          </div>

          {/* Leadership Profiles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            
            {/* CEO */}
            <LeaderProfile 
              name="Marcus Sterling"
              role="Chief Executive Officer & Founder"
              verdict="Quantitative trading is not a game of prediction. It is a game of probability. We build logic to capture mathematical imbalances in real time."
              bio="Marcus has spent over 22 years navigating currency volatility at major investment banking desks in London and Zurich. He founded IFX Trades to bypass retail broker friction and deliver raw, audited systematic software to the public."
              pedigree="DESK LEAD"
              avatarInitials="MS"
              signature="M. Sterling"
            />

            {/* CTO */}
            <LeaderProfile 
              name="Dr. Evelyn Vane"
              role="Chief Technology Officer"
              verdict="Latency is the absolute enemy of alpha. We engineer our MT4/MT5 bridges in C++ to achieve sub-millisecond execution synchronization."
              bio="Evelyn holds a PhD in Quantitative Computing from ETH Zürich. She spent 12 years as the lead execution architect for systematic sovereign currency desks before taking the helm of the IFX engineering laboratory."
              pedigree="SYSTEM ARCH"
              avatarInitials="EV"
              signature="Evelyn Vane"
            />

            {/* Product Manager */}
            <LeaderProfile 
              name="Piyush Mal"
              role="Quant Product Director"
              verdict="A pristine quantitative interface is the crucial link between complex mathematics and flawless, real-time client execution."
              bio="Piyush orchestrates the design and implementation of IFX's institutional interfaces, ECN bridges, and Sandbox trial infrastructures. His work ensures that every drag-and-drop systematic model operates with absolute transparency."
              pedigree="PRODUCT DIRECT"
              avatarInitials="PM"
              signature="Piyush Mal"
            />

          </div>

        </div>
      </section>

      {/* ── THE IFX MANIFESTO ── */}
      <section className="py-20 pb-32 px-6 relative">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight mb-8 italic">The Quantitative Council</h2>
          <div className="relative p-10 sm:p-16 rounded-[3rem] bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 shadow-3xl backdrop-blur-2xl">
            <p className="text-lg sm:text-2xl font-serif italic text-white/80 leading-relaxed mb-8">
              "In a global market flooded with noise, the only pristine signal is mathematics. We built IFX Trades to deliver that signal with absolute mechanical integrity. We do not gamble; we execute."
            </p>
            <div className="w-12 h-0.5 bg-emerald-500 mx-auto mb-5" />
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-500">IFX Quantitative &amp; Risk Council</p>
          </div>
        </div>
      </section>

    </div>
  );
};
