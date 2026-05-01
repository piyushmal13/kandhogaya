import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "motion/react";
import { Link } from "react-router-dom";
import { Cpu, Video, ArrowUpRight, BarChart2, BookOpen, ChevronRight, Brain, ShieldCheck } from "lucide-react";

const modules = [
  {
    id: "quantx",
    title: "Neural Logic Execution",
    description: "Our flagship multi-layer AI intelligence system. Unlike static, dead systems, QuantX dynamically adapts to live market conditions for precision execution.",
    icon: Brain,
    link: "/quantx",
    accent: "#10B981",
    tag: "ELITE",
    size: "lg",
  },
  {
    id: "competitive_edge",
    title: "The Institutional Edge",
    description: "We don't sell retail dreams. We deliver an algorithmic system that actually works in live markets, giving you a distinct advantage over standard retail traders.",
    icon: ShieldCheck,
    link: "/quantx",
    accent: "#06B6D4",
    tag: "ADVANTAGE",
    size: "sm",
  },
  {
    id: "webinars",
    title: "Live Strategy Sessions",
    description: "Join our developers in real-time as they break down algorithmic logic, execution models, and market regimes.",
    icon: Video,
    link: "/webinars",
    accent: "#D4AF37",
    tag: "MASTERCLASS",
    size: "sm",
  },
  {
    id: "adaptive_systems",
    title: "Adaptive Self-Learning",
    description: "Our models employ deep-learning loops to evolve alongside shifting market regimes, keeping you consistently ahead of the curve.",
    icon: Cpu,
    link: "/quantx",
    accent: "#8B5CF6",
    tag: "TECHNOLOGY",
    size: "sm",
  },
  {
    id: "macro_research",
    title: "Macro-Economic Research",
    description: "Daily deep-dives into global macro-economics, providing the fundamental backdrop that powers our algorithmic risk adjustments.",
    icon: BookOpen,
    link: "/blog",
    accent: "#F43F5E",
    tag: "INTELLIGENCE",
    size: "sm",
  },
];

const hexToRgba = (hex: string, opacity: number) => {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${opacity})`;
};

const TiltCard = ({ mod, index }: { mod: typeof modules[0]; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spotX = useMotionValue(0);
  const spotY = useMotionValue(0);

  const springX = useSpring(mx, { stiffness: 180, damping: 22 });
  const springY = useSpring(my, { stiffness: 180, damping: 22 });
  const rotateX = useTransform(springY, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-6deg", "6deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    spotX.set(e.clientX - rect.left);
    spotY.set(e.clientY - rect.top);
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => { mx.set(0); my.set(0); };

  const isLarge = mod.size === "lg";

  return (
    <motion.div
      initial={{ opacity: 0, y: 36, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.08, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: "1000px" }}
      className={`h-full ${isLarge ? "min-h-[300px]" : "min-h-[220px] md:min-h-[260px]"}`}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative group h-full"
      >
        <Link
          to={mod.link}
          className="flex flex-col h-full p-7 md:p-9 rounded-[2rem] bg-[#030406] border border-white/[0.05] overflow-hidden transition-all duration-500 group-hover:border-white/[0.1]"
          style={{ boxShadow: "0 30px 60px rgba(0,0,0,0.45)" }}
        >
          {/* Spotlight glow */}
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: useMotionTemplate`radial-gradient(500px circle at ${spotX}px ${spotY}px, ${hexToRgba(mod.accent, 0.07)}, transparent 45%)`,
            }}
          />
          {/* Border glow */}
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem]"
            style={{
              background: useMotionTemplate`radial-gradient(350px circle at ${spotX}px ${spotY}px, ${hexToRgba(mod.accent, 0.3)}, transparent 45%)`,
              WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              padding: "1px",
            }}
          />

          {/* 3D Content */}
          <div className="relative z-10 flex flex-col h-full" style={{ transform: "translateZ(20px)" }}>
            {/* Top row */}
            <div className="flex items-start justify-between mb-auto">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: hexToRgba(mod.accent, 0.08),
                    borderColor: hexToRgba(mod.accent, 0.15),
                  }}
                >
                  <mod.icon className="w-5 h-5" style={{ color: mod.accent }} aria-hidden />
                </div>
                <span
                  className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-[0.25em]"
                  style={{
                    color: mod.accent,
                    background: hexToRgba(mod.accent, 0.08),
                    border: `1px solid ${hexToRgba(mod.accent, 0.15)}`,
                  }}
                >
                  {mod.tag}
                </span>
              </div>
              <div
                className="w-8 h-8 rounded-full border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110"
                style={{ borderColor: hexToRgba(mod.accent, 0.2) }}
              >
                <ArrowUpRight className="w-3.5 h-3.5 text-white/50" />
              </div>
            </div>

            {/* Text */}
            <div className={isLarge ? "mt-10" : "mt-8"}>
              <h3 className={`font-black text-white mb-2.5 tracking-tight leading-tight ${isLarge ? "text-2xl md:text-3xl" : "text-lg md:text-xl"}`}>
                {mod.title}
              </h3>
              <p className={`text-white/35 leading-relaxed ${isLarge ? "text-sm md:text-base" : "text-[13px]"}`}>
                {mod.description}
              </p>
              <div
                className="mt-5 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                style={{ color: mod.accent }}
              >
                Explore <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export const EcosystemSection = () => {
  return (
    <section className="py-24 md:py-36 bg-[#010203] relative overflow-hidden" aria-labelledby="ecosystem-heading">
      {/* Background ambient */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[55%] bg-[radial-gradient(ellipse_65%_50%_at_50%_0%,rgba(16,185,129,0.055),transparent)]" />
        <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Header */}
        <div className="mb-16 md:mb-20 flex flex-col lg:flex-row lg:items-end gap-8 justify-between">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/[0.06] border border-emerald-500/[0.12] text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-7"
            >
              <BarChart2 className="w-3.5 h-3.5" aria-hidden />
              Institutional Core
            </motion.div>

            <motion.h2
              id="ecosystem-heading"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-[80px] font-bold text-white tracking-tight leading-[1] max-w-4xl"
            >
              The Next-Gen <br />
              <span className="text-emerald-400">Algorithmic Ecosystem.</span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.16 }}
            className="text-white/35 max-w-sm text-[15px] leading-relaxed lg:text-right lg:pb-3"
          >
            A cohesive architecture of adaptive algorithms, macro intelligence, and execution models—built to simulate live markets.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {/* Row 1 */}
          <div className="lg:col-span-2">
            <TiltCard mod={modules[0]} index={0} />
          </div>
          <div className="lg:col-span-1">
            <TiltCard mod={modules[1]} index={1} />
          </div>

          {/* Row 2 */}
          {modules.slice(2).map((mod, i) => (
            <div key={mod.id} className="lg:col-span-1">
              <TiltCard mod={mod} index={i + 2} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
