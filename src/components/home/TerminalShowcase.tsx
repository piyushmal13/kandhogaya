import React from "react";
import { motion } from "motion/react";
import { containerVariants, itemVariants } from "@/lib/motion";
import { ShieldCheck, Cpu, Activity, Server } from "lucide-react";

export const TerminalShowcase = () => {
  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="py-24 bg-[#010203] relative overflow-hidden border-t border-white/5"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/[0.02] blur-[130px] rounded-full" />
        <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-cyan-500/[0.015] blur-[100px] rounded-full" />
      </div>

      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Visual Mockup (Takes 7 Cols on desktop) */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-7 order-2 lg:order-1 relative"
          >
            <div className="absolute inset-0 bg-emerald-500/5 blur-[120px] rounded-full opacity-35" />
            <div className="relative rounded-[1.75rem] sm:rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl bg-[#090A0C] group transition-all duration-500 hover:border-emerald-500/30">
              <img 
                src="/mt5_elite_terminal_v3.png" 
                alt="MT5 Elite Algorithmic Terminal Execution Workstation" 
                className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              
              {/* Telemetry Indicator Overlay */}
              <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 flex items-center gap-3 px-4 py-2 rounded-full bg-black/80 border border-white/10 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/70 font-mono">NY4 Server: Active &lt;1.2ms</span>
              </div>
            </div>
          </motion.div>
          
          {/* Right Column: Copy & Value Proposition (Takes 5 Cols on desktop) */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-5 order-1 lg:order-2 space-y-8 text-left"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-[0.25em] w-fit">
                <Cpu className="w-2.5 h-2.5" /> High-Performance Infrastructure
              </div>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[0.95] italic uppercase">
                Terminal <br />
                <span className="text-emerald-400">Execution.</span>
              </h2>
              <p className="text-sm sm:text-base text-white/40 leading-relaxed font-medium">
                Native MetaTrader 5 (MT5) integration built with our proprietary bridge protocols. Experience zero-latency synchronization between our quantitative research models and your B2B execution workstation.
              </p>
            </div>

            {/* Structured Value Checklist */}
            <div className="space-y-4 pt-2">
              {[
                { icon: Activity, title: "Automated Strategy Execution", desc: "Automate system entry/exit logic with millisecond accuracy." },
                { icon: Server, title: "NY4 Co-location Infrastructure", desc: "Co-located servers minimize trade slippage and speed fills." },
                { icon: ShieldCheck, title: "Built-in Risk Safeguards", desc: "Enforce systemic drawdowns and equity caps at server level." }
              ].map((item) => (
                <div key={item.title} className="flex gap-4 items-start group">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/40 group-hover:text-emerald-400 group-hover:border-emerald-500/20 transition-all shrink-0">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-white group-hover:text-emerald-400 transition-colors">{item.title}</h3>
                    <p className="text-[11px] text-white/30 font-medium leading-normal mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </motion.div>

        </div>
      </div>
    </motion.div>
  );
};
