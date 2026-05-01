import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { ArrowRight, ChevronDown, Play } from "lucide-react";
import { Link } from "react-router-dom";

// ─── PERFORMANCE CONSTANTS ────────────────────────────────────────────────────
const EASING = [0.4, 0, 0.2, 1] as const;
const ENTRY   = [0.16, 1, 0.3, 1] as const;

// ─── ROCKET FLAME ENGINE (Canvas — GPU compositor, zero main-thread cost) ─────
const RocketFlame = React.memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;

    const setSize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.scale(dpr, dpr);
    };

    // Particle pool
    interface Particle {
      x: number; y: number;
      vx: number; vy: number;
      life: number; maxLife: number;
      size: number; type: "flame" | "spark" | "smoke" | "star";
    }

    const particles: Particle[] = [];
    let frame = 0;

    const spawn = (type: Particle["type"], count: number) => {
      for (let i = 0; i < count; i++) {
        const cx = W / 2;
        const cy = H * 0.62; // rocket nozzle position

        if (type === "flame") {
          particles.push({
            x: cx + (Math.random() - 0.5) * 18,
            y: cy + Math.random() * 8,
            vx: (Math.random() - 0.5) * 1.2,
            vy: Math.random() * 4.5 + 1.5,
            life: 1, maxLife: 55 + Math.random() * 35,
            size: Math.random() * 14 + 6,
            type: "flame"
          });
        } else if (type === "spark") {
          const angle = Math.PI / 2 + (Math.random() - 0.5) * 1.2;
          const speed = Math.random() * 3.5 + 1;
          particles.push({
            x: cx + (Math.random() - 0.5) * 12,
            y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed + 1,
            life: 1, maxLife: 35 + Math.random() * 20,
            size: Math.random() * 2.5 + 0.8,
            type: "spark"
          });
        } else if (type === "smoke") {
          particles.push({
            x: cx + (Math.random() - 0.5) * 30,
            y: cy + Math.random() * 20 + 10,
            vx: (Math.random() - 0.5) * 0.6,
            vy: Math.random() * 1.2 + 0.4,
            life: 1, maxLife: 90 + Math.random() * 60,
            size: Math.random() * 40 + 20,
            type: "smoke"
          });
        } else {
          // ambient stars
          particles.push({
            x: Math.random() * W,
            y: Math.random() * H * 0.55,
            vx: 0, vy: 0,
            life: Math.random(), maxLife: 80 + Math.random() * 120,
            size: Math.random() * 1.8 + 0.3,
            type: "star"
          });
        }
      }
    };

    // Seed stars
    for (let i = 0; i < 160; i++) spawn("star", 1);

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Sky gradient — deep space → launch glow
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0,    "rgba(1, 2, 3, 1)");
      sky.addColorStop(0.45, "rgba(2, 4, 8, 1)");
      sky.addColorStop(0.7,  "rgba(4, 8, 6, 1)");
      sky.addColorStop(1,    "rgba(10, 20, 12, 1)");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      // Horizon glow (launch pad light)
      const cx = W / 2;
      const hGlow = ctx.createRadialGradient(cx, H * 0.65, 0, cx, H * 0.65, W * 0.55);
      hGlow.addColorStop(0,   "rgba(16, 185, 129, 0.18)");
      hGlow.addColorStop(0.4, "rgba(16, 185, 129, 0.06)");
      hGlow.addColorStop(1,   "transparent");
      ctx.fillStyle = hGlow;
      ctx.fillRect(0, 0, W, H);

      // Spawn particles
      if (frame % 2 === 0) spawn("flame", 4);
      if (frame % 3 === 0) spawn("spark", 3);
      if (frame % 12 === 0) spawn("smoke", 1);
      if (frame % 90 === 0) spawn("star", 3);

      // Update + draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += 1;
        const t = p.life / p.maxLife;

        if (t >= 1) { particles.splice(i, 1); continue; }

        p.x += p.vx;
        p.y += p.vy;
        if (p.type === "flame" || p.type === "smoke") p.size += 0.25;

        const alpha = p.type === "star"
          ? 0.4 + 0.6 * Math.sin(p.life * 0.08 + p.x)
          : 1 - Math.pow(t, 0.6);

        if (p.type === "flame") {
          // Core flame: white → yellow → orange → transparent
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          const brightness = 1 - t * 0.8;
          grad.addColorStop(0,   `rgba(255, 255, ${Math.floor(220 * brightness)}, ${alpha * 0.95})`);
          grad.addColorStop(0.3, `rgba(255, ${Math.floor(200 * brightness)}, 60, ${alpha * 0.7})`);
          grad.addColorStop(0.6, `rgba(16, 185, 129, ${alpha * 0.3})`);
          grad.addColorStop(1,   "transparent");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === "spark") {
          ctx.fillStyle = `rgba(255, ${Math.floor(180 + 75 * (1 - t))}, 40, ${alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (1 - t * 0.5), 0, Math.PI * 2);
          ctx.fill();
          // Spark trail
          ctx.strokeStyle = `rgba(255, 200, 60, ${alpha * 0.3})`;
          ctx.lineWidth = p.size * 0.4;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 6, p.y - p.vy * 6);
          ctx.stroke();
        } else if (p.type === "smoke") {
          const sGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          sGrad.addColorStop(0,   `rgba(40, 50, 45, ${alpha * 0.25})`);
          sGrad.addColorStop(0.5, `rgba(20, 30, 25, ${alpha * 0.1})`);
          sGrad.addColorStop(1,   "transparent");
          ctx.fillStyle = sGrad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Star
          ctx.fillStyle = `rgba(200, 235, 220, ${alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Rocket silhouette
      const ry = H * 0.18; // rocket top Y
      const rh = H * 0.44; // rocket body height
      const rw = W * 0.028;
      const rcy = H * 0.62; // nozzle Y

      // Body
      ctx.save();
      ctx.shadowBlur = 30;
      ctx.shadowColor = "rgba(16, 185, 129, 0.5)";
      const bodyGrad = ctx.createLinearGradient(cx - rw, ry, cx + rw, ry);
      bodyGrad.addColorStop(0,   "rgba(10, 20, 15, 0.95)");
      bodyGrad.addColorStop(0.3, "rgba(40, 70, 55, 0.95)");
      bodyGrad.addColorStop(0.5, "rgba(60, 100, 80, 0.9)");
      bodyGrad.addColorStop(0.7, "rgba(40, 70, 55, 0.95)");
      bodyGrad.addColorStop(1,   "rgba(10, 20, 15, 0.95)");
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.moveTo(cx, ry); // nose tip
      ctx.bezierCurveTo(cx - rw * 0.2, ry + rh * 0.1, cx - rw, ry + rh * 0.25, cx - rw, ry + rh * 0.7);
      ctx.lineTo(cx - rw * 1.4, rcy);
      ctx.lineTo(cx + rw * 1.4, rcy);
      ctx.lineTo(cx + rw, ry + rh * 0.7);
      ctx.bezierCurveTo(cx + rw, ry + rh * 0.25, cx + rw * 0.2, ry + rh * 0.1, cx, ry);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Nozzle ring
      ctx.fillStyle = "rgba(16, 185, 129, 0.7)";
      ctx.beginPath();
      ctx.ellipse(cx, rcy, rw * 1.2, rw * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();

      // Fin (left)
      ctx.fillStyle = "rgba(20, 40, 30, 0.9)";
      ctx.beginPath();
      ctx.moveTo(cx - rw, ry + rh * 0.65);
      ctx.lineTo(cx - rw * 3.2, rcy + 10);
      ctx.lineTo(cx - rw * 1.4, rcy);
      ctx.closePath();
      ctx.fill();

      // Fin (right)
      ctx.beginPath();
      ctx.moveTo(cx + rw, ry + rh * 0.65);
      ctx.lineTo(cx + rw * 3.2, rcy + 10);
      ctx.lineTo(cx + rw * 1.4, rcy);
      ctx.closePath();
      ctx.fill();

      // Window glow
      const winY = ry + rh * 0.32;
      const winGrad = ctx.createRadialGradient(cx, winY, 0, cx, winY, rw * 0.6);
      winGrad.addColorStop(0,   "rgba(100, 230, 180, 0.9)");
      winGrad.addColorStop(0.5, "rgba(16, 185, 129, 0.5)");
      winGrad.addColorStop(1,   "transparent");
      ctx.fillStyle = winGrad;
      ctx.beginPath();
      ctx.arc(cx, winY, rw * 0.6, 0, Math.PI * 2);
      ctx.fill();

      // IFX lettering — tiny on fuselage
      ctx.fillStyle = "rgba(16, 185, 129, 0.6)";
      ctx.font = `bold ${Math.max(7, rw * 0.6)}px 'IBM Plex Mono', monospace`;
      ctx.textAlign = "center";
      ctx.fillText("IFX", cx, winY + rh * 0.18);

      frame++;
      animId = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(() => { setSize(); });
    ro.observe(canvas.parentElement || canvas);
    setSize();
    draw();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ willChange: "transform" }}
    />
  );
});

