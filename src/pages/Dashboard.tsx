import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Bell,
  Settings,
  Target,
  Video,
  Clock,
  Activity,
  ArrowUpRight,
  Zap,
  BookOpen,
  Lock
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { cn } from "../utils/cn";
import { motion, AnimatePresence } from "motion/react";
import { getAccess } from "@/utils/accessControl";
import { BRANDING } from "../constants/branding";
import { PurchaseModal } from "@/components/payments/PurchaseModal";

interface BotLicense {
  id: string;
  user_id: string;
  expires_at: string;
  license_key: string;
  is_active: boolean;
  algo_bots?: { name: string };
}

interface UserSignal {
  id: string;
  asset: string;
  direction: "BUY" | "SELL";
  status: string;
  created_at: string;
}

interface UserWebinar {
  id: string;
  title: string;
  date_time: string;
  status: string;
}


export const Dashboard = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();

  const [licenses, setLicenses] = useState<BotLicense[]>([]);
  const [signals, setSignals] = useState<UserSignal[]>([]);
  const [webinars, setWebinars] = useState<UserWebinar[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbHealthy, setDbHealthy] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<{ plan: string, amount: number } | null>(null);


  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Institutional Signal Discovery: Unified fulfillment re-discovery
      const [signalsRes, licenseRes, webinarRes] = await Promise.all([
        supabase.from("signals").select("*").limit(5),
        supabase.from("bot_licenses").select("*, algo_bots(name)").eq("user_id", user?.id),
        supabase.from("webinars").select("*").gte("date_time", new Date().toISOString()).limit(3)
      ]);

      setSignals(signalsRes.data || []);
      setLicenses(licenseRes.data || []);
      setWebinars(webinarRes.data || []);
      setDbHealthy(true);
    } catch (err) {
      console.error("Institutional Discovery Error:", err);
      setDbHealthy(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchData();
    }

    const refetch = () => {
      if (user) fetchData();
    };

    globalThis.addEventListener("app:login", refetch);
    globalThis.addEventListener("app:logout", refetch);

    return () => {
      globalThis.removeEventListener("app:login", refetch);
      globalThis.removeEventListener("app:logout", refetch);
    };
  }, [user, fetchData]);

  if (!user) return null; // Handled by ProtectedRoute but for TS safety

  const isAdmin = userProfile?.role === "admin";

  const isPro = userProfile?.isPro === true;
  const access = getAccess(userProfile);

  return (
    <div className="relative min-h-screen bg-black pt-28 pb-32 px-4">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[800px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[300px] bg-cyan-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Institutional Fulfillment Discovery Banner */}
        {!isPro && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 p-5 bg-gradient-to-r from-emerald-500/10 via-emerald-500/20 to-emerald-500/10 border border-emerald-500/20 rounded-[32px] flex items-center justify-between group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-emerald-500/5 animate-pulse" />
            <div className="flex items-center gap-6 relative z-10 px-4">
              <div className="w-10 h-10 bg-emerald-500 text-black rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Enroll in Institutional Tiers</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">🚀 Upgrade your plan to unlock full trading and execution power</p>
              </div>
            </div>
            <button 
              onClick={() => setSelectedPlan({ plan: "pro", amount: 99 })}
              className="relative z-10 px-8 py-3 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-xl"
            >
              Unlock Pro Access
            </button>
          </motion.div>
        )}

        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-3 mb-2">
              <div className={cn("w-2 h-2 rounded-full", dbHealthy ? "bg-emerald-500 shadow-[0_0_10px_#10b981]" : "bg-red-500")} />
              <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">
                {dbHealthy ? "SYSTEMS OPERATIONAL • LIVE CONNECTION" : "CONNECTION LOST • OFFLINE MODE"}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Console <span className="text-emerald-500">01</span>
              <span className="block text-sm font-medium text-gray-400 mt-2 lowercase">
                authenticated id: {userProfile?.full_name || user.email?.split('@')[0]}
              </span>
            </h1>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3">
            {isAdmin && (
              <Link to="/admin" className="h-12 px-6 rounded-2xl bg-white text-black text-sm font-bold flex items-center gap-2 hover:bg-gray-200 transition-all shadow-xl shadow-white/10 border-0">
                <Settings className="w-4 h-4" />
                ADMIN TERMINAL
              </Link>
            )}
            <div className={cn(
              "h-12 px-6 rounded-2xl flex items-center border-0 backdrop-blur-xl shadow-xl",
              isPro ? "bg-emerald-500 text-black shadow-emerald-500/10" : "bg-white/5 text-gray-400"
            )}>
              <ShieldCheck className="w-4 h-4 mr-2" />
              <span className="text-xs font-black uppercase tracking-widest">
                {isPro ? "PRO ACCESS" : "FREE TIER"}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Active Algos", value: licenses.filter(l => l.is_active).length, icon: Activity, color: "text-emerald-500" },
            { label: "Win Rate", value: "82.4%", icon: Target, color: "text-cyan-500" },
            { label: "Signals Today", value: signals.length, icon: Zap, color: "text-yellow-500" },
            { label: "Uptime", value: "99.99%", icon: Clock, color: "text-emerald-500" }
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md"
            >
              <stat.icon className={cn("w-5 h-5 mb-4", stat.color)} />
              <div className="text-2xl font-bold text-white mb-1 tracking-tight">{stat.value}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            <section className={cn("p-8 rounded-[36px] bg-white/5 border border-white/10 backdrop-blur-xl overflow-hidden relative group", !access.algo && "min-h-[400px]")}>
              <div className="absolute top-0 right-0 p-8 text-emerald-500/10 pointer-events-none group-hover:text-emerald-500/20 transition-colors">
                <Target className="w-32 h-32 rotate-12" />
              </div>

              {!access.algo && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-[6px] rounded-[36px] animate-in fade-in duration-500">
                  <div className="text-center space-y-4 max-w-xs">
                    <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-[32px] flex items-center justify-center mx-auto text-emerald-500 shadow-2xl">
                      <Lock className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Algo Discovery Locked</h3>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed mt-2">
                        Upgrade to <span className="text-emerald-500">ELITE</span> to unlock institutional algorithmic execution.
                      </p>
                    </div>
                    <button 
                      onClick={() => setSelectedPlan({ plan: "elite", amount: 249 })}
                      className="px-10 py-4 bg-emerald-500 text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-emerald-500/20"
                    >
                      Unlock Algo Terminal
                    </button>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-500" />
                  Your Licensed Terminal
                </h2>
                <Link to="/marketplace" className="text-xs font-bold text-emerald-500 hover:text-emerald-400 transition-colors uppercase tracking-widest">ADD NEW KEY</Link>
              </div>
              
              {(() => {
                if (loading) {
                  return (
                    <div className="space-y-4">
                      <div className="h-20 bg-white/5 rounded-3xl animate-pulse" />
                      <div className="h-20 bg-white/5 rounded-3xl animate-pulse" />
                    </div>
                  );
                }
                
                if (licenses.length > 0) {
                  return (
                    <div className="grid grid-cols-1 gap-3">
                      {licenses.map((license) => {
                        const status = license.is_active ? "ONLINE" : "EXPIRED";
                        const statusStyles = license.is_active 
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                          : "bg-red-500/10 text-red-400 border-red-500/20";
                          
                        return (
                          <div key={license.id} className="group relative p-6 rounded-3xl bg-black/40 border border-white/5 hover:border-emerald-500/30 transition-all">
                            <div className="flex items-center justify-between relative z-10">
                              <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                                  <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                  <div className="text-white font-bold group-hover:text-emerald-400 transition-colors uppercase tracking-tight">
                                    {license.algo_bots?.name || "QUANT ENGINE v2"}
                                  </div>
                                  <div className="flex items-center gap-3 mt-1 text-[10px] font-mono text-gray-500">
                                    <span>KEY: {license.license_key}</span>
                                    <span className="w-1 h-1 rounded-full bg-gray-700" />
                                    <span>EXP: {new Date(license.expires_at).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>
                              <span className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border",
                                statusStyles
                              )}>
                                {status}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                }

                return (
                  <div className="text-center py-16 border-2 border-dashed border-white/5 rounded-[32px]">
                    <p className="text-gray-500 text-sm mb-6">No licensed algorithms detected on this account.</p>
                    <Link to="/marketplace" className="inline-flex items-center px-8 py-3 rounded-2xl bg-emerald-500 text-black font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">
                      Initialize Setup
                    </Link>
                  </div>
                );
              })()}
            </section>

            {/* Quick Signals Feed */}
            <section className="p-8 rounded-[36px] bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden group">
              <div className="flex items-center justify-between mb-8 opacity-100 group-hover:opacity-100 transition-opacity">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Elite Signal Frequency
                </h2>
                <Link to="/signals" className="text-xs font-bold text-gray-500 hover:text-white uppercase tracking-widest">FULL FEED</Link>
              </div>

              {!access.signals && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 bg-black/60 backdrop-blur-[6px] rounded-[36px] animate-in fade-in duration-500">
                  <Lock className="w-12 h-12 text-emerald-500 mb-4" />
                  <h3 className="text-white font-black uppercase tracking-tighter text-lg mb-2">Signals Locked</h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest text-center mb-6">Upgrade to PRO for real-time institutional signals.</p>
                  <button 
                    onClick={() => setSelectedPlan({ plan: "pro", amount: 99 })}
                    className="px-8 py-3 bg-emerald-500 text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:scale-105 transition-all"
                  >
                    Unlock Signals
                  </button>
                </div>
              )}
              <div className={cn("space-y-2 relative transition-all duration-700", !access.signals && "blur-[8px] select-none pointer-events-none")}>
                {signals.length > 0 ? (
                  signals.map(s => (
                    <div key={s.id} className="p-4 rounded-2xl bg-black/40 flex items-center justify-between border border-white/5">
                      <div className="flex items-center gap-4">
                        <div className={cn("w-2 h-2 rounded-full shadow-[0_0_8px]", s.direction === 'BUY' ? "bg-emerald-500 shadow-emerald-500" : "bg-red-500 shadow-red-500")} />
                        <span className="text-sm font-bold text-white">{s.asset}</span>
                        <span className={cn("text-[10px] font-black tracking-widest px-2 py-0.5 rounded", s.direction === 'BUY' ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500")}>
                          {s.direction}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-gray-600">
                        {new Date(s.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-xs italic uppercase tracking-widest">Awaiting new trade setups...</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Webinars */}
            <section className="p-8 rounded-[36px] bg-emerald-500/5 border border-emerald-500/10 backdrop-blur-xl relative overflow-hidden group">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Video className="w-5 h-5 text-emerald-500" />
                Live Sessions
              </h2>

              {!access.webinars && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 bg-black/80 backdrop-blur-[4px] rounded-[36px] text-center">
                  <Lock className="w-8 h-8 text-emerald-500/50 mb-3" />
                  <div className="text-[10px] font-black uppercase tracking-widest text-white mb-4 leading-relaxed">
                    Elite Tier Required <br/> For Live Webinars
                  </div>
                  <button 
                    onClick={() => setSelectedPlan({ plan: "elite", amount: 249 })}
                    className="px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-black text-[8px] uppercase tracking-[0.2em] rounded-lg hover:bg-emerald-500 hover:text-black transition-all"
                  >
                    Upgrade Now
                  </button>
                </div>
              )}
              <AnimatePresence>
                {webinars.length > 0 ? (
                  <div className="space-y-4">
                    {webinars.map(w => (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={w.id} 
                        className="p-4 rounded-2xl bg-black/40 border border-white/5"
                      >
                        <div className="text-sm font-bold text-white mb-2">{w.title}</div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-emerald-500">{new Date(w.date_time).toLocaleDateString()}</span>
                          <Link to="/academy" className="p-2 rounded-xl bg-white/5 hover:bg-emerald-500 hover:text-black transition-all">
                            <ArrowUpRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[10px] uppercase font-bold text-gray-600 tracking-widest text-center py-8">
                    NO SESSIONS SCHEDULED
                  </div>
                )}
              </AnimatePresence>
            </section>

            {/* Quick Actions Card */}
            <section className="p-8 rounded-[36px] bg-white/5 border border-white/10 backdrop-blur-xl group">
              <h2 className="text-lg font-bold text-white mb-8">Quick Control</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Academy", icon: BookOpen, path: "/academy" },
                  { label: "Results", icon: Activity, path: "/results" },
                  { label: "Alerts", icon: Bell, href: BRANDING.whatsappUrl },
                  { label: "Support", icon: Target, path: "/contact" },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => item.path ? navigate(item.path) : window.open(item.href, "_blank")}
                    className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-black/40 border border-white/5 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all group/btn"
                  >
                    <item.icon className="w-6 h-6 text-emerald-500 group-hover/btn:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase text-gray-500 group-hover/btn:text-white transition-colors">{item.label}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Pro Upgrade CTA */}
            {!isPro && (
              <section className="p-1 rounded-[36px] bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-lg shadow-emerald-500/20">
                <div className="p-7 rounded-[34px] bg-black">
                  <h3 className="text-lg font-bold text-white mb-2">Upgrade to Pro</h3>
                  <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                    Unlock institutional strategies, priority signals, and one-on-one sessions.
                  </p>
                  <Link 
                    to="/marketplace" 
                    className="flex items-center justify-center py-3 rounded-2xl bg-emerald-500 text-black font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-emerald-500/10"
                  >
                    View Pro Algos
                  </Link>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {selectedPlan && (
        <PurchaseModal 
          plan={selectedPlan.plan}
          amount={selectedPlan.amount}
          onClose={() => setSelectedPlan(null)}
        />
      )}
    </div>
  );
};
