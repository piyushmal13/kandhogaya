import React from 'react';
import { History, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export function RecentActivity() {
  const activities = [
    { type: 'withdrawal', amount: '$4,200', date: '2h ago', status: 'Confirmed' },
    { type: 'trade', pair: 'XAU/USD', profit: '+$1,240', date: '4h ago', status: 'Settled' },
    { type: 'deposit', amount: '$10,000', date: 'Yesterday', status: 'Cleared' },
  ];

  return (
    <div className="p-6 rounded-3xl bg-black/20 border border-white/10 backdrop-blur-3xl space-y-6">
      <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] flex items-center gap-2">
        <History className="w-3 h-3 text-cyan-500" />
        Activity Ledger
      </h3>

      <div className="space-y-3">
        {activities.map((a, i) => (
          <div key={i} className="flex flex-col gap-1 group">
            <div className="h-14 px-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  {a.type === 'trade' ? (
                    <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                  ) : a.type === 'withdrawal' ? (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4 text-cyan-500" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-black uppercase text-white/80">
                    {a.type === 'trade' ? a.pair : a.type}
                  </span>
                  <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">{a.date}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono font-black text-white">
                  {a.type === 'trade' ? a.profit : a.amount}
                </div>
                <div className="text-[8px] font-black text-white/20 uppercase tracking-tighter">{a.status}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full text-center py-2 text-[9px] font-black text-white/20 hover:text-white/40 border-t border-white/5 uppercase tracking-[0.4em] transition-colors">
        Full Ledger Access
      </button>
    </div>
  );
}
