import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { TrendingUp, TrendingDown, Activity, ShieldCheck } from "lucide-react";
import { supabase, safeQuery } from "../../lib/supabase";

interface MarketItem {
  id: string;
  symbol: string;
  price: string;
  change: string;
  up: boolean;
}

export const MarketTicker = () => {
  const [data, setData] = useState<MarketItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const query = supabase
          .from("market_data")
          .select("*")
          .order("symbol", { ascending: true });
        
        const res = await safeQuery<MarketItem[]>(query);
        if (res && res.length > 0) {
          setData(res);
        }
      } catch (err) {
        console.error("Institutional Ticker Feed Failure:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketData();

    // Subscribe to real-time updates for high-fidelity execution feel
    const channel = supabase
      .channel('market-ticker-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'market_data' }, (payload) => {
        fetchMarketData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (isLoading && data.length === 0) {
    return (
      <div className="h-12 border-y border-white/5 bg-black/60 backdrop-blur-xl flex items-center justify-center">
        <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Duplicate for infinite scroll
  const scrollingData = [...data, ...data, ...data];

  return (
    <section className="relative h-12 md:h-14 border-y border-white/5 bg-black/80 backdrop-blur-3xl overflow-hidden z-[40]">
      {/* Label for Institutional Origin */}
      <div className="absolute left-0 top-0 bottom-0 z-20 px-4 sm:px-8 bg-black flex items-center gap-2 border-r border-white/5 shadow-[20px_0_40px_rgba(0,0,0,0.8)]">
        <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
        <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Live Feed</span>
        <div className="hidden sm:flex items-center gap-1 ml-2 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
          <ShieldCheck className="w-2.5 h-2.5 text-emerald-500" />
          <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-tighter">Verified</span>
        </div>
      </div>

      {/* Scrolling Content */}
      <div className="flex h-full items-center">
        <motion.div
          animate={{ x: ["0%", "-33.33%"] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap pl-32 md:pl-48 lg:pl-64"
        >
          {scrollingData.map((item, i) => (
            <div 
              key={`${item.id}-${i}`} 
              className="flex items-center gap-3 px-8 md:px-12 border-r border-white-[0.02]"
            >
              <span className="text-[10px] md:text-xs font-black text-white uppercase tracking-widest">{item.symbol}</span>
              <span className="text-[10px] md:text-xs font-mono text-gray-400 font-medium tabular-nums">{item.price}</span>
              <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full ${item.up ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                {item.up ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                <span className="text-[9px] font-black tabular-nums">{item.change}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Gradient Fades for depth */}
      <div className="absolute left-32 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
    </section>
  );
};
