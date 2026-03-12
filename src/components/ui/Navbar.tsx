import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { TrendingUp, LayoutDashboard, Settings, LogOut, Menu, X, Zap, BarChart3, Target, BookOpen, Video, MessageSquare, Briefcase, ChevronRight, Database } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { BRANDING } from "../../constants/branding";
import { cn } from "../../utils/cn";
import { motion, AnimatePresence } from "motion/react";
import { SupabaseStatus } from "./SupabaseStatus";

export const Navbar = () => {
  const { user, userProfile, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when location changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const navLinks = [
    { name: "Signals", path: "/signals", icon: Zap },
    { name: "Algos", path: "/marketplace", icon: BarChart3 },
    { name: "Results", path: "/results", icon: Target },
    { name: "Academy", path: "/courses", icon: BookOpen },
    { name: "Webinars", path: "/webinars", icon: Video },
    { name: "Blog", path: "/blog", icon: MessageSquare },
  ];

  const isAdmin = userProfile?.role === 'admin' || 
                  user?.email === 'admin@ifxtrades.com' || 
                  user?.email === 'admin@tradinghub.com' || 
                  user?.email === 'piyushmal1301@gmail.com';

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center group">
              <div className="h-10 md:h-12 w-auto flex items-center justify-center overflow-hidden transition-all relative py-1">
                <img 
                  src={BRANDING.logoUrl} 
                  alt={`${BRANDING.name} Logo`} 
                  className="h-full w-auto object-contain z-10" 
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
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
                {user ? (
                  <>
                    <Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors" title="Dashboard">
                      <LayoutDashboard className="w-5 h-5" />
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="text-gray-400 hover:text-white transition-colors" title="Admin Panel">
                        <Settings className="w-5 h-5" />
                      </Link>
                    )}
                    <button type="button" onClick={logout} className="text-gray-400 hover:text-red-400 transition-colors" title="Sign Out">
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

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              {!user && (
                <Link to="/login" className="bg-white text-black px-4 py-1.5 rounded-full text-xs font-bold hover:bg-emerald-400 transition-all">
                  Sign In
                </Link>
              )}
              <button 
                type="button" 
                onClick={() => setIsOpen(!isOpen)} 
                className="text-gray-400 p-2 hover:text-white transition-colors relative z-[70]"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden"
            />
            
            {/* Menu Content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-[70] w-[85%] max-w-sm bg-[#050505] border-l border-white/10 md:hidden shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <Link to="/" onClick={() => setIsOpen(false)}>
                  <img src={BRANDING.logoUrl} alt={BRANDING.name} className="h-10 w-auto" />
                </Link>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 px-2">
                    Market Access
                  </div>
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-xl transition-all",
                        location.pathname === link.path 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                          : "text-gray-400 hover:bg-white/5"
                      )}
                    >
                      <link.icon className={cn("w-5 h-5", location.pathname === link.path ? "text-emerald-400" : "text-gray-500")} />
                      <span className="text-lg font-bold tracking-tight">{link.name}</span>
                    </Link>
                  ))}
                </div>

                <div className="h-px bg-white/5 my-8" />

                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 px-2">
                    Institutional
                  </div>
                  
                  {user ? (
                    <>
                      <Link 
                        to="/dashboard" 
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-4 p-4 rounded-xl text-gray-400 hover:bg-white/5 transition-all"
                      >
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="text-lg font-bold tracking-tight">Dashboard</span>
                      </Link>
                      {isAdmin && (
                        <Link 
                          to="/admin" 
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-4 p-4 rounded-xl text-gray-400 hover:bg-white/5 transition-all"
                        >
                          <Settings className="w-5 h-5" />
                          <span className="text-lg font-bold tracking-tight">Admin Panel</span>
                        </Link>
                      )}
                    </>
                  ) : (
                    <Link 
                      to="/login" 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-4 p-4 rounded-xl bg-white text-black font-bold text-center justify-center mt-4"
                    >
                      Sign In to IFXTrades
                    </Link>
                  )}
                </div>
              </div>

              {user && (
                <div className="p-6 border-t border-white/5">
                  <button 
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-4 w-full p-4 rounded-xl text-red-400 hover:bg-red-500/5 transition-all font-bold"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
