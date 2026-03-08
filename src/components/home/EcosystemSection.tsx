import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "motion/react";
import { Link } from "react-router-dom";
import { Zap, Cpu, Video, GraduationCap, ArrowUpRight } from "lucide-react";

const modules = [
  {
    id: "signals",
    title: "Live Signals",
    description: "Institutional-grade trade setups with exact entry, stop loss, and take profit levels.",
    icon: Zap,
    link: "/signals",
  },
  {
    id: "algorithms",
    title: "Trading Algorithms",
    description: "Automated gold and forex trading bots designed for consistent, hands-free returns.",
    icon: Cpu,
    link: "/marketplace",
  },
  {
    id: "webinars",
    title: "Live Webinars",
    description: "Weekly market breakdowns and strategy sessions with our elite analyst team.",
    icon: Video,
    link: "/webinars",
  },
  {
    id: "academy",
    title: "Trading Academy",
    description: "From beginner concepts to advanced institutional order block strategies.",
    icon: GraduationCap,
    link: "/academy",
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
          className="block relative h-full p-8 rounded-[2rem] bg-[#050505] border border-white/5 overflow-hidden transition-colors duration-500 group-hover:bg-[#0a0a0a]"
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
            className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[2rem]"
            style={{
              background: useMotionTemplate`radial-gradient(400px circle at ${spotlightX}px ${spotlightY}px, rgba(16, 185, 129, 0.5), transparent 40%)`,
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
            <div className="absolute top-0 right-0 w-10 h-10 rounded-full bg-white/[0.02] flex items-center justify-center border border-white/5 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <ArrowUpRight className="w-5 h-5 text-gray-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-500" />
            </div>

            <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-8 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all duration-500">
              <mod.icon className="w-8 h-8 text-gray-400 group-hover:text-emerald-400 group-hover:scale-110 transition-all duration-500" />
            </div>
            
            <h3 className="text-2xl font-semibold text-white mb-4 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all duration-500">
              {mod.title}
            </h3>
            
            <p className="text-gray-400 text-lg leading-relaxed max-w-md group-hover:text-gray-300 transition-colors duration-500">
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
    <section className="py-32 bg-[#020202] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-gray-300 text-xs font-mono tracking-widest mb-6 backdrop-blur-md"
          >
            THE ECOSYSTEM
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tighter"
          >
            Four Pillars of <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Intelligence</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto tracking-tight"
          >
            Everything you need to dominate the markets, integrated into one powerful, institutional-grade platform.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {modules.map((mod, i) => (
            <EcosystemCard key={mod.id} mod={mod} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};
