import { ShieldAlert, Info } from 'lucide-react';

/**
 * RiskMetrics (v2.0)
 * 
 * High-authority stability telemetry for the Sovereign Terminal.
 * Features: Institutional monitoring markers, scale-accurate risk bars, and guarded state validation.
 */
export function RiskMetrics() {
  const metrics = [
    { label: 'Drawdown Max', value: '4.2%', status: 'Safe', color: '#58F2B6', width: '42%' },
    { label: 'Margin Efficiency', value: '82%', status: 'Optimal', color: '#58F2B6', width: '82%' },
    { label: 'Volatility Guard', value: 'Active', status: 'Locked', color: '#58F2B6', width: '100%' },
  ] as const;

  return (
    <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/10 backdrop-blur-xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <h3 className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.4em] flex items-center gap-3">
          <ShieldAlert className="w-3.5 h-3.5 text-primary-400 group-hover:animate-pulse" />
          Stability Index
        </h3>
        <Info className="w-3.5 h-3.5 text-white/10 cursor-help hover:text-white/40 transition-colors" />
      </div>

      <div className="space-y-6 relative z-10">
        {metrics.map((m) => (
          <div key={m.label} className="flex flex-col gap-2">
            <div className="flex justify-between items-center px-1">
              <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">{m.label}</span>
              <span className="text-[8px] font-mono text-primary-400 font-bold uppercase tracking-widest bg-primary-500/10 px-2 py-0.5 rounded-full">
                {m.status}
              </span>
            </div>
            
            <div className="h-12 px-5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between group/row hover:border-white/10 transition-colors">
              <span className="text-sm font-mono font-black text-foreground tabular-nums tracking-tighter">{m.value}</span>
              <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-500 transition-all duration-1000 ease-out" 
                  style={{ width: m.width }} 
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Surface Metadata */}
      <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-2 opacity-20">
         <div className="w-1.5 h-1.5 rounded-full bg-primary-400" />
         <span className="text-[8px] font-black uppercase tracking-widest text-primary-400">Guardian Mode Synchronized</span>
      </div>
    </div>
  );
}
