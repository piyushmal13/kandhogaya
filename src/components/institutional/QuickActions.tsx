import { EliteButton } from '@/components/ui/Button';
import { ShoppingBag, Key, Video, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDashboardData } from '@/hooks/useDashboardData';

const ACTIONS = [
  { label: 'Browse Algorithms', icon: ShoppingBag, path: '/marketplace', variant: 'elite' as const, glow: true },
  { label: 'My Licenses', icon: Key, path: '/dashboard', variant: 'institutional-outline' as const, glow: false },
  { label: 'Research Sessions', icon: Video, path: '/webinars', variant: 'institutional-outline' as const, glow: false },
  { label: 'Contact Support', icon: MessageSquare, path: '/contact', variant: 'institutional-outline' as const, glow: false },
] as const;

/**
 * QuickActions — Dashboard Navigation Shortcuts
 * Provides fast access to key platform features with live stats.
 */
export function QuickActions() {
  const navigate = useNavigate();
  const { data: dashData } = useDashboardData();

  return (
    <div className="p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] bg-white/[0.02] border border-white/10 backdrop-blur-xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />

      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/40 mb-5 sm:mb-8 flex items-center gap-3">
        <div className="w-1 h-3 bg-primary-500 rounded-full" />
        Quick Actions
      </h3>

      <div className="grid grid-cols-1 gap-2.5 sm:gap-4 relative z-10">
        {ACTIONS.map((action) => (
          <EliteButton
            key={action.label}
            variant={action.variant}
            glowEffect={action.glow}
            size="sm"
            className="w-full justify-start gap-3 sm:gap-4 px-4 sm:px-6 py-2.5 sm:py-3.5 border-white/5 hover:border-white/20 text-xs font-bold uppercase tracking-wider transition-all duration-300"
            onClick={() => navigate(action.path)}
            trackingEvent={`quick_${action.label.toLowerCase().replace(/\s/g, '_')}`}
          >
            <action.icon className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity shrink-0" />
            <span className="flex-1 text-left truncate">{action.label}</span>
          </EliteButton>
        ))}
      </div>

      {/* Quick Stats */}
      {dashData && (dashData.licenses.length > 0 || dashData.purchases.length > 0) && (
        <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-white/5 flex items-center justify-between">
          <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400/40">
            {dashData.licenses.length} License{dashData.licenses.length !== 1 ? 's' : ''} Active
          </span>
          <span className="text-[9px] font-mono text-white/20">
            {dashData.purchases.length} Purchase{dashData.purchases.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
}
