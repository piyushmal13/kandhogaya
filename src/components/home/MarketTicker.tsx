import React, { useState, useEffect, useMemo, useRef, useCallback, memo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { TrendingUp, TrendingDown, Activity, Zap } from 'lucide-react';

import { getMarketData, subscribeToMarketData } from "../../services/apiHandlers";


interface MarketPair {
  symbol: string;
  price: string;
  change: string;
  up: boolean;
  baseSymbol: string;
  volume?: string;
}

const TickerItem = memo(({ item, i }: { item: MarketPair, i: number }) => (
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
));

TickerItem.displayName = "TickerItem";

export const MarketTicker = () => {

  const [pairs, setPairs] = useState<MarketPair[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [marketStatus, setMarketStatus] = useState<"OPEN" | "CLOSED">("OPEN");
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(true);
  
  // High-performance update refs
  const pairsRef = useRef<MarketPair[]>([]);
  const pendingUpdates = useRef<Record<string, MarketPair>>({});

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchData = useCallback(async () => {
    if (!isMounted.current) return;
    setIsSyncing(true);
    
    try {
      const res = await getMarketData();
      console.log("Institutional Ticker DATA:", res);
      if (!isMounted.current || !res) return;

      const formatted = res.map((item: any) => {
        let baseSymbol = item.symbol.substring(0, 3);
        if (item.symbol === 'XAUUSD') baseSymbol = 'GOLD';
        else if (item.symbol === 'NASDAQ') baseSymbol = 'NAS100';

        return {
          symbol: item.symbol,
          price: item.price,
          change: item.change,
          up: item.up,
          baseSymbol,
          volume: item.volume
        };
      });
      
      pairsRef.current = formatted;
      setPairs(formatted);
      setLastUpdate(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err) {
      console.error("Market Data Sync Error:", err);
    } finally {
      if (isMounted.current) {
        setTimeout(() => setIsSyncing(false), 1000);
      }
    }
  }, []);

  const processUpdates = useCallback(() => {
    if (Object.keys(pendingUpdates.current).length === 0) return;

    const updates = Object.values({ ...pendingUpdates.current });
    pendingUpdates.current = {};

    setPairs(prev => {
      const updated = [...prev];
      for (const newItem of updates) {
        const index = updated.findIndex(p => p.symbol === newItem.symbol);
        if (index >= 0) {
          updated[index] = newItem;
        } else {
          updated.push(newItem);
        }
      }
      pairsRef.current = updated;
      return updated;
    });
    
    setLastUpdate(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  }, [setPairs]);

  // Throttle processor: Flushes pending updates every 500ms
  useEffect(() => {
    const interval = setInterval(processUpdates, 500);
    return () => clearInterval(interval);
  }, [processUpdates]);

  useEffect(() => {
    fetchData();
    console.log("RENDER MARKET TICKER DATA:", pairs);
  }, []);

  useEffect(() => {
    const refetch = () => fetchData();
    globalThis.addEventListener("supabase:refresh", refetch);
    globalThis.addEventListener("app:login", refetch);

    return () => {
      globalThis.removeEventListener("supabase:refresh", refetch);
      globalThis.removeEventListener("app:login", refetch);
    };
  }, [fetchData]);

  useEffect(() => {
    const channel = subscribeToMarketData((payload: any) => {
      const isUpdate = payload.eventType === 'UPDATE' || payload.eventType === 'INSERT';
      if (!isUpdate) return;

      let baseSymbol = payload.new.symbol.substring(0, 3);
      if (payload.new.symbol === 'XAUUSD') baseSymbol = 'GOLD';
      else if (payload.new.symbol === 'NASDAQ') baseSymbol = 'NAS100';

      const newItem = {
        symbol: payload.new.symbol,
        price: payload.new.price,
        change: payload.new.change,
        up: payload.new.up,
        baseSymbol,
        volume: payload.new.volume
      };

      // Buffer the update
      pendingUpdates.current[payload.new.symbol] = newItem;
    });

    return () => {
      channel.unsubscribe();
    };
  }, []);

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
            <span className="text-[10px] md:text-xs font-bold text-white tracking-[0.2em] font-sans leading-none opacity-80">
              {lastUpdate || "LIVE TRANS"}
            </span>
            <span className="text-[8px] md:text-[9px] text-[var(--brand)]/60 font-sans font-medium mt-1 tracking-[0.1em] uppercase">
              {isSyncing ? "SYNC" : "DATAFEED"}
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
            <TickerItem key={`${item.symbol}-${i}`} item={item} i={i} />
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
