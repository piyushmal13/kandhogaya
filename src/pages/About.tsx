import React from 'react';
import { motion } from 'motion/react';
import { Shield, Zap, Globe, Target, BarChart3, Users, Network, Lock, Cpu } from 'lucide-react';
import { PageMeta } from '../components/site/PageMeta';

const DataNode = ({ label, value, trend }: any) => (
  <div className="relative overflow-hidden p-6 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-xl group hover:border-[#58F2B6]/30 transition-all duration-500">
    <div className="absolute inset-0 bg-gradient-to-br from-[#58F2B6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#58F2B6] mb-2">{label}</div>
    <div className="text-3xl font-black text-white font-mono tracking-tighter mb-2">{value}</div>
    <div className="text-[9px] font-bold uppercase tracking-widest text-white/30 border-l border-white/10 pl-2">
      {trend}
    </div>
  </div>
);

const HexagonGrid = () => (
  <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='103.923' viewBox='0 0 60 103.923' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M30 103.923L0 86.603V51.962L30 34.641l30 17.321v34.641L30 103.923zM30 69.282l20-11.547V34.641L30 23.094 10 34.641v23.094L30 69.282z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
);

export const About = () => {
  return (
    <div className="min-h-screen bg-[#010203] text-white selection:bg-[#58F2B6]/30 font-sans overflow-hidden">
      <PageMeta 
        title="Institutional Intelligence & Corporate Overview | IFX TRADES"
        description="Discover the IFX TRADES mandate: Architecting sovereign data ecosystems, high-fidelity algorithmic execution pipelines, and uncompromised alpha extraction for global capital operators."
        path="/about"
        keywords={["institutional algorithmic firm", "quantitative engineering", "execution pipelines", "sovereign intelligence", "forex infrastructure", "institutional asset management", "algorithmic trading terminal"]}
      />
      
      {/* Hero: Sovereign Engineering */}
      <section className="relative pt-24 md:pt-44 pb-16 md:pb-32 px-4 md:px-6 border-b border-white/[0.02]">
        <HexagonGrid />
        <div className="absolute top-0 right-0 w-[300px] md:w-[800px] h-[300px] md:h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)] blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded bg-[#58F2B6]/10 border border-[#58F2B6]/20 text-[#58F2B6] text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] mb-6 md:mb-8">
                <Network className="w-4 h-4" /> Global Execution Infrastructure
              </div>
              <h1 className="text-[clamp(2.5rem,8vw,7rem)] font-black tracking-tighter leading-[0.85] uppercase mb-6 md:mb-8 italic">
                Corporate <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Sovereignty.</span>
              </h1>
              <p className="text-white/40 text-base md:text-xl font-light leading-relaxed max-w-xl mb-8 md:mb-10">
                IFX TRADES is the premier institutional algorithmic engineering firm. We architect sovereign data ecosystems and zero-latency execution pipelines for elite global capital operators. Elevate your portfolio risk governance today.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                 <button className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black text-[10px] md:text-[11px] font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                    Deploy Capital Protocol
                 </button>
                 <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] md:text-[11px] font-black uppercase tracking-widest rounded-xl transition-all">
                    Access Research Desk
                 </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10 lg:mt-0"
            >
              <DataNode label="Execution Latency" value="< 0.1ms" trend="Direct Fiber Cross-Connect" />
              <DataNode label="Infrastructure Uptime" value="99.999%" trend="Multi-Region Active Replication" />
              <DataNode label="Data Processing" value="4.2B/day" trend="Tick-Level FIX Order Books" />
              <DataNode label="AUM Governed" value="Institutional" trend="Strictly Tier-1 Providers Only" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Infrastructure Protocol */}
      <section className="py-16 md:py-32 relative bg-black overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
        
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 md:gap-10 mb-12 md:mb-20">
            <div>
              <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tighter italic">
                Infrastructure <br /><span className="text-[#58F2B6]">Protocol.</span>
              </h2>
            </div>
            <p className="text-white/40 text-[10px] md:text-base max-w-sm border-l border-[#58F2B6]/30 pl-4 md:pl-6 uppercase tracking-widest font-black leading-relaxed">
              We do not predict the market. We extract inefficiencies mathematically using pure compute power.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Cpu, title: "Hardware Advantage", desc: "Co-located servers in primary financial hubs to eliminate latency drag." },
              { icon: Lock, title: "Algorithmic Sovereignty", desc: "Proprietary C++ bridging protocols that maintain high-fidelity isolation from non-sovereign intermediaries." },
              { icon: Zap, title: "Dark Pool Routing", desc: "Advanced liquidity mapping to ensure minimum slippage on block executions." }
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 md:p-10 rounded-2xl md:rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
              >
                <f.icon className="w-8 h-8 md:w-10 md:h-10 text-[#58F2B6] mb-6 md:mb-8" />
                <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-white mb-3 md:mb-4">{f.title}</h3>
                <p className="text-white/40 text-sm md:text-base font-light leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Enclave */}
      <section className="py-16 md:py-32 px-4 md:px-6 border-t border-white/[0.02] bg-[#010203]">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10 text-white/40 text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] mb-6 md:mb-8">
            <Users className="w-3 h-3" /> Exclusive Corporate Syndicate
          </div>
          <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-black uppercase tracking-tighter leading-[0.9] mb-8 md:mb-10 italic">
            The Quantitative <span className="text-[#58F2B6]">Enclave</span>
          </h2>
          <div className="relative p-8 md:p-20 rounded-[2rem] md:rounded-[3rem] bg-gradient-to-b from-white/[0.02] to-transparent border border-white/5 backdrop-blur-xl mb-12 md:mb-16">
            <p className="text-lg md:text-3xl font-light text-white/70 leading-relaxed mb-8 md:mb-12 italic">
              "We architected IFX TRADES to be the definitive execution layer for modern asset managers. Eliminating non-sovereign inefficiencies and emotional interference through rigorous mathematical extraction. Performance is not a goal; it is a mathematical certainty."
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="w-10 md:w-16 h-px bg-[#58F2B6]/50" />
              <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em] text-[#58F2B6]">IFX Engineering Council</p>
              <div className="w-10 md:w-16 h-px bg-[#58F2B6]/50" />
            </div>
          </div>
          
          {/* Final Call to Action Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
             <div className="p-6 md:p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-left hover:bg-emerald-500/15 transition-all">
                <h3 className="text-lg font-black uppercase text-emerald-400 mb-2">Initiate Corporate Account</h3>
                <p className="text-sm text-white/60 mb-6 font-medium">Onboard your firm's capital with our zero-latency execution bridge. Seamless FIX API and MT5 Manager API integration.</p>
                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-white transition-colors">
                   Request Onboarding <Target className="w-3 h-3" />
                </button>
             </div>
             <div className="p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10 text-left hover:bg-white/10 transition-all">
                <h3 className="text-lg font-black uppercase text-white mb-2">Access Algorithmic Catalog</h3>
                <p className="text-sm text-white/60 mb-6 font-medium">License our proprietary quantitative models. Proven track records, rigorously backtested against 15 years of tick data.</p>
                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white hover:text-emerald-400 transition-colors">
                   View Performance Matrix <BarChart3 className="w-3 h-3" />
                </button>
             </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
