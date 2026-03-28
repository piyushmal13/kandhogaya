import { motion } from "motion/react";
import { Zap } from "lucide-react";
import { useDataPulse } from "../../hooks/useDataPulse";
import { SignalCardSkeleton } from "../ui/Skeleton";

interface Signal {
  id: string;
  asset: string;
  direction: "BUY" | "SELL";
  entry_price: number;
  stop_loss: number;
  take_profit: number;
  status: "active" | "closed";
  created_at: string;
}

export const LiveSignalsFeed = () => {
  const { signals, loading } = useDataPulse();

  // Cast signals to the internal interface for UI compatibility
  const feedSignals = (signals as any[]) || [];

  return (
    <section className="py-12 border-b border-[var(--border-default)]" style={{ background: "var(--bg-base)" }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" aria-hidden="true" />
            <h2 className="text-lg font-bold text-white tracking-tight uppercase">
              Live Signal Feed
            </h2>
          </div>
          <div
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: "var(--text-muted)" }}
          >
            Real-time Updates Active
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? ['skel-1', 'skel-2', 'skel-3'].map(key => <SignalCardSkeleton key={key} />)
            : signals.slice(0, 3).map((signal: Signal) => (
                <motion.div
                  key={signal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="rounded-3xl border border-[var(--border-default)] p-6 hover:border-[var(--accent)]/50 hover:shadow-[0_0_40px_rgba(88,242,182,0.15)] transition-all duration-300 group relative overflow-hidden"
                  style={{ background: "rgba(10,20,34,0.6)", backdropFilter: "blur(16px)" }}
                  role="article"
                  aria-label={`${signal.asset} ${signal.direction} signal`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl group-hover:opacity-100 opacity-0 transition-opacity"
                    style={{ background: "var(--accent-subtle)" }}
                    aria-hidden="true"
                  />
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-2xl font-bold text-white font-mono tracking-tight">
                        {signal.asset}
                      </div>
                      <div
                        className={`text-xs font-bold uppercase tracking-widest mt-1 ${
                          signal.direction === "BUY" ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {signal.direction} @ {signal.entry_price}
                      </div>
                    </div>
                    <div
                      className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                        signal.status === "active"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-white/5 text-slate-400"
                      }`}
                    >
                      {signal.status}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[10px] uppercase font-bold mb-1" style={{ color: "var(--text-muted)" }}>
                        Take Profit
                      </div>
                      <div className="text-sm font-bold text-white font-mono">{signal.take_profit}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold mb-1" style={{ color: "var(--text-muted)" }}>
                        Stop Loss
                      </div>
                      <div className="text-sm font-bold text-white font-mono">{signal.stop_loss}</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[var(--border-default)] flex justify-between items-center">
                    <div className="text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>
                      <time dateTime={signal.created_at}>
                        {new Date(signal.created_at).toLocaleTimeString()}
                      </time>
                    </div>
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                      style={{ background: "rgba(255,255,255,0.05)" }}
                      aria-hidden="true"
                    >
                      <Zap className="w-3 h-3 text-emerald-400" />
                    </div>
                  </div>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
};
