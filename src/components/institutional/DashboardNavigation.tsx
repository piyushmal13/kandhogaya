import React from 'react';
import { 
  LayoutDashboard, 
  Terminal, 
  Shield, 
  BookOpen, 
  BarChart3, 
  Settings, 
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';

export function DashboardNavigation() {
  const location = useLocation();
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Terminal, label: 'Marketplace', path: '/marketplace' },
    { icon: Shield, label: 'Signals', path: '/risk' },
    { icon: BookOpen, label: 'Academy', path: '/academy' },
    { icon: BarChart3, label: 'Performance', path: '/results' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="h-16 flex items-center px-6 border-b border-white/5 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
           <Zap className="w-5 h-5 text-black" />
        </div>
        <span className="ml-3 font-bold uppercase tracking-widest text-lg text-white">IFX TRADES</span>
      </div>

      <nav className="flex-1 py-8 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={cn(
                "group w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200",
                isActive ? "bg-white/10 text-white shadow-inner" : "text-gray-500 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive && "text-emerald-500")} />
              <span className="text-[11px] font-black uppercase tracking-widest leading-none">
                {item.label}
              </span>
              {isActive && (
                <div className="ml-auto w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_5px_var(--color8)]" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/5">
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
          <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] mb-1">Account Tier</p>
          <p className="text-[11px] font-bold text-emerald-500 uppercase tracking-widest">Premium Access</p>
        </div>
      </div>
    </div>
  );
}
