import React from "react";
import { motion } from "motion/react";
import { Activity, ShieldCheck, Zap, Layers, Cpu, ArrowRight, BarChart3, TrendingUp, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { EliteButton } from "../ui/Button";

export const PerformanceHistory = () => {
  const PRE_BUILT_ALGOS = [
    {
      name: "Forex Scalper X",
      description: "High-frequency institutional liquidity capturing model engineered for primary currency majors.",
      winRate: "83.4%",
      profitFactor: "2.2",
      maxDrawdown: "4.8%",
      type: "MQL5 / MT5",
      badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    },
    {
      name: "Gold Hunter Pro",
      description: "Bespoke commodity momentum tracking algorithm tuned for extreme high-volatility environments.",
      winRate: "78.9%",
      profitFactor: "2.4",
      maxDrawdown: "5.2%",
      type: "PineScript / TradingView",
      badgeColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20"
    },
    {
      name: "MT5 Trend Master",
      description: "Multi-asset macro trend-following system with automated correlation-based hedging limits.",
      winRate: "85.1%",
      profitFactor: "2.1",
      maxDrawdown: "3.5%",
      type: "C++ Compiler / MT5",
      badgeColor: "text-purple-400 bg-purple-500/10 border-purple-500/20"
    }
  ];

  const QUANT_STEPS = [
    {
      step: "01",
      title: "Logic Consultation",
      desc: "Our quantitative desk reviews your unique trading strategy and maps it to institutional quantitative specifications."
    },
    {
      step: "02",
      title: "Backtest & Optimize",
      desc: "Stress-test strategy parameters across 15+ years of raw historical tick-data under severe spread conditions."
    },
    {
      step: "03",
      title: "High-Precision Coding",
      desc: "Compile strict, clean, micro-second execution speed code using optimized C++, MQL5, or PineScript."
    },
    {
      step: "04",
      title: "Cryptographic Audit",
      desc: "Encrypt visual logic and securely deploy the compiled lock-proof binary file directly to your MT5/TradingView terminal."
    }
  ];

  return (
    <section className="py-16 md:py-32 bg-[#020202] border-t border-white/[0.04] relative overflow-hidden" aria-labelledby="algo-heading">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[60%] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(16,185,129,0.06),transparent)]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
        
        {/* Header Block */}
        <div className="text-center mb-20 md:mb-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/[0.06] border border-emerald-500/[0.12] text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6"
          >
            <Activity className="w-3.5 h-3.5" />
            Proprietary Architecture
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            id="algo-heading" 
            className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 tracking-tight leading-[1.1] uppercase italic"
          >
            Algorithmic <span className="text-emerald-500">Registry.</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/40 max-w-2xl mx-auto text-sm md:text-base leading-relaxed"
          >
            Deploy Asia's elite quantitative software models or commission a bespoke, institutional-grade algorithm built specifically to your execution guidelines.
          </motion.p>
        </div>

        {/* pre-built Algorithms Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
          {PRE_BUILT_ALGOS.map((algo, index) => (
            <motion.div
              key={algo.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="p-8 bg-zinc-900/40 border border-white/5 hover:border-emerald-500/20 rounded-[2.5rem] flex flex-col justify-between group transition-all duration-500 shadow-2xl relative overflow-hidden"
            >
              {/* Ambient Glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-transparent blur-2xl group-hover:scale-150 transition-all duration-500" />
              
              <div>
                <div className="flex justify-between items-start gap-4 mb-6">
                  <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${algo.badgeColor}`}>
                    {algo.type}
                  </div>
                  <Cpu className="w-5 h-5 text-gray-500 group-hover:text-emerald-400 transition-colors" />
                </div>

                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4 group-hover:text-emerald-400 transition-colors">
                  {algo.name}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed uppercase tracking-wider mb-8">
                  {algo.description}
                </p>
              </div>

              <div className="space-y-6 pt-6 border-t border-white/5">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Win Rate</span>
                    <span className="text-sm font-mono font-black text-white">{algo.winRate}</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Profit Factor</span>
                    <span className="text-sm font-mono font-black text-emerald-400">{algo.profitFactor}</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Max DD</span>
                    <span className="text-sm font-mono font-black text-red-400">{algo.maxDrawdown}</span>
                  </div>
                </div>

                <Link to="/marketplace" className="block w-full">
                  <EliteButton variant="secondary" size="sm" fluid rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Acquire Algorithm
                  </EliteButton>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bespoke Strategy Request Hub */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="p-10 md:p-16 bg-gradient-to-b from-zinc-900/60 to-black border border-white/[0.08] rounded-[3.5rem] shadow-[0_45px_90px_rgba(0,0,0,0.7)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Column 1: Intro */}
            <div className="lg:col-span-5 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-mono tracking-widest uppercase">
                <Zap className="w-3.5 h-3.5 text-emerald-400" /> Bespoke Engineering
              </div>
              
              <h3 className="text-3xl md:text-4xl font-black text-white uppercase italic leading-none tracking-tighter">
                Custom strategy <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 font-serif">Development desk.</span>
              </h3>
              
              <p className="text-xs md:text-sm text-gray-400 leading-relaxed uppercase tracking-wider">
                If you have a unique indicator, specific chart configuration, or manual trade trigger strategy, our expert desk will code it into a robust, lock-proof, high-precision automated algorithm.
              </p>

              <div className="pt-4">
                <Link to="/consultation">
                  <EliteButton variant="premium-gold" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Initiate Custom Request
                  </EliteButton>
                </Link>
              </div>
            </div>

            {/* Column 2: Pipeline Steps */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {QUANT_STEPS.map((step) => (
                <div key={step.step} className="p-6 bg-white/[0.02] border border-white/[0.04] rounded-3xl space-y-4 hover:border-emerald-500/10 transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-emerald-400 text-sm font-black">{step.step}</span>
                    <CheckCircle className="w-4 h-4 text-emerald-500/40" />
                  </div>
                  <h4 className="text-xs font-black text-white uppercase tracking-widest">
                    {step.title}
                  </h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </motion.div>

        {/* Global Security Footer */}
        <div className="mt-16 pt-10 border-t border-white/[0.04] flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">Institutional Audit Verified</span>
          </div>
          <div className="text-[9px] font-mono text-gray-600 uppercase tracking-widest text-center md:text-right">
            Backtesting metrics compiled using real historical spread modeling algorithms.
          </div>
        </div>

      </div>
    </section>
  );
};
