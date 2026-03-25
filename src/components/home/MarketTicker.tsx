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
  { symbol: "XAU/USD", price: "2,184.20", change: "+0.45%", up: true, baseSymbol: "GOLD", volume: "1.2B" },
  { symbol: "EUR/USD", price: "1.0942", change: "+0.12%", up: true, baseSymbol: "EUR", volume: "4.8B" },
  { symbol: "BTC/USD", price: "68,210.50", change: "-1.24%", up: false, baseSymbol: "BTC", volume: "32.1B" },
  { symbol: "USD/JPY", price: "149.24", change: "+0.08%", up: true, baseSymbol: "JPY", volume: "2.1B" },
  { symbol: "ETH/USD", price: "3,825.10", change: "+2.15%", up: true, baseSymbol: "ETH", volume: "12.4B" },
  { symbol: "GBP/USD", price: "1.2842", change: "-0.05%", up: false, baseSymbol: "GBP", volume: "1.8B" },
  { symbol: "NAS100", price: "18,410.50", change: "+0.15%", up: true, baseSymbol: "NDAQ", volume: "15.2B" },
  { symbol: "SOL/USD", price: "148.20", change: "+4.12%", up: true, baseSymbol: "SOL", volume: "4.2B" },
];


const TWELVE_DATA_KEY = import.meta.env.VITE_TWELVE_DATA_KEY as string | undefined;
const SYMBOLS = "XAU/USD,EUR/USD,BTC/USD,USD/JPY,GBP/USD,ETH/USD,SOL/USD,IXIC";


export const MarketTicker = () => {
  const [pairs, setPairs] = useState<MarketPair[]>(INITIAL_PAIRS);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [marketStatus, setMarketStatus] = useState<"OPEN" | "CLOSED">("OPEN");
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMarketStatus = () => {
      const now = new Date();
      const day = now.getUTCDay();
      // Simple ForeX market (approx 24h Mon-Fri)
      const isWeekend = day === 0 || day === 6;
      setMarketStatus(isWeekend ? "CLOSED" : "OPEN");
    };
    checkMarketStatus();
    const statusInterval = setInterval(checkMarketStatus, 60000);
    return () => clearInterval(statusInterval);
  }, []);
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      if (!isMounted) return;
      // Skip live fetch if API key is not configured — use static fallback data
      if (!TWELVE_DATA_KEY) {
        setIsSyncing(false);
        return;
      }
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
        if (isMounted) { // Corrected condition: ensure component is mounted before setting state
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
      className="relative w-full h-[70px] md:h-[90px] bg-[#020202] border-y border-white/5 overflow-hidden flex items-center z-50 transform-gpu"
    >
      {/* Dynamic Background Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#83ffc8]/[0.02] via-transparent to-cyan-500/[0.02] pointer-events-none" />
      <div className="absolute inset-0 backdrop-blur-3xl pointer-events-none" />
      
      {/* 10k Dashboard: Left Status */}
      <div className="absolute left-0 top-0 bottom-0 z-[60] flex items-center px-6 md:px-10 bg-[#020202]/95 border-r border-white/5 shadow-[30px_0_50px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`w-3 h-3 rounded-full transition-all duration-1000 ${marketStatus === "OPEN" ? 'bg-[#83ffc8] shadow-[0_0_15px_rgba(131,255,200,0.5)]' : 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]'}`} />
            {marketStatus === "OPEN" && (
              <motion.div 
                animate={{ scale: [1, 2.5], opacity: [0.3, 0] }} 
                transition={{ repeat: Infinity, duration: 2.5 }} 
                className="absolute inset-0 bg-[#83ffc8] rounded-full" 
              />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-white uppercase tracking-[0.4em] font-sans leading-none opacity-80">
              {marketStatus} SURFACE
            </span>
            <span className="text-[9px] text-[#83ffc8]/60 font-sans font-medium mt-1.5 tracking-[0.15em] uppercase">
              {isSyncing ? "SYNCING..." : (lastUpdate || "ACTIVE")}
            </span>
          </div>
        </div>
      </div>

      {/* Scroller Engine */}
      <div className="flex-1 relative h-full flex items-center overflow-hidden">
        {/* Soft Vignettes */}
        <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-[#020202] via-transparent to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-[#020202] via-transparent to-transparent z-10" />

        <motion.div 
          className="flex whitespace-nowrap items-center py-2"
          initial={{ x: 0 }}
          animate={prefersReducedMotion ? {} : { x: ["0%", "-33.333333%"] }}
          transition={{ ease: "linear", duration: 75, repeat: Infinity }}
        >
          {tickerItems.map((item, i) => (
            <div 
              key={`${item.symbol}-${i}`} 
              className="flex items-center gap-12 px-10 hover:bg-white/[0.02] transition-colors group cursor-default"
            >
              <div className="flex items-center gap-6">
                {/* Visual Accent */}
                <div className={`w-[2px] h-6 rounded-full transition-all duration-700 group-hover:h-8 ${item.up ? 'bg-[#83ffc8] shadow-[0_0_15px_rgba(131,255,200,0.4)]' : 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]'}`} />
                
                <div className="flex flex-col">
                  <span className="text-white font-bold text-sm md:text-base tracking-[0.1em] font-sans flex items-center gap-2">
                    {item.baseSymbol}
                    <span className="text-gray-700 text-[10px] font-bold">/</span>
                    <span className="text-gray-500 text-[10px] font-bold tracking-widest">USD</span>
                  </span>
                  {item.volume && (
                    <span className="text-[9px] text-gray-500 font-sans font-medium mt-1 tracking-widest uppercase opacity-40 group-hover:opacity-80 transition-opacity">VOL: {item.volume}</span>
                  )}
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-white text-base md:text-lg font-semibold tabular-nums tracking-tight flex items-center gap-3">
                    {item.price}
                    {item.up ? 
                      <TrendingUp className="w-4 h-4 text-[#83ffc8] opacity-80" /> : 
                      <TrendingDown className="w-4 h-4 text-rose-400 opacity-80" />
                    }
                  </span>
                  <div className={`text-[10px] font-bold rounded-full px-3 py-0.5 border mt-1 tracking-wider ${
                    item.up ? 'text-[#83ffc8] bg-emerald-500/5 border-emerald-500/10' : 'text-rose-400 bg-rose-500/5 border-rose-500/10'
                  }`}>
                    {item.change}
                  </div>
                </div>
              </div>
              
              {/* Divider Beam */}
              <div className="h-10 w-px bg-white/5" />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Institutional Hardware: Right Statistics */}
      <div className="hidden xl:flex absolute right-0 top-0 bottom-0 z-[60] items-center px-10 bg-[#020202]/90 border-l border-white/5 shadow-[-30px_0_50px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-4 group">
            <div className="p-2 rounded-xl bg-[#83ffc8]/5 border border-[#83ffc8]/10 group-hover:scale-110 transition-transform">
              <Zap className="w-4 h-4 text-[#83ffc8]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.3em] opacity-60">LATENCY</span>
              <span className="text-white text-[11px] font-sans font-semibold mt-0.5 tracking-wider">0.4ms</span>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="p-2 rounded-xl bg-cyan-500/5 border border-cyan-500/10 group-hover:scale-110 transition-transform">
              <Activity className="w-4 h-4 text-cyan-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.3em] opacity-60">ENGINE</span>
              <span className="text-white text-[11px] font-sans font-semibold mt-0.5 tracking-wider">99.9%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


