import React, { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from "recharts";
import { Users, ShieldCheck, ShoppingCart, Zap, TrendingUp, DollarSign } from "lucide-react";

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Traders", value: stats?.total_users?.toLocaleString() || "0", icon: Users, color: "text-blue-500" },
          { label: "Active Subs", value: stats?.active_subscriptions?.toLocaleString() || "0", icon: ShieldCheck, color: "text-emerald-500" },
          { label: "Revenue (MTD)", value: `$${(stats?.revenue_mtd || 0).toLocaleString()}`, icon: ShoppingCart, color: "text-amber-500" },
          { label: "Signal Accuracy", value: stats?.signal_accuracy || "0%", icon: Zap, color: "text-purple-500" },
        ].map((s) => (
          <div key={s.label} className="bg-zinc-900 border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <s.icon className="w-12 h-12" />
            </div>
            <s.icon className={`${s.color} w-5 h-5 mb-4`} />
            <div className="text-2xl font-bold text-white mb-1">{s.value}</div>
            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Growth */}
        <div className="bg-zinc-900 border border-white/10 p-8 rounded-3xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-white font-bold flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              Revenue Growth
            </h3>
            <select className="bg-black border border-white/10 rounded-lg px-3 py-1 text-xs text-gray-400 outline-none">
              <option>Last 7 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full relative">
            {chartData.length > 0 && (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="name" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0a0a0a", border: "1px solid #ffffff10", borderRadius: "12px" }}
                    itemStyle={{ color: "#10b981" }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* User Growth */}
        <div className="bg-zinc-900 border border-white/10 p-8 rounded-3xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-white font-bold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-500" />
              User Acquisition
            </h3>
          </div>
          <div className="h-[300px] w-full relative">
            {chartData.length > 0 && (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="name" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0a0a0a", border: "1px solid #ffffff10", borderRadius: "12px" }}
                    cursor={{ fill: '#ffffff05' }}
                  />
                  <Bar dataKey="users" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
