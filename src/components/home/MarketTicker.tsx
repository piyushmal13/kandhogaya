import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface MarketPair {
  symbol: string;
  price: string;
  change: string;
  up: boolean;
  baseSymbol: string;
}

const INITIAL_PAIRS: MarketPair[] = [
  { symbol: "BTCUSDT", price: "---", change: "0.00%", up: true, baseSymbol: "BTC" },
  { symbol: "ETHUSDT", price: "---", change: "0.00%", up: true, baseSymbol: "ETH" },
  { symbol: "SOLUSDT", price: "---", change: "0.00%", up: true, baseSymbol: "SOL" },
  { symbol: "BNBUSDT", price: "---", change: "0.00%", up: true, baseSymbol: "BNB" },
  { symbol: "ADAUSDT", price: "---", change: "0.00%", up: true, baseSymbol: "ADA" },
  { symbol: "XRPUSDT", price: "---", change: "0.00%", up: true, baseSymbol: "XRP" },
  { symbol: "DOTUSDT", price: "---", change: "0.00%", up: true, baseSymbol: "DOT" },
  { symbol: "LINKUSDT", price: "---", change: "0.00%", up: true, baseSymbol: "LINK" },
];

export const MarketTicker = () => {
  const [pairs, setPairs] = useState<MarketPair[]>(INITIAL_PAIRS);
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connectWS = () => {
      // Binance Combined Streams for multiple tickers
      const streams = INITIAL_PAIRS.map(p => `${p.symbol.toLowerCase()}@ticker`).join('/');
      ws.current = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);

      ws.current.onopen = () => {
        setIsConnected(true);
        console.log("[MarketTicker] WebSocket Connected");
      };

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const { s: symbol, c: closePrice, P: priceChangePercent } = data.data;

        setPairs(prev => prev.map(p => {
          if (p.symbol === symbol) {
            const price = parseFloat(closePrice);
            const formattedPrice = price > 1 ? price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : price.toFixed(4);
            const changeNum = parseFloat(priceChangePercent);
            
            return {
              ...p,
              price: formattedPrice,
              change: (changeNum >= 0 ? "+" : "") + priceChangePercent + "%",
              up: changeNum >= 0
            };
          }
          return p;
        }));
      };

      ws.current.onclose = () => {
        setIsConnected(false);
        console.log("[MarketTicker] WebSocket Disconnected, retrying...");
        setTimeout(connectWS, 5000);
      };

      ws.current.onerror = (err) => {
        console.error("[MarketTicker] WebSocket Error", err);
        ws.current?.close();
      };
    };

    connectWS();

    return () => {
      ws.current?.close();
    };
  }, []);

  // Triple the items for a perfectly smooth infinite scroll across all screen widths
  const tickerItems = [...pairs, ...pairs, ...pairs];

  return (
    <div className="w-full bg-[#020617]/40 border-y border-white/5 overflow-hidden flex items-center h-10 md:h-12 relative z-20 font-mono backdrop-blur-md">
      {/* Visual Status Indicator */}
      <div className="absolute left-4 z-30 flex items-center gap-2 pointer-events-none opacity-50 hidden sm:flex">
        <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Live</span>
      </div>

      {/* Edge Fades */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#050816] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#050816] to-transparent z-10 pointer-events-none" />
      
      <motion.div 
        className="flex whitespace-nowrap items-center"
        animate={{ x: ["0%", "-33.333333%"] }}
        transition={{ ease: "linear", duration: 35, repeat: Infinity }}
      >
        {tickerItems.map((item, i) => (
          <div key={`${item.symbol}-${i}`} className="flex items-center gap-3 md:gap-5 px-6 md:px-10 border-r border-white/5 transition-opacity duration-300">
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
              <span className="text-white font-bold text-[11px] md:text-sm tracking-widest flex items-center gap-1.5">
                <span className="text-[9px] text-slate-500 font-normal">#</span>
                {item.baseSymbol}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-slate-300 text-[10px] md:text-[13px] font-medium transition-all tabular-nums">
                  {item.price}
                </span>
                <span className={`flex items-center text-[9px] md:text-[11px] font-bold px-1.5 py-0.5 rounded-md ${
                  item.up ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'
                }`}>
                  {item.up ? <TrendingUp className="w-2.5 h-2.5 mr-1" /> : <TrendingDown className="w-2.5 h-2.5 mr-1" />}
                  {item.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
