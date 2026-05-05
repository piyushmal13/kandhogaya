import React from "react";
import { motion } from "motion/react";
import { Lightbulb, Code2, LineChart, Cpu } from "lucide-react";
import { containerVariants, itemVariants } from "@/lib/motion";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    icon: <Lightbulb className="w-8 h-8" />,
    title: "We Study the Markets",
    description: "Our analysts read global macro data, central bank policy, and institutional order flow — the same signals Wall Street uses every day.",
    span: "col-span-12 md:col-span-7",
    color: "bg-blue-500/5 border-blue-500/20 text-blue-400"
  },
  {
    icon: <Code2 className="w-8 h-8" />,
    title: "We Build the Algorithm",
    description: "Those insights become a coded, back-tested trading strategy — not a feeling or a hunch, but a rules-based engine.",
    span: "col-span-12 md:col-span-5",
    color: "bg-purple-500/5 border-purple-500/20 text-purple-400"
  },
  {
    icon: <Cpu className="w-8 h-8" />,
    title: "We Protect Your Capital",
    description: "Every strategy includes built-in stop-loss rules and position sizing. We focus on not losing before we focus on winning.",
    span: "col-span-12 md:col-span-4",
    color: "bg-rose-500/5 border-rose-500/20 text-rose-400"
  },
  {
    icon: <LineChart className="w-8 h-8" />,
    title: "You Learn & Execute",
    description: "We teach you how to run it. Live sessions, PDF guides, and direct Q&A with our analysts. You own the edge.",
    span: "col-span-12 md:col-span-8",
    color: "bg-[#58F2B6]/5 border-[#58F2B6]/20 text-[#58F2B6]"
  }
];

export const HowItWorks = () => {
  return (
    <section className="py-12 md:py-32 bg-[#020202] relative">
      <div className="container mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={itemVariants} className="mb-10 md:mb-20 text-center md:text-left">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#58F2B6] mb-4 block">
              How It Works
            </span>
            <h2 className="text-3xl md:text-7xl font-black text-white uppercase tracking-tighter max-w-4xl">
              From Market Insight <br />
              <span className="text-white/20">To Your Winning Trade.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-12 gap-6">
            {STEPS.map((step, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className={cn(
                  "p-6 md:p-12 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 bg-[#0A0A0A] relative overflow-hidden group transition-all duration-500 hover:border-white/20",
                  step.span
                )}
              >
                <div className={cn(
                  "absolute -right-8 -top-8 w-32 h-32 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000",
                  step.color.split(' ')[0]
                )} />
                
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center border mb-8 transition-transform group-hover:scale-110 duration-500",
                  step.color
                )}>
                  {step.icon}
                </div>

                <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-4">
                  {step.title}
                </h3>
                <p className="text-[rgba(248,250,252,0.6)] text-lg leading-relaxed max-w-md">
                  {step.description}
                </p>

                <div className="mt-12 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/10 group-hover:text-white/40 transition-colors">
                  <span>Step 0{i + 1}</span>
                  <div className="h-px flex-1 bg-white/5 group-hover:bg-white/10 transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
