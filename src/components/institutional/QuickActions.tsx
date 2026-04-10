import React from 'react';
import { Plus, Zap, Shield, BarChart3 } from 'lucide-react';
import { Button } from '../ui/Button';

export function QuickActions() {
  const actions = [
    { icon: Plus, label: 'Add Node', variant: 'sovereign' as const },
    { icon: Zap, label: 'Manual Execution', variant: 'secondary' as const },
    { icon: Shield, label: 'Hedge Protection', variant: 'secondary' as const },
    { icon: BarChart3, label: 'Export P/L', variant: 'secondary' as const },
  ];

  return (
    <div className="p-6 rounded-3xl bg-black/20 border border-white/10 backdrop-blur-3xl space-y-4">
      <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-2">Alpha Operations</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Button 
            key={action.label} 
            variant={action.variant} 
            size="sm" 
            className="rounded-xl flex items-center justify-center gap-2 h-12"
          >
            <action.icon className="w-4 h-4" />
            <span className="text-[9px] font-black uppercase tracking-widest leading-none">{action.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
