import { motion } from 'motion/react';
import { EliteButton } from '@/components/ui/Button';
import { ShieldAlert, FileText, Download, ShieldCheck, GraduationCap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ACTIONS = [
  { label: 'Access Masterclass', icon: GraduationCap, event: 'action_masterclass', variant: 'elite' as const, glow: true, path: '/academy' },
  { label: 'Risk Audit', icon: ShieldAlert, event: 'action_risk', variant: 'institutional-outline' as const, glow: false, path: '/consultation' },
  { label: 'Export Reports', icon: FileText, event: 'action_export', variant: 'institutional-outline' as const, glow: false, path: '#' },
  { label: 'Download Curriculum', icon: Download, event: 'action_curriculum', variant: 'institutional-outline' as const, glow: false, path: '/academy' },
] as const;

/**
 * QuickActions (v2.0)
 * 
 * The Command Bar of the Elite Terminal.
 * Features: Instant execution triggers, high-velocity interactions, and unified tracking.
 */
export function QuickActions() {
  const { user } = useAuth();
  const isAdmin = user?.email === 'piyushmalmantra01@gmail.com' || user?.email === 'piyushmal13@gmail.com';

  return (
    <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/10 backdrop-blur-xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
      
      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/40 mb-8 flex items-center gap-3">
        <div className="w-1 h-3 bg-primary-500 rounded-full" />
        Quick Command Center
      </h3>
      
      <div className="grid grid-cols-1 gap-4 relative z-10">
        {isAdmin && (
          <EliteButton 
            variant="premium-gold"
            glowEffect={true}
            size="md"
            className="w-full justify-start gap-4 px-6 border-white/5 hover:border-white/20 mb-2"
            trackingEvent="admin_portal_access"
            onClick={() => window.location.href = '/admin'}
          >
            <ShieldCheck className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity text-black" />
            <span className="flex-1 text-left text-black">Admin Command Portal</span>
          </EliteButton>
        )}
        {ACTIONS.map((action) => (
          <EliteButton 
            key={action.label}
            variant={action.variant}
            glowEffect={action.glow}
            size="md"
            className="w-full justify-start gap-4 px-6 border-white/5 hover:border-white/20"
            trackingEvent={action.event}
            onClick={() => window.location.href = action.path}
          >
            <action.icon className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
            <span className="flex-1 text-left">{action.label}</span>
          </EliteButton>
        ))}
      </div>

      {/* Surface Metadata */}
      <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between opacity-20">
         <span className="text-[8px] font-black uppercase tracking-widest text-[#58F2B6]">Executive Privileges</span>
         <div className="h-1 w-1 rounded-full bg-white/40" />
         <span className="text-[8px] font-mono">v2.0_ELITE</span>
      </div>
    </div>
  );
}
