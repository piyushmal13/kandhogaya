import { useRef, useEffect } from 'react';
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';

const metrics = [
  { value: 12400, suffix: '+', label: 'Algorithms Deployed' },
  { value: 84.2, suffix: '%', label: 'Avg Signal Accuracy' },
  { value: 40, suffix: '+', label: 'Countries Active' },
  { value: 2500, suffix: 'ms', label: 'Avg Latency' },
];

function AnimatedCounter({ value, suffix }: { value: number, suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 3000 });
  const display = useTransform(springValue, (latest) => 
    latest % 1 === 0 ? Math.floor(latest).toLocaleString() : latest.toFixed(1)
  );

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  return (
    <span ref={ref} className="tabular-nums">
      <motion.span>{display}</motion.span>{suffix}
    </span>
  );
}

export function MetricsTicker() {
  return (
    <section className="py-20 border-y border-white/10 bg-black/40 overflow-hidden">
      <div className="flex">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ 
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            },
          }}
          className="flex gap-12 shrink-0"
        >
          {[...metrics, ...metrics].map((metric, i) => (
            <div key={i} className="flex items-center gap-4 px-8">
              <div className="text-6xl md:text-7xl font-bold text-emerald-400 font-heading">
                <AnimatedCounter value={metric.value} suffix={metric.suffix} />
              </div>
              <div className="text-sm text-foreground/60 uppercase tracking-wider max-w-[120px] leading-tight">
                {metric.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
