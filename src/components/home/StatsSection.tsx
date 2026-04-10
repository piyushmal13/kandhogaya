import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";

// CONVERTED from broker-like metrics to institutional EDUCATION metrics
// Per CEO directive: No AUM, Daily Volume, or Execution latency
const stats = [
  { 
    label: "Elite Students", 
    value: "12,400",
    suffix: "+",
    sub: "India, Dubai & Global",
    color: "text-white"
  },
  { 
    label: "Course Completion Rate", 
    value: "94",
    suffix: "%",
    sub: "Industry-Leading Outcomes",
    color: "text-emerald-400"
  },
  { 
    label: "Live Webinars Hosted", 
    value: "280",
    suffix: "+",
    sub: "Since 2022",
    color: "text-emerald-400"
  },
  { 
    label: "Countries Reached", 
    value: "40",
    suffix: "+",
    sub: "Global Community",
    color: "text-white"
  },
];

const useCountUp = (end: number, trigger: boolean, duration: number = 2500) => {
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

const StatItem = ({ stat, i }: { stat: typeof stats[0], i: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const match = stat.value.match(/(\d+(\.\d+)?)/);
  const numericValue = match ? Number.parseFloat(match[0]) : 0;
  const hasDecimal = stat.value.includes('.');
  const animatedValue = useCountUp(numericValue, isInView, 2500);
  const formattedCount = hasDecimal 
    ? animatedValue.toFixed(1) 
    : Math.floor(animatedValue).toLocaleString();

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
      className="relative p-10 md:p-14 bg-transparent transition-all duration-700 flex flex-col justify-start group border-b lg:border-b-0 lg:border-r border-white/5 last:border-r-0 hover:bg-white/[0.01]"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-gradient-to-tr from-[var(--brand)]/5 via-transparent to-transparent pointer-events-none" />
      <div className="text-[10px] md:text-[11px] font-sans font-medium uppercase tracking-[0.3em] mb-6 md:mb-12 opacity-50 group-hover:opacity-90 transition-all duration-500 text-gray-400">
        {stat.label}
      </div>
      <div className={`text-5xl md:text-8xl font-sans font-bold tracking-tight mb-4 md:mb-6 transition-all duration-700 group-hover:translate-x-1 ${stat.color}`}>
        <span className="tabular-nums">{formattedCount}{stat.suffix}</span>
      </div>
      <div className="text-[10px] md:text-sm font-sans font-light flex items-center gap-3 opacity-60 group-hover:opacity-100 transition-all duration-500 text-gray-400">
        <div className={`w-1.5 h-1.5 rounded-full ${stat.color.replace('text-', 'bg-')} animate-pulse`} />
        <span className="tracking-wide">{stat.sub}</span>
      </div>
    </motion.div>
  );
};

export const StatsSection = () => {
  return (
    <section className="py-24 md:py-32 bg-[var(--color10)] relative overflow-hidden" aria-label="IFX Trades platform statistics">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(131,255,200,0.02),transparent_70%)] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 site-panel overflow-hidden border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.4)]">
          {stats.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
};
