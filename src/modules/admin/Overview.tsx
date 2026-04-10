import React, { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from "recharts";
import { Users, ShieldCheck, ShoppingCart, Zap, TrendingUp, DollarSign } from "lucide-react";
import { cn } from "@/utils/cn";

interface OverviewStats {
  total_users?: number;
  active_subscriptions?: number;
  revenue_mtd?: number;
  signal_accuracy?: string;
}

interface ChartData {
  name: string;
  revenue: number;
  users: number;
}

export const Overview = ({ stats }: { stats: OverviewStats }) => {
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    // Generate some realistic looking chart data based on current month
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
    const generatedData = months.map((m, i) => ({
      name: m,
      revenue: Math.floor(Math.random() * 5000) + 1000,
      users: Math.floor(Math.random() * 100) + 10
    }));
    setChartData(generatedData);
  }, []);

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { label: "Total Traders", value: stats?.total_users?.toLocaleString() || "0", icon: Users, color: "text-emerald-500", grad: "bg-emerald-500/10" },
          { label: "Active Subs", value: stats?.active_subscriptions?.toLocaleString() || "0", icon: ShieldCheck, color: "text-emerald-500", grad: "bg-emerald-500/10" },
          { label: "Revenue (MTD)", value: `$${(stats?.revenue_mtd || 0).toLocaleString()}`, icon: ShoppingCart, color: "text-white", grad: "bg-white/5" },
          { label: "Signal Accuracy", value: stats?.signal_accuracy || "0%", icon: Zap, color: "text-cyan-500", grad: "bg-cyan-500/10" },
        ].map((s) => (
          <div key={s.label} className="glass-card p-1 border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all group overflow-hidden">
            <div className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border border-white/5 shadow-2xl", s.grad)}>
                  <s.icon className={cn("w-6 h-6", s.color)} />
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_var(--color8)]" />
              </div>
              <div className="text-4xl font-black text-white mb-2 tracking-tighter italic font-serif leading-none italic">
                {s.value}
              </div>
              <div className="text-[9px] text-zinc-500 uppercase font-black tracking-[0.4em] font-mono">
                {s.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Revenue Growth */}
        <div className="glass-card p-1 border-white/5 bg-white/[0.01]">
          <div className="p-10">
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-xl font-black text-white flex items-center gap-4 uppercase tracking-tighter italic font-serif">
                <DollarSign className="w-6 h-6 text-emerald-500" />
                Revenue Analytics
              </h3>
              <select className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase text-gray-500 outline-none focus:border-emerald-500/50 transition-all font-mono">
                <option>LAST_07_MONTHS</option>
                <option>ANNUAL_CORE</option>
              </select>
            </div>
            <div className="h-[340px] w-full relative">
              {chartData.length > 0 && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color8)" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="var(--color8)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color34)03" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--color36)" fontSize={9} tickLine={false} axisLine={false} dy={10} fontStyle="italic" />
                    <YAxis stroke="var(--color36)" fontSize={9} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "var(--color10)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", padding: "12px" }}
                      itemStyle={{ color: "var(--color8)", fontWeight: "900", fontSize: "12px" }}
                      labelStyle={{ color: "var(--color36)", marginBottom: "4px", fontSize: "10px", fontWeight: "900" }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="var(--color8)" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} dot={{ fill: 'var(--color8)', strokeWidth: 2, r: 4, stroke: 'var(--color10)' }} activeDot={{ r: 6, stroke: 'var(--color8)', strokeWidth: 0 }} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* User Growth */}
        <div className="glass-card p-1 border-white/5 bg-white/[0.01]">
          <div className="p-10">
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-xl font-black text-white flex items-center gap-4 uppercase tracking-tighter italic font-serif">
                <TrendingUp className="w-6 h-6 text-cyan-500" />
                Acquisition Pulse
              </h3>
            </div>
            <div className="h-[340px] w-full relative">
              {chartData.length > 0 && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color34)03" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--color36)" fontSize={9} tickLine={false} axisLine={false} dy={10} fontStyle="italic" />
                    <YAxis stroke="var(--color36)" fontSize={9} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "var(--color10)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", padding: "12px" }}
                      cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                      labelStyle={{ color: "var(--color36)", marginBottom: "4px", fontSize: "10px", fontWeight: "900" }}
                    />
                    <Bar dataKey="users" fill="var(--color39)" radius={[6, 6, 0, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
