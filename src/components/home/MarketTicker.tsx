import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { supabase, safeQuery } from '../../lib/supabase';

const defaultPairs = [
  { symbol: "XAUUSD", price: "2150.45", change: "+0.45%", up: true },
  { symbol: "EURUSD", price: "1.0845", change: "-0.12%", up: false },
  { symbol: "BTCUSD", price: "64230.00", change: "+2.40%", up: true },
  { symbol: "NASDAQ", price: "18240.50", change: "+1.10%", up: true },
  { symbol: "GBPUSD", price: "1.2650", change: "-0.05%", up: false },
  { symbol: "USDJPY", price: "149.80", change: "+0.20%", up: true },
  { symbol: "US30", price: "39087.30", change: "+0.85%", up: true },
  { symbol: "ETHUSD", price: "3450.00", change: "+1.80%", up: true },
];

export const MarketTicker = () => {
  const [pairs, setPairs] = useState(defaultPairs);

  useEffect(() => {
    const fetchMarketData = async () => {
      const data = await safeQuery<any[]>(
        supabase.from('market_data').select('*').order('symbol')
      );
      if (data && data.length > 0) {
        setPairs(data);
      }
    };
    fetchMarketData();
  }, []);

  // Duplicate for seamless infinite scroll
  const tickerItems = [...pairs, ...pairs, ...pairs];

  return (
    <div className="w-full bg-[#050505] border-y border-white/5 overflow-hidden flex items-center h-10 md:h-14 relative z-20 font-mono">
      {/* Gradient Masks for smooth fade on edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />
      
      <motion.div 
        className="flex whitespace-nowrap items-center"
        animate={{ x: ["0%", "-33.333333%"] }}
        transition={{ ease: "linear", duration: 40, repeat: Infinity }}
      >
        {tickerItems.map((item, i) => (
          <div key={i} className="flex items-center gap-3 md:gap-4 px-4 md:px-8 border-r border-white/5">
            <span className="text-white font-bold text-[10px] md:text-sm tracking-widest">{item.symbol}</span>
            <span className="text-gray-400 text-[10px] md:text-sm">{item.price}</span>
            <span className={`flex items-center text-[9px] md:text-xs font-bold ${item.up ? 'text-emerald-500' : 'text-[#ff5f56]'}`}>
              {item.up ? <TrendingUp className="w-2.5 h-2.5 md:w-3 md:h-3 mr-1 md:mr-1.5" /> : <TrendingDown className="w-2.5 h-2.5 md:w-3 md:h-3 mr-1 md:mr-1.5" />}
              {item.change}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
