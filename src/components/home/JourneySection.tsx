import React from "react";
import { motion } from "motion/react";
import { containerVariants, itemVariants } from "@/lib/motion";

const MILESTONES = [
  { year: "2018", title: "Where It All Began", desc: "Our first gold trade model went live. It worked. We knew we were onto something real." },
  { year: "2020", title: "Building the Community", desc: "IFX Trades opened its doors to serious retail traders across India and the Middle East." },
  { year: "2022", title: "The ₹1 Billion Club", desc: "Our member community collectively managed over ₹1B in trading capital using our frameworks." },
  { year: "2024", title: "Going Institutional", desc: "Upgraded to high-performance cloud clusters and launched our flagship QuantX algorithm." },
  { year: "2026", title: "Asia's #1 Desk", desc: "Recognized as Asia's leading institutional forex education platform. Your edge starts here." },
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
              Our Story
            </span>
            <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter">
              Built on Real <br />
              <span className="text-white/20">Trading Experience.</span>
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
