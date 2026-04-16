import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Zap } from "lucide-react";

export const SignalsHero = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-32 pb-24"
      style={{ background: "linear-gradient(180deg, var(--bg-base), var(--color7))" }}
    >
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 overflow-hidden pointer-events-none will-change-transform"
        aria-hidden="true"
      >
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[600px] opacity-80"
          style={{ background: "radial-gradient(ellipse at top, rgba(88,242,182,0.12), transparent 70%)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
            backgroundSize: "120px 120px",
            maskImage: "radial-gradient(ellipse at center, black 70%, transparent 100%)",
          }}
        />
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono tracking-widest mb-6 border"
          style={{
            background: "var(--accent-subtle)",
            borderColor: "rgba(88,242,182,0.2)",
            color: "var(--accent)",
          }}
        >
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "var(--accent)" }} />
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "var(--accent)" }} />
          </span>
          QUANTITATIVE RESEARCH DESK ACTIVE
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-8xl font-bold text-white tracking-tighter mb-8 leading-tight"
        >
          Algorithmic Execution. <br />
          <span className="site-title-gradient">Zero Bias.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed font-light"
          style={{ color: "var(--text-muted)" }}
        >
          Institutional-grade educational models parsed by our active neural engine. We analyze global liquidity voids to demonstrate precise simulation environments.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
          className="group relative px-10 py-5 font-bold text-lg rounded-2xl overflow-hidden flex items-center gap-3 mx-auto transition-all duration-300"
          style={{
            background: "var(--accent)",
            color: "var(--accent-fg)",
            boxShadow: "0 0 60px rgba(88,242,182,0.4)",
          }}
          aria-label="Access Quantitative Models — scroll to pricing"
        >
          <div
            className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"
            aria-hidden="true"
          />
          <span className="relative z-10 flex items-center gap-2">
            Access Quantitative Models
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </span>
        </motion.button>
      </div>
    </section>
  );
};
