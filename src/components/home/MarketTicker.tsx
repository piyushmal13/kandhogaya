import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface MarketPair {
  symbol: string;
  price: string;
  change: string;
  up: boolean;
  baseSymbol: string;
}

const INITIAL_PAIRS: MarketPair[] = [
  { symbol: "XAU/USD", price: "---", change: "0.00%", up: true, baseSymbol: "GOLD" },
  { symbol: "EUR/USD", price: "---", change: "0.00%", up: true, baseSymbol: "EUR" },
  { symbol: "BTC/USD", price: "---", change: "0.00%", up: true, baseSymbol: "BTC" },
  { symbol: "USD/JPY", price: "---", change: "0.00%", up: true, baseSymbol: "JPY" },
  { symbol: "ETH/USD", price: "---", change: "0.00%", up: true, baseSymbol: "ETH" },
  { symbol: "GBP/USD", price: "---", change: "0.00%", up: true, baseSymbol: "GBP" },
  { symbol: "NAS100", price: "18240", change: "+0.12%", up: true, baseSymbol: "NDAQ" },
  { symbol: "SOL/USD", price: "---", change: "0.00%", up: true, baseSymbol: "SOL" },
];

const API_KEY = "6ac663a609254023a49d4412d9ea419e";
const SYMBOLS = "XAU/USD,EUR/USD,BTC/USD,USD/JPY,GBP/USD,ETH/USD,SOL/USD";

export const MarketTicker = () => {
  const [pairs, setPairs] = useState<MarketPair[]>(INITIAL_PAIRS);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.twelvedata.com/quote?symbol=${SYMBOLS}&apikey=${API_KEY}`
        );
        const data = await response.json();

        const updatePairs = (symbolData: any, symbol: string) => {
          const rawBase = symbol.split('/')[0];
          const base = rawBase.replace('USDT', '').replace('USD', '');
          
          const percentChange = Number.parseFloat(symbolData.percent_change);
          const isUp = percentChange >= 0;
          
          const price = Number.parseFloat(symbolData.close);
          let formattedPrice = "";
          if (price > 1000) {
            formattedPrice = price.toLocaleString(undefined, { maximumFractionDigits: 2 });
          } else {
            formattedPrice = price.toFixed(4);
          }
          
          let finalBaseSymbol = base;
          if (base === "BTC" || base === "ETH") {
            finalBaseSymbol = base;
          } else if (base === "XAU") {
            finalBaseSymbol = "GOLD";
          }
          
          return {
            symbol: symbol.replace('/', ''),
            price: formattedPrice,
            change: (isUp ? "+" : "") + percentChange.toFixed(2) + "%",
            up: isUp,
            baseSymbol: finalBaseSymbol
          };
        };

        const newPairs = Object.entries(data).map(([sym, details]: [string, any]) => updatePairs(details, sym));
        if (newPairs.length > 0) {
          setPairs(newPairs);
          setLastUpdate(new Date().toLocaleTimeString());
        }
      } catch (err) {
        console.error("TwelveData fetch failed", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); 

    return () => clearInterval(interval);
  }, []);

  const tickerItems = [...pairs, ...pairs, ...pairs];

  return (
    <div className="w-full bg-slate-950/40 border-y border-white/[0.03] overflow-hidden flex items-center h-11 md:h-14 relative z-20 font-mono backdrop-blur-xl">
      <div className="absolute left-4 z-30 flex items-center gap-2 pointer-events-none opacity-50 hidden sm:flex">
        <div className={`w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse`} />
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Live {lastUpdate}</span>
      </div>

      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-950/90 via-slate-950/40 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(88,242,182,0.03),transparent_70%)] pointer-events-none" />
      
      <motion.div 
        className="flex whitespace-nowrap items-center"
        animate={{ x: ["0%", "-33.333333%"] }}
        transition={{ ease: "linear", duration: 35, repeat: Infinity }}
      >
        {tickerItems.map((item, i) => (
          <div key={`${item.symbol}-${i}`} className="flex items-center gap-3 md:gap-5 px-6 md:px-10 border-r border-white/5 transition-opacity duration-300">
            <div className="flex flex-col md:flex-row md:items-center gap-1.5 md:gap-4 group">
              <span className="text-white font-bold text-[11px] md:text-[13px] tracking-[0.15em] flex items-center gap-2 group-hover:text-emerald-400 transition-colors">
                <span className="text-[9px] text-slate-600 font-bold group-hover:text-emerald-500/50 transition-colors">/</span>
                {item.baseSymbol}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-slate-200 text-[10px] md:text-[14px] font-semibold tabular-nums tracking-wider text-shadow-glow">
                  {item.price}
                </span>
                <div className={`flex items-center text-[8px] md:text-[10px] font-black px-2 py-0.5 rounded-[4px] border transition-all duration-500 shadow-sm ${
                  item.up 
                    ? 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10' 
                    : 'text-rose-400 bg-rose-500/5 border-rose-500/10'
                }`}>
                  {item.change}
                </div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
