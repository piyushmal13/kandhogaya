import React from "react";
import { Link } from "react-router-dom";
import { Zap, Lock } from "lucide-react";
import { cn } from "@/utils/cn";

interface SignalFeedProps {
  signals: any[];
  isPro: boolean;
  onUpgrade: () => void;
}

export const SignalFeed: React.FC<SignalFeedProps> = ({
  signals,
  isPro,
  onUpgrade
}) => {
  const renderSignals = () => {
    if (signals.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 text-xs font-black uppercase tracking-[0.2em] italic">Awaiting new trade setups...</p>
        </div>
      );
    }

    return signals.map(s => (
      <div key={s.id} className="p-6 rounded-3xl bg-black/40 flex items-center justify-between border border-white/5 hover:bg-white/5 transition-colors">
        <div className="flex items-center gap-6">
          <div className={cn("w-3 h-3 rounded-full shadow-[0_0_12px]", s.direction === 'BUY' ? "bg-emerald-500 shadow-emerald-500" : "bg-red-500 shadow-red-500")} />
          <span className="text-lg font-bold text-white tracking-tight">{s.asset}</span>
          <span className={cn("text-[9px] font-black tracking-[0.2em] px-3 py-1 rounded-lg", s.direction === 'BUY' ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500")}>
            {s.direction}
          </span>
        </div>
        <span className="text-[11px] font-mono text-gray-600 font-black">
          {new Date(s.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    ));
  };

  return (
    <section className="p-10 rounded-[48px] bg-white/5 border border-white/10 backdrop-blur-3xl relative group">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-2xl font-black text-white flex items-center gap-3 uppercase tracking-tighter italic">
          <Zap className="w-6 h-6 text-yellow-500" />
          Elite Frequency
        </h2>
        <Link to="/signals" className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-[0.2em]">FULL FEED</Link>
      </div>

      {!isPro && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-8 bg-black/80 backdrop-blur-xl rounded-[48px] animate-in fade-in duration-1000">
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-[32px] flex items-center justify-center mb-6 text-emerald-500 shadow-2xl relative">
            <Lock className="w-10 h-10" />
            <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse" />
          </div>
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic mb-2">Signals Locked</h3>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest text-center mb-8">Upgrade for real-time institutional signals.</p>
          <button 
            onClick={onUpgrade}
            className="px-10 py-4 bg-emerald-500 text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:scale-110 transition-all shadow-xl shadow-emerald-500/20"
          >
            Unlock Discovery Feed
          </button>
        </div>
      )}
      
      <div className={cn("space-y-3 relative transition-all duration-700", !isPro && "blur-[12px] select-none pointer-events-none")}>
        {renderSignals()}
      </div>
    </section>
  );
};
