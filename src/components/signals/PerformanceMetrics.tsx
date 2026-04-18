import { motion } from "motion/react";
import { Activity, TrendingUp, Users } from "lucide-react";

const metrics = [
  { label: "Simulated Points", value: "48,250+", icon: TrendingUp, color: "text-emerald-500" },
  { label: "Model Fidelity", value: "82.4%", icon: Activity, color: "text-emerald-500" },
  { label: "Active Learners", value: "12,400+", icon: Users, color: "text-emerald-500" },
];

export const PerformanceMetrics = () => (
  <section
    className="py-16 bg-[#020202] border-y border-white/[0.05] relative overflow-hidden"
    aria-label="Performance statistics"
  >
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.8 }}
            className="group flex items-center justify-center gap-8 p-10 rounded-[2.5rem] bg-[#080B12] border border-white/[0.06] hover:border-emerald-500/20 transition-all duration-700 hover:shadow-2xl"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/20 group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-all duration-700">
              <metric.icon className="w-7 h-7" aria-hidden="true" />
            </div>
            <div>
              <div className="text-4xl font-black text-white tracking-tighter italic mb-1 tabular-nums">{metric.value}</div>
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic group-hover:text-emerald-500/60 transition-colors duration-700">
                {metric.label}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