RocketFlame.displayName = "RocketFlame";

// ─── SCROLL TICKER ─────────────────────────────────────────────────────────────
const TICKERS = [
  "XAUUSD · +2.4%",
  "EURUSD · +0.8%",
  "GBPUSD · -0.3%",
  "NASDAQ · +1.2%",
  "BTCUSD · +5.1%",
  "USDJPY · -0.6%",
  "OIL WTI · +1.8%",
];

// ─── HERO COMPONENT ────────────────────────────────────────────────────────────
export const FortressHero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Scroll-triggered scale zoom on background (GPU only — no layout)
  const rawScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const scale     = useSpring(rawScale, { stiffness: 80, damping: 20, mass: 0.5 });
  const opacity   = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const textY     = useTransform(scrollYProgress, [0, 0.5], [0, 60]);

  const [tickerOffset, setTickerOffset] = useState(0);
  const tickerRef = useRef(0);

  // Ramp ticker via rAF (no setInterval)
  useEffect(() => {
    let id: number;
    const tick = () => {
      tickerRef.current -= 0.4;
      setTickerOffset(tickerRef.current);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);

  const scrollDown = useCallback(() => {
    window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] overflow-hidden bg-[#010203] flex flex-col"
      aria-label="IFX Trades — Institutional Trading Education"
    >
      {/* ── CANVAS BACKGROUND (GPU layer) ── */}
      <motion.div
        style={{ scale, willChange: "transform" }}
        className="absolute inset-0 origin-center"
        aria-hidden="true"
      >
        <RocketFlame />
      </motion.div>

      {/* ── GRADIENT OVERLAY (text readability) ── */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(1,2,3,0.35) 0%, rgba(1,2,3,0.15) 30%, rgba(1,2,3,0.55) 70%, rgba(1,2,3,1) 100%)",
        }}
        aria-hidden="true"
      />

      {/* ── LIVE MARKET TICKER ── */}
      <div
        className="relative z-20 border-b border-emerald-500/10 bg-black/30 backdrop-blur-sm overflow-hidden h-9 flex items-center"
        aria-label="Live market data ticker"
      >
        <div className="absolute left-0 z-10 w-16 h-full bg-gradient-to-r from-black/80 to-transparent" />
        <div className="absolute right-0 z-10 w-16 h-full bg-gradient-to-l from-black/80 to-transparent" />
        <div
          className="flex gap-14 whitespace-nowrap"
          style={{ transform: `translateX(${tickerOffset % (TICKERS.length * 180)}px)` }}
          aria-hidden="true"
        >
          {[...TICKERS, ...TICKERS, ...TICKERS].map((t, i) => (
            <span
              key={i}
              className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-emerald-400/70"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <motion.div
        style={{ opacity, y: textY }}
        className="relative z-20 flex-1 flex flex-col items-center justify-center px-6 pt-12 pb-28 text-center"
      >
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASING }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] backdrop-blur-md mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.35em] text-emerald-400">
            Asia's #1 Institutional Trading Education
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.85, ease: ENTRY }}
          className="font-black text-white tracking-[-0.04em] leading-[0.88] uppercase max-w-5xl mx-auto mb-6"
          style={{ fontSize: "clamp(3.2rem, 9vw, 9rem)" }}
        >
          Trade Like{" "}
          <span
            className="italic font-serif"
            style={{
              background: "linear-gradient(135deg, #10B981 0%, #00FFA3 50%, #06B6D4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Institutions
          </span>
          <br />Do.
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.7, ease: EASING }}
          className="max-w-2xl mx-auto text-white/65 leading-relaxed mb-12"
          style={{ fontSize: "clamp(1rem, 1.8vw, 1.2rem)" }}
        >
          Stop gambling with retail strategies. Get inside access to professional
          algorithmic frameworks, live macro analysis, and execution intelligence
          used by Asia's top quant traders.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.6, ease: EASING }}
          className="flex flex-col sm:flex-row items-center gap-4 justify-center w-full"
        >
          <Link
            to="/webinars"
            className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-emerald-500 text-black font-black text-sm uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] shadow-[0_0_40px_rgba(16,185,129,0.35)] hover:shadow-[0_0_60px_rgba(16,185,129,0.5)]"
            style={{ willChange: "transform" }}
          >
            Start Learning Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>

          <Link
            to="/quantx"
            className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/[0.05] border border-white/10 text-white font-black text-sm uppercase tracking-[0.2em] hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.97] backdrop-blur-md"
            style={{ willChange: "transform" }}
          >
            <Play className="w-4 h-4 text-emerald-400" />
            See QuantX Results
          </Link>
        </motion.div>

        {/* Social proof strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.8 }}
          className="flex flex-wrap justify-center items-center gap-x-10 gap-y-3 mt-14 pt-10 border-t border-white/[0.06] w-full max-w-3xl mx-auto"
        >
          {[
            { value: "12,000+",     label: "Active Traders" },
            { value: "₹0 Broker",   label: "No Hidden Fees" },
            { value: "3-Year",      label: "Verified Track Record" },
            { value: "India · UAE", label: "Compliance Verified" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1">
              <span className="text-xl font-black text-white tracking-tight">{s.value}</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── SCROLL INDICATOR ── */}
      <motion.button
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        onClick={scrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 opacity-40 hover:opacity-90 transition-opacity duration-300 cursor-pointer"
        aria-label="Scroll down to explore"
      >
        <span className="text-[9px] font-black uppercase tracking-[0.45em] text-white">Explore</span>
        <ChevronDown className="w-4 h-4 text-emerald-400" />
      </motion.button>
    </section>
  );
};
