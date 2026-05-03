import React from 'react';
import { motion } from 'motion/react';
import { Shield, Zap, Globe, Target, BarChart3, Users } from 'lucide-react';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';

const StatCard = ({ label, value, sub }: { label: string; value: string; sub: string }) => (
  <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-md">
    <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">{label}</p>
    <h3 className="text-4xl font-black text-white tracking-tighter mb-1">{value}</h3>
    <p className="text-white/40 text-xs font-medium uppercase tracking-widest">{sub}</p>
  </div>
);

const FeatureSection = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="group p-10 rounded-[3rem] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 hover:border-emerald-500/20 transition-all duration-500">
    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
      <Icon size={28} />
    </div>
    <h3 className="text-2xl font-black text-white mb-4 tracking-tight uppercase">{title}</h3>
    <p className="text-white/50 leading-relaxed font-medium">
      {description}
    </p>
  </div>
);

export const About = () => {
  return (
    <div className="min-h-screen bg-[#010203] text-white selection:bg-emerald-500 selection:text-black">
      <Navbar />
      
      {/* ── HERO SECTION ── */}
      <section className="relative pt-44 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-md mb-10"
          >
            <Shield size={14} className="text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400">Institutional Heritage</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-9xl font-black tracking-[-0.04em] leading-[0.9] uppercase mb-12"
          >
            The New Standard in <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Quant Intelligence.</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto text-white/60 text-lg md:text-xl font-medium leading-relaxed mb-20"
          >
            IFX Trades was founded on a single premise: that institutional-grade execution intelligence should not be a walled garden. We provide the technical bridge between retail ambition and professional algorithmic reality.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <StatCard label="Model Velocity" value="Optimized" sub="Compute Precision" />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <StatCard label="Quant Volume" value="$2.4B+" sub="Processed Monthly" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <StatCard label="Active Licenses" value="12,000+" sub="Global Enclave" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── MISSION SECTION ── */}
      <section className="py-32 px-6 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight uppercase mb-8 leading-[1.1]">
                Why Institutions Choose <br />
                <span className="text-emerald-500">IFX Intelligence.</span>
              </h2>
              <p className="text-white/50 text-lg leading-relaxed mb-10 font-medium">
                Traditional retail trading is built on hype and lagged indicators. IFX Intelligence operates at the structural level of the market. We don't just teach trading; we deploy high-frequency quantitative frameworks that have been hardened in the most volatile environments.
              </p>
              
              <div className="space-y-6">
                {[
                  "Direct-to-Bank Order Flow Analysis",
                  "RSA-Secured Algorithmic Licenses",
                  "Institutional Education Infrastructure",
                  "Zero Conflict-of-Interest Model"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 group">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                      <Target size={12} />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-widest text-white/80">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FeatureSection 
                icon={Zap} 
                title="Institutional Tech" 
                description="Our algorithms are built on private C++ and Python stacks, bypassing standard retail limitations for true institutional edge."
              />
              <FeatureSection 
                icon={Globe} 
                title="Global Reach" 
                description="Operating from India to the UAE, we provide the infrastructure for a borderless quant economy."
              />
              <FeatureSection 
                icon={BarChart3} 
                title="Data Rigor" 
                description="Every signal is backtested across 10 years of tick data and forward-tested in live shadow mode before deployment."
              />
              <FeatureSection 
                icon={Users} 
                title="The Enclave" 
                description="Join a private ecosystem of the top 1% of traders who prioritize logic over luck and math over emotion."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── THE FOUNDERS / VISION ── */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-8">The IFX Manifesto</h2>
          <div className="relative p-12 md:p-20 rounded-[4rem] bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5">
            <p className="text-xl md:text-3xl font-serif italic text-white/80 leading-relaxed mb-12">
              "In an era of information noise, the only true signal is math. We built IFX Trades to be the signal for those who are tired of the noise. No fluff, no gurus—just cold, hard execution."
            </p>
            <div className="w-16 h-1 bg-emerald-500 mx-auto mb-6" />
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500">The IFX Quantitative Council</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

