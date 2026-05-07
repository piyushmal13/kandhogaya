import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, GraduationCap, LayoutDashboard, User } from 'lucide-react';
import { cn } from '../../utils/cn';
import { motion } from 'motion/react';

export const BottomNavBar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Terminal', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Marketplace', path: '/marketplace', icon: BarChart3 },
    { name: 'Academy', path: '/academy', icon: GraduationCap },
    { name: 'Profile', path: '/dashboard?tab=profile', icon: User }, // Assuming profile is accessible here
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden px-4 pb-6 pt-2 bg-gradient-to-t from-[#010203] via-[#010203]/90 to-transparent pointer-events-none">
      <nav className="flex items-center justify-between bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-3xl px-6 py-4 shadow-[0_20px_40px_rgba(0,0,0,0.8)] pointer-events-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path.includes('?') && location.pathname === item.path.split('?')[0]);
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1.5 transition-all duration-300",
                isActive ? "text-emerald-400" : "text-white/40 hover:text-white"
              )}
            >
              <div className={cn(
                "p-2 rounded-xl transition-all duration-300",
                isActive ? "bg-emerald-500/10" : ""
              )}>
                <item.icon className={cn("w-6 h-6", isActive ? "stroke-[2.5]" : "stroke-2")} />
              </div>
              <span className="text-[9px] font-bold tracking-widest uppercase">{item.name}</span>
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute -bottom-4 w-12 h-1 bg-emerald-500 rounded-t-full"
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
