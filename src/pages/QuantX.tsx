import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PageMeta } from "@/components/site/PageMeta";
import { EliteButton } from "@/components/ui/Button";
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
  Workflow,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  HeartHandshake
} from 'lucide-react';

const IntelligenceLayer = ({ number, title, description, inputs, outputs, icon: Icon, delay = 0 }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className="relative p-6 sm:p-8 rounded-[1.75rem] sm:rounded-[2rem] bg-white/[0.01] border border-white/[0.05] hover:border-emerald-500/20 hover:bg-emerald-500/[0.01] transition-all group overflow-hidden shadow-2xl"
    >
      <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.06] transition-opacity">
        <Icon size={120} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Icon size={22} />
          </div>
          <div>
            <span className="text-[9px] font-black tracking-[0.3em] text-emerald-500/60 uppercase">Layer {number}</span>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{title}</h3>
          </div>
        </div>
        
        <p className="text-xs sm:text-sm text-white/40 leading-relaxed mb-6 sm:mb-8">
          {description}
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 border-t border-white/5 pt-6">
          <div>
            <span className="block text-[8px] sm:text-[9px] font-black uppercase tracking-[0.3em] text-[#58F2B6] mb-2 leading-none">
              Operational Ingestion
            </span>
            <ul className="space-y-1.5">
              {inputs.map((input: string) => (
                <li key={input} className="text-xs text-white/60 flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-emerald-500/40 shrink-0" />
                  {input}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="block text-[8px] sm:text-[9px] font-black tracking-[0.2em] text-white/20 uppercase mb-2 leading-none">System Output</span>
            <div className="inline-flex px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-wider">
              {outputs}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ArchitectureNode = ({ title, icon: Icon, subtext, active = false }: any) => (
  <div className={`relative flex flex-col items-center gap-3 p-6 rounded-3xl border transition-all duration-500 ${
    active ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_10px_35px_rgba(16,185,129,0.05)]' : 'bg-white/[0.01] border-white/[0.04] text-white/30'
  }`}>
    <Icon size={24} className={active ? 'text-emerald-400' : 'text-white/20'} />
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
    <div ref={containerRef} className="min-h-screen bg-[#010203] text-white selection:bg-emerald-500/30 font-sans">
      <PageMeta 
        title="QuantX Ecosystem | Undisputed Systematic Software Engineering"
        description="Discover the seamless, emotional-free systematic algorithms behind QuantX. Built for elite capital protection, high-performance rule execution, and total peace of mind."
      />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden border-b border-white/[0.05]">
        <motion.div 
          style={{ y: backgroundY }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_70%)]" />
          <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.png')]" />
        </motion.div>

        <div className="container mx-auto px-6 relative z-10 text-center pt-20 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4">
              <Brain className="w-3.5 h-3.5" />
              Sovereign Trading Sanctuary
            </div>
            
            <h1 className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter mb-4 leading-[0.88] uppercase italic text-shimmer pr-2">
              Quant<span className="text-emerald-400 font-serif">X</span>
            </h1>
            
            <p className="text-white/45 text-sm sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed px-4">
              Bypassing human emotional friction. We engineer seamless, institutional-grade systematic algorithmic frameworks that free thousands of professional traders from the constant anxiety of manual execution.
            </p>
          </motion.div>
        </div>

        <motion.div 
          style={{ opacity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <div className="text-[9px] font-black tracking-[0.3em] text-white/20 uppercase">Initialize Core Matrix</div>
          <div className="w-px h-12 bg-gradient-to-b from-emerald-500/50 to-transparent" />
        </motion.div>
      </section>

      {/* Psychological Alignment: The Pain vs. The Sanctuary */}
      <section className="py-24 md:py-36 border-b border-white/[0.05] relative overflow-hidden bg-gradient-to-b from-black to-[#020305]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.03),transparent_60%)] pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-20 md:mb-28">
            <span className="text-xs font-black uppercase tracking-[0.4em] text-emerald-400 mb-4 block">Psychological Engineering</span>
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter mb-6 leading-tight">
              Why Elite Traders <br />
              <span className="text-white/30">Choose Systematic Peace.</span>
            </h2>
            <p className="text-white/40 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl mx-auto uppercase tracking-wide">
              Manual trading is a war against your own central nervous system. QuantX replaces screen fatigue and anxiety with flawless algorithmic discipline.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-stretch">
            {/* The Chaos of Manual Retail Trading */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="p-8 md:p-12 rounded-[2.5rem] bg-red-950/5 border border-red-500/10 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-6 block">The Chaos of Manual Execution</span>
                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white mb-6">Mental Burnout &amp; Anxiety</h3>
                
                <ul className="space-y-4 text-xs md:text-sm text-white/50">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                    <span><strong>Decision Fatigue:</strong> Constant market analysis depletes willpower, leading to catastrophic revenge trades.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                    <span><strong>Execution Delays:</strong> Human latency during volatile news results in severe slippage and bad fills.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                    <span><strong>Continuous Surveillance:</strong> Locked to screens 14 hours a day, sacrificing health and personal freedom.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                    <span><strong>Emotional Drift:</strong> Breaking your own risk limits because of fear, greed, or market noise.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-red-500/10 text-red-400/50 text-[10px] font-mono tracking-wider uppercase">
                Result: Unpredictable returns, high stress, constant drawdown.
              </div>
            </motion.div>

            {/* The Sanctuary of QuantX Automation */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="p-8 md:p-12 rounded-[2.5rem] bg-emerald-950/5 border border-emerald-500/10 flex flex-col justify-between shadow-[0_20px_50px_rgba(16,185,129,0.02)]"
            >
              <div>
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-6 block">The QuantX Solution</span>
                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white mb-6">Seamless Systematic Liberation</h3>
                
                <ul className="space-y-4 text-xs md:text-sm text-white/70">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                    <span><strong>Zero Emotion Rules:</strong> 100% mechanical mathematical compliance. Logic triggers execute exactly as backtested.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                    <span><strong>Micro-Second Latency:</strong> Lightning-fast order routing bypassing retail platform bottlenecks completely.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                    <span><strong>Total Time Freedom:</strong> Algorithms handle continuous market surveillance, letting you reclaim your life.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                    <span><strong>Hardcoded Risk Governance:</strong> Capital preservation algorithms enforce strict caps on absolute exposure.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-emerald-500/10 text-emerald-400 text-[10px] font-mono tracking-wider uppercase">
                Result: Flawless execution, total peace of mind, professional stability.
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Architecture Flow */}
      <section className="py-24 md:py-36 border-b border-white/[0.05]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16 md:mb-24">
            <span className="text-xs font-black uppercase tracking-[0.4em] text-white/30 block mb-3">Modular Synthesis Pipeline</span>
            <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight italic uppercase">Seamless Softwares, Flawless Output.</h2>
            <p className="text-white/40 text-sm md:text-lg max-w-xl mx-auto leading-relaxed">
              We create state-of-the-art automated strategies, enabling thousands of traders worldwide to enjoy hassle-free execution.
            </p>
          </div>

          <div className="relative max-w-6xl mx-auto">
            {/* Visual Flow Lines */}
            <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent -translate-y-1/2 hidden lg:block" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 relative z-10">
              <ArchitectureNode title="Macro Data Feed" icon={Database} subtext="Global Liquidity Core" active />
              <ArchitectureNode title="Quant Core Analysis" icon={Brain} subtext="Systematic Synthesizer" active />
              <ArchitectureNode title="Drawdown Guard" icon={ShieldAlert} subtext="Hard Position Stop" active />
              <ArchitectureNode title="Execution Desk" icon={Zap} subtext="Sub-Millisecond Fill" active />
              <ArchitectureNode title="Auto-Recalibration" icon={RefreshCcw} subtext="Recursive Optimization" active />
            </div>
          </div>
        </div>
      </section>

      {/* Intelligence Layers */}
      <section className="py-24 md:py-36 bg-white/[0.01]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8 mb-16 md:mb-24 max-w-6xl mx-auto">
            <div className="max-w-2xl">
              <div className="text-emerald-500 text-[9px] font-black tracking-[0.4em] uppercase mb-3">Tactical Operations</div>
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter leading-none italic uppercase">Systematic <br className="hidden sm:block" />Analysis Layers</h2>
            </div>
            <p className="text-white/30 text-xs sm:text-sm md:text-base max-w-xs leading-relaxed pb-2 uppercase tracking-wider font-semibold">
              Deep numerical processing across 5 proprietary algorithmic intelligence vectors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <IntelligenceLayer 
              number="1"
              title="Regime Classification"
              description="Identifies current structural environments. Dynamic models classify whether the asset is trending, mean-reverting, or undergoing range compression and institutional liquidity sweeps."
              inputs={["Adaptive Volatility (ATR)", "Market Volatility Index", "Liquidity Pool Clustery"]}
              outputs="MARKET REGIME MATRIX"
              icon={Activity}
              delay={0}
            />
            <IntelligenceLayer 
              number="2"
              title="Tactical Engine Selector"
              description="Dynamically routes orders and active strategies by selecting the exact high-fidelity algorithm designed for the detected market regime."
              inputs={["Trend-Following Modules", "High-Spread Scalping Logic", "Order Block Arbitrage"]}
              outputs="STRATEGY ALLOCATION"
              icon={Layers}
              delay={0.1}
            />
            <IntelligenceLayer 
              number="3"
              title="Precision Probability Scoring"
              description="Evaluates execution setups numerically. Each market edge triggers only when multiple confirming filters exceed a strict mathematical score threshold."
              inputs={["Order Flow Ingestion", "Volatilty Compression Profile", "High-Precision Filters"]}
              outputs="CONFIDENCE RATINGS"
              icon={Target}
              delay={0.2}
            />
            <IntelligenceLayer 
              number="4"
              title="Capital Protection Protocol"
              description="Enforces strict risk management parameters automatically. System calculates position size dynamically based on your account size and the volatility risk signature."
              inputs={["Absolute Capital Limits", "ATR Standard Risk Scaling", "Real-Time Drawdown Tracking"]}
              outputs="HARD LIMIT CONTROL"
              icon={ShieldAlert}
              delay={0.3}
            />
            <div className="md:col-span-2">
              <IntelligenceLayer 
                number="5"
                title="Continuous Recursive Recalibration"
                description="The systematic learning layer. Recalibrates thresholds hourly using historical feedback models to prevent algorithmic drift and adapt continuously to active price shifts."
                inputs={["MFE Yield Tracking", "Microstructure Spread Profiling", "Historical Backtest Drift"]}
                outputs="RECURSIVE FEEDBACK LOOP"
                icon={Workflow}
                delay={0.4}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Execution Infrastructure */}
      <section className="py-24 md:py-36 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/[0.03] rounded-full blur-[120px] pointer-events-none" />
        
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center max-w-6xl mx-auto">
            <div>
              <span className="text-emerald-400 text-xs font-black uppercase tracking-[0.4em] mb-4 block">Uncompromising Rigor</span>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black mb-10 tracking-tight uppercase italic leading-none">Designed for Absolute Trust.</h2>
              
              <div className="space-y-8 sm:space-y-10">
                <div className="flex gap-4 sm:gap-6">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 shadow-lg">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-bold mb-2 uppercase text-white">Elite Capital Governance</h4>
                    <p className="text-xs sm:text-sm text-white/40 leading-relaxed">Every software suite we release features built-in capital protection blocks, ensuring drawdowns are strictly managed without active user intervention.</p>
                  </div>
                </div>
                
                <div className="flex gap-4 sm:gap-6">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 shadow-lg">
                    <Cpu size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-bold mb-2 uppercase text-white">Hassle-Free Implementation</h4>
                    <p className="text-xs sm:text-sm text-white/40 leading-relaxed">No complicated setups. We compile all algorithmic parameters into clean, secure, drag-and-drop binaries ready for MT5, TradingView, or proprietary bridges.</p>
                  </div>
                </div>

                <div className="flex gap-4 sm:gap-6">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 shadow-lg">
                    <HeartHandshake size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-bold mb-2 uppercase text-white">Continuous Developer Support</h4>
                    <p className="text-xs sm:text-sm text-white/40 leading-relaxed">We stand behind our code. Our global quantitative desk continuously recalibrates volatility indexes and releases systematic model optimizations automatically.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="h-auto min-h-[300px] lg:aspect-square rounded-3xl sm:rounded-[3.5rem] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.06] p-8 overflow-hidden group">
                <div className="absolute inset-0 bg-emerald-500/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                {/* Visual Representation of the "Loop" */}
                <div className="relative h-full flex flex-col justify-center items-center min-h-[250px]">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border border-emerald-500/10 rounded-full border-dashed"
                  />
                  <div className="text-center relative z-10">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-4 sm:mb-6 shadow-[0_0_50px_-12px_rgba(16,185,129,0.4)]">
                      <Cpu className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" />
                    </div>
                    <div className="text-[9px] font-black tracking-[0.4em] text-emerald-500 uppercase mb-2">Model Audited Enclave</div>
                    <div className="text-xl sm:text-2xl font-bold uppercase tracking-wide">Dynamic Verification</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 md:py-40 bg-emerald-600/[0.01] border-t border-white/[0.05] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
        
        <div className="container mx-auto px-4 md:px-6 text-center max-w-4xl">
          <span className="text-xs font-black uppercase tracking-[0.4em] text-emerald-400 mb-6 block">Join the Quantitative Frontier</span>
          <h2 className="text-4xl md:text-7xl font-black mb-10 tracking-tight italic uppercase leading-none">
            Total Systematic Control. <br />
            <span className="text-emerald-400">Zero Nervous Friction.</span>
          </h2>
          <p className="text-white/40 text-sm md:text-base leading-relaxed mb-12 max-w-lg mx-auto">
            Stop waging a stressful manual war against high-frequency liquidity pools. Step into the QuantX Sanctuary and automate with supreme tactical authority.
          </p>
          <Link to="/webinars">
            <EliteButton variant="premium-gold" size="lg" rightIcon={<ChevronRight className="w-4 h-4" />}>
              REQUEST ACCESS TO QUANTX RESEARCH
            </EliteButton>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default QuantX;
