import React from "react";
import { motion } from "motion/react";
import { Code2, Cpu, Users, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { EliteButton } from "../ui/Button";

const features = [
  {
    icon: Code2,
    title: "Custom Platform Systems",
    desc: "Custom configurations built to support trading workflows beyond standard retail software limits."
  },
  {
    icon: Cpu,
    title: "Experienced Software Team",
    desc: "A dedicated engineering desk with deep experience in C++, Python, and MT4/MT5 systematic setups."
  },
  {
    icon: ShieldCheck,
    title: "Thoroughly Tested Software",
    desc: "Every custom tool we deliver is fully verified for stability, complete with setup logs and performance verification."
  }
];

export const CustomAlgoTeam = () => {
  return (
    <section className="py-24 md:py-40 bg-[var(--bg-base)] relative overflow-hidden">
      {/* Background VFX */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#3B82F6]/5 blur-[120px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3B82F6]/5 border border-[#3B82F6]/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
              <Code2 className="w-3.5 h-3.5" />
              Custom Engineering Desk
            </div>
            
            <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter mb-8 leading-[0.9]">
              Asia's Largest <br />
              <span className="text-white/20">Senior Algo Team.</span>
            </h2>
            
            <p className="text-white/40 text-base leading-relaxed mb-12 max-w-xl">
              We are home to a highly experienced team of software developers and trading analysts. Whether you need a custom platform setup, specialized indicators, or automated order routing systems, our engineers design tools tailored to your exact needs.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              <div className="flex items-center gap-4 p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-white">40+</div>
                  <div className="text-[10px] text-white/30 uppercase font-black tracking-widest">Senior Quants</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-white">&lt;1ms</div>
                  <div className="text-[10px] text-white/30 uppercase font-black tracking-widest">Execution Latency</div>
                </div>
              </div>
            </div>

            <EliteButton 
              variant="elite" 
              size="lg" 
              className="group"
              onClick={() => document.getElementById('consultation')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Request Custom Build
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </EliteButton>
          </motion.div>

          <div className="space-y-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group p-8 rounded-[2.5rem] bg-[#0A0A0A] border border-white/5 hover:border-blue-500/30 transition-all hover:translate-y-[-4px]"
              >
                <div className="flex gap-6 items-start">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 group-hover:text-blue-400 group-hover:border-blue-500/20 transition-all">
                    <f.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tight mb-3">{f.title}</h3>
                    <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
