import React from 'react';
import { Search, Bell, User, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

const StatusIndicator = ({ status }: { status: 'open' | 'closed' }) => (
  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
    <span className={cn(
      "relative flex h-2 w-2",
      status === 'open' ? "text-emerald-500" : "text-red-500"
    )}>
      <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", status === 'open' ? "bg-emerald-400" : "bg-red-400")} />
      <span className={cn("relative inline-flex rounded-full h-2 w-2", status === 'open' ? "bg-emerald-500" : "bg-red-500")} />
    </span>
    <span className="text-[10px] font-black text-white/70 uppercase tracking-widest font-mono">
      Market {status}
    </span>
  </div>
);

export function DashboardHeader() {
  return (
    <div className="w-full flex items-center justify-between">
      <div className="flex items-center gap-8">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-emerald-500 transition-colors" />
          <input 
            type="text"
            placeholder="Search nodes, algos, telemetry..."
            className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs font-medium w-[300px] focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-white/10"
          />
        </div>
        <StatusIndicator status="open" />
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.02] border border-white/5">
          <Activity className="w-3 h-3 text-emerald-500" />
          <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">
            Link Latency: <span className="text-white/80">124ms</span>
          </span>
        </div>
        <div className="flex items-center gap-4 border-l border-white/10 pl-6 h-8">
          <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-black" />
          </button>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center overflow-hidden cursor-pointer hover:border-emerald-500/50 transition-colors">
            <User className="w-5 h-5 text-white/40" />
          </div>
        </div>
      </div>
    </div>
  );
}
