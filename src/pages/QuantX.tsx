import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useAnimation } from 'motion/react';
import { PageMeta } from "@/components/site/PageMeta";
import { 
  Brain, Cpu, Activity, ShieldAlert, Zap, 
  Database, LineChart, Layers, ChevronRight,
  Target, RefreshCcw, Workflow, Lock, Terminal
} from 'lucide-react';

const NeuralNode = ({ x, y, delay, color }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: [0, 1, 0.5, 1], scale: 1 }}
    transition={{ duration: 3, delay, repeat: Infinity, repeatType: 'reverse' }}
    className={`absolute w-2 h-2 rounded-full ${color}`}
    style={{ left: `${x}%`, top: `${y}%` }}
  >
    <div className={`absolute inset-0 rounded-full blur-md ${color} opacity-50`} />
  </motion.div>
);

const QuantumState = ({ title, value, status }: any) => (
  <div className="p-4 bg-black/40 border border-emerald-500/10 rounded-2xl backdrop-blur-xl">
    <div className="text-[9px] font-black tracking-widest text-emerald-500/50 uppercase mb-2">{title}</div>
    <div className="text-xl font-black text-white font-mono tracking-tighter">{value}</div>
    <div className={`text-[8px] font-bold tracking-widest uppercase mt-2 ${status === 'optimal' ? 'text-emerald-400' : 'text-cyan-400'}`}>
      STATUS: {status}
    </div>
  </div>
);

export const QuantX = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#000] text-white selection:bg-emerald-500/30 font-sans overflow-hidden">
      <PageMeta 
        title="QuantX Ecosystem | Autonomous Neural Execution"
        description="Experience the QuantX AI. A multi-layer cognitive ecosystem designed for institutional-grade gold execution."
      />

      {/* Hero Section - The AI Core */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden border-b border-white/[0.02]">
        <motion.div style={{ y }} className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
            {/* Pulsing Core */}
            <motion.div 
              animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border border-emerald-500/10 border-dashed"
            />
            <motion.div 
              animate={{ scale: [1.1, 1, 1.1], rotate: [360, 180, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-10 rounded-full border border-cyan-500/10 border-dotted"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_50%)] blur-2xl" />
          </div>
          
          {/* Neural Nodes */}
          {Array.from({ length: 20 }).map((_, i) => (
            <NeuralNode 
              key={i} 
              x={Math.random() * 100} 
              y={Math.random() * 100} 
              delay={Math.random() * 2}
              color={i % 2 === 0 ? 'bg-emerald-500' : 'bg-cyan-500'}
            />
          ))}
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.04] mix-blend-overlay" />
        </motion.div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.4em] mb-8 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Neural Protocol Active
                </div>
                <h1 className="text-[clamp(4rem,10vw,10rem)] font-black tracking-tighter leading-[0.85] uppercase mb-8">
                  QUANT<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500 italic">X</span>
                </h1>
                <p className="text-white/40 text-lg md:text-2xl max-w-2xl leading-relaxed mb-10 font-light">
                  A sovereign artificial intelligence engine engineered for zero-latency institutional market extraction.
                </p>
                <div className="flex flex-wrap gap-6">
                  <button className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] flex items-center gap-2">
                    Initialize Terminal <ChevronRight className="w-4 h-4" />
                  </button>
                  <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white text-xs font-black uppercase tracking-widest rounded-xl border border-white/10 transition-all flex items-center gap-2">
                    <Terminal className="w-4 h-4" /> View Architecture
                  </button>
                </div>
              </motion.div>
            </div>
            
            <div className="lg:col-span-5 relative hidden lg:block">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="grid grid-cols-2 gap-4"
              >
                <QuantumState title="Machine Learning" value="Deep-Q Net" status="optimal" />
                <QuantumState title="Tick Processing" value="1.2M/sec" status="active" />
                <QuantumState title="Win Probability" value="84.2%" status="optimal" />
                <QuantumState title="Risk Protocol" value="Hardened" status="active" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* The Core Engine Flow */}
      <section className="py-32 relative bg-[#020304] border-t border-white/[0.02]">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center mb-24">
            <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-black tracking-tighter uppercase italic leading-[0.9] mb-6">
              Autonomous <br /><span className="text-emerald-500">Cognition</span>
            </h2>
            <p className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto">
              QuantX does not guess. It computes. Operating on massive datasets, identifying anomalies that human analysts cannot perceive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Brain, title: "Pattern Recognition", desc: "Real-time analysis of Level II liquidity and dark pool order flow." },
              { icon: Zap, title: "HFT Execution Bridge", desc: "Orders dispatched directly to Tier-1 liquidity providers via custom FIX API." },
              { icon: ShieldAlert, title: "Dynamic Risk Shield", desc: "Recursive logic adjusts exposure dynamically based on live market volatility." }
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="p-10 rounded-[2.5rem] bg-gradient-to-b from-white/[0.03] to-transparent border border-white/[0.05] relative group"
              >
                <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem] blur-xl" />
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-8 group-hover:scale-110 transition-transform">
                  <f.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-4">{f.title}</h3>
                <p className="text-white/40 leading-relaxed font-light">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Real-time Data Visualization Placeholder */}
      <section className="py-32 relative overflow-hidden bg-black border-t border-white/[0.02]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.05),transparent_60%)]" />
        <div className="container mx-auto px-6 relative z-10">
           <div className="p-12 md:p-24 rounded-[3rem] bg-white/[0.01] border border-white/[0.05] backdrop-blur-3xl text-center">
             <Cpu className="w-20 h-20 text-emerald-500 mx-auto mb-8 opacity-50" />
             <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6">
               Ready for Deployment
             </h2>
             <p className="text-white/40 text-lg max-w-xl mx-auto mb-10">
               Integrate the QuantX cognitive engine directly into your institutional execution environment today.
             </p>
             <button className="px-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest text-sm rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.3)] transition-all">
               Deploy Framework
             </button>
           </div>
        </div>
      </section>

    </div>
  );
};

export default QuantX;
