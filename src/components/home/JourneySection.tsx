import React from "react";
import { motion } from "motion/react";
import { containerVariants, itemVariants } from "@/lib/motion";

const MILESTONES = [
  { year: "2018", title: "Inception of Sovereign Alpha", desc: "First proprietary liquidity model deployed on XAUUSD." },
  { year: "2020", title: "Institutional Node Expansion", desc: "IFX Trades established as the primary intelligence hub for retail quant groups." },
  { year: "2022", title: "The $1B Benchmark", desc: "Systems surpass $1B in cumulative client-managed execution volume." },
  { year: "2024", title: "Quantum Era Integration", desc: "Migration to high-performance execution clusters across HK and London nodes." },
  { year: "2026", title: "The Sovereign Frontier", desc: "Global expansion into bespoke algorithmic private-banking solutions." },
];

export const JourneySection = () => {
  return (
    <section className="py-32 bg-[#0A0A0A] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants} className="text-center mb-24">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#58F2B6] mb-4 block">
              The Evolution of Authority
            </span>
            <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter">
              A Legacy of <br />
              <span className="text-white/20">Institutional Engineering.</span>
            </h2>
          </motion.div>

          {/* Timeline Surface */}
          <div className="relative max-w-5xl mx-auto pl-8 md:pl-0">
            {/* Center Line (Desktop) */}
            <div className="absolute left-[8px] md:left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2" />

            <div className="space-y-24">
              {MILESTONES.map((milestone, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className={`flex flex-col md:flex-row items-start md:items-center gap-12 ${
                    i % 2 === 0 ? "md:flex-row-reverse text-left md:text-right" : "text-left"
                  }`}
                >
                  <div className="flex-1 w-full">
                    <div className={`flex flex-col gap-4 ${i % 2 === 0 ? "md:items-end" : "md:items-start"}`}>
                      <span className="text-5xl md:text-7xl font-black text-[#58F2B6]/20 font-mono tracking-tighter">
                        {milestone.year}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
                        {milestone.title}
                      </h3>
                      <p className="text-[rgba(248,250,252,0.6)] text-lg leading-relaxed max-w-md">
                        {milestone.desc}
                      </p>
                    </div>
                  </div>

                  {/* Marker Hook */}
                  <div className="absolute left-[8px] md:left-1/2 w-4 h-4 rounded-full bg-[#58F2B6] border-4 border-[#020202] -translate-x-1/2 z-20 shadow-[0_0_15px_#58F2B6]" />

                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
