import { motion } from "motion/react";
import { BarChart3, MessageSquare, Zap } from "lucide-react";

const steps = [
  {
    title: "Market Analysis",
    desc: "Our research desk analyzes global markets using institutional order flow data.",
    icon: BarChart3,
  },
  {
    title: "Signal Generation",
    desc: "Trade setups are generated with precise entry, stop loss, and take profit levels.",
    icon: Zap,
  },
  {
    title: "Instant Delivery",
    desc: "Signals are instantly delivered to members via our private WhatsApp channel.",
    icon: MessageSquare,
  },
];

export const HowItWorks = () => (
  <section
    className="py-32 md:py-48 bg-[#020202] relative overflow-hidden"
    aria-labelledby="how-it-works-heading"
  >
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-24">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          id="how-it-works-heading" 
          className="text-shimmer mb-6"
        >
          Institutional <br />
          <span className="italic font-serif text-gradient-emerald">Onboarding.</span>
        </motion.h2>
        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white/20 italic">
          From analysis to execution in three synchronized steps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
        <div
          className="hidden md:block absolute top-20 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"
          aria-hidden="true"
        />

        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2, duration: 0.8 }}
            className="relative flex flex-col items-center text-center group"
          >
            <div className="w-40 h-40 rounded-[2.5rem] bg-[#080B12] border border-white/[0.06] flex items-center justify-center mb-10 relative z-10 transition-all duration-700 group-hover:border-emerald-500/30 group-hover:shadow-[0_40px_80px_rgba(16,185,129,0.1)]">
              <step.icon className="w-12 h-12 text-white/20 group-hover:text-emerald-500 transition-colors duration-700" />
              <div className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl bg-emerald-500 text-black font-black flex items-center justify-center text-[10px] border-4 border-[#020202] shadow-xl italic">
                0{i + 1}
              </div>
            </div>
            <h3 className="text-xl font-black text-white mb-4 uppercase tracking-[0.3em] italic">{step.title}</h3>
            <p className="text-[11px] font-black uppercase tracking-widest text-white/30 leading-relaxed max-w-[200px] italic">
              {step.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
