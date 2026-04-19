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
    { name: "Home", path: "/", icon: Home },
    { name: "Academy", path: "/academy", icon: BookOpen },
    { name: "Marketplace", path: "/marketplace", icon: BarChart3 },
    { name: "Signals", path: "/risk", icon: Zap },
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
            "mt-4 mx-4 sm:mx-12 flex-1 max-w-7xl flex items-center justify-between rounded-[1.25rem] px-4 sm:px-7 transition-all duration-500 will-change-transform",
            scrolled
              ? "h-14 sm:h-16 bg-black/80 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-3xl"
              : "h-16 sm:h-20 bg-transparent border border-transparent"
          )}
        >
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-3 group shrink-0"
            aria-label="IFX Trades — Institutional Forex Education Platform"
          >
            <div
              className={cn(
                "flex items-center justify-center transition-all duration-500 overflow-hidden rounded-xl border bg-black/50 group-hover:shadow-[0_0_24px_rgba(16,185,129,0.2)] group-hover:border-emerald-500/20",
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
            className="hidden md:flex items-center gap-1"
            aria-label="Main Navigation"
            itemScope
            itemType="https://schema.org/SiteNavigationElement"
          >
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  itemProp="url"
                  className={cn(
                    "relative px-3 py-2 text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-300 rounded-lg group/link",
                    isActive
                      ? "text-emerald-400"
                      : "text-white/40 hover:text-white hover:bg-white/[0.04]"
                  )}
                >
                  <span itemProp="name">{link.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-4 bg-emerald-400 rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/dashboard"
                  className="text-white/40 hover:text-white transition-all p-2 hover:bg-white/[0.04] rounded-lg"
                  aria-label="Dashboard"
                >
                  <LayoutDashboard className="h-4 w-4" />
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="text-emerald-400 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-all"
                    aria-label="Admin"
                  >
                    <Settings className="h-4 w-4" />
                  </Link>
                )}
                <button
                  type="button"
                  onClick={logout}
                  className="text-white/30 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-all"
                  aria-label="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                data-cursor="LOGIN"
                className="group relative inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[10px] font-black text-black uppercase tracking-[0.25em] overflow-hidden shadow-[0_8px_24px_rgba(255,255,255,0.12)] hover:shadow-[0_8px_32px_rgba(16,185,129,0.3)] transition-all duration-500"
              >
                <div className="absolute inset-0 bg-emerald-400 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                <span className="relative z-10 flex items-center gap-2">
                  Portal
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            )}
          </div>

          {/* Mobile controls */}
          <div className="md:hidden flex items-center gap-2">
            {!user && (
              <Link
                to="/login"
                className="rounded-full bg-white/10 border border-white/10 px-4 py-2 text-[9px] font-black text-white uppercase tracking-widest hover:bg-white/20 transition-all active:scale-95"
              >
                Sign In
              </Link>
            )}
            {user && (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link to="/admin" className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 active:scale-90 transition-transform">
                    <Settings className="h-4 w-4" />
                  </Link>
                )}
                <Link to="/dashboard" className="p-2 bg-white/5 border border-white/10 rounded-xl text-white active:scale-90 transition-transform">
                  <LayoutDashboard className="h-4 w-4" />
                </Link>
              </div>
            )}
            <button
              type="button"
              onClick={() => setIsOpen((o) => !o)}
              className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-white/50 hover:text-white hover:bg-white/[0.08] transition-all active:scale-90"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
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
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 z-[60] flex flex-col bg-[#020202]/98 backdrop-blur-3xl md:hidden overflow-y-auto pt-24 px-6 pb-10"
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 hover:text-white"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col gap-8 flex-1 mt-4">
              <div>
                <div className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-400/50 mb-4">Navigation</div>
                <div className="flex flex-col gap-2">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-4 rounded-2xl border px-5 py-4 transition-all duration-200",
                          location.pathname === link.path
                            ? "border-emerald-500/25 bg-emerald-500/[0.07] text-emerald-400"
                            : "border-white/[0.04] bg-white/[0.02] text-white/60 hover:border-white/10 hover:text-white"
                        )}
                      >
                        <link.icon className="h-5 w-5 shrink-0" aria-hidden />
                        <span className="text-lg font-bold tracking-tight">{link.name}</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 mb-4">Account</div>
                {user ? (
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-4 rounded-2xl border border-white/[0.04] bg-white/[0.02] px-5 py-4 text-white/60 hover:text-white"
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      <span className="text-lg font-bold">Console</span>
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 text-emerald-400"
                      >
                        <Settings className="h-5 w-5" />
                        <span className="text-lg font-bold">Admin Terminal</span>
                      </Link>
                    )}
                    <button
                      onClick={() => { logout(); setIsOpen(false); }}
                      className="flex items-center gap-4 rounded-2xl border border-red-500/10 bg-red-500/5 px-5 py-4 text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                      <span className="text-lg font-bold">Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-5 text-sm font-black uppercase tracking-[0.2em] text-black shadow-[0_8px_30px_rgba(255,255,255,0.15)]"
                  >
                    Access Portal <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>

            {/* Bottom badge */}
            <div className="mt-8 p-5 rounded-2xl bg-emerald-500/[0.04] border border-emerald-500/[0.08] text-center">
              <div className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-1">IFX Sovereign Protocol</div>
              <div className="text-[10px] text-white/30 font-medium">Session secured · v2.4</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
