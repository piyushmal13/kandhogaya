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
      <nav className="fixed inset-x-0 top-3 z-50 px-4 sm:px-6">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between rounded-full border border-white/10 bg-slate-950/72 px-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:px-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 overflow-hidden">
              <img
                src={BRANDING.logoUrl}
                alt={`${BRANDING.name} Logo`}
                className="h-7 w-7 object-contain"
              />
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-semibold tracking-[0.22em] text-white">{BRANDING.name}</div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Institutional Intelligence</div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-5">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-white",
                    location.pathname === link.path ? "text-emerald-200" : "text-slate-400",
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="h-8 w-px bg-white/[0.08]" />

            <div className="flex items-center gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 hover:border-emerald-200/30 hover:text-white"
              >
                <Phone className="h-4 w-4 text-emerald-200" />
                Contact
              </Link>

              {user ? (
                <>
                  <Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors">
                    <LayoutDashboard className="h-5 w-5" />
                  </Link>
                  {isAdmin ? (
                    <Link to="/admin" className="text-slate-400 hover:text-white transition-colors">
                      <Settings className="h-5 w-5" />
                    </Link>
                  ) : null}
                  <button type="button" onClick={logout} className="text-slate-400 hover:text-red-300 transition-colors">
                    <LogOut className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-300 px-5 py-2 text-sm font-semibold text-slate-950 shadow-[0_14px_36px_rgba(88,242,182,0.16)] hover:bg-emerald-200"
                >
                  Access Platform
                  <ArrowRight className="h-4 w-4" />
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
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-x-4 top-24 z-[70] rounded-[2rem] border border-white/10 bg-[#061120]/96 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl md:hidden"
            >
              <div className="mb-5 flex items-center justify-between">
                <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                    <img src={BRANDING.logoUrl} alt={BRANDING.name} className="h-7 w-7 object-contain rounded-sm" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold tracking-[0.22em] text-white">{BRANDING.shortName}</div>
                    <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Trading Surface</div>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-2">
                <div className="px-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500">Market Access</div>
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-4 rounded-2xl border px-4 py-4 transition-all",
                      location.pathname === link.path
                        ? "border-emerald-200/20 bg-emerald-300/10 text-emerald-100"
                        : "border-white/[0.06] bg-white/[0.04] text-slate-300 hover:border-white/[0.12] hover:bg-white/[0.07]",
                    )}
                  >
                    <link.icon className="h-5 w-5 text-emerald-200" />
                    <span className="text-base font-semibold">{link.name}</span>
                  </Link>
                ))}
              </div>

              <div className="my-5 h-px bg-white/[0.08]" />

              <div className="space-y-2">
                <div className="px-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500">Institutional</div>
                <Link
                  to="/about"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.04] px-4 py-4 text-slate-300 hover:border-white/[0.12] hover:bg-white/[0.07]"
                >
                  <MessageSquare className="h-5 w-5 text-emerald-200" />
                  <span className="text-base font-semibold">About IFXTrades</span>
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.04] px-4 py-4 text-slate-300 hover:border-white/[0.12] hover:bg-white/[0.07]"
                >
                  <Phone className="h-5 w-5 text-emerald-200" />
                  <span className="text-base font-semibold">Contact Desk</span>
                </Link>

                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.04] px-4 py-4 text-slate-300 hover:border-white/[0.12] hover:bg-white/[0.07]"
                    >
                      <LayoutDashboard className="h-5 w-5 text-emerald-200" />
                      <span className="text-base font-semibold">Dashboard</span>
                    </Link>
                    {isAdmin ? (
                      <Link
                        to="/admin"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.04] px-4 py-4 text-slate-300 hover:border-white/[0.12] hover:bg-white/[0.07]"
                      >
                        <Settings className="h-5 w-5 text-emerald-200" />
                        <span className="text-base font-semibold">Admin Panel</span>
                      </Link>
                    ) : null}
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-300 px-5 py-3 text-sm font-semibold text-slate-950"
                  >
                    Access Platform
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>

              {user ? (
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="flex w-full items-center justify-center gap-3 rounded-full border border-red-400/[0.15] bg-red-400/[0.08] px-5 py-3 text-sm font-semibold text-red-200"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : null}

              <div className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 text-sm text-slate-400">
                Institutional-grade signals, algorithms, and research with a single access layer.
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
};
