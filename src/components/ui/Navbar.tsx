import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Phone,
  Settings,
  Target,
  Video,
  X,
  Zap,
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
    { name: "Signals", path: "/signals", icon: Zap },
    { name: "Algos", path: "/marketplace", icon: BarChart3 },
    { name: "Results", path: "/results", icon: Target },
    { name: "Academy", path: "/courses", icon: BookOpen },
    { name: "Webinars", path: "/webinars", icon: Video },
    { name: "Insights", path: "/blog", icon: MessageSquare },
  ];

  const isAdmin =
    userProfile?.role === "admin" ||
    user?.email === "admin@ifxtrades.com" ||
    user?.email === "admin@tradinghub.com" ||
    user?.email === "piyushmal1301@gmail.com";

  return (
    <>
      <nav className="fixed inset-x-0 top-6 z-50 px-6 sm:px-12">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between rounded-full border border-white/5 bg-black/40 px-8 shadow-[0_32px_80px_rgba(0,0,0,0.6)] backdrop-blur-3xl transition-all duration-700 hover:border-white/10">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="flex items-center justify-center overflow-hidden rounded-[1.25rem] bg-white/[0.04] p-0 transition-all duration-700 group-hover:bg-white/[0.08] group-hover:scale-105 border border-white/5 group-hover:border-[#83ffc8]/20 shadow-2xl h-12 w-12 sm:h-14 sm:w-14">
              <ResizedImage
                src={BRANDING.logoUrl}
                alt={`${BRANDING.name} Logo`}
                className="h-full w-full object-cover"
              />
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-12">
            <div className="flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "relative text-xs font-sans font-medium uppercase tracking-[0.25em] transition-all duration-500 hover:text-[#83ffc8]",
                    location.pathname === link.path ? "text-[#83ffc8]" : "text-gray-400",
                  )}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <motion.div 
                      layoutId="nav-active"
                      className="absolute -bottom-2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#83ffc8] to-transparent opacity-60"
                    />
                  )}
                </Link>
              ))}
            </div>

            <div className="h-6 w-px bg-white/5" />

            <div className="flex items-center gap-6">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-3 rounded-full border border-white/5 bg-white/[0.02] px-6 py-2.5 text-xs font-sans font-medium text-gray-400 tracking-[0.2em] uppercase hover:border-[#83ffc8]/20 hover:text-white transition-all duration-700"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500/50 group-hover:bg-[#83ffc8] transition-colors" />
                Support
              </Link>

              {user ? (
                <div className="flex items-center gap-5">
                  <Link to="/dashboard" className="text-gray-400 hover:text-white transition-all duration-500 hover:scale-110">
                    <LayoutDashboard className="h-5 w-5" />
                  </Link>
                  {isAdmin ? (
                    <Link to="/admin" className="text-gray-400 hover:text-white transition-all duration-500 hover:scale-110">
                      <Settings className="h-5 w-5" />
                    </Link>
                  ) : null}
                  <button type="button" onClick={logout} className="text-gray-400 hover:text-rose-400 transition-all duration-500 hover:scale-110">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="group relative inline-flex items-center gap-3 rounded-full bg-white px-8 py-3 text-xs font-bold text-black uppercase tracking-[0.2em] shadow-[0_12px_40px_rgba(255,255,255,0.1)] hover:shadow-[0_12px_40px_rgba(131,255,200,0.2)] transition-all duration-700 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[#83ffc8] translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[0.16,1,0.2,1]" />
                  <span className="relative z-10 flex items-center gap-3">
                    Private Portal
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform duration-500" />
                  </span>
                </Link>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center gap-3">
            {user ? null : (
              <Link
                to="/login"
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white"
              >
                Sign In
              </Link>
            )}
            <button
              type="button"
              onClick={() => setIsOpen((open) => !open)}
              className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 transition-colors hover:text-white"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
              className="fixed inset-y-0 right-0 z-[70] w-full max-w-[320px] bg-[#020617]/95 border-l border-white/10 shadow-[-20px_0_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl md:hidden overflow-y-auto"
            >
              <div className="p-6 flex flex-col min-h-full">
                <div className="flex items-center justify-between mb-8">
                  <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center group">
                    <div className="flex items-center justify-center overflow-hidden rounded-2xl bg-white/[0.02] p-0 group-hover:bg-white/[0.05] transition-all duration-700 h-12 w-12">
                      <ResizedImage src={BRANDING.logoUrl} alt="Logo" className="h-full w-full object-cover" />
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
                    <div className="px-2 mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-500/60">Core Access</div>
                    <div className="grid grid-cols-1 gap-2">
                      {navLinks.map((link) => (
                        <Link
                          key={link.path}
                          to={link.path}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center gap-4 rounded-xl border px-4 py-3.5 transition-all duration-300",
                            location.pathname === link.path
                              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                              : "border-white/[0.03] bg-white/[0.02] text-slate-400 hover:border-white/[0.1] hover:bg-white/[0.05]",
                          )}
                        >
                          <link.icon className="h-4 w-4" />
                          <span className="text-sm font-bold tracking-tight">{link.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="px-2 mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-600">Account Control</div>
                    <div className="grid grid-cols-1 gap-2">
                      <Link
                        to="/contact"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-4 rounded-xl border border-white/[0.03] bg-white/[0.02] px-4 py-3.5 text-slate-400 hover:border-white/[0.1] hover:bg-white/[0.05]"
                      >
                        <Phone className="h-4 w-4" />
                        <span className="text-sm font-bold tracking-tight">Contact Desk</span>
                      </Link>

                      {user ? (
                        <>
                          <Link
                            to="/dashboard"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-4 rounded-xl border border-white/[0.03] bg-white/[0.02] px-4 py-3.5 text-slate-400 hover:border-white/[0.1] hover:bg-white/[0.05]"
                          >
                            <LayoutDashboard className="h-4 w-4" />
                            <span className="text-sm font-bold tracking-tight">Dashboard</span>
                          </Link>
                          {isAdmin ? (
                            <Link
                              to="/admin"
                              onClick={() => setIsOpen(false)}
                              className="flex items-center gap-4 rounded-xl border border-white/[0.03] bg-white/[0.02] px-4 py-3.5 text-slate-400 hover:border-white/[0.1] hover:bg-white/[0.05]"
                            >
                              <Settings className="h-4 w-4" />
                              <span className="text-sm font-bold tracking-tight">Admin Master</span>
                            </Link>
                          ) : null}
                        </>
                      ) : (
                        <Link
                          to="/login"
                          onClick={() => setIsOpen(false)}
                          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-4 text-sm font-bold text-slate-950 shadow-[0_10px_30px_rgba(16,185,129,0.2)]"
                        >
                          Access Platform
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-8">
                  {user ? (
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="flex w-full items-center justify-center gap-3 rounded-xl border border-red-500/10 bg-red-500/5 px-5 py-4 text-sm font-bold text-red-400 transition-colors hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Terminate Session</span>
                    </button>
                  ) : null}

                  <div className="mt-6 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                    <div className="text-[9px] font-bold text-emerald-500 uppercase tracking-[0.2em] mb-1">Status: Operational</div>
                    <div className="text-[10px] text-slate-500 leading-relaxed font-medium">
                      Market protocols and institutional access layers are currently online for your region.
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
