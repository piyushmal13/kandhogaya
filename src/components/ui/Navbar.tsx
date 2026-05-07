import React, { useEffect, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { BRANDING } from "../../constants/branding";
import { useAuth } from "../../contexts/AuthContext";
import { cn } from "../../utils/cn";

export const Navbar = () => {
  const { user, userProfile, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastY, setLastY] = useState(0);
  const [hidden, setHidden] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const handleScroll = useCallback(() => {
    const y = window.scrollY;
    setScrolled(y > 20);
    if (y > 100) {
      setHidden(y > lastY + 8);
    } else {
      setHidden(false);
    }
    setLastY(y);
  }, [lastY]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const navLinks = [
    { name: "Terminal", path: "/", icon: Home },
    { name: "Ecosystem", path: "/quantx", icon: Zap },
    { name: "Webinars", path: "/webinars", icon: BookOpen },
    { name: "Marketplace", path: "/marketplace", icon: BarChart3 },
    { name: "About", path: "/about", icon: Zap },
    { name: "Blog", path: "/blog", icon: MessageSquare },
  ];

  const isAdmin = userProfile?.role === "admin";

  return (
    <>
      <motion.nav
        className="fixed inset-x-0 top-0 z-50 flex justify-center"
        animate={{ y: hidden ? -96 : 0 }}
        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
      >
        <div
          className={cn(
            "mt-4 mx-4 sm:mx-12 flex-1 max-w-7xl flex items-center justify-between rounded-[1.5rem] px-4 sm:px-7 transition-all duration-500 will-change-transform",
            scrolled
              ? "h-14 sm:h-16 bg-[#040608]/80 border border-white/5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-[48px] saturate-[180%]"
              : "h-16 sm:h-20 bg-transparent border border-transparent"
          )}
        >
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-3 group shrink-0"
            aria-label="IFX Trades — Institutional Master Terminal"
          >
            <div
              className={cn(
                "flex items-center justify-center transition-all duration-500 overflow-hidden rounded-[14px] border bg-[#010203] group-hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] group-hover:border-emerald-500/30",
                scrolled ? "h-9 w-9 sm:h-11 sm:w-11 border-white/10" : "h-11 w-11 sm:h-14 sm:w-14 border-white/5"
              )}
            >
              <img
                src={BRANDING.logoUrl}
                alt="IFX Trades logo"
                className="h-full w-full object-contain p-1.5"
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav 
            className="hidden md:flex items-center gap-1.5"
            aria-label="Main Navigation"
            itemScope
            itemType="https://schema.org/SiteNavigationElement"
          >
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.path === '/' && location.pathname === '');
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  itemProp="url"
                  className={cn(
                    "relative px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-300 rounded-xl group/link",
                    isActive
                      ? "text-emerald-400 bg-emerald-500/[0.05] border border-emerald-500/10"
                      : "text-white/40 hover:text-white hover:bg-white/[0.04] border border-transparent"
                  )}
                >
                  <span itemProp="name">{link.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-6 bg-emerald-400 rounded-t-full shadow-[0_-2px_10px_rgba(16,185,129,0.5)]"
                      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2 bg-white/[0.02] p-1.5 rounded-[1.25rem] border border-white/[0.05]">
                <Link
                  to="/dashboard"
                  className="text-white/50 hover:text-white transition-all p-2.5 hover:bg-white/[0.04] rounded-xl"
                  aria-label="Dashboard"
                >
                  <LayoutDashboard className="h-4 w-4" />
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="text-emerald-400 p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/20 transition-all shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                    aria-label="Admin"
                  >
                    <Settings className="h-4 w-4" />
                  </Link>
                )}
                <button
                  type="button"
                  onClick={logout}
                  className="text-white/30 hover:text-red-400 p-2.5 rounded-xl hover:bg-red-500/10 transition-all"
                  aria-label="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                data-cursor="LOGIN"
                className="group relative inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-[10px] font-black text-black uppercase tracking-[0.25em] overflow-hidden shadow-[0_10px_30px_rgba(255,255,255,0.15)] hover:shadow-[0_10px_40px_rgba(16,185,129,0.3)] transition-all duration-500"
              >
                <div className="absolute inset-0 bg-emerald-400 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                <span className="relative z-10 flex items-center gap-2">
                  Portal
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            )}
          </div>

          {/* Mobile controls */}
          <div className="md:hidden flex items-center gap-2">
            {!user && (
              <Link
                to="/login"
                className="rounded-xl bg-white/10 border border-white/10 px-5 py-2.5 text-[9px] font-black text-white uppercase tracking-widest hover:bg-white/20 transition-all active:scale-95"
              >
                Sign In
              </Link>
            )}
            {user && (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link to="/admin" className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-[14px] text-emerald-400 active:scale-90 transition-transform">
                    <Settings className="h-4 w-4" />
                  </Link>
                )}
                <Link to="/dashboard" className="p-2.5 bg-white/5 border border-white/10 rounded-[14px] text-white active:scale-90 transition-transform">
                  <LayoutDashboard className="h-4 w-4" />
                </Link>
              </div>
            )}
            <button
              type="button"
              onClick={() => setIsOpen((o) => !o)}
              className="rounded-[14px] border border-white/10 bg-white/[0.04] p-2.5 text-white/50 hover:text-white hover:bg-white/[0.08] transition-all active:scale-90"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[60] flex flex-col bg-[#010203]/98 backdrop-blur-3xl md:hidden overflow-y-auto pt-28 px-6 pb-12"
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/50 hover:text-white active:scale-90 transition-all"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="flex flex-col gap-10 flex-1 mt-6">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400/50 mb-5">Navigation</div>
                <div className="flex flex-col gap-3">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.4 }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-5 rounded-[1.5rem] border px-6 py-5 transition-all duration-300",
                          location.pathname === link.path
                            ? "border-emerald-500/30 bg-emerald-500/[0.08] text-emerald-400 shadow-[0_10px_30px_rgba(16,185,129,0.1)]"
                            : "border-white/[0.05] bg-white/[0.02] text-white/60 hover:border-white/15 hover:text-white hover:bg-white/[0.05]"
                        )}
                      >
                        <link.icon className="h-6 w-6 shrink-0" aria-hidden />
                        <span className="text-xl font-bold tracking-tight">{link.name}</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-5">Account</div>
                {user ? (
                  <div className="flex flex-col gap-3">
                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-5 rounded-[1.5rem] border border-white/[0.05] bg-white/[0.02] px-6 py-5 text-white/60 hover:text-white"
                    >
                      <LayoutDashboard className="h-6 w-6" />
                      <span className="text-xl font-bold">Dashboard</span>
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-5 rounded-[1.5rem] border border-emerald-500/20 bg-emerald-500/10 px-6 py-5 text-emerald-400"
                      >
                        <Settings className="h-6 w-6" />
                        <span className="text-xl font-bold">Admin Terminal</span>
                      </Link>
                    )}
                    <button
                      onClick={() => { logout(); setIsOpen(false); }}
                      className="flex items-center gap-5 rounded-[1.5rem] border border-red-500/10 bg-red-500/5 px-6 py-5 text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="h-6 w-6" />
                      <span className="text-xl font-bold">Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-3 rounded-[1.5rem] bg-white px-6 py-6 text-sm font-black uppercase tracking-[0.2em] text-black shadow-[0_15px_40px_rgba(255,255,255,0.2)]"
                  >
                    Access Portal <ArrowRight className="h-5 w-5" />
                  </Link>
                )}
              </div>
            </div>

            {/* Bottom badge */}
            <div className="mt-10 p-6 rounded-[1.5rem] bg-emerald-500/[0.05] border border-emerald-500/[0.1] text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <div className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em]">IFX Desk Acknowledged</div>
              </div>
              <div className="text-[11px] text-white/30 font-mono tracking-widest">SESSION SECURED</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
