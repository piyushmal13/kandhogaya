import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { ArrowDown, Play } from 'lucide-react';

export function HeroLaboratory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  
  // Text scramble effect
  const [displayText, setDisplayText] = useState('');
  const finalText = "ENGINEERED FOR ALPHA";
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  
  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        finalText
          .split('')
          .map((letter, index) => {
            if (index < iteration) return finalText[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );
      iteration += 1/3;
      if (iteration >= finalText.length) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Magnetic button effect
  const magneticX = useMotionValue(0);
  const magneticY = useMotionValue(0);
  const springX = useSpring(magneticX, { stiffness: 150, damping: 15 });
  const springY = useSpring(magneticY, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    magneticX.set((e.clientX - centerX) * 0.3);
    magneticY.set((e.clientY - centerY) * 0.3);
  };

  const handleMouseLeave = () => {
    magneticX.set(0);
    magneticY.set(0);
  };

  return (
    <section 
      ref={containerRef}
      className="relative h-[200vh] bg-background overflow-hidden"
    >
      {/* Animated Background Grid - 3D Perspective */}
      <motion.div 
        style={{ y, scale }}
        className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:64px_64px] perspective-1000"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </motion.div>

      {/* Floating Orbs with Blur */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ 
            x: [0, 100, 0], 
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ 
            x: [0, -100, 0], 
            y: [0, 100, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-emerald-400/10 rounded-full blur-[100px]"
        />
      </div>

      {/* Main Content - Fixed then releases */}
      <div className="sticky top-0 h-screen flex items-center justify-center">
        <motion.div 
          style={{ opacity }}
          className="relative z-10 max-w-7xl mx-auto px-6 text-center"
        >
          {/* Scramble Text Title */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold font-heading tracking-tighter">
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">
                {displayText}
              </span>
            </h1>
          </motion.div>

          {/* Subtitle with Word Reveal */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="text-xl md:text-2xl text-foreground/60 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            We architect proprietary trading systems for institutional desks. 
            From your strategy to deployed algorithms in 2-4 weeks.
          </motion.p>

          {/* Magnetic Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <motion.button
              style={{ x: springX, y: springY }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-10 py-5 bg-emerald-500 rounded-full overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2 text-black font-bold text-lg">
                Start Your Project
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.5 }}
              />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 px-8 py-5 border border-white/20 rounded-full text-foreground hover:bg-white/5 transition-colors"
            >
              <Play className="w-5 h-5" />
              Watch Reel
            </motion.button>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-2 text-foreground/40"
            >
              <span className="text-xs tracking-widest uppercase">Scroll</span>
              <ArrowDown className="w-4 h-4" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
