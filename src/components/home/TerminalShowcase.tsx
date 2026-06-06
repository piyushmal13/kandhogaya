import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { containerVariants, itemVariants } from "@/lib/motion";
import { ShieldCheck, Cpu, Activity, Server, Minus, Square, X, TrendingUp, TrendingDown } from "lucide-react";

export const TerminalShowcase = () => {
  // Live ticking state for EURUSD current price
  const [eurusdPrice, setEurusdPrice] = useState(1.09415);
  // Other static/semi-static prices to build visual complexity
  const [xauusdPrice, setXauusdPrice] = useState(2038.45);
  const [gbpusdPrice, setGbpusdPrice] = useState(1.09658);
  const [usdjpyPrice, setUsdjpyPrice] = useState(132.85);
  const [priceDirection, setPriceDirection] = useState<"up" | "down">("up");

  // Price ticking emulator
  useEffect(() => {
    const timer = setInterval(() => {
      const change = (Math.random() - 0.5) * 0.00018;
      setEurusdPrice(prev => {
        const next = +(prev + change).toFixed(5);
        setPriceDirection(next >= prev ? "up" : "down");
        return next;
      });
      // Fluctuate other tickers slowly
      setXauusdPrice(prev => +(prev + (Math.random() - 0.5) * 0.12).toFixed(2));
      setGbpusdPrice(prev => +(prev + (Math.random() - 0.5) * 0.00015).toFixed(5));
      setUsdjpyPrice(prev => +(prev + (Math.random() - 0.5) * 0.04).toFixed(2));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Account constants
  const balance = 258495.12;
  const margin = 12850.00;

  // Position Parameters (EURUSD Sell position, Volume: 10 Lots, Entry: 1.09600)
  const openPrice = 1.09600;
  const lots = 10.0;
  const contractSize = 100000;

  // Sell Profit = (Open Price - Current Bid Price) * Lots * Contract Size
  const tradeProfit = +((openPrice - eurusdPrice) * lots * contractSize).toFixed(2);
  
  // Calculations (Equity = Balance + Profit; Free Margin = Equity - Margin)
  const equity = +(balance + tradeProfit).toFixed(2);
  const freeMargin = +(equity - margin).toFixed(2);

  const fmt = (num: number) => num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="py-24 bg-[#010203] relative overflow-hidden border-t border-white/5"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/[0.02] blur-[130px] rounded-full" />
        <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-blue-500/[0.01] blur-[100px] rounded-full" />
      </div>

      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Live Interactive MT5 Mock Terminal (Takes 7 Cols on desktop) */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-7 order-2 lg:order-1 relative w-full"
          >
            <div className="absolute inset-0 bg-emerald-500/5 blur-[120px] rounded-full opacity-35 pointer-events-none" />
            
            {/* MT5 Mock Terminal Shell */}
            <div className="relative rounded-2xl border border-white/10 shadow-2xl bg-[#090A0D] overflow-hidden text-white font-sans text-left flex flex-col select-none">
              
              {/* Header Bar */}
              <div className="bg-[#1C2028] border-b border-[#2C313C] px-4 py-2 flex items-center justify-between text-xs select-none">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded bg-blue-500 flex items-center justify-center text-[7px] font-black text-white">5</div>
                  <span className="font-bold tracking-tight text-white/80">MT5 Elite Terminal | Institutional Tier</span>
                </div>
                <div className="text-[10px] text-white/45 font-mono">
                  Account: <span className="text-white/80 font-bold">7800123</span> (Active | Live Server)
                </div>
                <div className="flex items-center gap-3 text-white/30">
                  <Minus className="w-3 h-3 hover:text-white transition-colors cursor-pointer" />
                  <Square className="w-2.5 h-2.5 hover:text-white transition-colors cursor-pointer" />
                  <X className="w-3 h-3 hover:text-rose-400 transition-colors cursor-pointer" />
                </div>
              </div>

              {/* Balance & Equity Live Metrics Bar */}
              <div className="bg-[#131722] border-b border-[#202430] p-3 text-[10px] sm:text-xs font-mono grid grid-cols-2 md:grid-cols-5 gap-3 text-white/50 border-l border-r border-white/5">
                <div>
                  <div className="text-[8px] uppercase tracking-wider text-white/20 mb-0.5">Balance</div>
                  <div className="text-white font-bold">${fmt(balance)}</div>
                </div>
                <div>
                  <div className="text-[8px] uppercase tracking-wider text-white/20 mb-0.5">Equity</div>
                  <div className="text-white font-bold">${fmt(equity)}</div>
                </div>
                <div>
                  <div className="text-[8px] uppercase tracking-wider text-white/20 mb-0.5">Margin</div>
                  <div className="text-white font-bold">${fmt(margin)}</div>
                </div>
                <div>
                  <div className="text-[8px] uppercase tracking-wider text-white/20 mb-0.5">Free Margin</div>
                  <div className="text-white font-bold">${fmt(freeMargin)}</div>
                </div>
                <div className="text-right col-span-2 md:col-span-1">
                  <div className="text-[8px] uppercase tracking-wider text-white/20 mb-0.5">Live Profit</div>
                  <div className={`font-bold transition-colors ${tradeProfit >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    ${tradeProfit >= 0 ? "+" : ""}{fmt(tradeProfit)}
                  </div>
                </div>
              </div>

              {/* 2x2 Chart Grid Simulation */}
              <div className="grid grid-cols-2 gap-px bg-[#1F222B] border-b border-[#1F222B]">
                
                {/* Chart 1: EUR/USD, H1 */}
                <div className="bg-[#131722] p-3 aspect-video relative flex flex-col justify-between overflow-hidden">
                  <div className="flex items-center justify-between text-[8px] font-mono text-white/40">
                    <span className="font-bold text-white/80">EUR/USD, H1</span>
                    <span className={priceDirection === "up" ? "text-emerald-400" : "text-rose-400"}>
                      {eurusdPrice.toFixed(5)}
                    </span>
                  </div>
                  {/* Candlestick lines mock */}
                  <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-20 pointer-events-none">
                    <div className="h-6 w-1 bg-rose-500 rounded-sm relative"><div className="absolute -top-1 left-0.5 h-8 w-px bg-rose-500"></div></div>
                    <div className="h-8 w-1 bg-emerald-500 rounded-sm relative"><div className="absolute -top-2 left-0.5 h-12 w-px bg-emerald-500"></div></div>
                    <div className="h-4 w-1 bg-rose-500 rounded-sm relative"><div className="absolute -top-1 left-0.5 h-6 w-px bg-rose-500"></div></div>
                    <div className="h-10 w-1 bg-emerald-500 rounded-sm relative"><div className="absolute -top-3 left-0.5 h-16 w-px bg-emerald-500"></div></div>
                    <div className="h-6 w-1 bg-rose-500 rounded-sm relative"><div className="absolute -top-2 left-0.5 h-9 w-px bg-rose-500"></div></div>
                  </div>
                  {/* Instant order execute tags */}
                  <div className="flex items-center justify-between z-10 gap-2 mt-auto">
                    <div className="flex-1 bg-rose-500/10 border border-rose-500/20 rounded p-1 text-center">
                      <div className="text-[6px] text-rose-400 font-bold uppercase">Sell</div>
                      <div className="text-[8px] font-mono font-bold text-rose-500">{(eurusdPrice).toFixed(4)}</div>
                    </div>
                    <div className="flex-1 bg-emerald-500/10 border border-emerald-500/20 rounded p-1 text-center">
                      <div className="text-[6px] text-emerald-400 font-bold uppercase">Buy</div>
                      <div className="text-[8px] font-mono font-bold text-emerald-500">{(eurusdPrice + 0.00015).toFixed(4)}</div>
                    </div>
                  </div>
                </div>

                {/* Chart 2: XAU/USD, H4 */}
                <div className="bg-[#131722] p-3 aspect-video relative flex flex-col justify-between overflow-hidden">
                  <div className="flex items-center justify-between text-[8px] font-mono text-white/40">
                    <span className="font-bold text-white/80">XAU/USD, H4</span>
                    <span className="text-emerald-400">{xauusdPrice.toFixed(2)}</span>
                  </div>
                  {/* Candlestick lines mock */}
                  <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-20 pointer-events-none">
                    <div className="h-10 w-1 bg-emerald-500 rounded-sm relative"><div className="absolute -top-2 left-0.5 h-14 w-px bg-emerald-500"></div></div>
                    <div className="h-6 w-1 bg-rose-500 rounded-sm relative"><div className="absolute -top-1 left-0.5 h-8 w-px bg-rose-500"></div></div>
                    <div className="h-12 w-1 bg-emerald-500 rounded-sm relative"><div className="absolute -top-3 left-0.5 h-18 w-px bg-emerald-500"></div></div>
                    <div className="h-4 w-1 bg-rose-500 rounded-sm relative"><div className="absolute -top-2 left-0.5 h-7 w-px bg-rose-500"></div></div>
                  </div>
                  {/* Action tag */}
                  <div className="flex items-center justify-between z-10 gap-2 mt-auto">
                    <div className="flex-1 bg-rose-500/10 border border-rose-500/20 rounded p-1 text-center">
                      <div className="text-[6px] text-rose-400 font-bold uppercase">Sell</div>
                      <div className="text-[8px] font-mono font-bold text-rose-500">{xauusdPrice.toFixed(2)}</div>
                    </div>
                    <div className="flex-1 bg-emerald-500/10 border border-emerald-500/20 rounded p-1 text-center">
                      <div className="text-[6px] text-emerald-400 font-bold uppercase">Buy</div>
                      <div className="text-[8px] font-mono font-bold text-emerald-500">{(xauusdPrice + 0.3).toFixed(2)}</div>
                    </div>
                  </div>
                </div>

                {/* Chart 3: GBP/USD, M30 */}
                <div className="bg-[#131722] p-3 aspect-video relative flex flex-col justify-between overflow-hidden">
                  <div className="flex items-center justify-between text-[8px] font-mono text-white/40">
                    <span className="font-bold text-white/80">GBP/USD, M30</span>
                    <span className="text-rose-400">{gbpusdPrice.toFixed(5)}</span>
                  </div>
                  {/* Candlestick lines mock */}
                  <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-20 pointer-events-none">
                    <div className="h-4 w-1 bg-rose-500 rounded-sm relative"><div className="absolute -top-1 left-0.5 h-6 w-px bg-rose-500"></div></div>
                    <div className="h-8 w-1 bg-rose-500 rounded-sm relative"><div className="absolute -top-2 left-0.5 h-11 w-px bg-rose-500"></div></div>
                    <div className="h-10 w-1 bg-emerald-500 rounded-sm relative"><div className="absolute -top-3 left-0.5 h-15 w-px bg-emerald-500"></div></div>
                    <div className="h-6 w-1 bg-rose-500 rounded-sm relative"><div className="absolute -top-1 left-0.5 h-8 w-px bg-rose-500"></div></div>
                  </div>
                  {/* Action tag */}
                  <div className="flex items-center justify-between z-10 gap-2 mt-auto">
                    <div className="flex-1 bg-rose-500/10 border border-rose-500/20 rounded p-1 text-center">
                      <div className="text-[6px] text-rose-400 font-bold uppercase">Sell</div>
                      <div className="text-[8px] font-mono font-bold text-rose-500">{gbpusdPrice.toFixed(4)}</div>
                    </div>
                    <div className="flex-1 bg-emerald-500/10 border border-emerald-500/20 rounded p-1 text-center">
                      <div className="text-[6px] text-emerald-400 font-bold uppercase">Buy</div>
                      <div className="text-[8px] font-mono font-bold text-emerald-500">{(gbpusdPrice + 0.00012).toFixed(4)}</div>
                    </div>
                  </div>
                </div>

                {/* Chart 4: USD/JPY, D1 */}
                <div className="bg-[#131722] p-3 aspect-video relative flex flex-col justify-between overflow-hidden">
                  <div className="flex items-center justify-between text-[8px] font-mono text-white/40">
                    <span className="font-bold text-white/80">USD/JPY, D1</span>
                    <span className="text-emerald-400">{usdjpyPrice.toFixed(2)}</span>
                  </div>
                  {/* Candlestick lines mock */}
                  <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-20 pointer-events-none">
                    <div className="h-6 w-1 bg-emerald-500 rounded-sm relative"><div className="absolute -top-2 left-0.5 h-9 w-px bg-emerald-500"></div></div>
                    <div className="h-10 w-1 bg-emerald-500 rounded-sm relative"><div className="absolute -top-3 left-0.5 h-16 w-px bg-emerald-500"></div></div>
                    <div className="h-4 w-1 bg-rose-500 rounded-sm relative"><div className="absolute -top-1 left-0.5 h-6 w-px bg-rose-500"></div></div>
                    <div className="h-8 w-1 bg-emerald-500 rounded-sm relative"><div className="absolute -top-2 left-0.5 h-12 w-px bg-emerald-500"></div></div>
                  </div>
                  {/* Action tag */}
                  <div className="flex items-center justify-between z-10 gap-2 mt-auto">
                    <div className="flex-1 bg-rose-500/10 border border-rose-500/20 rounded p-1 text-center">
                      <div className="text-[6px] text-rose-400 font-bold uppercase">Sell</div>
                      <div className="text-[8px] font-mono font-bold text-rose-500">{usdjpyPrice.toFixed(2)}</div>
                    </div>
                    <div className="flex-1 bg-emerald-500/10 border border-emerald-500/20 rounded p-1 text-center">
                      <div className="text-[6px] text-emerald-400 font-bold uppercase">Buy</div>
                      <div className="text-[8px] font-mono font-bold text-emerald-500">{(usdjpyPrice + 0.05).toFixed(2)}</div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Trade/Orders Active Table */}
              <div className="bg-[#1C2028] text-[9px] sm:text-[10px] font-mono overflow-x-auto min-h-[100px] flex flex-col justify-between">
                
                {/* Table Header */}
                <div className="border-b border-[#2C313C] px-3 py-1 flex items-center justify-between text-white/40">
                  <div className="flex gap-4">
                    <span className="text-white border-b border-blue-500 pb-0.5 font-bold uppercase tracking-wider">Open Trades (1)</span>
                    <span className="uppercase tracking-wider">Exposure</span>
                    <span className="uppercase tracking-wider">History</span>
                    <span className="uppercase tracking-wider">Journal</span>
                  </div>
                  <div className="text-[8px] text-emerald-500 font-bold uppercase">Live Connection</div>
                </div>

                {/* Table Position Row */}
                <div className="px-3 py-2 flex items-center justify-between hover:bg-[#202530] transition-colors border-b border-white/5 bg-[#141820]/45">
                  <div className="grid grid-cols-6 gap-2 sm:gap-6 flex-1">
                    <div className="font-bold text-white">EURUSD</div>
                    <div className="text-rose-400 font-bold uppercase">Sell</div>
                    <div className="text-white/80">{lots.toFixed(1)}</div>
                    <div className="text-white/80 font-bold">{openPrice.toFixed(5)}</div>
                    <div className="text-rose-500/70">1.09920</div>
                    <div className="text-emerald-500/70">1.09200</div>
                  </div>
                  
                  {/* Current Ticking Price & Dynamic Profit */}
                  <div className="flex gap-6 items-center shrink-0 min-w-[120px] justify-end">
                    <div className="text-white font-bold">{eurusdPrice.toFixed(5)}</div>
                    <div className={`font-bold ${tradeProfit >= 0 ? "text-emerald-400 animate-pulse" : "text-rose-400"}`}>
                      ${tradeProfit >= 0 ? "+" : ""}{fmt(tradeProfit)}
                    </div>
                  </div>
                </div>

                {/* Bottom Total Footer */}
                <div className="bg-[#131722] border-t border-[#202430] px-3 py-1 flex items-center justify-between text-[8px] text-white/35">
                  <div>Live execution ticks via Equinix LD4 cross-connect.</div>
                  <div className="flex gap-2 items-center font-bold">
                    <span>TOTAL PROFIT:</span>
                    <span className={tradeProfit >= 0 ? "text-emerald-400" : "text-rose-400"}>
                      ${tradeProfit >= 0 ? "+" : ""}{fmt(tradeProfit)}
                    </span>
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
          
          {/* Right Column: Copy & Value Proposition (Takes 5 Cols on desktop) */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-5 order-1 lg:order-2 space-y-8 text-left"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-[0.25em] w-fit">
                <Cpu className="w-2.5 h-2.5" /> High-Performance Infrastructure
              </div>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[0.95] italic uppercase">
                Terminal <br />
                <span className="text-emerald-400">Execution.</span>
              </h2>
              <p className="text-sm sm:text-base text-white/40 leading-relaxed font-medium">
                Native MetaTrader 5 (MT5) integration built with our proprietary bridge protocols. Experience zero-latency synchronization between our quantitative research models and your B2B execution workstation.
              </p>
            </div>

            {/* Structured Value Checklist */}
            <div className="space-y-4 pt-2">
              {[
                { icon: Activity, title: "Automated Strategy Execution", desc: "Automate system entry/exit logic with millisecond accuracy." },
                { icon: Server, title: "Equinix Co-location Infrastructure", desc: "Co-located servers minimize trade slippage and speed fills." },
                { icon: ShieldCheck, title: "Built-in Risk Safeguards", desc: "Enforce systemic drawdowns and equity caps at server level." }
              ].map((item) => (
                <div key={item.title} className="flex gap-4 items-start group">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/40 group-hover:text-emerald-400 group-hover:border-emerald-500/20 transition-all shrink-0">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-white group-hover:text-emerald-400 transition-colors">{item.title}</h3>
                    <p className="text-[11px] text-white/30 font-medium leading-normal mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </motion.div>

        </div>
      </div>
    </motion.div>
  );
};
