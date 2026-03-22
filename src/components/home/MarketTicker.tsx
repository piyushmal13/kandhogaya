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
  { symbol: "XAUUSD", price: "---", change: "0.00%", up: true, baseSymbol: "GOLD" },
  { symbol: "EURUSD", price: "---", change: "0.00%", up: true, baseSymbol: "EUR" },
  { symbol: "BTCUSD", price: "64750", change: "+2.40%", up: true, baseSymbol: "BTC" },
  { symbol: "USDJPY", price: "---", change: "0.00%", up: true, baseSymbol: "JPY" },
  { symbol: "ETHUSD", price: "3480", change: "+1.80%", up: true, baseSymbol: "ETH" },
  { symbol: "GBPUSD", price: "---", change: "0.00%", up: true, baseSymbol: "GBP" },
  { symbol: "NAS100", price: "18240", change: "+0.12%", up: true, baseSymbol: "NDAQ" },
  { symbol: "XAGUSD", price: "---", change: "0.00%", up: true, baseSymbol: "SLVR" },
];

export const MarketTicker = () => {
  const [pairs, setPairs] = useState<MarketPair[]>(INITIAL_PAIRS);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const [goldRes, silverRes, forexRes] = await Promise.all([
          fetch("https://api.gold-api.com/price/XAU"),
          fetch("https://api.gold-api.com/price/XAG"),
          fetch("https://api.frankfurter.app/latest?from=USD&to=EUR,GBP,JPY")
        ]);

        const goldData = await goldRes.json();
        const silverData = await silverRes.json();
        const forexData = await forexRes.json();

        setPairs(prev => prev.map(p => {
          if (p.symbol === "XAUUSD" && goldData?.price) return { ...p, price: goldData.price.toFixed(2), change: "+0.42%", up: true };
          if (p.symbol === "XAGUSD" && silverData?.price) return { ...p, price: silverData.price.toFixed(2), change: "-0.15%", up: false };
          if (p.symbol === "EURUSD" && forexData?.rates?.EUR) return { ...p, price: (1 / forexData.rates.EUR).toFixed(4), change: "+0.05%", up: true };
          if (p.symbol === "GBPUSD" && forexData?.rates?.GBP) return { ...p, price: (1 / forexData.rates.GBP).toFixed(4), change: "+0.02%", up: true };
          if (p.symbol === "USDJPY" && forexData?.rates?.JPY) return { ...p, price: forexData.rates.JPY.toFixed(2), change: "-0.08%", up: false };
          return p;
        }));
        
        setLastUpdate(new Date().toLocaleTimeString());
      } catch (err) {
        console.error("Market data fetch failed:", err);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 30000); 
    return () => clearInterval(interval);
  }, []);

  const tickerItems = [...pairs, ...pairs, ...pairs];

  return (
    <div className="w-full bg-slate-950/40 border-y border-white/[0.03] overflow-hidden flex items-center h-11 md:h-14 relative z-20 font-mono backdrop-blur-xl">
      <div className="absolute left-4 z-30 flex items-center gap-2 pointer-events-none opacity-50 hidden sm:flex">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Live {lastUpdate || 'Syncing...'}</span>
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
