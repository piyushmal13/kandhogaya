import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Activity, Globe, Zap, Users } from 'lucide-react';

export const WebinarOperationsMonitor = () => {
  const [syncCount, setSyncCount] = useState(1248);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setSyncCount(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y border-white/5">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
          <Activity className="w-3 h-3" />
          Execution Live
        </div>
        <div className="text-xl font-black text-white tracking-tighter uppercase italic">
          Expert <span className="text-emerald-500/40">Desk</span>
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-[10px] font-black text-cyan-500 uppercase tracking-widest">
          <Globe className="w-3 h-3" />
          Institutional Reach
        </div>
        <div className="text-xl font-black text-white tracking-tighter uppercase italic">
          {syncCount.toLocaleString()} <span className="text-cyan-500/40">Traders</span>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2 text-[10px] font-black text-amber-500 uppercase tracking-widest">
          <Zap className="w-3 h-3" />
          Signal Integrity
        </div>
        <div className="text-xl font-black text-white tracking-tighter uppercase italic">
          High <span className="text-amber-500/40">Precision</span>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
          <Users className="w-3 h-3" />
          Expert Session
        </div>
        <div className="text-xl font-black text-white tracking-tighter uppercase italic">
          Global <span className="text-emerald-500/40">Access</span>
        </div>
      </div>
    </div>
  );
};
