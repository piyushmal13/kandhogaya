import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';

export const AnimatedAlgoCube = ({ className = "" }: { className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      setMousePos({
        x: (clientX / innerWidth - 0.5) * 20,
        y: (clientY / innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const smoothMouseX = useSpring(mousePos.x, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mousePos.y, { stiffness: 50, damping: 20 });

  // Bind scroll progression to the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 20,
    restDelta: 0.001
  });

  // Layer transformations
  const coreY = useTransform(smoothProgress, [0, 1], [0, 0]);
  const coreScale = useTransform(smoothProgress, [0, 1], [0.8, 1]);
  
  const midLayerY = useTransform(smoothProgress, [0, 1], [-20, -60]);
  const midLayerScale = useTransform(smoothProgress, [0, 1], [0.9, 1.25]);

  const topLayerY = useTransform(smoothProgress, [0, 1], [-40, -120]);
  const topLayerScale = useTransform(smoothProgress, [0, 1], [1, 1.5]);
  const topLayerOpacity = useTransform(smoothProgress, [0, 0.5, 1], [0.3, 0.6, 1]);

  return (
    <div ref={containerRef} className={`relative flex items-center justify-center ${className}`}>
      
      {/* Background glow that expands */}
      <motion.div 
        style={{ scale: coreScale, opacity: topLayerOpacity }}
        className="absolute w-[300px] h-[300px] bg-emerald-500/[0.2] blur-[120px] rounded-full"
      />

      <motion.div 
        className="relative w-[300px] h-[300px] sm:w-[450px] sm:h-[450px]" 
        style={{ 
          perspective: "1200px",
          rotateX: smoothMouseY,
          rotateY: smoothMouseX,
        }}
      >
        {/* BASE LAYER - The Matrix Core */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center transform-gpu"
          style={{ y: coreY, scale: coreScale, rotateX: "65deg", rotateZ: "45deg" }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="core-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <rect x="20" y="20" width="160" height="160" fill="url(#core-grad)" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.4" rx="12" />
            {/* Grid Lines */}
            {Array.from({length: 8}).map((_, i) => (
              <React.Fragment key={`grid-${i}`}>
                <line x1={20 + i*20} y1="20" x2={20 + i*20} y2="180" stroke="#10b981" strokeWidth="0.5" strokeOpacity="0.4" />
                <line x1="20" y1={20 + i*20} x2="180" y2={20 + i*20} stroke="#10b981" strokeWidth="0.5" strokeOpacity="0.4" />
              </React.Fragment>
            ))}
          </svg>
        </motion.div>

        {/* MID LAYER - Processing Nodes */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center transform-gpu pointer-events-none"
          style={{ y: midLayerY, scale: midLayerScale, rotateX: "65deg", rotateZ: "45deg" }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
            <rect x="40" y="40" width="120" height="120" fill="transparent" stroke="#10b981" strokeWidth="2.5" strokeOpacity="0.6" rx="10" />
            {/* Nodes */}
            {[
              {x: 40, y: 40}, {x: 100, y: 40}, {x: 160, y: 40},
              {x: 40, y: 100}, {x: 100, y: 100}, {x: 160, y: 100},
              {x: 40, y: 160}, {x: 100, y: 160}, {x: 160, y: 160}
            ].map((node, i) => (
              <circle key={`node-${i}`} cx={node.x} cy={node.y} r="5" fill="#34d399" className="animate-pulse shadow-[0_0_10px_#10b981]" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
            {/* Connections */}
            <path d="M 40 40 L 100 100 L 160 40" fill="none" stroke="#34d399" strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="6 4" />
            <path d="M 40 160 L 100 100 L 160 160" fill="none" stroke="#34d399" strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="6 4" />
          </svg>
        </motion.div>

        {/* TOP LAYER - The 'Algo Head' Cover */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center transform-gpu pointer-events-none z-10"
          style={{ y: topLayerY, scale: topLayerScale, rotateX: "65deg", rotateZ: "45deg", opacity: topLayerOpacity }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_30px_50px_rgba(16,185,129,0.4)] overflow-visible">
            <defs>
              <linearGradient id="top-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255, 255, 255, 0.15)" />
                <stop offset="100%" stopColor="rgba(255, 255, 255, 0.05)" />
              </linearGradient>
            </defs>
            {/* Glass panel */}
            <rect x="30" y="30" width="140" height="140" fill="url(#top-grad)" stroke="rgba(255,255,255,0.5)" strokeWidth="1" rx="15" />
            {/* Inner Ring */}
            <circle cx="100" cy="100" r="45" fill="none" stroke="rgba(16,185,129,0.9)" strokeWidth="3" strokeDasharray="12 6" className="origin-center animate-[spin_8s_linear_infinite]" />
            <circle cx="100" cy="100" r="35" fill="rgba(16,185,129,0.2)" stroke="#fff" strokeWidth="1.5" strokeOpacity="0.6" />
            <circle cx="100" cy="100" r="12" fill="#10b981" className="animate-pulse shadow-[0_0_15px_#10b981]" />
          </svg>
        </motion.div>

        {/* Connecting Lines between layers (visual illusion) */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center transform-gpu pointer-events-none"
          style={{ rotateX: "65deg", rotateZ: "45deg", opacity: smoothProgress }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
            {/* Simulate vertical connecting lasers */}
            <motion.path d="M 40 40 L 40 -120" fill="none" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.5" style={{ pathLength: smoothProgress }} />
            <motion.path d="M 160 40 L 160 -120" fill="none" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.5" style={{ pathLength: smoothProgress }} />
            <motion.path d="M 40 160 L 40 -120" fill="none" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.5" style={{ pathLength: smoothProgress }} />
            <motion.path d="M 160 160 L 160 -120" fill="none" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.5" style={{ pathLength: smoothProgress }} />
          </svg>
        </motion.div>

      </motion.div>
    </div>
  );
};
