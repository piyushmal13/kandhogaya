import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { PageMeta } from "@/components/site/PageMeta";
import { 
  Brain, 
  Cpu, 
  Activity, 
  ShieldAlert, 
  Zap, 
  Database, 
  LineChart, 
  Layers, 
  ChevronRight,
  Target,
  RefreshCcw,
  Workflow
} from 'lucide-react';

const IntelligenceLayer = ({ number, title, description, inputs, outputs, icon: Icon, delay = 0 }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className="relative p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] hover:border-emerald-500/20 transition-all group overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
        <Icon size={120} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Icon size={24} />
          </div>
          <div>
            <span className="text-[10px] font-black tracking-[0.3em] text-emerald-500/60 uppercase">Layer {number}</span>
            <h3 className="text-2xl font-bold text-white tracking-tight">{title}</h3>
          </div>
        </div>
        
        <p className="text-white/40 leading-relaxed mb-8 max-w-md">
          {description}
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#58F2B6]/80">
              Elite Execution Environment <span className="text-white/20 ml-2">v2.0_ELITE</span>
            </span>
            <ul className="space-y-2">
              {inputs.map((input: string) => (
                <li key={input} className="text-sm text-white/60 flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-emerald-500/40" />
                  {input}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="block text-[10px] font-black tracking-[0.2em] text-white/20 uppercase mb-3">Intelligence Output</span>
            <div className="inline-flex px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wider">
              {outputs}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ArchitectureNode = ({ title, icon: Icon, subtext, active = false }: any) => (
  <div className={`relative flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all duration-500 ${
    active ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-white/[0.02] border-white/[0.05] text-white/30'
  }`}>
    <Icon size={20} />
    <div className="text-center">
      <div className={`text-[10px] font-black tracking-widest uppercase mb-0.5 ${active ? 'text-emerald-400' : 'text-white/60'}`}>
        {title}
      </div>
      {subtext && <div className="text-[8px] opacity-40 font-medium">{subtext}</div>}
    </div>
  </div>
);

export const QuantX = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#010203] text-white selection:bg-emerald-500/30">
      <PageMeta 
        title="QuantX Ecosystem | Institutional Intelligence Trading System"
        description="Explore the multi-layer architecture behind QuantX. From market regime detection to autonomous execution and recursive feedback loops."
      />

      {/* Hero Section */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden border-b border-white/[0.05] pt-32 pb-24">
        <motion.div 
          style={{ y: backgroundY }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.08),transparent_70%)]" />
          <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.png')]" />
        </motion.div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.4em] mb-8">
              <Brain className="w-3.5 h-3.5" />
              Intelligence Protocol
            </div>
            <h1 className="text-[clamp(3.5rem,10vw,8rem)] md:text-[9rem] lg:text-[12rem] font-black tracking-tighter mb-8 leading-[0.85] uppercase">
              QUANT<span className="text-emerald-400 italic">X</span>
            </h1>
            <p className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Not a bot. A multi-layer cognitive ecosystem designed for institutional-grade gold execution.
            </p>
          </motion.div>
        </div>

        <motion.div 
          style={{ opacity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <div className="text-[10px] font-black tracking-[0.3em] text-white/20 uppercase">Initialize Core</div>
          <div className="w-px h-12 bg-gradient-to-b from-emerald-500/50 to-transparent" />
        </motion.div>
      </section>

      {/* Core Architecture Flow */}
      <section className="py-32 border-b border-white/[0.05]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight italic uppercase">Institutional Infrastructure</h2>
            <p className="text-white/40 text-lg">A seamless data-to-execution pipeline engineered for precision and reliability.</p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Visual Flow Lines */}
            <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent -translate-y-1/2 hidden lg:block" />
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 relative z-10">
              <ArchitectureNode title="Market Data" icon={Database} subtext="L-Feed" active />
              <ArchitectureNode title="Core Analyzer" icon={Brain} subtext="Engine-v8" active />
              <ArchitectureNode title="Risk Engine" icon={ShieldAlert} subtext="Strict-Mode" active />
              <ArchitectureNode title="Execution Model" icon={Zap} subtext="Demo Environment" active />
              <ArchitectureNode title="Optimization" icon={RefreshCcw} subtext="Auto-Recal" active />
            </div>
          </div>
        </div>
      </section>

      {/* Intelligence Layers */}
      <section className="py-32 bg-white/[0.01]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-24">
            <div className="max-w-2xl">
              <div className="text-emerald-500 text-[10px] font-black tracking-[0.4em] uppercase mb-4">Institutional Framework</div>
              <h2 className="text-[clamp(2.5rem,6vw,5rem)] md:text-7xl font-bold tracking-tighter leading-[0.9] italic uppercase">Core Analysis <br className="hidden md:block" />Layers</h2>
            </div>
            <p className="text-white/30 text-lg max-w-sm leading-relaxed pb-2">
              Processing thousands of data points across five specialized intelligence vectors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <IntelligenceLayer 
              number="1"
              title="Regime Classification"
              description="Real-time market environment analysis. Identifies if the current structure is trending, ranging, or exhibiting institutional manipulation."
              inputs={["Volatility (ATR)", "Price Action", "Liquidity Zones"]}
              outputs="MARKET REGIME"
              icon={Activity}
              delay={0}
            />
            <IntelligenceLayer 
              number="2"
              title="Framework Selection"
              description="Dynamically activates the most robust execution engine based on the current market environment output."
              inputs={["Trend Engine", "Mean Reversion", "SMC Engine"]}
              outputs="ACTIVE STRATEGY"
              icon={Layers}
              delay={0.1}
            />
            <IntelligenceLayer 
              number="3"
              title="Probability Scoring"
              description="Each trade setup is assigned a quantitative score. Only high-confidence setups exceed the 70/100 threshold."
              inputs={["Structure", "Volatility", "Confirmations"]}
              outputs="CONFIDENCE SCORE"
              icon={Target}
              delay={0.2}
            />
            <IntelligenceLayer 
              number="4"
              title="Risk Intelligence"
              description="Dynamic lot sizing and capital preservation algorithms. Adjusts exposure based on winning/losing streaks."
              inputs={["Balance", "Equity Curve", "Drawdown"]}
              outputs="LOT SIZE / STOP"
              icon={ShieldAlert}
              delay={0.3}
            />
            <div className="md:col-span-2">
              <IntelligenceLayer 
                number="5"
                title="Trade Management"
                description="The precision profit-capture layer. Automates break-even moves, partial closes, and advanced trailing stops."
                inputs={["MFE Tracking", "Liquidity Gaps", "Time In Trade"]}
                outputs="DYNAMIC EXIT"
                icon={Workflow}
                delay={0.4}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Execution Infrastructure */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/[0.03] rounded-full blur-[120px] pointer-events-none" />
        
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-bold mb-12 tracking-tight">Institutional Execution.</h2>
              
              <div className="space-y-12">
                <div className="flex gap-6">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60">
                    <Zap size={20} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-3">MT5 Core Bridge</h4>
                    <p className="text-white/40 leading-relaxed">High-performance data pipeline ensuring strategy signals occur within milliseconds of AI confirmation in the demo environment.</p>
                  </div>
                </div>
                
                <div className="flex gap-6">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60">
                    <Database size={20} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-3">Hybrid Infrastructure</h4>
                    <p className="text-white/40 leading-relaxed">Dedicated VPS infrastructure with 24/7 uptime monitoring and automated failover systems.</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60">
                    <LineChart size={20} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-3">Continuous Performance Review</h4>
                    <p className="text-white/40 leading-relaxed">Every execution is recorded and audited. The desk automatically recalibrates strategy thresholds based on 30-day rolling performance data.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-white/[0.05] to-transparent border border-white/[0.05] p-12 overflow-hidden group">
                <div className="absolute inset-0 bg-emerald-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                {/* Visual Representation of the "Loop" */}
                <div className="relative h-full flex flex-col justify-center items-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border border-emerald-500/10 rounded-full border-dashed"
                  />
                  <div className="text-center relative z-10">
                    <div className="w-24 h-24 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-6 shadow-[0_0_50px_-12px_rgba(16,185,129,0.5)]">
                      <Cpu size={40} />
                    </div>
                    <div className="text-[10px] font-black tracking-[0.5em] text-emerald-500 uppercase mb-2">Execution Processor</div>
                    <div className="text-2xl font-bold">DESK ACTIVE</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 md:py-40 bg-emerald-600/[0.02] border-t border-white/[0.05]">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-[clamp(2.5rem,6vw,5rem)] md:text-7xl font-black mb-12 tracking-tight italic uppercase leading-[0.9]">
            Elite Alpha. <br />
            <span className="text-emerald-400">Zero Guesswork.</span>
          </h2>
          <button className="btn-primary px-10 py-5 text-sm">
            ACCESS QUANTX SYSTEM <ChevronRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default QuantX;
