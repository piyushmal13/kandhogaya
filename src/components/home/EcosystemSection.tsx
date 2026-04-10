import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "motion/react";
import { Link } from "react-router-dom";
import { Zap, Cpu, Video, GraduationCap, ArrowUpRight } from "lucide-react";

const modules = [
  {
    id: "signals",
    title: "AI Signal Intelligence",
    description: "Multi-layered HFT algorithms processing 40+ asset classes with institutional-grade entry precision.",
    icon: Zap,
    link: "/signals",
  },
  {
    id: "algorithms",
    title: "Enterprise Execution",
    description: "Low-latency trading architecture with direct API integration and systematic risk management.",
    icon: Cpu,
    link: "/products",
  },
  {
    id: "webinars",
    title: "Volatility Desk",
    description: "Live market-flow visualization and strategic trade ideation from senior institutional analysts.",
    icon: Video,
    link: "/signals",
  },
  {
    id: "academy",
    title: "Professional Academy",
    description: "Comprehensive certification tracks and advanced development modules for sophisticated traders.",
    icon: GraduationCap,
    link: "/courses",
  }
];

const EcosystemCard = ({ mod, index }: { mod: typeof modules[0], index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  // Mouse position values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Smooth springs for the 3D tilt
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  
  // Transform mouse position into rotation degrees
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  // Spotlight position values
  const spotlightX = useMotionValue(0);
  const spotlightY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Update spotlight
    spotlightX.set(mouseX);
    spotlightY.set(mouseY);
    
    // Update 3D tilt (normalized between -0.5 and 0.5)
    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    // Reset tilt on leave
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: index * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: "1000px" }}
      className="h-full"
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative group h-full"
      >
        <Link 
          to={mod.link} 
          className="block relative h-full p-8 md:p-12 rounded-[2.5rem] bg-[var(--color6)] border border-white/5 overflow-hidden transition-all duration-700 group-hover:bg-[var(--color11)] group-hover:border-white/10 shadow-2xl"
        >
          {/* Spotlight Background Glow */}
          <motion.div
            className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
            style={{
              background: useMotionTemplate`radial-gradient(800px circle at ${spotlightX}px ${spotlightY}px, rgba(131, 255, 200, 0.04), transparent 40%)`,
            }}
          />
          
          {/* Glowing Edge Mask */}
          <motion.div
            className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2.5rem]"
            style={{
              background: useMotionTemplate`radial-gradient(600px circle at ${spotlightX}px ${spotlightY}px, rgba(131, 255, 200, 0.4), transparent 40%)`,
              WebkitMask: "linear-gradient(var(--color12) 0 0) content-box, linear-gradient(var(--color12) 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              padding: "1px",
            }}
          />

          {/* 3D Content Container */}
          <div 
            className="relative z-10 flex flex-col h-full" 
            style={{ transform: "translateZ(60px)" }}
          >
            {/* Top Right Arrow */}
            <div className="absolute top-0 right-0 w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/[0.015] flex items-center justify-center border border-white/5 group-hover:bg-[var(--brand)]/5 group-hover:border-[var(--brand)]/20 transition-all duration-700 group-hover:scale-110">
              <ArrowUpRight className="w-5 h-5 md:w-7 md:h-7 text-white/20 group-hover:text-[var(--brand)] transition-all duration-700" />
            </div>

            <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-[2rem] bg-white/[0.015] border border-white/5 flex items-center justify-center mb-8 md:mb-12 group-hover:bg-[var(--brand)]/5 group-hover:border-[var(--brand)]/20 transition-all duration-700">
              <mod.icon className="w-7 h-7 md:w-10 md:h-10 text-white/30 group-hover:text-[var(--brand)] transition-all duration-700" />
            </div>
            
            <h3 className="text-2xl md:text-4xl font-semibold text-white mb-4 md:mb-6 tracking-tight group-hover:text-white transition-all duration-700">
              {mod.title}
            </h3>
            
            <p className="text-gray-400 text-base md:text-xl leading-relaxed max-w-sm group-hover:text-gray-300 transition-colors duration-700 font-sans font-light">
              {mod.description}
            </p>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export const EcosystemSection = () => {
  return (
    <section className="py-24 md:py-40 bg-[var(--color10)] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.03),transparent_70%)]" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16 md:mb-32">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-[var(--brand)] text-[11px] font-sans font-medium tracking-[0.3em] uppercase mb-8"
          >
            Institutional Core
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl md:text-8xl font-semibold text-white mb-8 md:mb-12 tracking-[-0.04em]"
          >
            The IFX <span className="gradient-text italic font-serif">Ecosystem</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gray-400 max-w-3xl mx-auto text-lg md:text-2xl leading-relaxed font-sans font-light px-4 opacity-80"
          >
            Everything you need for serious market execution, integrated into one powerful platform.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
          {modules.map((mod, i) => (
            <EcosystemCard key={mod.id} mod={mod} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};
