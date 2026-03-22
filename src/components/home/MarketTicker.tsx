import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { TrendingUp, TrendingDown, Activity, Zap } from 'lucide-react';

interface MarketPair {
  symbol: string;
  price: string;
  change: string;
  up: boolean;
  baseSymbol: string;
  volume?: string;
}

const INITIAL_PAIRS: MarketPair[] = [
  { symbol: "XAU/USD", price: "2,184.20", change: "+0.45%", up: true, baseSymbol: "GOLD" },
  { symbol: "EUR/USD", price: "1.0942", change: "+0.12%", up: true, baseSymbol: "EUR" },
  { symbol: "BTC/USD", price: "68,210.50", change: "-1.24%", up: false, baseSymbol: "BTC" },
  { symbol: "USD/JPY", price: "149.24", change: "+0.08%", up: true, baseSymbol: "JPY" },
  { symbol: "ETH/USD", price: "3,825.10", change: "+2.15%", up: true, baseSymbol: "ETH" },
  { symbol: "GBP/USD", price: "1.2842", change: "-0.05%", up: false, baseSymbol: "GBP" },
  { symbol: "NAS100", price: "18,410.50", change: "+0.15%", up: true, baseSymbol: "NDAQ" },
  { symbol: "SOL/USD", price: "148.20", change: "+4.12%", up: true, baseSymbol: "SOL" },
];

const TWELVE_DATA_KEY = "6ac663a609254023a49d4412d9ea419e";
const SYMBOLS = "XAU/USD,EUR/USD,BTC/USD,USD/JPY,GBP/USD,ETH/USD,SOL/USD,IXIC";

export const MarketTicker = () => {
  const [pairs, setPairs] = useState<MarketPair[]>(INITIAL_PAIRS);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [isSyncing, setIsSyncing] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      if (!isMounted) return;
      setIsSyncing(true);
      
      try {
        const response = await fetch(
          `https://api.twelvedata.com/quote?symbol=${SYMBOLS}&apikey=${TWELVE_DATA_KEY}`
        );
        const data = await response.json();

        // Handle both single and multi-symbol responses
        const items = data.symbol ? { [data.symbol]: data } : data;

        const newPairs = Object.entries(items).map(([sym, details]: [string, any]) => {
          if (!details || details.code || details.status === "error" || !details.close) return null;

          const base = sym.split('/')[0];
          const price = Number.parseFloat(details.close) || 0;
          const pct = Number.parseFloat(details.percent_change) || 0;
          
          let formattedPrice = "";
          if (price > 1000) {
            formattedPrice = price.toLocaleString(undefined, { 
              minimumFractionDigits: 2,
              maximumFractionDigits: 2 
            });
          } else if (price < 10) {
            formattedPrice = price.toFixed(4);
          } else {
            formattedPrice = price.toFixed(2);
          }

          let displaySymbol = base;
          if (base === "XAU") displaySymbol = "GOLD";
          else if (base === "IXIC") displaySymbol = "NAS100";

          return {
            symbol: sym.replace('/', ''),
            price: formattedPrice,
            change: (pct >= 0 ? "+" : "") + pct.toFixed(2) + "%",
            up: pct >= 0,
            baseSymbol: displaySymbol,
            volume: details.volume ? (Number.parseInt(details.volume) / 1000000).toFixed(1) + "M" : undefined
          };
        }).filter(p => p !== null) as MarketPair[];

        if (isMounted && newPairs.length > 0) {
          setPairs(newPairs);
          setLastUpdate(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }
      } catch (err) {
        if (isMounted) console.error("Institutional Data Sync Error:", err);
      } finally {
        if (isMounted) {
          setTimeout(() => setIsSyncing(false), 3000);
        }
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // 1 minute interval for maximum stability
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Triple the pairs for a truly seamless infinite loop
  const tickerItems = useMemo(() => [...pairs, ...pairs, ...pairs], [pairs]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[52px] md:h-[64px] bg-black border-y border-white/5 overflow-hidden flex items-center z-50 transform-gpu"
    >
      {/* Dynamic Background Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
      <div className="absolute inset-0 backdrop-blur-[20px] pointer-events-none" />
      
      {/* 10k Dashboard: Left Status */}
      <div className="absolute left-0 top-0 bottom-0 z-[60] flex items-center px-4 md:px-8 bg-black/90 border-r border-white/5 shadow-[25px_0_40px_rgba(0,0,0,0.9)]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-2 h-2 rounded-full transition-all duration-1000 ${isSyncing ? 'bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,1)] scale-110' : 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]'}`} />
            {isSyncing && (
              <motion.div 
                animate={{ scale: [1, 2.5], opacity: [0.6, 0] }} 
                transition={{ repeat: Infinity, duration: 1.5 }} 
                className="absolute inset-0 bg-cyan-500 rounded-full" 
              />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-white uppercase tracking-[0.25em] font-mono leading-none">
              Live Terminal
            </span>
            <span className="text-[8px] text-zinc-500 font-mono mt-1 tracking-tighter uppercase">
              {lastUpdate || "Booting..."}
            </span>
          </div>
        </div>
      </div>

      {/* Scroller Engine */}
      <div className="flex-1 relative h-full flex items-center overflow-hidden">
        {/* Soft Vignettes */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black via-transparent to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black via-transparent to-transparent z-10" />

        <motion.div 
          className="flex whitespace-nowrap items-center py-2"
          initial={{ x: 0 }}
          animate={!prefersReducedMotion ? { x: ["0%", "-33.333333%"] } : {}}
          transition={{ ease: "linear", duration: 60, repeat: Infinity }}
        >
          {tickerItems.map((item, i) => (
            <div 
              key={`${item.symbol}-${i}`} 
              className="flex items-center gap-10 px-8 hover:bg-white/[0.02] transition-colors group cursor-default"
            >
              <div className="flex items-center gap-5">
                {/* Visual Accent */}
                <div className={`w-1 h-5 rounded-full ${item.up ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]'}`} />
                
                <div className="flex flex-col">
                  <span className="text-white font-black text-xs md:text-[13px] tracking-widest font-mono flex items-center gap-2">
                    {item.baseSymbol}
                    <span className="text-zinc-700 text-[9px] font-bold">/</span>
                    <span className="text-zinc-600 text-[9px] font-bold tracking-tighter">USD</span>
                  </span>
                  {item.volume && (
                    <span className="text-[8px] text-zinc-500 font-mono font-bold">24H VOL: {item.volume}</span>
                  )}
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-white text-sm md:text-base font-bold tabular-nums tracking-wider flex items-center gap-2">
                    {item.price}
                    {item.up ? 
                      <TrendingUp className="w-3 h-3 text-emerald-400" /> : 
                      <TrendingDown className="w-3 h-3 text-rose-400" />
                    }
                  </span>
                  <div className={`text-[9px] font-black rounded-md px-1.5 py-0.5 border ${
                    item.up ? 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10' : 'text-rose-400 bg-rose-500/5 border-rose-500/10'
                  }`}>
                    {item.change}
                  </div>
                </div>
              </div>
              
              {/* Divider Beam */}
              <div className="h-8 w-px bg-white/5" />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Institutional Hardware: Right Statistics */}
      <div className="hidden xl:flex absolute right-0 top-0 bottom-0 z-[60] items-center px-8 bg-black/90 border-l border-white/5">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
              <Zap className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Latency</span>
              <span className="text-white text-[11px] font-mono font-bold">0.4ms</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-cyan-500/5 border border-cyan-500/10">
              <Activity className="w-3.5 h-3.5 text-cyan-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Engine</span>
              <span className="text-white text-[11px] font-mono font-bold">99.9%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


