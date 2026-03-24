import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "motion/react";
import { Link } from "react-router-dom";
import { Zap, Cpu, Video, GraduationCap, ArrowUpRight } from "lucide-react";

const modules = [
  {
    id: "signals",
    title: "AI Signal Engine",
    description: "Proprietary HFT algorithms scanning 40+ assets in real-time with exact entry and targets.",
    icon: Zap,
    link: "/signals",
  },
  {
    id: "algorithms",
    title: "Elite Bot Ecosystem",
    description: "Automated trading execution with low-latency API integration and institutional logic.",
    icon: Cpu,
    link: "/products",
  },
  {
    id: "webinars",
    title: "Live Analysis Portal",
    description: "Daily market breakdowns and real-time trade ideas with our elite analyst team.",
    icon: Video,
    link: "/signals",
  },
  {
    id: "academy",
    title: "Elite Academy",
    description: "Professional-grade mentorship and certified courses for serious retail traders.",
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
          className="block relative h-full p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] bg-[#050505] border border-white/5 overflow-hidden transition-colors duration-500 group-hover:bg-[#0a0a0a]"
        >
          {/* Spotlight Background Glow */}
          <motion.div
            className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: useMotionTemplate`radial-gradient(600px circle at ${spotlightX}px ${spotlightY}px, rgba(16, 185, 129, 0.05), transparent 40%)`,
            }}
          />
          
          {/* Glowing Edge Mask */}
          <motion.div
            className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl md:rounded-[2.5rem]"
            style={{
              background: useMotionTemplate`radial-gradient(400px circle at ${spotlightX}px ${spotlightY}px, rgba(16, 185, 129, 1), transparent 40%)`,
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              padding: "1px",
            }}
          />

          {/* 3D Content Container - Pops out due to translateZ */}
          <div 
            className="relative z-10 flex flex-col h-full" 
            style={{ transform: "translateZ(40px)" }}
          >
            {/* Top Right Arrow */}
            <div className="absolute top-0 right-0 w-8 h-8 md:w-12 md:h-12 rounded-full bg-white/[0.02] flex items-center justify-center border border-white/5 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <ArrowUpRight className="w-4 h-4 md:w-6 md:h-6 text-gray-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-500" />
            </div>

            <div className="w-12 h-12 md:w-20 md:h-20 rounded-xl md:rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-6 md:mb-10 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all duration-500 neon-glow-emerald">
              <mod.icon className="w-6 h-6 md:w-10 md:h-10 text-gray-400 group-hover:text-emerald-400 group-hover:scale-110 transition-all duration-500" />
            </div>
            
            <h3 className="text-xl md:text-3xl font-bold text-white mb-3 md:mb-6 tracking-tight group-hover:text-emerald-400 transition-all duration-500 uppercase">
              {mod.title}
            </h3>
            
            <p className="text-gray-400 text-sm md:text-xl leading-relaxed max-w-md group-hover:text-gray-300 transition-colors duration-500 font-mono italic">
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
    <section className="py-24 md:py-40 bg-[#020202] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.03),transparent_70%)]" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16 md:mb-32">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono tracking-[0.2em] uppercase mb-6"
          >
            Institutional Core
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 md:mb-10 tracking-tighter"
          >
            The IFX <span className="gradient-text">Ecosystem</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gray-500 max-w-2xl mx-auto text-lg md:text-2xl leading-relaxed font-mono px-4"
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
