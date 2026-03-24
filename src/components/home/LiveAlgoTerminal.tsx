import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Activity, TrendingUp, TrendingDown, Shield } from "lucide-react";
import { getSignals, subscribeToSignals } from "../../services/apiHandlers";
import { Signal } from "../../types";

// 3 Active, 1 Pending — static data, no randomness
// const trades = [
//   {
//     pair: "XAUUSD",
//     type: "LONG",
//     entry: "2150.45",
//     status: "ACTIVE",
//     pl: "+0.85%",
//     isProfit: true,
//     time: "12m ago"
//   },
//   {
//     pair: "GBPJPY",
//     type: "SHORT",
//     entry: "189.20",
//     status: "ACTIVE",
//     pl: "+0.42%",
//     isProfit: true,
//     time: "45m ago"
//   },
//   {
//     pair: "US30",
//     type: "LONG",
//     entry: "39150.00",
//     status: "ACTIVE",
//     pl: "+0.91%",
//     isProfit: true,
//     time: "1h ago"
//   },
//   {
//     pair: "NAS100",
//     type: "SHORT",
//     entry: "18100.50",
//     status: "PENDING",
//     pl: "0.00%",
//     isProfit: false,
//     time: "Just now"
//   }
// ];

/**
 * Deterministic seed-based pseudo-random using a linear congruential generator.
 * Produces the exact same sequence every render — stable across hot-reloads.
 */
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
};

const generateMonthlyResults = () =>
  Array.from({ length: 36 }).map((_, i) => {
    const r1 = seededRandom(i * 2);
    const r2 = seededRandom(i * 2 + 1);
    const isPositive = r1 > 0.15; // ~85% positive months
    const raw = isPositive
      ? (r2 * 89 + 1).toFixed(1)  // 1% to 90%
      : (r2 * -15).toFixed(1);    // 0% to -15%
    return {
      month: `M${i + 1}`,
      value: Number.parseFloat(raw),
      isPositive,
    };
  });

export const LiveAlgoTerminal = () => {
  const [activeSignals, setActiveSignals] = useState<Signal[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [latency, setLatency] = useState(45);

  useEffect(() => {
    const fetchInitial = async () => {
      setIsScanning(true);
      const data = await getSignals();
      if (data) {
        setActiveSignals(data.slice(0, 5));
      }
      setTimeout(() => setIsScanning(false), 2000);
    };
    fetchInitial();

    const channel = subscribeToSignals((payload: any) => {
      if (payload.eventType === 'INSERT') {
        setIsScanning(true);
        setActiveSignals(prev => [payload.new as Signal, ...prev].slice(0, 5));
        setTimeout(() => setIsScanning(false), 2000);
      }
    });

    const latInterval = setInterval(() => {
      setLatency(30 + Math.floor(Math.random() * 30));
    }, 3000);

    return () => {
      channel.unsubscribe();
      clearInterval(latInterval);
    };
  }, []);

  // Stable across all renders — deterministic RNG
  const monthlyResults = useMemo(generateMonthlyResults, []);

  // Computed summary stats
  const positiveCount = useMemo(() => monthlyResults.filter(m => m.isPositive).length, [monthlyResults]);
  const bestMonth = useMemo(() => Math.max(...monthlyResults.map(m => m.value)), [monthlyResults]);
  const worstMonth = useMemo(() => Math.min(...monthlyResults.map(m => m.value)), [monthlyResults]);

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
              <div className="p-4 bg-black/40 border border-white/5 rounded-2xl flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Global Latency</div>
                  <div className="text-white font-bold font-mono">{latency}ms <span className="text-[10px] text-emerald-500 ml-1">OPTIONAL</span></div>
                </div>
              </div>
            </div>

            {/* Trades List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2 relative">
              <AnimatePresence mode="popLayout">
                {activeSignals.map((signal, idx) => (
                  <motion.div
                    key={signal.id}
                    layout
                    initial={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] hover:border-emerald-500/20 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
                        signal.direction === 'BUY' 
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                          : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                      }`}>
                        {signal.direction === 'BUY' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="text-white font-bold tracking-tight flex items-center gap-2">
                          {signal.asset}
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                            signal.direction === 'BUY' ? 'bg-emerald-500/20 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 border-rose-500/20 text-rose-400'
                          }`}>
                            {signal.direction}
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                          ENTRY: <span className="text-white">{signal.entry_price}</span> 
                          {!!signal.stop_loss && <span className="ml-2">SL: <span className="text-rose-400">{signal.stop_loss}</span></span>}
                          {!!signal.take_profit && <span className="ml-2">TP: <span className="text-emerald-400">{signal.take_profit}</span></span>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xs font-bold text-white mb-0.5 uppercase">{signal.status || "RUNNING"}</div>
                      <div className="text-[10px] text-gray-600 font-mono">
                        {new Date(signal.created_at || "").toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Matrix Scan Effect */}
              {isScanning && (
                <motion.div
                  initial={{ top: "-10%" }}
                  animate={{ top: "110%" }}
                  transition={{ duration: 2, ease: "linear" }}
                  className="absolute left-0 right-0 h-20 bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent pointer-events-none z-10"
                >
                  <div className="absolute top-1/2 w-full h-px bg-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
                </motion.div>
              )}
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
                  key={month.month}
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

            <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="text-gray-500">
                TOTAL RETURN
                <div className="text-emerald-400 font-bold text-sm mt-0.5">+1,240%</div>
              </div>
              <div className="text-gray-500">
                MAX DRAWDOWN
                <div className="text-red-400 font-bold text-sm mt-0.5">-8.2%</div>
              </div>
              <div className="text-gray-500">
                POSITIVE MONTHS
                <div className="text-emerald-400 font-bold text-sm mt-0.5">{positiveCount}/36</div>
              </div>
              <div className="text-gray-500">
                BEST / WORST
                <div className="text-sm mt-0.5">
                  <span className="text-emerald-400 font-bold">+{bestMonth.toFixed(1)}%</span>
                  <span className="text-gray-600 mx-1">/</span>
                  <span className="text-red-400 font-bold">{worstMonth.toFixed(1)}%</span>
                </div>
              </div>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
};
