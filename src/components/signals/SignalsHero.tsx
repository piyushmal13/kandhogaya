import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";


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
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-32 pb-24 md:pt-48 md:pb-32 bg-[#020202]"
    >
      {/* Premium Atmospheric Background */}
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_70%)]" />
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "url('/grid.svg')",
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse at center, black 40%, transparent 100%)",
          }}
        />
        {/* Animated Particles or Floaters could go here */}
      </motion.div>

      <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-emerald-500/[0.04] border border-emerald-500/[0.15] text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em] mb-12"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="ml-2">Sovereign Research Desk Active</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-shimmer mb-10 leading-[0.9]"
        >
          Research Intelligence. <br />
          <span className="italic font-serif text-gradient-emerald">High Fidelity.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-lg md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light mb-16"
        >
          Institutional-grade research models parsed by our active neural engine. We analyze global liquidity voids to demonstrate precise simulation environments for sophisticated participants.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <button
            onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
            className="group relative px-12 py-5 bg-white text-black font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-[0_20px_40px_rgba(255,255,255,0.1)] active:scale-95"
          >
            Access Research Models
          </button>
          <button
            onClick={() => document.getElementById("performance")?.scrollIntoView({ behavior: "smooth" })}
            className="px-12 py-5 bg-white/[0.03] text-white/60 border border-white/[0.08] font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl transition-all duration-500 hover:bg-white/[0.06] hover:text-white"
          >
            Audit Performance
          </button>
        </motion.div>
      </div>
    </section>
  );
};
