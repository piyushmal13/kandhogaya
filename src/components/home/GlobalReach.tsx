import React, { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";
import { motion } from "motion/react";
import { MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const REGIONS = [
  { name: "Dubai", flag: "🇦🇪", lat: 25.2048, lng: 55.2708, key: true },
  { name: "Mumbai", flag: "🇮🇳", lat: 19.076, lng: 72.8777, key: true },
  { name: "London", flag: "🇬🇧", lat: 51.5074, lng: -0.1278, key: true },
  { name: "Singapore", flag: "🇸🇬", lat: 1.3521, lng: 103.8198, key: true },
  { name: "New York", flag: "🇺🇸", lat: 40.7128, lng: -74.006, key: true },
  { name: "Tokyo", flag: "🇯🇵", lat: 35.6762, lng: 139.6503, key: true },
  { name: "Zurich", flag: "🇨🇭", lat: 47.3769, lng: 8.5417, key: true },
];


export const GlobalReach = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [r, setR] = useState(0);

  useEffect(() => {
    let phi = 0;
    let width = 0;
    const onResize = () => {
      if (canvasRef.current) width = canvasRef.current.offsetWidth;
    };
    globalThis.addEventListener("resize", onResize);
    onResize();

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.4,
      mapSamples: 25000,
      mapBrightness: 9,
      baseColor: [0.04, 0.04, 0.06],
      markerColor: [16 / 255, 185 / 255, 129 / 255],
      glowColor: [16 / 255, 185 / 255, 129 / 255],
      markers: REGIONS.map((region) => ({
        location: [region.lat, region.lng] as [number, number],
        size: region.key ? 0.12 : 0.07,
      })),
      onRender: (state) => {
        if (!pointerInteracting.current) {
          phi += 0.004;
        }
        state.phi = phi + r;
        state.width = width * 2;
        state.height = width * 2;
      },
    });

    setTimeout(() => setIsLoaded(true), 250);
    return () => {
      globe.destroy();
      globalThis.removeEventListener("resize", onResize);
    };
  }, [r]);

  return (
    <section
      className="py-24 md:py-40 relative overflow-hidden bg-[#020202]"
      aria-labelledby="global-heading"
    >
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[70%] bg-[radial-gradient(ellipse_55%_45%_at_50%_0%,rgba(16,185,129,0.07),transparent)]" />
        <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
        {/* Top section: text + globe */}
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 mb-24 md:mb-36">
          {/* Text */}
          <div className="flex-1 max-w-xl order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/[0.05] border border-emerald-500/[0.15] text-emerald-500 text-[10px] font-black uppercase tracking-[0.35em] mb-10"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              {" "}Global Alpha Network
            </motion.div>

            <motion.h2
              id="global-heading"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-7xl font-black text-white tracking-tighter mb-8 leading-[0.87] uppercase"
            >
              Institutional{" "}
              <span
                className="italic font-serif mx-3"
                style={{
                  background: "linear-gradient(135deg, #10B981, #00FFA3)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Intelligence
              </span>
              {" "}Terminal.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.18 }}
              className="text-white/40 text-base md:text-lg mb-10 leading-relaxed"
            >
              Direct access to professional execution protocols across every major financial hub. From Mumbai to Singapore, Dubai to London, New York to Tokyo.
            </motion.p>

            {/* Region tags */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.26 }}
              className="flex flex-wrap gap-2.5 mb-10"
            >
              {REGIONS.map((region) => (
                <div
                  key={region.name}
                  className={`group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all duration-300 cursor-default ${
                    region.key
                      ? "bg-emerald-500/[0.06] border-emerald-500/[0.2] text-white/70 hover:border-emerald-500/40"
                      : "bg-white/[0.02] border-white/[0.07] text-white/30 hover:border-white/[0.14]"
                  }`}
                >
                  <span className={`text-sm ${!region.key && "grayscale group-hover:grayscale-0 transition-all"}`}>{region.flag}</span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em]">{region.name}</span>
                  {region.key && <MapPin className="w-2.5 h-2.5 text-emerald-400 ml-0.5" />}
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.34 }}
            >
              <Link
                to="/academy"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white text-black font-black text-xs uppercase tracking-[0.25em] hover:bg-emerald-500 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
              >
                Access Intelligence Terminal
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Globe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 w-full max-w-[320px] sm:max-w-[480px] lg:max-w-[580px] aspect-square relative mx-auto order-1 lg:order-2"
          >
            <div className="absolute inset-[-15%] bg-emerald-500/[0.09] blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute inset-0 flex items-center justify-center">
              <canvas
                ref={canvasRef}
                onPointerDown={(e) => {
                  pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
                  if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
                }}
                onPointerUp={() => {
                  pointerInteracting.current = null;
                  if (canvasRef.current) canvasRef.current.style.cursor = "grab";
                }}
                onPointerOut={() => {
                  pointerInteracting.current = null;
                  if (canvasRef.current) canvasRef.current.style.cursor = "grab";
                }}
                onMouseMove={(e) => {
                  if (pointerInteracting.current !== null) {
                    const delta = e.clientX - pointerInteracting.current;
                    pointerInteractionMovement.current = delta;
                    setR(delta / 200);
                  }
                }}
                style={{ width: "100%", height: "100%", cursor: "grab", contain: "layout paint size" }}
                className={`transition-opacity duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}
              />
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};
