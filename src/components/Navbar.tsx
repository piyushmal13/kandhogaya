import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { TrendingUp, LayoutDashboard, Settings, LogOut, Menu, X, Zap, BarChart3, Target, BookOpen, Video, MessageSquare, Briefcase } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { cn } from "../utils/cn";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Signals", path: "/signals", icon: Zap },
    { name: "Algos", path: "/marketplace", icon: BarChart3 },
    { name: "Results", path: "/results", icon: Target },
    { name: "Academy", path: "/courses", icon: BookOpen },
    { name: "Webinars", path: "/webinars", icon: Video },
    { name: "Blog", path: "/blog", icon: MessageSquare },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center group">
            <div className="h-12 md:h-16 w-auto flex items-center justify-center overflow-hidden transition-all relative py-2">
              <img 
                src="/logo.png" 
                alt="IFXTrades Logo" 
                className="h-full w-auto object-contain z-10" 
              />
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-emerald-400",
                  location.pathname === link.path ? "text-emerald-400" : "text-gray-400"
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex items-center gap-4 border-l border-white/10 pl-8">
              <Link to="/hiring" className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full hover:bg-emerald-500 hover:text-black transition-all">
                <Briefcase className="w-3 h-3" />
                Hiring
              </Link>
              {user ? (
                <>
                  <Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                    <LayoutDashboard className="w-5 h-5" />
                  </Link>
                  {(user.email === 'admin@ifxtrades.com' || user.email === 'admin@tradinghub.com' || user.user_metadata?.role === 'admin') && (
                    <Link to="/admin" className="text-gray-400 hover:text-white transition-colors">
                      <Settings className="w-5 h-5" />
                    </Link>
                  )}
                  <button type="button" onClick={logout} className="text-gray-400 hover:text-red-400 transition-colors">
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <Link to="/login" className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-emerald-400 transition-all">
                  Sign In
                </Link>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button type="button" onClick={() => setIsOpen(!isOpen)} className="text-gray-400">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
