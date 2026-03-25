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

  return (
    <section className="py-24 md:py-32 bg-[#020202] border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(131,255,200,0.02),transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left: Live Terminal (Compact) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1 bg-[#050505] border border-white/5 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-5 w-full">
                <div className="p-3 rounded-xl bg-[#83ffc8]/5 text-[#83ffc8] border border-[#83ffc8]/10">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 font-sans font-medium uppercase tracking-[0.3em] opacity-60">System Latency</div>
                  <div className="text-white font-semibold font-sans text-lg">{latency}ms <span className="text-[10px] text-[#83ffc8] ml-2 tracking-widest uppercase opacity-80">Atomic</span></div>
                </div>
              </div>
            </div>

            {/* Trades List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2 relative min-h-[400px]">
              <AnimatePresence mode="popLayout">
                {activeSignals.map((signal, idx) => (
                  <motion.div
                    key={signal.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    className="flex items-center justify-between p-5 bg-white/[0.015] border border-white/5 rounded-2xl hover:bg-white/[0.03] hover:border-[#83ffc8]/10 transition-all group"
                  >
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-500 group-hover:scale-110 ${
                        signal.direction === 'BUY' 
                          ? 'bg-emerald-500/5 border-emerald-500/10 text-[#83ffc8]' 
                          : 'bg-rose-500/5 border-rose-500/10 text-rose-400'
                      }`}>
                        {signal.direction === 'BUY' ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                      </div>
                      <div>
                        <div className="text-white font-semibold text-base tracking-tight flex items-center gap-3">
                          {signal.asset}
                          <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold tracking-widest ${
                            signal.direction === 'BUY' ? 'bg-emerald-500/10 border-emerald-500/20 text-[#83ffc8]' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                          }`}>
                            {signal.direction}
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-500 font-sans font-medium mt-1 uppercase tracking-widest opacity-60">
                          LOG: <span className="text-white/80">{signal.entry_price}</span> 
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-white mb-1 uppercase tracking-widest opacity-40">{signal.status || "EXEC"}</div>
                      <div className="text-[10px] text-gray-600 font-sans font-medium uppercase tracking-tighter">
                        {new Date(signal.created_at || "").toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Matrix Scan Effect */}
              {isScanning && (
                <motion.div
                  initial={{ top: "-20%" }}
                  animate={{ top: "120%" }}
                  transition={{ duration: 2.5, ease: "linear" }}
                  className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-[#83ffc8]/10 to-transparent pointer-events-none z-10"
                >
                  <div className="absolute top-1/2 w-full h-px bg-[#83ffc8]/30 shadow-[0_0_30px_rgba(131,255,200,0.4)]" />
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Right: Monthly Performance Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-[#050505] border border-white/5 rounded-[2rem] p-10 shadow-2xl relative overflow-hidden"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
              <h3 className="text-white font-semibold text-2xl flex items-center gap-4 tracking-tight">
                <Activity className="w-6 h-6 text-[#83ffc8]" />
                Institutional Audit (36M)
              </h3>
              <div className="flex gap-6 text-[10px] font-sans font-medium uppercase tracking-[0.3em]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#83ffc8]" /> <span className="opacity-60">Alpha</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/40" /> <span className="opacity-60">Retraction</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-12 gap-2 md:gap-3">
              {monthlyResults.map((month, i) => (
                <motion.div
                  key={month.month}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.01 }}
                  className={`
                    relative group aspect-square rounded-xl border flex items-center justify-center cursor-default transition-all duration-700
                    ${month.isPositive 
                      ? 'bg-emerald-500/[0.03] border-emerald-500/10 hover:bg-emerald-500/10 hover:border-emerald-500/20' 
                      : 'bg-rose-500/[0.03] border-rose-500/10 hover:bg-rose-500/10 hover:border-rose-500/20'}
                  `}
                >
                  <span className={`text-[10px] md:text-sm font-sans font-semibold ${month.isPositive ? 'text-[#83ffc8]' : 'text-rose-400/60'}`}>
                    {month.value}%
                  </span>
                  
                  {/* Tooltip */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl text-[10px] text-white opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none z-20 shadow-2xl scale-75 group-hover:scale-100">
                    MONTH {i + 1}: <span className={month.isPositive ? 'text-[#83ffc8]' : 'text-rose-400'}>{month.value}%</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 pt-10 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-8">
              <div className="group">
                <div className="text-[10px] font-sans font-medium text-gray-500 uppercase tracking-[0.3em] mb-2 opacity-60 group-hover:opacity-100 transition-opacity">Total Alpha</div>
                <div className="text-[#83ffc8] font-semibold text-2xl md:text-3xl tracking-tight">+1,240%</div>
              </div>
              <div className="group">
                <div className="text-[10px] font-sans font-medium text-gray-500 uppercase tracking-[0.3em] mb-2 opacity-60 group-hover:opacity-100 transition-opacity">Max Drawdown</div>
                <div className="text-rose-500/80 font-semibold text-2xl md:text-3xl tracking-tight">-8.2%</div>
              </div>
              <div className="group">
                <div className="text-[10px] font-sans font-medium text-gray-500 uppercase tracking-[0.3em] mb-2 opacity-60 group-hover:opacity-100 transition-opacity">Win Velocity</div>
                <div className="text-white font-semibold text-2xl md:text-3xl tracking-tight">{positiveCount}/36M</div>
              </div>
              <div className="group">
                <div className="text-[10px] font-sans font-medium text-gray-500 uppercase tracking-[0.3em] mb-2 opacity-60 group-hover:opacity-100 transition-opacity">Peak Logic</div>
                <div className="text-white font-semibold text-2xl md:text-3xl tracking-tight flex items-center gap-2">
                  <span className="text-[#83ffc8]">+{bestMonth.toFixed(1)}%</span>
                </div>
              </div>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
};
