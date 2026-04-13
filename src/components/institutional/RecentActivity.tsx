import { History, ArrowUpRight, ArrowDownRight } from 'lucide-react';

/**
 * RecentActivity (v2.0)
 * 
 * The Multi-Asset Ledger for the Sovereign Terminal.
 * Features: High-density row mapping, state-specific iconography, and audit-ready status tracking.
 */
export function RecentActivity() {
  const activities = [
    { type: 'withdrawal', amount: '$4,200', date: '2h ago', status: 'Confirmed', icon: ArrowDownRight, color: 'text-red-500' },
    { type: 'trade', pair: 'XAU/USD', profit: '+$1,240', date: '4h ago', status: 'Settled', icon: ArrowUpRight, color: 'text-primary-400' },
    { type: 'deposit', amount: '$10,000', date: 'Yesterday', status: 'Cleared', icon: ArrowUpRight, color: 'text-primary-400' },
  ] as const;

  return (
    <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/10 backdrop-blur-xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />

      <h3 className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.4em] flex items-center gap-3 mb-8">
        <History className="w-3.5 h-3.5 text-primary-400" />
        Activity Ledger
      </h3>

      <div className="space-y-3 relative z-10">
        {activities.map((a, i) => (
          <div 
            key={i} 
            className="group/row relative p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover/row:border-white/10 transition-colors`}>
                  <a.icon className={`w-5 h-5 ${a.color}`} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-black uppercase text-foreground leading-none">
                    {'pair' in a ? a.pair : a.type}
                  </span>
                  <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">{a.date}</span>
                </div>
              </div>
              <div className="text-right flex flex-col gap-0.5">
                <div className="text-sm font-mono font-black text-foreground tabular-nums">
                  {'profit' in a ? a.profit : a.amount}
                </div>
                <div className="text-[8px] font-black text-white/20 uppercase tracking-widest">{a.status}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-8 pt-6 text-[10px] font-black text-white/20 hover:text-primary-400 border-t border-white/5 uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-2 group/btn">
        Full Ledger Archive
        <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
      </button>
    </div>
  );
}
