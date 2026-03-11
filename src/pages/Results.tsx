import React from "react";
import { motion } from "motion/react";
import { Target, TrendingUp, ShieldCheck, Award, CheckCircle2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from "react-router-dom";
import { cn } from "../utils/cn";

export const Results = () => {
  const data = [
    { month: 'Oct', pips: 4200 },
    { month: 'Nov', pips: 3800 },
    { month: 'Dec', pips: 5100 },
    { month: 'Jan', pips: 4800 },
    { month: 'Feb', pips: 6200 },
    { month: 'Mar', pips: 5800 },
  ];

  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <span className="text-emerald-500 font-bold text-xs uppercase tracking-[0.3em] mb-4 inline-block">Track Record</span>
        <h1 className="text-6xl font-bold text-white mb-6 tracking-tight">Institutional Performance</h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">Transparency is our core value. View our verified trading performance across all IFXTrades ecosystems.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
        <div className="lg:col-span-2 bg-zinc-900 border border-white/10 rounded-[3rem] p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10">
            <div className="text-emerald-500 font-bold text-4xl tracking-tighter">+48,250 Pips</div>
            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest text-right">Total Gain (LTM)</div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-10">Equity Growth Curve</h3>
          <div className="h-[400px] w-full min-h-[400px] relative">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorPips" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="month" stroke="#ffffff20" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff20" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Area type="monotone" dataKey="pips" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorPips)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-8">
          {[
            { label: "Win Rate", value: "82.4%", icon: Target, color: "text-emerald-500" },
            { label: "Profit Factor", value: "3.24", icon: TrendingUp, color: "text-white" },
            { label: "Avg. Risk/Reward", value: "1:3.5", icon: ShieldCheck, color: "text-emerald-500" },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-zinc-900 border border-white/10 p-8 rounded-[2.5rem] flex items-center gap-6"
            >
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center">
                <stat.icon className={cn("w-7 h-7", stat.color)} />
              </div>
              <div>
                <div className="text-3xl font-bold text-white tracking-tighter">{stat.value}</div>
                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-emerald-500 p-12 rounded-[3rem] group">
          <Award className="text-black w-12 h-12 mb-6 group-hover:rotate-12 transition-transform" />
          <h3 className="text-3xl font-bold text-black mb-4 tracking-tight">Verified by MyFxBook</h3>
          <p className="text-black/70 mb-8 font-medium">Our results are audited and verified by third-party platforms to ensure 100% transparency for our community.</p>
          <button type="button" onClick={() => alert("Redirecting to MyFxBook...")} className="px-8 py-4 bg-black text-white font-bold rounded-2xl hover:scale-105 transition-transform">
            View Public Audit
          </button>
        </div>
        <div className="bg-zinc-900 border border-white/10 p-12 rounded-[3rem]">
          <CheckCircle2 className="text-emerald-500 w-12 h-12 mb-6" />
          <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">Join the Winners</h3>
          <p className="text-gray-500 mb-8">Stop guessing. Start following the data. Join 12,000+ traders who use IFXTrades to secure their edge.</p>
          <Link to="/login" className="inline-block px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-emerald-500 transition-all">
            Get Started Now
          </Link>
        </div>
      </div>
    </div>
  );
};
