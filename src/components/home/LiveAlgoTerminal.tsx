import React, { useMemo } from "react";
import { motion } from "motion/react";
import { Zap, Wifi, Activity, ArrowRight, Clock, AlertCircle, CheckCircle2 } from "lucide-react";

// 3 Active, 1 Pending
const trades = [
  {
    pair: "XAUUSD",
    type: "LONG",
    entry: "2150.45",
    status: "ACTIVE",
    pl: "+0.85%",
    isProfit: true,
    time: "12m ago"
  },
  {
    pair: "GBPJPY",
    type: "SHORT",
    entry: "189.20",
    status: "ACTIVE",
    pl: "+0.42%",
    isProfit: true,
    time: "45m ago"
  },
  {
    pair: "US30",
    type: "LONG",
    entry: "39150.00",
    status: "ACTIVE",
    pl: "+0.91%",
    isProfit: true,
    time: "1h ago"
  },
  {
    pair: "NAS100",
    type: "SHORT",
    entry: "18100.50",
    status: "PENDING",
    pl: "0.00%",
    isProfit: false,
    time: "Just now"
  }
];

// Generate 36 months of random data (mostly positive)
const monthlyResults = Array.from({ length: 36 }).map((_, i) => {
  const isPositive = Math.random() > 0.15; // 85% positive months
  const value = isPositive 
    ? (Math.random() * 89 + 1).toFixed(1) // 1% to 90%
    : (Math.random() * -15).toFixed(1); // -0% to -15%
  
  return {
    month: `M${i + 1}`,
    value: parseFloat(value),
    isPositive
  };
});

export const LiveAlgoTerminal = () => {
  return (
    <section className="py-12 bg-[#020202] border-t border-white/5 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Live Terminal (Compact) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1 bg-[#050505] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <Zap className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">LIVE TERMINAL</div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-500">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                    </span>
                    SYSTEM ONLINE
                  </div>
                </div>
              </div>
              <div className="text-[10px] font-mono text-gray-500 text-right">
                <div>LATENCY</div>
                <div className="text-emerald-500 font-bold">12ms</div>
              </div>
            </div>

            {/* Trades List */}
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] pr-1 custom-scrollbar">
              {trades.map((trade, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/5 rounded-lg p-3 hover:bg-white/[0.04] transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold text-sm">{trade.pair}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${trade.type === 'LONG' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                        {trade.type}
                      </span>
                    </div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 ${
                      trade.status === 'ACTIVE' 
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                        : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                    }`}>
                      {trade.status === 'ACTIVE' ? <CheckCircle2 className="w-2 h-2" /> : <AlertCircle className="w-2 h-2" />}
                      {trade.status}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> {trade.time}
                    </div>
                    <div className={`text-sm font-bold font-mono ${
                      trade.status === 'PENDING' ? 'text-gray-500' : 
                      trade.pl.startsWith('+') ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {trade.pl}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Monthly Performance Grid */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-[#050505] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-500" />
                Monthly Performance (3 Years)
              </h3>
              <div className="flex gap-4 text-[10px] font-mono text-gray-500">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-sm bg-emerald-500" /> Positive
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-sm bg-red-500" /> Negative
                </div>
              </div>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-12 gap-1.5 md:gap-2">
              {monthlyResults.map((month, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.02 }}
                  className={`
                    relative group aspect-square rounded-md md:rounded-lg border flex items-center justify-center cursor-default
                    ${month.isPositive 
                      ? 'bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20' 
                      : 'bg-red-500/10 border-red-500/20 hover:bg-red-500/20'}
                  `}
                >
                  <span className={`text-[8px] sm:text-[10px] md:text-xs font-mono font-bold ${month.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                    {month.value}%
                  </span>
                  
                  {/* Tooltip */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black border border-white/10 px-2 py-1 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    Month {i + 1}: {month.value}%
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center text-xs text-gray-500 font-mono">
              <div>TOTAL RETURN: <span className="text-emerald-400 font-bold">+1,240%</span></div>
              <div>MAX DRAWDOWN: <span className="text-red-400 font-bold">-8.2%</span></div>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
};
