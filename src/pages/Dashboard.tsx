import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { Zap, ShieldCheck, Bell, Settings, Target, Video, BookOpen, Clock, Activity, ArrowUpRight } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase, safeQuery } from "../lib/supabase";
import { cn } from "../utils/cn";
import { motion } from "motion/react";

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
  direction: string;
  status: string;
  created_at: string;
}

interface UserWebinar {
  id: string;
  title: string;
  date_time: string;
}

export const Dashboard = () => {
  const { user, userProfile } = useAuth();
  const [licenses, setLicenses] = useState<BotLicense[]>([]);
  const [signals, setSignals] = useState<UserSignal[]>([]);
  const [webinars, setWebinars] = useState<UserWebinar[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbHealthy, setDbHealthy] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchDashboardData = async () => {
        setLoading(true);
        try {
          const [licenseData, signalData, webinarData] = await Promise.all([
            safeQuery<BotLicense[]>(
              supabase.from('bot_licenses').select('*, algo_bots(name)').eq('user_id', user.id)
            ),
            safeQuery<UserSignal[]>(
              supabase.from('signals').select('*').eq('status', 'active').limit(5)
            ),
            safeQuery<UserWebinar[]>(
              supabase.from('webinar_registrations').select('webinars(id, title, date_time)').eq('user_id', user.id).limit(3)
            )
          ]);
          
          setLicenses(Array.isArray(licenseData) ? licenseData : []);
          setSignals(Array.isArray(signalData) ? signalData : []);
          
          // Flatten webinar data
          const flatWebinars = (webinarData as any[] || []).map(w => w.webinars).filter(Boolean);
          setWebinars(flatWebinars);
          
          setDbHealthy(true);
        } catch (err) {
          console.error("Dashboard Fetch Error:", err);
          setDbHealthy(false);
        } finally {
          setLoading(false);
        }
      };
      fetchDashboardData();
    }
  }, [user]);

  if (!user) return <Navigate to="/login" />;

  const isAdmin = userProfile?.role === 'admin' || 
                  user.email === 'admin@ifxtrades.com' || 
                  user.email === 'admin@tradinghub.com' || 
                  user.email === 'piyushmal1301@gmail.com';

  const isPro = userProfile?.isPro === true;

  return (
    <div className="relative min-h-screen bg-black pt-28 pb-32 px-4">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[800px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[300px] bg-cyan-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
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
              <span className="block text-sm font-medium text-gray-400 mt-2">
                AUTHENTICATED AS: {userProfile?.full_name || user.email?.split('@')[0]}
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
              isPro ? "bg-emerald-500 text-black" : "bg-white/5 text-gray-400"
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
            { label: "Uptime", value: "99.99%", icon: Clock, color: "text-blue-500" }
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
            <section className="p-8 rounded-[36px] bg-white/5 border border-white/10 backdrop-blur-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 text-emerald-500/10 pointer-events-none">
                <Target className="w-32 h-32 rotate-12" />
              </div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-500" />
                  Your Licensed Terminal
                </h2>
                <Link to="/marketplace" className="text-xs font-bold text-emerald-500 hover:text-emerald-400">ADD NEW KEY</Link>
              </div>
              
              {loading ? (
                <div className="space-y-4">
                  <div className="h-20 bg-white/5 rounded-3xl animate-pulse" />
                  <div className="h-20 bg-white/5 rounded-3xl animate-pulse" />
                </div>
              ) : licenses.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {licenses.map((license) => (
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
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter",
                          license.is_active ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                        )}>
                          {license.is_active ? "ONLINE" : "EXPIRED"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 border-2 border-dashed border-white/5 rounded-[32px]">
                  <p className="text-gray-500 text-sm mb-6">No licensed algorithms detected on this account.</p>
                  <Link to="/marketplace" className="inline-flex items-center px-8 py-3 rounded-2xl bg-emerald-500 text-black font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">
                    Initialize Setup
                  </Link>
                </div>
              )}
            </section>

            {/* Quick Signals Feed */}
            <section className="p-8 rounded-[36px] bg-white/5 border border-white/10 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Elite Signal Frequency
                </h2>
                <Link to="/signals" className="text-xs font-bold text-gray-500 hover:text-white">FULL FEED</Link>
              </div>
              <div className="space-y-2">
                {signals.map(s => (
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
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Webinars */}
            <section className="p-8 rounded-[36px] bg-emerald-500/5 border border-emerald-500/10 backdrop-blur-xl">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Video className="w-5 h-5 text-emerald-500" />
                Live Sessions
              </h2>
              {webinars.length > 0 ? (
                <div className="space-y-4">
                  {webinars.map(w => (
                    <div key={w.id} className="p-4 rounded-2xl bg-black/40 border border-white/5">
                      <div className="text-sm font-bold text-white mb-2">{w.title}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-emerald-500">{new Date(w.date_time).toLocaleDateString()}</span>
                        <Link to={`/webinars/${w.id}`} className="p-2 rounded-xl bg-white/5 hover:bg-emerald-500 hover:text-black transition-all">
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-[10px] uppercase font-bold text-gray-600 tracking-widest text-center py-8">
                  NO SESSIONS SCHEDULED
                </div>
              )}
            </section>

            {/* Quick Actions Card */}
            <section className="p-8 rounded-[36px] bg-white/5 border border-white/10 backdrop-blur-xl group">
              <h2 className="text-lg font-bold text-white mb-8">Quick Control</h2>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-black/40 border border-white/5 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all">
                  <BookOpen className="w-6 h-6 text-emerald-500" />
                  <span className="text-[10px] font-black uppercase text-gray-500">Academy</span>
                </button>
                <button className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-black/40 border border-white/5 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all">
                  <Activity className="w-6 h-6 text-emerald-500" />
                  <span className="text-[10px] font-black uppercase text-gray-500">Analytics</span>
                </button>
                <button className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-black/40 border border-white/5 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all">
                  <Bell className="w-6 h-6 text-emerald-500" />
                  <span className="text-[10px] font-black uppercase text-gray-500">App Alerts</span>
                </button>
                <button className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-black/40 border border-white/5 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all">
                  <Target className="w-6 h-6 text-emerald-500" />
                  <span className="text-[10px] font-black uppercase text-gray-500">Support</span>
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
