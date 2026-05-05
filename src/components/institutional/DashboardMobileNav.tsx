import React from 'react';
import { 
  LayoutDashboard, 
  Terminal, 
  Shield, 
  BookOpen, 
  BarChart3, 
  Settings 
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function DashboardMobileNav() {
  const location = useLocation();
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Terminal, label: 'Market', path: '/marketplace' },
    { icon: Shield, label: 'Signals', path: '/risk' },
    { icon: BookOpen, label: 'Academy', path: '/academy' },
    { icon: BarChart3, label: 'Results', path: '/results' },
    { icon: Settings, label: 'Admin', path: '/admin' },
  ];

  return (
    <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md">
      <nav className="flex items-center justify-between p-2 rounded-3xl bg-[#080B12]/80 border border-white/10 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={cn(
                "relative flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300",
                isActive 
                  ? "bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]" 
                  : "text-gray-500 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              {isActive && (
                <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-emerald-500 text-black text-[9px] font-black uppercase tracking-widest whitespace-nowrap animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-300">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
