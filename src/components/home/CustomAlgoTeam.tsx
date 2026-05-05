import React from "react";
import { motion } from "motion/react";
import { Code2, Cpu, Users, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { EliteButton } from "../ui/Button";

const features = [
  {
    icon: Code2,
    title: "Proprietary Execution Logic",
    desc: "Our senior engineering team develops custom trading frameworks from the ground up, bypassing standard retail platform limitations."
  },
  {
    icon: Cpu,
    title: "High-Performance Architecture",
    desc: "Asia's largest specialized quant desk focusing exclusively on institutional-grade MQL5 and C++ bridge systems."
  },
  {
    icon: ShieldCheck,
    title: "Audited Trading Logs",
    desc: "Every custom deployment comes with a full institutional audit trail and detailed performance reports."
  }
];

export const CustomAlgoTeam = () => {
  return (
    <section className="py-24 md:py-40 bg-[#020202] relative overflow-hidden">
      {/* Background VFX */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#58F2B6]/5 blur-[120px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#58F2B6]/5 border border-[#58F2B6]/10 text-[#58F2B6] text-[10px] font-black uppercase tracking-[0.3em] mb-8">
              <Code2 className="w-3.5 h-3.5" />
              Custom Engineering Desk
            </div>
            
            <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter mb-8 leading-[0.9]">
              Asia's Largest <br />
              <span className="text-white/20">Senior Algo Team.</span>
            </h2>
            
            <p className="text-white/60 text-xl leading-relaxed mb-12 max-w-xl">
              We house Asia's largest and most senior team of algorithmic architects. Whether you require a proprietary HFT bridge or a specialized custom execution framework, our engineers are ready to build for your desk.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              <div className="flex items-center gap-4 p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
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
                className="group p-8 rounded-[2.5rem] bg-[#0A0A0A] border border-white/5 hover:border-[#58F2B6]/30 transition-all hover:translate-y-[-4px]"
              >
                <div className="flex gap-6 items-start">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 group-hover:text-[#58F2B6] group-hover:border-[#58F2B6]/20 transition-all">
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
