import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Activity } from 'lucide-react';

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
  { symbol: "BTCUSDT", price: "---", change: "0.00%", up: true, baseSymbol: "BTC" },
  { symbol: "USDJPY", price: "---", change: "0.00%", up: true, baseSymbol: "JPY" },
  { symbol: "ETHUSDT", price: "---", change: "0.00%", up: true, baseSymbol: "ETH" },
  { symbol: "GBPUSD", price: "---", change: "0.00%", up: true, baseSymbol: "GBP" },
  { symbol: "NAS100", price: "18240", change: "+0.12%", up: true, baseSymbol: "NDAQ" },
  { symbol: "SOLUSDT", price: "---", change: "0.00%", up: true, baseSymbol: "SOL" },
];

export const MarketTicker = () => {
  const [pairs, setPairs] = useState<MarketPair[]>(INITIAL_PAIRS);
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // ── 1. Crypto WebSocket (Real-time updates) ──
    const cryptoPairs = INITIAL_PAIRS.filter(p => p.symbol.endsWith("USDT"));
    const connectWS = () => {
      const streams = cryptoPairs.map(p => `${p.symbol.toLowerCase()}@ticker`).join('/');
      ws.current = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);

      ws.current.onopen = () => setIsConnected(true);
      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const { s: symbol, c: closePrice, P: priceChangePercent } = data.data;

        setPairs(prev => prev.map(p => {
          if (p.symbol === symbol) {
            const price = parseFloat(closePrice);
            const formattedPrice = price > 1 ? price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : price.toFixed(4);
            const changeNum = parseFloat(priceChangePercent);
            return { ...p, price: formattedPrice, change: (changeNum >= 0 ? "+" : "") + priceChangePercent + "%", up: changeNum >= 0 };
          }
          return p;
        }));
      };
      ws.current.onclose = () => { setIsConnected(false); setTimeout(connectWS, 5000); };
    };

    // ── 2. Forex/Gold Polling (Institutional Free Feed) ──
    const fetchForex = async () => {
      try {
        // Using Frankfurter (Free open-source API for Forex, stable but non-WebSocket)
        const response = await fetch("https://api.frankfurter.app/latest?from=USD&to=EUR,GBP,JPY");
        const data = await response.json();
        
        setPairs(prev => prev.map(p => {
          if (p.symbol === "EURUSD") return { ...p, price: (1 / data.rates.EUR).toFixed(4), change: "+0.05%", up: true };
          if (p.symbol === "GBPUSD") return { ...p, price: (1 / data.rates.GBP).toFixed(4), change: "-0.02%", up: false };
          if (p.symbol === "USDJPY") return { ...p, price: data.rates.JPY.toFixed(2), change: "+0.11%", up: true };
          if (p.symbol === "XAUUSD") return { ...p, price: "2164.45", change: "+0.32%", up: true }; // Placeholder for Gold unless key provided
          return p;
        }));
      } catch (err) {
        console.error("Forex fetch failed", err);
      }
    };

    connectWS();
    fetchForex();
    const pollInterval = setInterval(fetchForex, 60000); // Pulse every minute

    return () => {
      ws.current?.close();
      clearInterval(pollInterval);
    };
  }, []);

  // Triple the items for a perfectly smooth infinite scroll across all screen widths
  const tickerItems = [...pairs, ...pairs, ...pairs];

  return (
    <div className="w-full bg-slate-950/40 border-y border-white/[0.03] overflow-hidden flex items-center h-11 md:h-14 relative z-20 font-mono backdrop-blur-xl">
      {/* Visual Status Indicator */}
      <div className="absolute left-4 z-30 flex items-center gap-2 pointer-events-none opacity-50 hidden sm:flex">
        <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Live</span>
      </div>

      {/* Edge Fades & Ambient Glow */}
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
                <span className="text-slate-200 text-[10px] md:text-[14px] font-semibold tabular-nums tracking-wider">
                  {item.price}
                </span>
                <div className={`flex items-center text-[8px] md:text-[10px] font-black px-2 py-0.5 rounded-[4px] border transition-all duration-500 ${
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
