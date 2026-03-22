import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
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
  { symbol: "XAU/USD", price: "2,154.20", change: "+0.45%", up: true, baseSymbol: "GOLD" },
  { symbol: "EUR/USD", price: "1.0842", change: "+0.12%", up: true, baseSymbol: "EUR" },
  { symbol: "BTC/USD", price: "64,210.50", change: "-1.24%", up: false, baseSymbol: "BTC" },
  { symbol: "USD/JPY", price: "148.24", change: "+0.08%", up: true, baseSymbol: "JPY" },
  { symbol: "ETH/USD", price: "3,425.10", change: "+2.15%", up: true, baseSymbol: "ETH" },
  { symbol: "GBP/USD", price: "1.2742", change: "-0.05%", up: false, baseSymbol: "GBP" },
  { symbol: "NAS100", price: "18,210.50", change: "+0.15%", up: true, baseSymbol: "NDAQ" },
  { symbol: "SOL/USD", price: "145.20", change: "+4.12%", up: true, baseSymbol: "SOL" },
];

const TWELVE_DATA_KEY = "6ac663a609254023a49d4412d9ea419e";
const SYMBOLS = "XAU/USD,EUR/USD,BTC/USD,USD/JPY,GBP/USD,ETH/USD,SOL/USD,IXIC";

export const MarketTicker = () => {
  const [pairs, setPairs] = useState<MarketPair[]>(INITIAL_PAIRS);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsSyncing(true);
      try {
        const response = await fetch(
          `https://api.twelvedata.com/quote?symbol=${SYMBOLS}&apikey=${TWELVE_DATA_KEY}`
        );
        const data = await response.json();

        // Handle both single and multi-symbol responses from Twelve Data
        const items = data.symbol ? { [data.symbol]: data } : data;

        const newPairs = Object.entries(items).map(([sym, details]: [string, any]) => {
          if (!details || details.code || details.status === "error") return null;

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

        if (newPairs.length > 0) {
          setPairs(newPairs);
          setLastUpdate(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }
      } catch (err) {
        console.error("Institutional Data Fetch Error:", err);
      } finally {
        setTimeout(() => setIsSyncing(false), 2000);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 45000); // 45s for high stability
    return () => clearInterval(interval);
  }, []);

  // Triple for seamless infinite loop
  const tickerItems = useMemo(() => [...pairs, ...pairs, ...pairs], [pairs]);

  return (
    <div className="group relative w-full h-[52px] md:h-[64px] bg-black border-y border-white/5 overflow-hidden flex items-center z-40 backdrop-blur-2xl">
      {/* --- Premium Overlay Elements --- */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-cyan-500/5 pointer-events-none opacity-50" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      {/* 10k Premium Badge */}
      <div className="absolute left-0 top-0 bottom-0 z-50 flex items-center px-4 md:px-8 bg-black/80 backdrop-blur-3xl border-r border-white/5 shadow-[20px_0_40px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-2 h-2 rounded-full transition-all duration-700 ${isSyncing ? 'bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.8)] scale-125' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'}`} />
            {isSyncing && <motion.div animate={{ scale: [1, 2], opacity: [0.5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute inset-0 bg-cyan-500 rounded-full" />}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-white hover:text-emerald-400 transition-colors uppercase tracking-[0.2em] font-mono leading-none">
              Live Core
            </span>
            <span className="text-[8px] text-zinc-500 font-mono mt-0.5 tracking-tighter">
              {lastUpdate || "CONNECTING..."}
            </span>
          </div>
        </div>
      </div>

      {/* Infinite Scroller */}
      <div className="flex-1 relative overflow-hidden h-full flex items-center">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black via-black/40 to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black via-black/40 to-transparent z-20 pointer-events-none" />

        <motion.div 
          className="flex whitespace-nowrap items-center pl-48"
          animate={{ x: ["0%", "-33.333333%"] }}
          transition={{ ease: "linear", duration: 55, repeat: Infinity }}
        >
          {tickerItems.map((item, i) => (
            <div 
              key={`${item.symbol}-${i}`} 
              className="flex items-center gap-12 px-10 border-white/[0.03] transition-all duration-500 hover:scale-105"
            >
              <div className="flex items-center gap-4">
                {/* Asset Identity */}
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2">
                    <span className={`w-1 h-3 rounded-full ${item.up ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    <span className="text-white font-black text-xs md:text-sm tracking-widest font-mono group/asset">
                      {item.baseSymbol}
                      <span className="text-zinc-700 text-[10px] ml-1 opacity-50">/USD</span>
                    </span>
                  </div>
                  {item.volume && (
                    <span className="text-[8px] text-zinc-600 font-mono ml-3 font-bold">VOL: {item.volume}</span>
                  )}
                </div>

                {/* Price Display */}
                <div className="flex flex-col items-end">
                  <span className="text-white text-sm md:text-base font-bold tabular-nums tracking-wider flex items-center gap-1.5">
                    {item.price}
                    {item.up ? 
                      <TrendingUp className="w-3 h-3 text-emerald-400 opacity-50" /> : 
                      <TrendingDown className="w-3 h-3 text-rose-400 opacity-50" />
                    }
                  </span>
                  <span className={`text-[9px] font-black tabular-nums transition-colors ${item.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {item.change}
                  </span>
                </div>
              </div>
              
              {/* Separator */}
              <div className="h-6 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent mx-2" />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Institutional Specs Badge */}
      <div className="hidden xl:flex absolute right-0 top-0 bottom-0 z-50 items-center px-8 bg-black/80 backdrop-blur-3xl border-l border-white/5">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-emerald-500/10 border border-emerald-500/20">
              <Zap className="w-3 h-3 text-emerald-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-zinc-500 font-bold leading-none">LATENCY</span>
              <span className="text-[10px] text-white font-mono font-black mt-0.5">0.4ms</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-cyan-500/10 border border-cyan-500/20">
              <Activity className="w-3 h-3 text-cyan-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-zinc-500 font-bold leading-none">UPTIME</span>
              <span className="text-[10px] text-white font-mono font-black mt-0.5">99.9%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

