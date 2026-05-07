import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Store, 
  GraduationCap, 
  Video, 
  LineChart, 
  Settings,
  LogOut,
  Shield,
  Trophy
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useFlags, type FlagKey } from '@/hooks/useFlags';
import { InfrastructurePulse } from '../ui/InfrastructurePulse';

interface NavItem {
  path: string;
  label: string;
  icon: any;
  flag: FlagKey;
}

export function GlobalNavigation() {
  const location = useLocation();
  const { logout, userProfile } = useAuth();
  const { flags } = useFlags();

  const navItems: NavItem[] = [
    { path: '/dashboard', label: 'Omni-View', icon: LayoutDashboard, flag: 'admin_panel' },
    { path: '/marketplace', label: 'Marketplace', icon: Store, flag: 'marketplace' },
    { path: '/academy', label: 'Academy', icon: GraduationCap, flag: 'academy' },
    { path: '/webinars', label: 'Webinars', icon: Video, flag: 'webinars' },
    { path: '/results', label: 'Performance', icon: LineChart, flag: 'algo' },
  ];

  // Filter items based on flags
  const visibleItems = navItems.filter(item => flags[item.flag] !== false);

  // Conditional Intelligence Layers
  if (userProfile?.role === 'admin') {
    visibleItems.push({ path: '/admin', label: 'Command', icon: Shield, flag: 'admin_panel' });
  }
  if (userProfile?.role === 'agent' || userProfile?.role === 'admin') {
    visibleItems.push({ path: '/agent', label: 'Growth', icon: Trophy, flag: 'affiliate_system' });
  }

  return (
    <nav className="h-full flex flex-col bg-black/60 backdrop-blur-3xl border-r border-white/5 shadow-[20px_0_50px_rgba(0,0,0,0.5)]">
      {/* Branding Node */}
      <div className="h-28 flex items-center px-8 border-b border-white/5 shrink-0">
        <div className="relative group flex items-center gap-4">
           <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10 shadow-2xl group-hover:border-cyan-500/50 transition-all duration-500">
              <img 
                src="/logo.png" 
                alt="IFX Trades Logo" 
                className="w-full h-full object-contain"
              />
           </div>
           <div className="flex flex-col">
              <span className="font-black uppercase tracking-tighter italic text-xl text-white leading-none">IFX <span className="text-cyan-500">Trades</span></span>
              <span className="text-[7px] font-black uppercase tracking-[0.4em] text-white/20 leading-tight mt-1">Research Desk</span>
           </div>
        </div>
      </div>

      {/* Primary Execution Rail */}
      <div className="flex-1 py-8 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {visibleItems.map((item) => {
          const isActive = location.pathname === item.path || 
                          location.pathname.startsWith(`${item.path}/`);
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "relative group flex items-center gap-4 px-4 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-500 preserve-3d",
                isActive 
                  ? 'bg-white/10 text-white shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-white/5' 
                  : 'text-white/30 hover:bg-white/[0.03] hover:text-white hover:translate-x-1'
              )}
            >
              {/* Subtle Glow Overlay */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 bg-gradient-to-r from-cyan-500/[0.05] to-transparent transition-opacity duration-500 pointer-events-none" />
              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute left-[-10px] w-1 h-10 bg-cyan-500 rounded-r-full shadow-[0_0_25px_rgba(0,229,255,0.6)]"
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                />
              )}
              <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive ? 'text-cyan-400' : 'text-current')} />
              <span>{item.label}</span>
              
              {/* Pulse Indicator for High-Activity Surfaces */}
              {item.path === '/webinars' && (
                <span className="ml-auto relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Secondary Intelligence Actions */}
      <div className="p-6 border-t border-white/5 space-y-2">
        <NavLink
          to="/settings"
          className={({ isActive }) => cn(
            "flex items-center gap-4 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
            isActive ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white'
          )}
        >
          <Settings className="w-5 h-5" />
          <span>Protocol Settings</span>
        </NavLink>
        
        <button
          onClick={logout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500/60 hover:bg-red-500/10 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20"
        >
          <LogOut className="w-5 h-5" />
          <span>Terminate</span>
        </button>

        <InfrastructurePulse />
      </div>
    </nav>
  );
}
