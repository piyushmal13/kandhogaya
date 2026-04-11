import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play, Shield, TrendingUp, Globe } from 'lucide-react';

// ── Brand partner SVG components ─────────────────────────────────────────────
const MT5Logo = () => (
  <svg viewBox="0 0 32 32" className="w-5 h-5 fill-current">
    <rect x="4" y="4" width="10" height="24" rx="2" />
    <rect x="18" y="10" width="10" height="18" rx="2" />
  </svg>
);

const BinanceLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M12 0L14.4 2.4L9.6 7.2L7.2 4.8L12 0ZM4.8 7.2L7.2 9.6L4.8 12L2.4 9.6L4.8 7.2ZM19.2 7.2L21.6 9.6L19.2 12L16.8 9.6L19.2 7.2ZM12 7.2L16.8 12L12 16.8L7.2 12L12 7.2ZM9.6 16.8L12 19.2L9.6 21.6L7.2 19.2L9.6 16.8ZM14.4 16.8L16.8 19.2L14.4 21.6L12 19.2L14.4 16.8ZM12 21.6L14.4 24L12 24L9.6 24L12 21.6Z"/>
  </svg>
);

const partners = [
  { name: 'MetaTrader 5', Icon: MT5Logo,    type: 'Execution Platform' },
  { name: 'Binance', Icon: BinanceLogo,      type: 'Liquidity Partner' },
  { name: 'TradingView', Icon: TrendingUp,   type: 'Charting Suite' },
  { name: 'AWS Global',  Icon: Globe,         type: 'Infrastructure' },
  { name: 'ISO 27001',   Icon: Shield,        type: 'Certified Secure' },
];

// ── Floating code rain lines ───────────────────────────────────────────────
const CODE_LINES = [
  "const alpha = calculateEdge(market.tick);",
  "risk.maxDrawdown = 0.02;          // 2% hard cap",
  "signal.confidence = 0.842;        // live accuracy",
  "exec.latency = 12;                // ms avg",
  "portfolio.sharpe = 2.31;         // trailing 12m",
  "hedge.delta = calcNeutral(pos);",
  "if (regime === 'trending') algo.activate();",
  "backtest.passes = 12400;",
];

export function FortressHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const y       = useTransform(scrollYProgress, [0, 1], [0, 260]);
  const opacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    setMousePos({
      x: ((e.clientX - r.left)  / r.width)  * 100,
      y: ((e.clientY - r.top)   / r.height) * 100,
    });
  };

  const handleTouch = (e: React.TouchEvent) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    setMousePos({
      x: ((e.touches[0].clientX - r.left) / r.width) * 100,
      y: ((e.touches[0].clientY - r.top) / r.height) * 100,
    });
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouch}
      className="relative min-h-screen bg-[#020202] overflow-hidden flex flex-col justify-center"
    >
      {/* ── Mouse-tracking Spotlight ── */}
      <div
        className="absolute inset-0 pointer-events-none transition-[background] duration-300"
        style={{
          background: `radial-gradient(700px circle at ${mousePos.x}% ${mousePos.y}%, rgba(16,185,129,0.12), transparent 42%)`,
        }}
      />

      {/* ── Subtle Grid ── */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_40%,black_40%,transparent_100%)]" />

      {/* ── Floating code rain ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
        {CODE_LINES.map((line, i) => (
          <motion.div
            key={i}
            className="absolute whitespace-nowrap font-mono text-[10px] text-emerald-500/[0.06]"
            style={{ left: `${(i * 13) % 100}%`, top: 0 }}
            initial={{ y: '100vh', opacity: 0 }}
            animate={{ y: '-120vh', opacity: [0, 0.6, 0.6, 0] }}
            transition={{
              duration: 18 + i * 2.3,
              repeat: Infinity,
              delay: i * 1.1,
              ease: 'linear',
            }}
          >
            {line}
          </motion.div>
        ))}
      </div>

      {/* ── Main content ── */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 pt-36 pb-24"
      >
        {/* Trusted Partners Bar */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="flex flex-wrap items-center gap-6 mb-16 pb-8 border-b border-white/[0.06]"
        >
          <span className="text-[10px] uppercase tracking-[0.35em] text-white/30 font-mono shrink-0">
            Trusted Infrastructure
          </span>
          <div className="flex flex-wrap items-center gap-7">
            {partners.map(({ name, Icon, type }) => (
              <div
                key={name}
                className="flex items-center gap-2 text-white/25 hover:text-emerald-400/70 transition-colors duration-300 group cursor-default"
                title={type}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="text-[11px] font-medium tracking-wider hidden sm:inline">{name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 56 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          {/* Eyebrow */}
          <p className="text-[10px] font-mono font-black text-emerald-500 uppercase tracking-[0.45em] mb-6">
            Est. 2018 · Dubai, UAE · 40+ Countries
          </p>

          <h1 className="font-heading font-black leading-[0.88] tracking-tight text-white"
              style={{ fontSize: 'clamp(3.2rem, 8.5vw, 7.5rem)' }}>
            <span className="block">Algorithmic</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-300 to-emerald-400 bg-[length:200%_100%] animate-gradient-x">
              Infrastructure
            </span>
            <span className="block text-white/80">for Elite Traders</span>
          </h1>
        </motion.div>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.42 }}
          className="text-lg lg:text-xl text-white/50 max-w-2xl mb-14 leading-relaxed font-light"
        >
          We architect proprietary trading systems for family offices, prop
          firms, and institutional desks. You own the source. We own the
          excellence.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 mb-24"
        >
          <a
            href="#consult"
            className="group relative inline-flex items-center gap-2 px-9 py-4 bg-emerald-500 text-black font-black text-sm tracking-[0.1em] uppercase overflow-hidden hover:shadow-[0_0_50px_rgba(16,185,129,0.35)] transition-shadow duration-500"
          >
            <span className="relative z-10 flex items-center gap-2">
              INITIATE PROJECT
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
            {/* Slide-to-white wipe */}
            <span className="absolute inset-0 translate-y-full group-hover:translate-y-0 bg-white transition-transform duration-300" aria-hidden="true" />
          </a>

          <button className="inline-flex items-center gap-2 px-8 py-4 border border-white/15 text-white/70 font-semibold text-sm tracking-[0.08em] uppercase hover:bg-white/[0.04] hover:border-white/30 transition-all duration-300">
            <Play className="w-4 h-4" />
            VIEW SHOWREEL
          </button>
        </motion.div>

        {/* Stats Row — integrated text, not cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, delay: 0.82 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-8 border-t border-white/[0.07] pt-10"
        >
          {[
            { value: '2018',    label: 'Founded, Dubai UAE' },
            { value: '12,400+', label: 'Systems Deployed' },
            { value: '$2.4B',   label: 'Volume Processed' },
            { value: '99.9%',   label: 'Uptime SLA' },
          ].map((stat) => (
            <div key={stat.label} className="group cursor-default">
              <div className="text-3xl lg:text-4xl font-black text-white font-heading tracking-tighter group-hover:text-emerald-400 transition-colors duration-300">
                {stat.value}
              </div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-white/35 mt-1.5 group-hover:text-white/55 transition-colors duration-300 font-mono">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
