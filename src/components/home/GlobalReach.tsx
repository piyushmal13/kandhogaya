import React, { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";
import { motion } from "motion/react";
import { Globe2, MapPin, Users, TrendingUp, Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const REGIONS = [
  { name: "Dubai", flag: "🇦🇪", lat: 25.2048, lng: 55.2708 },
  { name: "India", flag: "🇮🇳", lat: 20.5937, lng: 78.9629 },
  { name: "Thailand", flag: "🇹🇭", lat: 15.87, lng: 100.9925 },
  { name: "Laos", flag: "🇱🇦", lat: 19.8563, lng: 102.4955 },
  { name: "South Africa", flag: "🇿🇦", lat: -30.5595, lng: 22.9375 },
  { name: "Russia", flag: "🇷🇺", lat: 61.524, lng: 105.3188 },
  { name: "Pakistan", flag: "🇵🇰", lat: 30.3753, lng: 69.3451 },
];

const GLOBAL_STATS = [
  { label: "Countries", value: "7+", icon: Globe2 },
  { label: "Active Traders", value: "12,400+", icon: Users },
  { label: "Model Fidelity", value: "84.2%", icon: TrendingUp },
  { label: "Operational uptime", value: "99.9%", icon: Shield },
];

export const GlobalReach = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

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
      diffuse: 1.4,
      mapSamples: 20000,
      mapBrightness: 14,
      baseColor: [0.15, 0.18, 0.2],
      markerColor: [0.06, 0.73, 0.5],
      glowColor: [0.04, 0.12, 0.08],
      markers: REGIONS.map((r) => ({
        location: [r.lat, r.lng] as [number, number],
        size: 0.06,
      })),
      onRender: (state) => {
        state.phi = phi;
        phi += 0.004;
        state.width = width * 2;
        state.height = width * 2;
      },
    });

    setTimeout(() => setIsLoaded(true), 200);

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section
      className="py-24 md:py-48 relative overflow-hidden bg-[#020202]"
      aria-labelledby="global-heading"
    >
      {/* Ambient bg */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[60%] bg-[radial-gradient(ellipse_60%_50%_at_50%_10%,rgba(16,185,129,0.06),transparent)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/[0.06] border border-emerald-500/[0.12] text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8"
            >
              <Globe2 className="w-3.5 h-3.5" aria-hidden />
              Global Infrastructure
            </motion.div>

            <motion.h2
              id="global-heading"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="text-4xl sm:text-6xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-[0.9]"
            >
              Powering{" "}
              <span className="italic font-serif text-gradient-emerald">Traders</span>
              <br className="hidden md:block" /> Across the Globe
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.16 }}
              className="text-gray-400 text-base md:text-lg mb-12 max-w-lg mx-auto lg:mx-0 leading-relaxed"
            >
              Our high-performance intelligence hubs serve thousands of active traders
              in major financial centers and emerging markets worldwide.
            </motion.p>

            {/* Region tags */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.24 }}
              className="flex flex-wrap justify-center lg:justify-start gap-2 mb-12"
            >
              {REGIONS.map((region) => (
                <div
                  key={region.name}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-emerald-500/20 hover:bg-emerald-500/[0.03] transition-all duration-300 cursor-default"
                >
                  <span className="text-sm">{region.flag}</span>
                  <span className="text-[10px] font-black text-white/50 uppercase tracking-wider">
                    {region.name}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.32 }}
            >
              <Link
                to="/academy"
                data-cursor="JOIN"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-emerald-500 text-black font-black text-sm uppercase tracking-[0.15em] hover:bg-emerald-400 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:shadow-[0_0_50px_rgba(16,185,129,0.35)]"
              >
                Join the Network
                <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
            </motion.div>
          </div>

          {/* Globe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[520px] aspect-square relative mx-auto order-1 lg:order-2"
          >
            {/* Globe glow */}
            <div className="absolute inset-[-20%] bg-emerald-500/[0.08] blur-[100px] rounded-full pointer-events-none animate-pulse" aria-hidden />
            <canvas
              ref={canvasRef}
              style={{ width: "100%", height: "100%", contain: "layout paint size" }}
              className={`transition-opacity duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}
              aria-label="Interactive 3D globe showing IFX Trades global presence"
            />
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-20 md:mt-28 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {GLOBAL_STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 + i * 0.08 }}
              className="flex flex-col items-center gap-3 py-6 px-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-emerald-500/15 transition-all duration-500 cursor-default group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/[0.12] flex items-center justify-center group-hover:scale-110 transition-transform">
                <stat.icon className="w-5 h-5 text-emerald-400" aria-hidden />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tighter">
                {stat.value}
              </div>
              <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
