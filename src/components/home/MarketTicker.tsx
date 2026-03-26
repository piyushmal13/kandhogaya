import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
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
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const simulateData = useCallback(() => {
    if (!isMounted.current) return;
    
    setPairs(prev => prev.map(p => {
      const currentPrice = Number.parseFloat(p.price.replace(',', ''));
      const volatility = 0.0005;
      const change = currentPrice * (Math.random() - 0.5) * volatility;
      const newPrice = currentPrice + change;
      
      const decimals = p.price.includes('.') ? p.price.split('.')[1].length : 2;
      
      return {
        ...p,
        price: newPrice.toLocaleString(undefined, { 
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals 
        })
      };
    }));
    setLastUpdate(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  }, []);

  const fetchData = useCallback(async () => {
    if (!isMounted.current) return;
    
    setIsSyncing(true);
    
    if (!TWELVE_DATA_KEY) {
      simulateData();
      setTimeout(() => {
        if (isMounted.current) setIsSyncing(false);
      }, 800);
      return;
    }

    try {
      const response = await fetch(
        `https://api.twelvedata.com/quote?symbol=${SYMBOLS}&apikey=${TWELVE_DATA_KEY}`
      );
      const data = await response.json();
      const items = data.symbol ? { [data.symbol]: data } : data;

      const newPairs = Object.entries(items).map(([sym, details]: [string, any]) => {
        if (!details || details.code || details.status === "error" || !details.close) return null;

        const base = sym.split('/')[0];
        const price = Number.parseFloat(details.close) || 0;
        const pct = Number.parseFloat(details.percent_change) || 0;
        
        const formattedPrice = price.toLocaleString(undefined, { 
          minimumFractionDigits: price < 10 ? 4 : 2,
          maximumFractionDigits: price < 10 ? 4 : 2 
        });

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

      if (isMounted.current && newPairs.length > 0) {
        setPairs(newPairs);
        setLastUpdate(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    } catch (err) {
      if (isMounted.current) {
        console.error("Institutional Data Sync Error:", err);
        simulateData();
      }
    } finally {
      if (isMounted.current) {
        setTimeout(() => {
          if (isMounted.current) setIsSyncing(false);
        }, 2000);
      }
    }
  }, [simulateData]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, TWELVE_DATA_KEY ? 60000 : 5000);
    return () => clearInterval(interval);
  }, [fetchData]);

  useEffect(() => {
    const checkMarketStatus = () => {
      const now = new Date();
      const day = now.getUTCDay();
      const isWeekend = day === 0 || day === 6;
      setMarketStatus(isWeekend ? "CLOSED" : "OPEN");
    };
    checkMarketStatus();
    const statusInterval = setInterval(checkMarketStatus, 60000);
    return () => clearInterval(statusInterval);
  }, []);

  const tickerItems = useMemo(() => [...pairs, ...pairs, ...pairs], [pairs]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[70px] md:h-[90px] bg-[#020202] border-y border-white/5 overflow-hidden flex items-center z-50 transform-gpu"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand)]/[0.02] via-transparent to-cyan-500/[0.02] pointer-events-none" />
      <div className="absolute inset-0 backdrop-blur-3xl pointer-events-none" />
      
      <div className="absolute left-0 top-0 bottom-0 z-[60] flex items-center px-3 md:px-10 bg-[#020202]/95 border-r border-white/5 shadow-[30px_0_50px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative">
            <div className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-1000 ${marketStatus === "OPEN" ? 'bg-[var(--brand)] shadow-[0_0_15px_var(--brand-glow)]' : 'bg-red-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]'}`} />
            {marketStatus === "OPEN" && (
              <motion.div 
                animate={{ scale: [1, 2.5], opacity: [0.3, 0] }} 
                transition={{ repeat: Infinity, duration: 2.5 }} 
                className="absolute inset-0 bg-[var(--brand)] rounded-full" 
              />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] md:text-[10px] font-bold text-white uppercase tracking-[0.2em] md:tracking-[0.4em] font-sans leading-none opacity-80">
              {marketStatus} SURFACE
            </span>
            <span className="text-[7px] md:text-[9px] text-[var(--brand)]/60 font-sans font-medium mt-1 md:mt-1.5 tracking-[0.1em] md:tracking-[0.15em] uppercase">
              {isSyncing ? "SYNC" : (lastUpdate || "LIVE")}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative h-full flex items-center overflow-hidden">
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
                <div className={`w-[2px] h-6 rounded-full transition-all duration-700 group-hover:h-8 ${item.up ? 'bg-[var(--brand)] shadow-[0_0_15px_var(--brand-glow)]' : 'bg-red-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]'}`} />
                
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
                      <TrendingUp className="w-4 h-4 text-[var(--brand)] opacity-80" /> : 
                      <TrendingDown className="w-4 h-4 text-red-400 opacity-80" />
                    }
                  </span>
                  <div className={`text-[10px] font-bold rounded-full px-3 py-0.5 border mt-1 tracking-wider ${
                    item.up ? 'text-[var(--brand)] bg-[var(--brand)]/5 border-[var(--brand)]/10' : 'text-red-400 bg-red-500/5 border-red-500/10'
                  }`}>
                    {item.change}
                  </div>
                </div>
              </div>
              
              <div className="h-10 w-px bg-white/5" />
            </div>
          ))}
        </motion.div>
      </div>

      <div className="hidden xl:flex absolute right-0 top-0 bottom-0 z-[60] items-center px-10 bg-[#020202]/90 border-l border-white/5 shadow-[-30px_0_50px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-4 group">
            <div className="p-2 rounded-xl bg-[var(--brand)]/5 border border-[var(--brand)]/10 group-hover:scale-110 transition-transform">
              <Zap className="w-4 h-4 text-[var(--brand)]" />
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
