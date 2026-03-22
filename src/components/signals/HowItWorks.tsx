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
    className="py-24"
    style={{ background: "var(--bg-base)" }}
    aria-labelledby="how-it-works-heading"
  >
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <h2 id="how-it-works-heading" className="text-3xl md:text-5xl font-bold text-white mb-4">
          How It Works
        </h2>
        <p style={{ color: "var(--text-muted)" }}>
          From analysis to execution in three simple steps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        <div
          className="hidden md:block absolute top-12 left-0 right-0 h-0.5"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(88,242,182,0.2), transparent)",
          }}
          aria-hidden="true"
        />

        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            className="relative flex flex-col items-center text-center group"
          >
            <div
              className="w-24 h-24 rounded-2xl border flex items-center justify-center mb-6 relative z-10 transition-colors duration-500 shadow-2xl group-hover:border-[var(--accent)]/50"
              style={{
                background: "var(--bg-raised)",
                borderColor: "var(--border-default)",
              }}
            >
              <step.icon className="w-10 h-10 text-emerald-400" aria-hidden="true" />
              <div
                className="absolute -top-3 -right-3 w-8 h-8 rounded-full font-bold flex items-center justify-center text-sm border-4"
                style={{
                  background: "var(--accent)",
                  color: "var(--accent-fg)",
                  borderColor: "var(--bg-base)",
                }}
                aria-hidden="true"
              >
                {i + 1}
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: "var(--text-muted)" }}>
              {step.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
