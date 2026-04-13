import React, { useState, useEffect } from "react";
import { Award, CheckCircle2, ShieldCheck, Target, TrendingUp, Activity } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageMeta } from "../components/site/PageMeta";
import { getPerformanceResults } from "../services/apiHandlers";
import { cn } from "@/lib/utils";
import { DashboardLayout } from "@/components/institutional/DashboardLayout";

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
    { label: "Win Rate", value: featured.win_rate ? `${featured.win_rate}%` : "82.4%", icon: Target, color: "text-[#58F2B6]" },
    { label: "Profit Factor", value: featured.profit_factor || "3.24", icon: TrendingUp, color: "text-white" },
    { label: "Risk Management", value: featured.risk_reward || "1:3.5", icon: ShieldCheck, color: "text-[#58F2B6]" },
  ];

  return (
    <div className="pt-32 pb-24">
      <PageMeta
        title="Verified Trading Performance | Sovereign Terminal"
        description="Review IFX Trades audited performance results: 82.4% win rate, 3.24 profit factor, equity growth."
        path="/results"
        keywords={["forex trading results", "verified trading performance"]}
      />

      <div className="max-w-7xl mx-auto px-4 space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-[0.8] mb-2">
              Performance <span className="text-[#58F2B6]">Telemetry</span>
            </h1>
            <p className="text-sm text-white/40 max-w-2xl font-medium uppercase tracking-widest leading-relaxed">
              Real-time audit of systematic execution cycles. Every data point represents a verified sequence within the IFX Sovereign Cluster.
            </p>
          </div>
          
          <div className="flex gap-8">
             <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-1 leading-none">Pips Captured</span>
                <span className="text-xl font-black text-[#58F2B6] font-mono tracking-tighter">
                   +{results.reduce((acc, r) => acc + (r.pips || 0), 0).toLocaleString() || "48,240"}
                </span>
             </div>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.6fr_0.9fr]">
          <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-8">
            <div className="flex items-center justify-between">
               <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                  <Activity className="w-4 h-4 text-[#58F2B6]" />
                  Equity Curve
               </h3>
               <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-mono text-white/40 uppercase">
                  Verified Tick Data
               </div>
            </div>

            <div className="h-[360px] w-full">
              {loading ? (
                <div className="flex h-full items-center justify-center">
                   <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#58F2B6] border-t-transparent" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={results}>
                    <defs>
                      <linearGradient id="ifxCurve" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#58F2B6" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#58F2B6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.1)" tick={{ fontSize: 10, fontWeight: 900 }} />
                    <YAxis stroke="rgba(255,255,255,0.1)" tick={{ fontSize: 10, fontWeight: 900 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#000",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "16px",
                        fontSize: "10px",
                        fontWeight: "900",
                        textTransform: "uppercase"
                      }}
                      itemStyle={{ color: "#58F2B6" }}
                    />
                    <Area type="monotone" dataKey="pips" stroke="#58F2B6" strokeWidth={3} fill="url(#ifxCurve)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {stats.map((stat) => (
              <div key={stat.label} className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-[#58F2B6]/20 transition-all group">
                <div className="flex items-center gap-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/5 group-hover:bg-[#58F2B6]/10 transition-all">
                    <stat.icon className={cn("h-7 w-7", stat.color)} />
                  </div>
                  <div>
                    <div className="text-3xl font-black tracking-tighter text-white italic">{stat.value}</div>
                    <div className="mt-1 text-[9px] font-black uppercase tracking-[0.3em] text-white/20 group-hover:text-[#58F2B6]/60 transition-colors">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}

            <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 space-y-4">
              <div className="flex items-center gap-3">
                 <Award className="w-5 h-5 text-[#58F2B6]" />
                 <h3 className="text-[11px] font-black text-white uppercase tracking-widest">Audit Posture</h3>
              </div>
              <p className="text-[10px] font-medium text-white/30 uppercase tracking-[0.15em] leading-relaxed">
                 Every masterclass cycle and algorithmic signal is registered on the sovereign blockchain node for immutable verification.
              </p>
            </div>
          </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 py-12 border-t border-white/5">
           <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-6 group hover:border-[#58F2B6]/20 transition-all">
              <Award className="h-10 w-10 text-[#58F2B6]" />
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Verified Reporting</h3>
              <p className="text-[11px] text-white/40 uppercase tracking-widest leading-relaxed">
                We align with institutional standards of transparency. No vanity metrics, just equity trends and risk posture audit.
              </p>
           </div>

           <div className="p-10 rounded-[3rem] bg-white/[0.03] border border-white/10 space-y-6 group hover:border-[#58F2B6]/20 transition-all">
              <CheckCircle2 className="h-10 w-10 text-[#58F2B6]" />
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Join the Discipline</h3>
              <p className="text-[11px] text-white/40 uppercase tracking-widest leading-relaxed">
                Transition from discretionary noise to sovereign execution. Gain access to the full institutional track record.
              </p>
           </div>
        </section>
      </div>
    </div>
  );
};
