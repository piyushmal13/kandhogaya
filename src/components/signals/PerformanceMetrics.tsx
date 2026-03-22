import { motion } from "motion/react";
import { Activity, TrendingUp, Users } from "lucide-react";

const metrics = [
  { label: "Pips Generated", value: "48,250+", icon: TrendingUp, color: "text-emerald-400" },
  { label: "Accuracy Rate", value: "82.4%", icon: Activity, color: "text-cyan-400" },
  { label: "Active Traders", value: "12,400+", icon: Users, color: "text-purple-400" },
];

export const PerformanceMetrics = () => (
  <section
    className="py-12 border-y border-[var(--border-default)]"
    style={{ background: "var(--bg-base)" }}
    aria-label="Performance statistics"
  >
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center justify-center gap-4 p-6 rounded-2xl border border-[var(--border-default)] hover:border-[var(--border-hover)] transition-colors"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <div className={`p-3 rounded-xl ${metric.color}`} style={{ background: "rgba(255,255,255,0.05)" }}>
              <metric.icon className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <div className={`text-3xl font-bold ${metric.color} font-mono`}>{metric.value}</div>
              <div
                className="text-sm font-medium uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                {metric.label}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
