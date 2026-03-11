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
        { location: [15.8700, 100.9925], size: 0.06 }, // Thailand
        { location: [19.8563, 102.4955], size: 0.04 }, // Laos
        { location: [-30.5595, 22.9375], size: 0.07 }, // South Africa
        { location: [61.5240, 105.3188], size: 0.1 }, // Russia
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
    <section className="py-16 md:py-24 bg-[#000000] relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10 text-gray-400 text-xs font-mono tracking-widest mb-6"
            >
              <Globe2 className="w-4 h-4 text-emerald-500" />
              GLOBAL INFRASTRUCTURE
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tighter mb-6"
            >
              Powering Traders Across the Globe
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-base md:text-lg mb-10 max-w-xl mx-auto lg:mx-0"
            >
              Our low-latency trading infrastructure and intelligence hubs serve thousands of active traders in major financial centers and emerging markets worldwide.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-2 text-xs md:text-sm font-mono text-gray-400"
            >
              {['Dubai', 'India', 'Thailand', 'Laos', 'Africa', 'Russia', 'Pakistan'].map((region) => (
                <div key={region} className="flex items-center gap-2 justify-center lg:justify-start">
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
            transition={{ duration: 1 }}
            className="flex-1 w-full max-w-[260px] sm:max-w-[400px] lg:max-w-[500px] aspect-square relative mx-auto order-1 lg:order-2"
          >
            <div className="absolute inset-0 bg-emerald-500/10 blur-[60px] md:blur-[100px] rounded-full pointer-events-none" />
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
