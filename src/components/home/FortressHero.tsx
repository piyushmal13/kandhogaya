import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { ArrowRight, ChevronDown, Activity, Shield, Cpu, Globe } from "lucide-react";
import { SovereignButton } from "../ui/SovereignButton";
import { institutionalVariants, containerVariants, itemVariants } from "@/lib/motion";

const CodeRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "01010101010101010101";
    const charArray = chars.split("");
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    const draw = () => {
      ctx.fillStyle = "rgba(2, 2, 2, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#58F2B6"; // Accent Primary
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 opacity-[0.03] pointer-events-none" />;
};

export const FortressHero = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center bg-[#020202] overflow-hidden selection:bg-[#58F2B6]/30"
    >
      {/* ── SOVEREIGN DEPTH LAYER ── */}
      <CodeRain />
      
      {/* Mouse Tracking Spotlight */}
      <div 
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(88, 242, 182, 0.04), transparent 80%)`
        }}
      />

      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-20" />

      <div className="container mx-auto px-6 relative z-30">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto text-center"
        >
          {/* Status Badge */}
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-xl mb-10"
          >
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#58F2B6] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#58F2B6]"></span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#58F2B6]/80">
              Sovereign Execution Environment <span className="text-white/20 ml-2">v2.0_ELITE</span>
            </span>
          </motion.div>

          {/* Headline Engine */}
          <motion.h1 
            variants={itemVariants}
            className="text-6xl md:text-8xl lg:text-[140px] font-black text-white tracking-tighter leading-[0.85] uppercase mb-10"
          >
            Institutional <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#58F2B6] via-[#F8FAFC] to-[#58F2B6]/40">
              Intelligence
            </span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-2xl text-[rgba(248,250,252,0.6)] max-w-3xl mx-auto mb-16 leading-relaxed font-light tracking-wide uppercase"
          >
            Engineering proprietary algorithmic liquidity and <br className="hidden md:block" />
            macroeconomic alpha for the world's most disciplined traders.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <SovereignButton variant="primary" size="xl" glowEffect>
              Begin Deployment
            </SovereignButton>
            <SovereignButton variant="outline" size="xl">
              Audit Performance
            </SovereignButton>
          </motion.div>
        </motion.div>
      </div>

      {/* Metadata Perimeter */}
      <div className="absolute bottom-20 left-10 hidden xl:flex items-center gap-6">
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#58F2B6]/40">Live Matrix</span>
          <div className="flex items-center gap-2">
            <Cpu className="w-3 h-3 text-[#58F2B6]" />
            <span className="text-[10px] font-mono text-white/40">Core_01: ACTIVE</span>
          </div>
        </div>
        <div className="h-8 w-px bg-white/10" />
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Network</span>
          <div className="flex items-center gap-2">
            <Globe className="w-3 h-3 text-white/20" />
            <span className="text-[10px] font-mono text-white/40">Global_Pulse: 100%</span>
          </div>
        </div>
      </div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 cursor-pointer opacity-20 hover:opacity-100 transition-opacity"
      >
        <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white">Initialize Scroll</span>
        <ChevronDown className="w-4 h-4 text-[#58F2B6]" />
      </motion.div>
    </section>
  );
};
