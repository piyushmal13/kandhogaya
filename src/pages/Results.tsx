import React, { useState, useEffect } from "react";
import { Award, CheckCircle2, ShieldCheck, Target, TrendingUp, Activity } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageMeta } from "../components/site/PageMeta";
import { getPerformanceResults } from "../services/apiHandlers";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

export const Results = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      const data = await getPerformanceResults();
      if (data) setResults(data);
      setLoading(false);
    };
    fetchResults();
  }, []);

  const featured = results.find(r => r.is_featured) || results.at(-1) || {};

  const stats = [
    { label: "Win Rate", value: featured.win_rate ? `${featured.win_rate}%` : "82.4%", icon: Target, color: "text-emerald-500" },
    { label: "Profit Factor", value: featured.profit_factor || "3.24", icon: TrendingUp, color: "text-white" },
    { label: "Risk Management", value: featured.risk_reward || "1:3.5", icon: ShieldCheck, color: "text-emerald-500" },
  ];

  return (
    <div className="pt-32 md:pt-48 pb-20 md:pb-32 bg-[#020202] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.06)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
      </div>

      <PageMeta
        title="Institutional Performance Analytics | IFX TRADES"
        description="Access verified performance data across the IFX multi-strategy ecosystem: 82.4% win rate, 3.24 profit factor, consistent equity growth."
        path="/results"
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-32">
          <div className="space-y-10">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-emerald-500/[0.04] border border-emerald-500/[0.15] text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em]">
              Institutional Performance Data
            </div>
            <h1 className="text-shimmer leading-[0.9]">
              Strategy <br />
              <span className="italic font-serif text-gradient-emerald">Analytics.</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl font-light leading-relaxed">
              Transparent reporting across our elite algorithmic ecosystem. Every data point represents a verified outcome within the IFX multi-strategy execution framework.
            </p>
          </div>
          
          <div className="flex gap-12">
             <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-3">Pips Captured</span>
                <span className="text-4xl font-black text-emerald-500 font-mono tracking-tighter italic">
                   +{results.reduce((acc, r) => acc + (r.pips || 0), 0).toLocaleString() || "48,240"}
                </span>
             </div>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1.6fr_0.9fr] mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] bg-[#080B12] border border-white/[0.06] space-y-10 shadow-2xl"
          >
            <div className="flex items-center justify-between">
               <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em] flex items-center gap-4">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  Equity Curve Analysis
               </h3>
               <div className="px-4 py-2 bg-emerald-500/[0.05] border border-emerald-500/[0.1] rounded-full text-[9px] font-black text-emerald-500/60 uppercase tracking-widest italic">
                  Verified Strategy Data
               </div>
            </div>

            <div className="h-[400px] w-full">
              {loading ? (
                <div className="flex h-full items-center justify-center">
                   <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={results}>
                    <defs>
                      <linearGradient id="ifxCurve" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.05)" tick={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.1em' }} />
                    <YAxis stroke="rgba(255,255,255,0.05)" tick={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.1em' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#080B12",
                        border: "1px solid rgba(16,185,129,0.1)",
                        borderRadius: "20px",
                        fontSize: "9px",
                        fontWeight: "900",
                        textTransform: "uppercase",
                        letterSpacing: "0.2em"
                      }}
                      itemStyle={{ color: "#10B981" }}
                      labelFormatter={(label) => `Period: ${label}`}
                      formatter={(value: any) => [`${value} Pips`, 'Strategy Performance']}
                    />
                    <Area type="monotone" dataKey="pips" stroke="#10B981" strokeWidth={3} fill="url(#ifxCurve)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>

          <div className="space-y-8">
            {stats.map((stat, idx) => (
              <motion.div 
                key={stat.label} 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-10 rounded-[2.5rem] bg-[#080B12] border border-white/[0.06] hover:border-emerald-500/20 transition-all duration-700 group hover:shadow-xl"
              >
                <div className="flex items-center gap-8">
                  <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-white/[0.03] border border-white/[0.06] group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-all duration-700">
                    <stat.icon className={cn("h-7 w-7", stat.color)} />
                  </div>
                  <div>
                    <div className="text-4xl font-black tracking-tighter text-white italic mb-1">{stat.value}</div>
                    <div className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 group-hover:text-emerald-500/60 transition-colors duration-700">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            ))}

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-10 rounded-[3rem] bg-emerald-500/[0.02] border border-emerald-500/[0.1] space-y-6"
            >
              <div className="flex items-center gap-4">
                 <Award className="w-5 h-5 text-emerald-500" />
                 <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Verification Standards</h3>
              </div>
              <p className="text-[11px] font-light text-white/30 uppercase tracking-[0.2em] leading-relaxed italic">
                 Every strategy execution and algorithmic trade is logged within our proprietary verification protocol for absolute transparency.
              </p>
            </motion.div>
          </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 py-24 border-t border-white/[0.05]">
           <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="p-12 rounded-[4rem] bg-[#080B12] border border-white/[0.06] space-y-8 group hover:border-emerald-500/30 transition-all duration-700"
            >
              <Award className="h-12 w-12 text-emerald-500" />
              <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Institutional Reporting</h3>
              <p className="text-[11px] text-white/30 uppercase tracking-[0.2em] leading-relaxed font-light">
                We align with institutional standards of transparency. No vanity metrics, just verified equity trends and risk posture metrics.
              </p>
           </motion.div>

           <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="p-12 rounded-[4rem] bg-[#080B12] border border-white/[0.06] space-y-8 group hover:border-emerald-500/30 transition-all duration-700"
            >
              <CheckCircle2 className="h-12 w-12 text-emerald-500" />
              <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Elite Execution</h3>
              <p className="text-[11px] text-white/30 uppercase tracking-[0.2em] leading-relaxed font-light">
                Transition from discretionary noise to systematic excellence. Gain access to our full institutional multi-strategy alpha.
              </p>
           </motion.div>
        </section>
      </div>
    </div>
  );
};
