import React, { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";
import { motion } from "motion/react";
import { Globe2, MapPin } from "lucide-react";

export const GlobalReach = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let phi = 0;
    let width = 0;
    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };
    window.addEventListener('resize', onResize);
    onResize();

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 12, // Increased brightness for better visibility on black
      baseColor: [0.3, 0.3, 0.3], // Lighter base color
      markerColor: [0.1, 0.8, 0.5], // Emerald
      glowColor: [0.1, 0.2, 0.15], // More visible glow
      markers: [
        { location: [25.2048, 55.2708], size: 0.05 }, // Dubai
        { location: [20.5937, 78.9629], size: 0.08 }, // India
        { location: [15.87, 100.9925], size: 0.06 }, // Thailand
        { location: [19.8563, 102.4955], size: 0.04 }, // Laos
        { location: [-30.5595, 22.9375], size: 0.07 }, // South Africa
        { location: [61.524, 105.3188], size: 0.1 }, // Russia
        { location: [30.3753, 69.3451], size: 0.06 }, // Pakistan
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.005;
        state.width = width * 2;
        state.height = width * 2;
      }
    });

    setTimeout(() => setIsLoaded(true), 100);

    return () => {
      globe.destroy();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <section className="py-24 md:py-48 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-24">
          
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="site-pill inline-flex items-center gap-2 px-4 py-1.5 text-xs font-mono tracking-widest mb-8"
              style={{ color: 'var(--text-muted)' }}
            >
              <Globe2 className="w-4 h-4 text-emerald-500" />
              GLOBAL INFRASTRUCTURE
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-8xl font-bold text-white tracking-tighter mb-8 leading-[0.95]"
            >
              Powering <span className="institutional-title italic font-serif text-emerald-400">Traders</span> Across the Globe
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-base md:text-xl mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed opacity-60"
              style={{ color: 'var(--text-muted)' }}
            >
              Our low-latency trading infrastructure and intelligence hubs serve thousands of active traders in major financial centers and emerging markets worldwide.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-4 text-xs md:text-sm font-mono"
              style={{ color: 'var(--text-muted)' }}
            >
              {['Dubai', 'India', 'Thailand', 'Laos', 'Africa', 'Russia', 'Pakistan'].map((region) => (
                <div key={region} className="flex items-center gap-2 justify-center lg:justify-start opacity-70 hover:opacity-100 transition-opacity">
                  <MapPin className="w-3 h-3 text-emerald-500" />
                  {region}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Globe */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 w-full max-w-[280px] sm:max-w-[450px] lg:max-w-[600px] aspect-square relative mx-auto order-1 lg:order-2"
          >
            <div className="absolute inset-0 bg-emerald-500/15 blur-[80px] md:blur-[120px] rounded-full pointer-events-none animate-pulse" />
            <canvas
              ref={canvasRef}
              style={{ width: "100%", height: "100%", contain: "layout paint size" }}
              className={`transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};
