import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { TrendingUp, TrendingDown, Activity, ShieldCheck } from "lucide-react";
import { marketService } from "../../services/marketService";

// ─── LOCKED: DO NOT MODIFY ────────────────────────────────────────────────────
// useEffect: marketService.subscribe() polling with active-flag cleanup
// marketService.getMarketPairs() — data from TwelveData → DB → Mock fallback
// ─────────────────────────────────────────────────────────────────────────────

interface MarketItem {
  id: string;
  symbol: string;
  price: string;
  change: string;
  up: boolean;
}

const SNAP = [0.4, 0, 0.2, 1] as const;

/** Data Pulse — brief glow-flash on value render/update */
const TickerCell = ({ item, idx }: { item: MarketItem; idx: number }) => (
  <div
    key={`${item.id}-${idx}`}
    className="flex items-center gap-3 px-8 md:px-10 border-r border-white/[0.04] h-full"
  >
    <span
      className="text-[10px] md:text-[11px] font-black text-white/80 uppercase tracking-widest"
      style={{ fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.18em' }}
    >
      {item.symbol}
    </span>
    {/* Price — data pulse on mount via animation */}
    <motion.span
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: SNAP }}
      className="text-[10px] md:text-[12px] tabular-nums text-white/60"
      style={{ fontFamily: 'IBM Plex Mono, monospace' }}
    >
      {item.price}
    </motion.span>
    <div
      className={`flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-black tabular-nums border ${
        item.up
          ? 'bg-emerald-500/[0.08] text-emerald-400 border-emerald-500/[0.15]'
          : 'bg-red-500/[0.08] text-red-400 border-red-500/[0.15]'
      }`}
      style={{ fontFamily: 'IBM Plex Mono, monospace' }}
    >
      {item.up ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
      <span>{item.change}</span>
    </div>
  </div>
);

/** Institutional skeleton loader — 3 block shimmer rows */
const TickerSkeleton = () => (
  <div className="flex h-full items-center gap-10 pl-48 animate-pulse" aria-hidden="true">
    {[80, 64, 96, 72, 88].map((w, i) => (
      <div key={i} className="flex items-center gap-3">
        <div className="h-2 rounded bg-white/[0.06]" style={{ width: `${w * 0.35}rem` }} />
        <div className="h-2 rounded bg-white/[0.04]" style={{ width: `${w * 0.45}rem` }} />
        <div className="h-4 w-12 rounded bg-white/[0.04]" />
      </div>
    ))}
  </div>
);

export const MarketTicker = () => {
  const [data, setData] = useState<MarketItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // LOCKED — polling logic with active flag and subscription cleanup
  useEffect(() => {
    let active = true;
    const fetchMarketData = async () => {
      setIsLoading(true);
      try {
        const res = await marketService.getMarketPairs();
        if (active && res && res.length > 0) setData(res);
      } catch (err) {
        console.error("Institutional Ticker Feed Failure:", err);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    fetchMarketData();
    const sub = marketService.subscribe(() => { fetchMarketData(); });
    return () => { active = false; sub.unsubscribe(); };
  }, []);

  const scrollingData = [...data, ...data, ...data];

  return (
    <section
      className="relative h-10 sm:h-12 md:h-[3.25rem] border-y border-white/[0.06] bg-black/90 backdrop-blur-3xl overflow-hidden z-[40]"
      aria-label="Educational Demo Market Feed"
    >
      {/* ── ORIGIN LABEL ── */}
      <div className="absolute left-0 top-0 bottom-0 z-20 px-3 sm:px-6 bg-[#020202] flex items-center gap-2 border-r border-white/[0.05] shadow-[20px_0_40px_rgba(0,0,0,0.9)]">
        <Activity className="w-2.5 h-2.5 text-[var(--brand-cyan)] animate-pulse" />
        <span
          className="text-[8px] sm:text-[9px] font-black text-[var(--brand-cyan)] uppercase italic"
          style={{ fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.2em' }}
        >
          EDU_DEMO
        </span>
        <div className="hidden sm:flex items-center gap-1 ml-1 px-1.5 py-0.5 rounded bg-cyan-500/[0.08] border border-cyan-500/[0.15]">
          <ShieldCheck className="w-2.5 h-2.5 text-[var(--brand-cyan)]" />
          <span
            className="text-[7px] font-bold text-[var(--brand-cyan)] uppercase"
            style={{ fontFamily: 'IBM Plex Mono, monospace' }}
          >
            SIMULATED
          </span>
        </div>
      </div>

      {/* ── SCROLLING FEED ── */}
      <div className="flex h-full items-center">
        {isLoading && data.length === 0 ? (
          <TickerSkeleton />
        ) : (
          <motion.div
            animate={{ x: ["0%", "-33.33%"] }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
            className="flex whitespace-nowrap pl-24 sm:pl-28 md:pl-40 lg:pl-52"
          >
            {scrollingData.map((item, i) => (
              <TickerCell key={`${item.id}-${i}`} item={item} idx={i} />
            ))}
          </motion.div>
        )}
      </div>

      {/* Gradient fades */}
      <div className="absolute left-28 sm:left-36 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
    </section>
  );
};
