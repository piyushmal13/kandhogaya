import React, { useRef, useEffect } from "react";
import { motion, useInView, useAnimationControls } from "motion/react";
import { AnimatedCandlesticks } from "./ui/AnimatedCandlesticks";
import { Star, ShieldCheck, Activity, CheckCircle2, Cpu, Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchReviews } from "../services/reviewService";
import { getProducts } from "../services/apiHandlers";
import { Product } from "../types";
import { useState } from "react";

const algoKeywords = ["algo", "algorithm", "logic", "analytical", "pattern", "neural", "automated", "system", "win rate", "institutional"];

const isAlgoReview = (rev: any) => {
  const role = rev.role?.toLowerCase() || "";
  const text = rev.text?.toLowerCase() || "";
  return algoKeywords.some((key) => role.includes(key) || text.includes(key));
};

const ALGO_FEATURES = [
  {
    icon: Cpu,
    title: "Neural Logic Engine",
    desc: "Advanced architectural mapping of order-flow imbalances across 28 global currency pairs with adaptive weighting.",
    color: "emerald",
  },
  {
    icon: Activity,
    title: "Systemic Risk Shield",
    desc: "Dynamic equity protection modules that recalibrate position weighting in volatile market conditions automatically.",
    color: "cyan",
  },
  {
    icon: ShieldCheck,
    title: "Protocol Hardening",
    desc: "Hard-coded news event pausing — all analysis pipelines halt during high-impact fundamental releases.",
    color: "violet",
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  emerald: { bg: "bg-emerald-500/[0.07]", border: "border-emerald-500/[0.12]", text: "text-emerald-400", glow: "group-hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]" },
  cyan: { bg: "bg-cyan-500/[0.07]", border: "border-cyan-500/[0.12]", text: "text-cyan-400", glow: "group-hover:shadow-[0_0_40px_rgba(6,182,212,0.15)]" },
  violet: { bg: "bg-violet-500/[0.07]", border: "border-violet-500/[0.12]", text: "text-violet-400", glow: "group-hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]" },
};

// Animated algo stats ticker
const ALGO_STATS = [
  { label: "Probability Rate", value: "High", suffix: "" },
  { label: "Instruments", value: "40", suffix: "+" },
  { label: "Signals/Month", value: "240", suffix: "+" },
  { label: "Logic Type", value: "Neural", suffix: "" },
];

const CountUp = ({ target, suffix = "" }: { target: string; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isFloat = target.includes(".");
  const num = parseFloat(target);
  const controls = useAnimationControls();

  useEffect(() => {
    if (!isInView) return;
    const start = performance.now();
    const duration = 1800;
    const raf = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = num * ease;
      if (ref.current) {
        ref.current.textContent = (isFloat ? current.toFixed(1) : Math.round(current).toString()) + suffix;
      }
      if (progress < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [isInView, num, isFloat, suffix]);

  if (target === "High" || target === "Neural") {
    return <span>{target}</span>;
  }

  return <span ref={ref}>0{suffix}</span>;
};

export const AlgoGreatness = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [featuredAlgo, setFeaturedAlgo] = useState<Product | null>(null);
  const [stats, setStats] = useState({ avg: 4.9, count: 1200 });
  const sectionRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const isTerminalInView = useInView(terminalRef, { once: true, margin: "-80px" });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [reviewData, products] = await Promise.all([fetchReviews(), getProducts()]);
        if (reviewData && reviewData.length > 0) {
          const filtered = reviewData.filter(isAlgoReview);
          setReviews(filtered.length > 0 ? filtered.slice(0, 3) : reviewData.slice(0, 3));
          const relevant = filtered.length > 0 ? filtered : reviewData;
          const avg = relevant.reduce((a: number, c: any) => a + (c.rating || 5), 0) / relevant.length;
          setStats({ avg: parseFloat(avg.toFixed(1)), count: reviewData.length > 100 ? reviewData.length : 1200 + reviewData.length });
        }
        if (products?.length > 0) {
          const gold = products.find((p: Product) => p.name.includes("Gold"));
          setFeaturedAlgo(gold || products[0]);
        }
      } catch (err) {
        console.error("AlgoGreatness load error:", err);
      }
    };
    loadData();
  }, []);

  const getEmbedUrl = (url?: string): string | null => {
    if (!url) return null;
    try {
      if (url.includes("youtube.com/shorts/")) return url.replace("youtube.com/shorts/", "youtube.com/embed/");
      if (url.includes("youtube.com/watch?v=")) return url.replace("watch?v=", "embed/");
      if (url.includes("youtu.be/")) return url.replace("youtu.be/", "youtube.com/embed/");
      return url;
    } catch { return url; }
  };

  const videoUrl = getEmbedUrl((featuredAlgo as any)?.video_explanation_url);

  return (
    <section ref={sectionRef} className="relative py-24 md:py-40 bg-[#020202] overflow-hidden border-t border-white/[0.04]" aria-labelledby="algo-heading">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[60%] bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06)_0%,transparent_60%)] blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-[radial-gradient(circle,rgba(212,175,55,0.04)_0%,transparent_60%)] blur-3xl" />
        <div className="dot-grid absolute inset-0 opacity-[0.04]" style={{ maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black, transparent)" }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">

        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20 md:mb-32"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/[0.06] border border-emerald-500/[0.12] rounded-full mb-8">
            <Zap className="w-3.5 h-3.5 text-emerald-400" aria-hidden />
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.35em]">Institutional Logic</span>
          </div>
          <h2 id="algo-heading" className="text-4xl sm:text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-6">
            Algorithmic{" "}
            <span className="italic font-serif text-gradient-emerald">Precision</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Experience the architecture behind{" "}
            <span className="text-white font-semibold">{featuredAlgo?.name || "our proprietary systems"}</span>
            {" "}— built for precision, not speculation.
          </p>
        </motion.div>

        {/* ── Stats Row ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20 md:mb-32"
        >
          {ALGO_STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="text-center py-8 px-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-emerald-500/20 hover:bg-emerald-500/[0.02] transition-all duration-500 group"
            >
              <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tighter mb-2">
                <CountUp target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-[10px] font-black text-white/35 uppercase tracking-[0.3em]">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Live Algo Terminal + Chart ── */}
        <motion.div
          ref={terminalRef}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-20 md:mb-32"
        >
          {/* Glow */}
          <div className="absolute -inset-4 bg-emerald-500/5 rounded-[3rem] blur-3xl" aria-hidden />

          <div className="relative rounded-[2rem] sm:rounded-[2.5rem] bg-[#08090E] border border-white/[0.07] overflow-hidden shadow-[0_60px_120px_rgba(0,0,0,0.8)]">
            {/* Window chrome */}
            <div className="flex items-center justify-between px-5 sm:px-8 py-4 border-b border-white/[0.05] bg-white/[0.015]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="flex items-center gap-2">
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                />
                <span className="text-[10px] font-mono text-emerald-400/60 uppercase tracking-[0.3em]">
                  {featuredAlgo?.name || "QUANTITATIVE TERMINAL"}
                </span>
              </div>
              <span className="text-[9px] font-mono text-white/15 hidden sm:block">EDUCATIONAL VISUALIZER</span>
            </div>

            {/* Chart */}
            <div className="relative h-[260px] sm:h-[320px] md:h-[380px] p-6">
              {isTerminalInView && <AnimatedCandlesticks className="absolute inset-6" />}
            </div>

            {/* Video section if available */}
            {videoUrl && (
              <div className="border-t border-white/[0.05] aspect-video">
                <iframe
                  src={videoUrl}
                  title={`${featuredAlgo?.name || "Algo"} Strategy Breakdown`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            )}

            {/* Scan line */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(180deg, transparent 0%, rgba(16,185,129,0.025) 40%, transparent 100%)", height: "30%" }}
              animate={{ y: ["-100%", "500%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
              aria-hidden
            />
          </div>
        </motion.div>

        {/* ── Feature Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8 mb-24 md:mb-40">
          {ALGO_FEATURES.map((feat, i) => {
            const c = colorMap[feat.color];
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.12, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`group relative p-8 md:p-10 rounded-[2rem] border ${c.border} ${c.bg} hover:border-white/10 ${c.glow} transition-all duration-700 card-shine overflow-hidden`}
              >
                <div className={`w-14 h-14 rounded-2xl ${c.bg} border ${c.border} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                  <feat.icon className={`w-7 h-7 ${c.text}`} aria-hidden />
                </div>
                <h3 className="text-xl md:text-2xl font-black text-white mb-4 tracking-tighter">{feat.title}</h3>
                <p className="text-gray-400 text-sm md:text-base leading-relaxed">{feat.desc}</p>
              </motion.div>
            );
          })}
        </div>



        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mt-16"
        >
          <Link
            to="/marketplace"
            data-cursor="EXPLORE"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-emerald-500 text-black font-black text-sm uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-[0_0_40px_rgba(16,185,129,0.25)] hover:shadow-[0_0_60px_rgba(16,185,129,0.4)]"
          >
            Explore Algo Suite
            <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
