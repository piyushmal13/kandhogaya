import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { TrendingUp, TrendingDown, Activity, ShieldCheck } from "lucide-react";
import { marketService } from "../../services/marketService";

interface MarketItem {
  id: string;
  symbol: string;
  price: string;
  change: string;
  up: boolean;
}

const SNAP = [0.16, 1, 0.3, 1] as const;

/** Data Pulse — high fidelity data tape cell */
const TickerCell = ({ item, idx }: { item: MarketItem; idx: number }) => (
  <div
    key={`${item.id}-${idx}`}
    className="flex items-center gap-4 px-10 md:px-14 border-r border-white/[0.03] h-full relative group"
  >
    {/* Subtle hover reveal glow */}
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-r ${item.up ? 'from-emerald-500' : 'from-red-500'} to-transparent`} />
    
    <span
      className="text-[10px] md:text-[11px] font-black text-white/70 uppercase tracking-[0.2em] relative z-10"
      style={{ fontFamily: 'var(--font-mono)' }}
    >
      {item.symbol}
    </span>
    
    <motion.span
      initial={{ opacity: 0.5, y: 2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: SNAP }}
      className="text-[11px] md:text-[13px] font-medium text-white tabular-nums relative z-10 tracking-tight"
      style={{ fontFamily: 'var(--font-mono)' }}
    >
      {item.price}
    </motion.span>
    
    <div
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-black tabular-nums border relative z-10 ${
        item.up
          ? 'bg-emerald-500/[0.06] text-emerald-400 border-emerald-500/[0.12] shadow-[0_0_15px_rgba(16,185,129,0.1)]'
          : 'bg-red-500/[0.06] text-red-400 border-red-500/[0.12] shadow-[0_0_15px_rgba(239,68,68,0.1)]'
      }`}
      style={{ fontFamily: 'var(--font-mono)' }}
    >
      {item.up ? <TrendingUp className="w-2.5 h-2.5 stroke-[3]" /> : <TrendingDown className="w-2.5 h-2.5 stroke-[3]" />}
      <span>{item.change}</span>
    </div>
  </div>
);

const TickerSkeleton = () => (
  <div className="flex h-full items-center gap-14 pl-56 animate-pulse opacity-50" aria-hidden="true">
    {[80, 64, 96, 72, 88].map((w, i) => (
      <div key={i} className="flex items-center gap-4">
        <div className="h-1.5 rounded-full bg-white/[0.05]" style={{ width: `${w * 0.35}rem` }} />
        <div className="h-1.5 rounded-full bg-white/[0.03]" style={{ width: `${w * 0.45}rem` }} />
        <div className="h-5 w-14 rounded-md bg-white/[0.04]" />
      </div>
    ))}
  </div>
);

export const MarketTicker = () => {
  const [data, setData] = useState<MarketItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchMarketData = async () => {
      setIsLoading(true);
      try {
        const res = await marketService.getMarketPairs();
        if (active && res && res.length > 0) setData(res);
      } catch (err) {
        console.error("Master Terminal Feed Failure:", err);
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
      className="relative h-12 sm:h-14 md:h-[3.75rem] border-y border-white/[0.04] bg-[#020304] overflow-hidden z-[40]"
      aria-label="Institutional Data Feed"
    >
      {/* ── ORIGIN LABEL ── */}
      <div className="absolute left-0 top-0 bottom-0 z-20 px-4 sm:px-8 bg-gradient-to-r from-[#020304] via-[#020304] to-transparent flex items-center gap-3 backdrop-blur-md">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
        <span
          className="text-[8px] sm:text-[9px] font-black text-white/60 uppercase tracking-[0.25em]"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          GLOBAL_FEED
        </span>
        <div className="hidden sm:flex items-center gap-1.5 ml-2 px-2 py-1 rounded bg-white/[0.03] border border-white/[0.05]">
          <ShieldCheck className="w-2.5 h-2.5 text-white/40" />
          <span
            className="text-[7px] font-bold text-white/40 uppercase tracking-[0.1em]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            L1_DATA
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
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="flex whitespace-nowrap pl-32 sm:pl-40 md:pl-56 lg:pl-64"
          >
            {scrollingData.map((item, i) => (
              <TickerCell key={`${item.id}-${i}`} item={item} idx={i} />
            ))}
          </motion.div>
        )}
      </div>

      {/* Extreme Gradient Fades for depth */}
      <div className="absolute left-28 sm:left-36 top-0 bottom-0 w-32 bg-gradient-to-r from-[#020304] to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-[#020304] to-transparent pointer-events-none z-10" />
    </section>
  );
};
