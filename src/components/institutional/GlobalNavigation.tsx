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
  Zap,
  Shield,
  Trophy
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

export function GlobalNavigation() {
  const location = useLocation();
  const { logout, userProfile } = useAuth();

  const navItems = [
    { path: '/dashboard', label: 'Omni-View', icon: LayoutDashboard },
    { path: '/marketplace', label: 'Marketplace', icon: Store },
    { path: '/academy', label: 'Academy', icon: GraduationCap },
    { path: '/webinars', label: 'Webinars', icon: Video },
    { path: '/results', label: 'Performance', icon: LineChart },
  ];

  // Conditional Intelligence Layers
  if (userProfile?.role === 'admin') {
    navItems.push({ path: '/admin', label: 'Command', icon: Shield });
  }
  if (userProfile?.role === 'agent' || userProfile?.role === 'admin') {
    navItems.push({ path: '/agent', label: 'Growth', icon: Trophy });
  }

  return (
    <nav className="h-full flex flex-col bg-black/60 backdrop-blur-3xl border-r border-white/5 shadow-[20px_0_50px_rgba(0,0,0,0.5)]">
      {/* Branding Node */}
      <div className="h-24 flex items-center px-10 border-b border-white/5 shrink-0">
        <div className="w-11 h-11 rounded-2xl bg-white/[0.03] flex items-center justify-center shrink-0 shadow-[0_4px_30px_rgba(0,0,0,0.4)] border border-white/5 group-hover:border-cyan-500/30 transition-all">
           <Zap className="w-6 h-6 text-cyan-400 fill-cyan-400/20" />
        </div>
        <div className="ml-5 flex flex-col">
           <span className="font-black uppercase tracking-tighter italic text-xl text-white leading-none">IFX <span className="text-cyan-500">Trades</span></span>
           <span className="text-[8px] font-black uppercase tracking-[0.6em] text-white/20 leading-tight mt-1">Sovereign Node</span>
        </div>
      </div>

      {/* Primary Execution Rail */}
      <div className="flex-1 py-8 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
                          location.pathname.startsWith(`${item.path}/`);
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "relative group flex items-center gap-4 px-4 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300",
                isActive 
                  ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)] border border-white/5' 
                  : 'text-white/30 hover:bg-white/5 hover:text-white'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute left-[-10px] w-1 h-10 bg-cyan-500 rounded-r-full shadow-[0_0_25px_rgba(0,229,255,0.6)]"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
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
          <span>Config</span>
        </NavLink>
        
        <button
          onClick={logout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500/60 hover:bg-red-500/10 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20"
        >
          <LogOut className="w-5 h-5" />
          <span>Terminate</span>
        </button>

        <div className="mt-6 p-5 rounded-3xl bg-white/[0.01] border border-white/5">
           <p className="text-[7px] font-black uppercase tracking-[0.5em] text-white/10 mb-1 leading-none text-center">Protocol Integrity</p>
           <div className="flex items-center justify-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
              <span className="text-[9px] font-mono text-cyan-500 uppercase tracking-tighter">NODE_SYNC_OK</span>
           </div>
        </div>
      </div>
    </nav>
  );
}
