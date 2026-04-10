import React, { useEffect, useState } from "react";
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
  Video,
  X,
  Plane,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { BRANDING } from "../../constants/branding";
import { useAuth } from "../../contexts/AuthContext";
import { cn } from "../../utils/cn";
import { ResizedImage } from "./ResizedImage";

export const Navbar = () => {
  const { user, userProfile, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const navLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Courses", path: "/academy", icon: BookOpen },
    { name: "Algos", path: "/marketplace", icon: BarChart3 },
    // { name: "Signals", path: "/signals", icon: Zap }, // Temporarily disconnected
    { name: "Travel", path: "/travel", icon: Plane },
    { name: "Webinars", path: "/webinars", icon: Video },
    { name: "Blog", path: "/blog", icon: MessageSquare },
  ];

  const isAdmin = userProfile?.role === "admin";

  return (
    <>
      <nav className="fixed inset-x-0 top-3 sm:top-6 z-50 px-3 sm:px-12">
        <div className="mx-auto flex h-14 sm:h-20 max-w-7xl items-center justify-between rounded-full border border-white/5 bg-black/40 px-5 sm:px-8 shadow-[0_32px_80px_rgba(0,0,0,0.6)] backdrop-blur-3xl transition-all duration-700 hover:border-white/10">
          <Link to="/" className="flex items-center gap-3 group" aria-label="IFX Trades — Institutional Forex Education Platform">
            <div className="flex items-center justify-center transition-all duration-700 group-hover:scale-110 h-10 w-10 sm:h-14 sm:w-14 rounded-xl overflow-hidden bg-black/50 border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)] group-hover:shadow-[0_0_30px_rgba(88,242,182,0.15)] group-hover:border-emerald-500/20">
              <img src={BRANDING.logoUrl} alt="IFX Trades institutional forex education logo" className="h-full w-full object-contain p-1.5" />
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "relative text-[10px] font-sans font-bold uppercase tracking-[0.3em] transition-all duration-500 hover:text-[var(--brand)] px-2 py-1 group/link",
                    location.pathname === link.path ? "text-[var(--brand)]" : "text-gray-400",
                  )}
                >
                  {link.name}
                  <div className={cn(
                    "absolute -bottom-1 left-0 h-[2px] bg-[var(--brand)] transition-all duration-500",
                    location.pathname === link.path ? "w-full opacity-100" : "w-0 opacity-0 group-hover/link:w-full group-hover/link:opacity-60"
                  )} />
                </Link>
              ))}
            </div>

            <div className="h-6 w-px bg-white/5" />

            <div className="flex items-center gap-5">
              {user ? (
                <div className="flex items-center gap-5">
                  <Link to="/dashboard" className="text-gray-400 hover:text-white transition-all duration-500 hover:scale-110 p-2">
                    <LayoutDashboard className="h-5 w-5" />
                  </Link>
                  {isAdmin ? (
                    <Link to="/admin" className="text-[var(--brand)] hover:scale-110 transition-all p-2 bg-[var(--brand)]/10 border border-[var(--brand)]/20 rounded-xl">
                      <Settings className="h-5 w-5" />
                    </Link>
                  ) : null}
                  <button type="button" onClick={logout} className="text-gray-400 hover:text-red-400 transition-all duration-500 hover:scale-110 p-2">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="group relative inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[10px] font-bold text-black uppercase tracking-[0.2em] shadow-[0_12px_40px_rgba(255,255,255,0.1)] hover:shadow-[0_12px_40px_rgba(131,255,200,0.2)] transition-all duration-700 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[var(--brand)] translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[0.16,1,0.2,1]" />
                  <span className="relative z-10 flex items-center gap-2">
                    Private Portal
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform duration-500" />
                  </span>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Logic - Optimized Density */}
          <div className="md:hidden flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                 {isAdmin && (
                    <Link to="/admin" className="p-2.5 bg-[var(--brand)]/10 border border-[var(--brand)]/20 rounded-xl text-[var(--brand)]">
                       <Settings className="h-4 w-4" />
                    </Link>
                 )}
                 <Link to="/dashboard" className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white">
                    <LayoutDashboard className="h-4 w-4" />
                 </Link>
              </div>
            ) : (
              <Link
                to="/login"
                className="rounded-full bg-[var(--brand)]/10 border border-[var(--brand)]/30 px-5 py-2.5 text-[10px] font-black text-white uppercase tracking-[0.2em] hover:bg-[var(--brand)]/20 transition-all duration-500"
              >
                Sign In
              </Link>
            )}
            <button
              type="button"
              onClick={() => setIsOpen((open) => !open)}
              className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-slate-300 transition-colors hover:text-white"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[60] bg-slate-950/75 backdrop-blur-sm md:hidden"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 z-[70] w-full max-w-[320px] bg-[var(--color30)]/95 border-l border-white/10 shadow-[-20px_0_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl md:hidden overflow-y-auto"
            >
              <div className="p-6 flex flex-col min-h-full">
                <div className="flex items-center justify-between mb-8">
                  <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center group">
                    <div className="flex items-center justify-center transition-all duration-700 h-10 w-10 rounded-xl overflow-hidden">
                      <ResizedImage src={BRANDING.logoUrl} alt="Logo" className="h-full w-full object-contain" />
                    </div>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="px-2 mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-500/60 font-mono italic">Core Discovery</div>
                    <div className="grid grid-cols-1 gap-2">
                      {navLinks.map((link) => (
                        <Link
                          key={link.path}
                          to={link.path}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center gap-4 rounded-xl border px-4 py-4 transition-all duration-300",
                            location.pathname === link.path
                              ? "border-[var(--brand)]/20 bg-[var(--brand)]/10 text-[var(--brand)] shadow-[0_0_20px_rgba(16,185,129,0.05)]"
                              : "border-white/[0.03] bg-white/[0.02] text-slate-400 hover:border-white/[0.1] hover:bg-white/[0.05]",
                          )}
                        >
                          <link.icon className="h-4 w-4" />
                          <span className="text-sm font-black uppercase tracking-widest">{link.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="px-2 mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-600 font-mono italic">Client Control</div>
                    <div className="grid grid-cols-1 gap-2">
                      {user ? (
                        <>
                          <Link
                            to="/dashboard"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-4 rounded-xl border border-white/[0.03] bg-white/[0.02] px-4 py-4 text-slate-400 hover:border-white/[0.1] hover:bg-white/[0.05]"
                          >
                            <LayoutDashboard className="h-4 w-4" />
                            <span className="text-sm font-black uppercase tracking-widest">Master Console</span>
                          </Link>
                          {isAdmin ? (
                            <Link
                              to="/admin"
                              onClick={() => setIsOpen(false)}
                              className="flex items-center gap-4 rounded-xl border border-[var(--brand)]/20 bg-[var(--brand)]/10 px-4 py-4 text-[var(--brand)] hover:bg-[var(--brand)]/20"
                            >
                              <Settings className="h-4 w-4" />
                              <span className="text-sm font-black uppercase tracking-widest">Admin Terminal</span>
                            </Link>
                          ) : null}
                        </>
                      ) : (
                        <Link
                          to="/login"
                          onClick={() => setIsOpen(false)}
                          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-5 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-950 shadow-[0_10px_30px_rgba(16,185,129,0.2)] hover:bg-white transition-all"
                        >
                          Access Portal
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-10">
                  {user ? (
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="flex w-full items-center justify-center gap-3 rounded-xl border border-red-500/10 bg-red-500/5 px-5 py-4 text-[10px] font-black text-red-400 uppercase tracking-widest transition-colors hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Terminate Session</span>
                    </button>
                  ) : null}

                  <div className="mt-8 p-6 rounded-2xl bg-[var(--brand)]/5 border border-[var(--brand)]/10 text-center">
                    <div className="text-[9px] font-black text-[var(--brand)] uppercase tracking-[0.3em] mb-2">Operational Integrity</div>
                    <div className="text-[10px] text-slate-500 leading-relaxed font-bold uppercase tracking-widest">
                      Session secured via <br/> IFX Protocol v2.4
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
};
