import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";

// ─── LOCKED: DO NOT MODIFY ────────────────────────────────────────────────────
// useCountUp: RAF-based count animation with cubic ease-out — pure math, no deps
// useInView: triggers once on viewport entry — scroll-intersection logic
// stats array: CEO-directive metrics (education-only, no broker metrics)
// ─────────────────────────────────────────────────────────────────────────────

const SNAP = [0.4, 0, 0.2, 1] as const;

const stats = [
  {
    label: "Elite Students",
    value: "12,400",
    suffix: "+",
    sub: "India, Dubai & Global",
    color: "text-white",
    accentColor: "bg-white",
  },
  {
    label: "Course Completion Rate",
    value: "94",
    suffix: "%",
    sub: "Industry-Leading Outcomes",
    color: "text-emerald-400",
    accentColor: "bg-emerald-400",
  },
  {
    label: "Live Webinars Hosted",
    value: "280",
    suffix: "+",
    sub: "Since 2022",
    color: "text-[var(--brand-accent)]",
    accentColor: "bg-[var(--brand-accent)]",
  },
  {
    label: "Countries Reached",
    value: "40",
    suffix: "+",
    sub: "Global Community",
    color: "text-[var(--brand-secondary)]",
    accentColor: "bg-[var(--brand-secondary)]",
  },
];

// LOCKED — RAF count-up engine
const useCountUp = (end: number, trigger: boolean, duration: number = 1800) => {
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
  const hasDecimal = stat.value.includes('.');
  // LOCKED — useCountUp trigger
  const animatedValue = useCountUp(numericValue, isInView, 1800);
  const formattedCount = hasDecimal
    ? animatedValue.toFixed(1)
    : Math.floor(animatedValue).toLocaleString();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.09, duration: 0.35, ease: SNAP }}
      className="relative p-10 md:p-14 flex flex-col justify-start group border-b lg:border-b-0 lg:border-r border-white/[0.05] last:border-r-0 hover:bg-white/[0.012] transition-colors duration-150 overflow-hidden"
    >
      {/* Subtle ambient glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-tr from-[var(--brand-primary)]/[0.04] via-transparent to-transparent pointer-events-none" />

      {/* Data label — IBM Plex Mono, precision */}
      <div
        className="text-[9px] md:text-[10px] font-black uppercase mb-6 md:mb-10 opacity-40 group-hover:opacity-70 transition-opacity duration-150 text-white/60"
        style={{ fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.3em' }}
      >
        {stat.label}
      </div>

      {/* Animated value — IBM Plex Mono, dominant size */}
      <div
        className={`text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-tight mb-4 transition-transform duration-150 group-hover:translate-x-0.5 tabular-nums ${stat.color}`}
        style={{ fontFamily: 'IBM Plex Mono, monospace' }}
      >
        {formattedCount}{stat.suffix}
      </div>

      {/* Sub-label */}
      <div
        className="text-[9px] md:text-[11px] font-medium flex items-center gap-2.5 opacity-50 group-hover:opacity-80 transition-opacity duration-150 text-white/50"
        style={{ fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.12em' }}
      >
        <div className={`w-1.5 h-1.5 rounded-full ${stat.accentColor} animate-pulse`} />
        <span className="uppercase tracking-wide">{stat.sub}</span>
      </div>

      {/* Bottom separator line — appears on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-primary)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
    </motion.div>
  );
};

export const StatsSection = () => {
  return (
    <section
      className="py-24 md:py-32 bg-[var(--bg-base)] relative overflow-hidden"
      aria-label="IFX Trades platform statistics"
    >
      {/* Radial ambient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.025),transparent_65%)] pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, ease: SNAP }}
          className="flex items-center gap-3 mb-12 md:mb-16"
        >
          <div className="h-px w-8 bg-[var(--brand-primary)]" />
          <span
            className="text-[9px] uppercase text-[var(--brand-primary)] font-black"
            style={{ fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.35em' }}
          >
            PLATFORM_TELEMETRY
          </span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 site-panel overflow-hidden border border-white/[0.05] shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
          {stats.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
};
