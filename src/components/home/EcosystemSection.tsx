import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "motion/react";
import { Link } from "react-router-dom";
import { Zap, Cpu, Video, GraduationCap, ArrowUpRight, BarChart2, BookOpen } from "lucide-react";

const modules = [
  {
    id: "signals",
    title: "AI Signal Intelligence",
    description: "Multi-layered analytical algorithms processing 40+ asset classes with institutional-grade precision.",
    icon: Zap,
    link: "/signals",
    accent: "#10B981",
    size: "lg", // takes 2 cols on large
  },
  {
    id: "algorithms",
    title: "Enterprise Execution",
    description: "High-performance architecture with systematic risk management.",
    icon: Cpu,
    link: "/marketplace",
    accent: "#06B6D4",
    size: "sm",
  },
  {
    id: "academy",
    title: "Professional Academy",
    description: "Certification tracks and advanced development for sophisticated traders.",
    icon: GraduationCap,
    link: "/academy",
    accent: "#8B5CF6",
    size: "sm",
  },
  {
    id: "webinars",
    title: "Volatility Desk",
    description: "Live market-flow visualization and strategic trade ideation from senior institutional analysts.",
    icon: Video,
    link: "/webinars",
    accent: "#D4AF37",
    size: "sm",
  },
  {
    id: "blog",
    title: "Macro Intelligence",
    description: "Deep-dive research articles, market commentary, and institutional-grade analysis.",
    icon: BookOpen,
    link: "/blog",
    accent: "#F43F5E",
    size: "sm",
  },
];

const TiltCard = ({ mod, index }: { mod: typeof modules[0]; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 25 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);
  const spotX = useMotionValue(0);
  const spotY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    spotX.set(mx);
    spotY.set(my);
    x.set(mx / rect.width - 0.5);
    y.set(my / rect.height - 0.5);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  const accent = mod.accent;
  const accentHex = accent;
  const accentRgba = (opacity: number) => {
    // hex to rgba helper
    const r = Number.parseInt(accent.slice(1, 3), 16);
    const g = Number.parseInt(accent.slice(3, 5), 16);
    const b = Number.parseInt(accent.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${opacity})`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay: index * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: "1200px" }}
      className="h-full min-h-[240px] md:min-h-[280px]"
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
          data-cursor="EXPLORE"
          className="flex flex-col h-full p-7 md:p-10 rounded-[2.5rem] bg-[#080B12] border border-white/[0.05] overflow-hidden transition-all duration-700 group-hover:border-white/10"
          style={{ boxShadow: `0 40px 80px rgba(0,0,0,0.5)` }}
        >
          {/* Spotlight */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: useMotionTemplate`radial-gradient(600px circle at ${spotX}px ${spotY}px, ${accentRgba(0.06)}, transparent 40%)`,
            }}
          />
          {/* Edge glow on hover */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[2.5rem]"
            style={{
              background: useMotionTemplate`radial-gradient(400px circle at ${spotX}px ${spotY}px, ${accentRgba(0.35)}, transparent 40%)`,
              WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              padding: "1px",
            }}
          />

          {/* 3D content */}
          <div className="relative z-10 flex flex-col h-full" style={{ transform: "translateZ(24px)" }}>
            <div className="flex items-start justify-between mb-auto">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 group-hover:scale-110"
                style={{
                  background: accentRgba(0.08),
                  borderColor: accentRgba(0.15),
                }}
              >
                <mod.icon className="w-5 h-5" style={{ color: accentHex }} aria-hidden />
              </div>
              <div
                className="w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-500 group-hover:scale-110"
                style={{ borderColor: accentRgba(0.15), background: accentRgba(0.05) }}
              >
                <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-white transition-colors duration-500" aria-hidden />
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl md:text-2xl font-black text-white mb-3 tracking-tight leading-tight">
                {mod.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {mod.description}
              </p>
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export const EcosystemSection = () => {
  return (
    <section className="py-24 md:py-40 bg-[#020202] relative overflow-hidden" aria-labelledby="ecosystem-heading">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100%] h-[50%] bg-[radial-gradient(ellipse_70%_50%_at_center_top,rgba(16,185,129,0.05),transparent)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/[0.05] border border-emerald-500/[0.1] text-emerald-400 text-[10px] font-black uppercase tracking-[0.35em] mb-8"
          >
            <BarChart2 className="w-3.5 h-3.5" aria-hidden />
            Institutional Core
          </motion.div>

          <motion.h2
            id="ecosystem-heading"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-[100px] font-black text-white mb-8 tracking-tighter leading-[0.95] max-w-4xl mx-auto"
          >
            THE{" "}
            <span className="italic font-serif text-gradient-emerald">INFRASTRUCTURE</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed"
          >
            Everything serious traders need — integrated into a single, institutional-grade platform.
          </motion.p>
        </div>

        {/* Bento grid — large + small cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {/* Row 1: one wide card (2 cols) + one small */}
          <div className="lg:col-span-2">
            <TiltCard mod={modules[0]} index={0} />
          </div>
          <div className="lg:col-span-1">
            <TiltCard mod={modules[1]} index={1} />
          </div>

          {/* Row 2: three equal cards */}
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
