import React from 'react';
import { Search, Bell, User } from 'lucide-react';

/**
 * DashboardHeader — Clean top bar for authenticated dashboard.
 * Search bar + notification bell + user avatar only. No status indicators.
 */
export function DashboardHeader() {
  return (
    <div className="w-full flex items-center justify-between">
      <div className="flex items-center gap-4 md:gap-8">
        <div className="relative group hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-emerald-500 transition-colors" />
          <input 
            type="text"
            placeholder="Search algorithms, sessions..."
            className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs font-medium w-[200px] lg:w-[300px] focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-white/10"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-black" />
        </button>
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center overflow-hidden cursor-pointer hover:border-emerald-500/50 transition-colors shrink-0">
          <User className="w-5 h-5 text-white/40" />
        </div>
      </div>
    </div>
  );
}
