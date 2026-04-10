import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';

export function RiskMetrics() {
  const metrics = [
    { label: 'Drawdown Max', value: '4.2%', status: 'Safe' },
    { label: 'Exposure Ratio', value: '1:30', status: 'Optimal' },
    { label: 'Risk per Trade', value: '1.5%', status: 'Guarded' },
  ];

  return (
    <div className="p-6 rounded-3xl bg-black/20 border border-white/10 backdrop-blur-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] flex items-center gap-2">
          <ShieldAlert className="w-3 h-3 text-emerald-500" />
          Stability Index
        </h3>
        <Info className="w-3 h-3 text-white/10 cursor-help" />
      </div>

      <div className="space-y-4">
        {metrics.map((m) => (
          <div key={m.label} className="flex flex-col gap-1">
            <div className="flex justify-between items-center px-1">
              <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">{m.label}</span>
              <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-widest">{m.status}</span>
            </div>
            <div className="h-10 px-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <span className="text-sm font-mono font-black text-white">{m.value}</span>
              <div className="h-1 w-16 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
