import React, { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";
import { motion } from "motion/react";
import { Globe2, MapPin, Users, TrendingUp, Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const REGIONS = [
  { name: "Dubai", flag: "🇦🇪", lat: 25.2048, lng: 55.2708 },
  { name: "Mumbai", flag: "🇮🇳", lat: 19.076, lng: 72.8777 },
  { name: "London", flag: "🇬🇧", lat: 51.5074, lng: -0.1278 },
  { name: "Singapore", flag: "🇸🇬", lat: 1.3521, lng: 103.8198 },
  { name: "New York", flag: "🇺🇸", lat: 40.7128, lng: -74.006 },
  { name: "Tokyo", flag: "🇯🇵", lat: 35.6762, lng: 139.6503 },
  { name: "Zurich", flag: "🇨🇭", lat: 47.3769, lng: 8.5417 },
];

const GLOBAL_STATS = [
  { label: "Partner Desks", value: "12+", icon: Globe2 },
  { label: "Elite Alumni", value: "8,200+", icon: Users },
  { label: "Model Fidelity", value: "84.2%", icon: TrendingUp },
  { label: "Academic Uptime", value: "99.9%", icon: Shield },
];

export const GlobalReach = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef(null);
  const pointerInteractionMovement = useRef(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [r, setR] = useState(0);

  useEffect(() => {
    let phi = 0;
    let width = 0;
    const onResize = () => {
      if (canvasRef.current) width = canvasRef.current.offsetWidth;
    };
    window.addEventListener("resize", onResize);
    onResize();

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.25,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 25000,
      mapBrightness: 8,
      baseColor: [0.05, 0.05, 0.05],
      markerColor: [16/255, 185/255, 129/255],
      glowColor: [16/255, 185/255, 129/255],
      markers: REGIONS.map((r) => ({
        location: [r.lat, r.lng] as [number, number],
        size: 0.1,
      })),
      onRender: (state) => {
        if (!pointerInteracting.current) {
          phi += 0.005;
        }
        state.phi = phi + r;
        state.width = width * 2;
        state.height = width * 2;
      },
    });

    setTimeout(() => setIsLoaded(true), 200);

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [r]);

  return (
    <section
      className="py-32 md:py-64 relative overflow-hidden bg-[#020202]"
      aria-labelledby="global-heading"
    >
      {/* Ambient bg */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[80%] bg-[radial-gradient(ellipse_60%_50%_at_50%_10%,rgba(16,185,129,0.1),transparent)]" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-20 lg:gap-32">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-emerald-500/[0.04] border border-emerald-500/[0.15] text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em] mb-10"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Global Sovereign Network
            </motion.div>

            <motion.h2
              id="global-heading"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-5xl sm:text-7xl md:text-9xl font-black text-white tracking-tighter mb-10 leading-[0.85] uppercase"
            >
              Institutional <br />
              <span className="italic font-serif text-gradient-emerald">Reach.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-lg md:text-xl mb-16 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light"
            >
              Our high-fidelity intelligence hubs bridge the gap between retail limitations and institutional execution protocols across the world's most liquid hubs.
            </motion.p>

            {/* Region tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center lg:justify-start gap-3 mb-16"
            >
              {REGIONS.map((region) => (
                <div
                  key={region.name}
                  className="group inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-emerald-500/30 hover:bg-emerald-500/[0.05] transition-all duration-500 cursor-default"
                >
                  <span className="text-lg grayscale group-hover:grayscale-0 transition-all">{region.flag}</span>
                  <span className="text-[11px] font-black text-white/40 group-hover:text-white transition-colors uppercase tracking-[0.2em]">
                    {region.name}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Link
                to="/academy"
                className="group relative inline-flex items-center gap-4 px-10 py-5 rounded-full bg-white text-black font-black text-xs uppercase tracking-[0.3em] hover:bg-emerald-500 transition-all duration-500 hover:scale-[1.05] active:scale-[0.95] overflow-hidden"
              >
                <span className="relative z-10">Access Academy Desk</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Globe Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 w-full max-w-[320px] sm:max-w-[500px] lg:max-w-[700px] aspect-square relative mx-auto order-1 lg:order-2"
          >
            {/* Globe glow */}
            <div className="absolute inset-[-10%] bg-emerald-500/[0.1] blur-[120px] rounded-full pointer-events-none animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <canvas
                ref={canvasRef}
                onPointerDown={(e) => {
                  pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
                  canvasRef.current!.style.cursor = 'grabbing';
                }}
                onPointerUp={() => {
                  pointerInteracting.current = null;
                  canvasRef.current!.style.cursor = 'grab';
                }}
                onPointerOut={() => {
                  pointerInteracting.current = null;
                  canvasRef.current!.style.cursor = 'grab';
                }}
                onMouseMove={(e) => {
                  if (pointerInteracting.current !== null) {
                    const delta = e.clientX - pointerInteracting.current;
                    pointerInteractionMovement.current = delta;
                    setR(delta / 200);
                  }
                }}
                style={{ width: "100%", height: "100%", cursor: 'grab', contain: "layout paint size" }}
                className={`transition-opacity duration-2000 ${isLoaded ? "opacity-100" : "opacity-0"}`}
              />
            </div>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-32 md:mt-48 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {GLOBAL_STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="group relative flex flex-col items-center gap-5 py-10 px-6 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.08] hover:border-emerald-500/20 hover:bg-emerald-500/[0.03] transition-all duration-700 cursor-default"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/[0.08] border border-emerald-500/[0.15] flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <stat.icon className="w-6 h-6 text-emerald-500" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tighter">
                {stat.value}
              </div>
              <div className="text-[11px] font-black text-white/20 uppercase tracking-[0.4em] group-hover:text-emerald-500/50 transition-colors">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
