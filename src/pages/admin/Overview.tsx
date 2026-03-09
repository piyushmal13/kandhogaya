import React from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell 
} from "recharts";
import { Users, ShieldCheck, ShoppingCart, Zap, TrendingUp, DollarSign } from "lucide-react";

const data = [
  { name: "Jan", revenue: 4000, users: 2400 },
  { name: "Feb", revenue: 3000, users: 1398 },
  { name: "Mar", revenue: 2000, users: 9800 },
  { name: "Apr", revenue: 2780, users: 3908 },
  { name: "May", revenue: 1890, users: 4800 },
  { name: "Jun", revenue: 2390, users: 3800 },
  { name: "Jul", revenue: 3490, users: 4300 },
];

const COLORS = ["#10b981", "#06b6d4", "#f59e0b", "#ef4444"];

export const Overview = ({ stats }: { stats: any }) => {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Traders", value: stats?.total_users || "24.5k", icon: Users, color: "text-blue-500" },
          { label: "Active Subs", value: stats?.active_subscriptions || "1,240", icon: ShieldCheck, color: "text-emerald-500" },
          { label: "Revenue (MTD)", value: stats?.revenue_mtd ? `$${stats.revenue_mtd}` : "$42.5k", icon: ShoppingCart, color: "text-amber-500" },
          { label: "Signal Accuracy", value: stats?.signal_accuracy || "82.4%", icon: Zap, color: "text-purple-500" },
        ].map((s, i) => (
          <div key={i} className="bg-zinc-900 border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
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
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
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
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
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
          </div>
        </div>
      </div>
    </div>
  );
};
