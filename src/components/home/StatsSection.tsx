import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import { TrendingUp, Users, Video, Globe } from "lucide-react";

// ─── LOCKED: DO NOT MODIFY ────────────────────────────────────────────────────
// useCountUp: RAF-based count animation with cubic ease-out — pure math, no deps
// useInView: triggers once on viewport entry — scroll-intersection logic
// stats array: CEO-directive metrics (education-only, no broker metrics)
// ─────────────────────────────────────────────────────────────────────────────

const SNAP = [0.4, 0, 0.2, 1] as const;

const stats = [
  {
    label: "Global Clients",
    value: "12,400",
    suffix: "+",
    sub: "Unified trading desk",
    icon: Users,
    color: "#10B981",
  },
  {
    label: "Verification Index",
    value: "94",
    suffix: "%",
    sub: "Institutional modeling",
    icon: TrendingUp,
    color: "#00FFA3",
  },
  {
    label: "Daily Logic Validations",
    value: "2,800",
    suffix: "+",
    sub: "Automated systems",
    icon: Video,
    color: "#D4AF37",
  },
  {
    label: "Partner Desks",
    value: "40",
    suffix: "+",
    sub: "Global liquidity hubs",
    icon: Globe,
    color: "#8B5CF6",
  },
];

// LOCKED — RAF count-up engine
const useCountUp = (end: number, trigger: boolean, duration = 1800) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setCount(easedProgress * end);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration, trigger]);

  return count;
};

const StatItem = ({ stat, i }: { stat: typeof stats[0]; i: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const regex = /(\d+(\.\d+)?)/;
  const match = regex.exec(stat.value);
  const numericValue = match ? Number.parseFloat(match[0]) : 0;
  const hasDecimal = stat.value.includes(".");
  const animatedValue = useCountUp(numericValue, isInView, 1800);
  const formattedCount = hasDecimal
    ? animatedValue.toFixed(1)
    : Math.floor(animatedValue).toLocaleString();

  const Icon = stat.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.09, duration: 0.55, ease: SNAP }}
      className="group relative flex flex-col p-10 md:p-12 cursor-default"
    >
      {/* Vertical divider (right) — not on last col */}
      <div className="absolute top-0 right-0 bottom-0 w-px bg-white/[0.05] hidden lg:block last:hidden" />
      {/* Horizontal divider (bottom) on mobile/tablet */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/[0.05] lg:hidden" />

      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 70% 60% at 30% 50%, ${stat.color}08, transparent)` }}
      />

      {/* Icon */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-200"
        style={{ background: `${stat.color}10`, border: `1px solid ${stat.color}20` }}
      >
        <Icon className="w-5 h-5" style={{ color: stat.color }} aria-hidden />
      </div>

      {/* Label */}
      <div
        className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-5 group-hover:text-white/50 transition-colors duration-200"
      >
        {stat.label}
      </div>

      {/* Animated number */}
      <div
        className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-3 tabular-nums"
        style={{ fontFamily: "IBM Plex Mono, monospace", color: stat.color }}
      >
        {formattedCount}{stat.suffix}
      </div>

      {/* Sub */}
      <div className="flex items-center gap-2 text-[10px] font-medium text-white/30 uppercase tracking-[0.15em]">
        <div
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: stat.color }}
        />
        {stat.sub}
      </div>
    </motion.div>
  );
};

export const StatsSection = () => {
  return (
    <section
      className="py-16 md:py-24 bg-[#020202] relative overflow-hidden border-y border-white/[0.05]"
      aria-label="IFX Trades platform statistics"
    >
      {/* Subtle ambient */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none"
        aria-hidden
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(16,185,129,0.025), transparent)" }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: SNAP }}
          className="flex items-center gap-3 mb-10"
        >
          <div className="h-px w-8 bg-emerald-500" />
          <span
            className="text-[10px] uppercase text-emerald-500 font-bold tracking-[0.2em]"
          >
            Institutional Impact
          </span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-white/[0.06] rounded-[2rem] overflow-hidden">
          {stats.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
};
