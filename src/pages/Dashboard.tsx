import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Clock, Activity, Zap, BookOpen, 
  Lock, ListChecks, ShieldCheck, Bell, Settings, Target, Users, Video 
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { cn } from "../utils/cn";
import { motion, AnimatePresence } from "motion/react";
import { BRANDING } from "../constants/branding";
import { PurchaseModal } from "@/components/payments/PurchaseModal";
import { tracker } from "@/core/tracker";
import { useDataPulse } from "@/hooks/useDataPulse";
import { BotLicense } from "@/types";
import { ActivityPulse } from "@/components/dashboard/ActivityPulse";
import { UrgencyBanner } from "@/components/ui/UrgencyBanner";

export const Dashboard = () => {
  const { user, userProfile, sessionReady, access } = useAuth();
  const navigate = useNavigate();
  const { signals, webinars, performanceStats, marketData, registrations } = useDataPulse();
  const [userLead, setUserLead] = useState<any>(null);
  const isMountedRef = useRef(true);

  const [licenses, setLicenses] = useState<BotLicense[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<{ plan: string, amount: number, productId?: string } | null>(null);

  const fetchLicenses = useCallback(async () => {
    if (!user?.id) {
       setLoading(false);
       return;
    }
    
    try {
      const { data, error } = await supabase.from('bot_licenses')
        .select(`
          *,
          algo_bots (
            name,
            version
          )
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      setLicenses(data || []);
    } catch (err) {
      console.error('Institutional License Discovery Error:', err);
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [user?.id]);

  const fetchUserLead = useCallback(async () => {
    if (!user?.email) return;
    const { data } = await supabase.from('leads').select('*').eq('email', user.email).maybeSingle();
    if (data) setUserLead(data);
  }, [user]);

  useEffect(() => {
    if (sessionReady) {
      fetchLicenses();
      fetchUserLead();
    }
    tracker.track("page_view", { surface: "dashboard" });
  }, [sessionReady, fetchLicenses, fetchUserLead]);

  console.log("RENDER DASHBOARD DATA:", { licenses, signals, webinars });

  useEffect(() => {
    const refetch = () => fetchLicenses();
    globalThis.addEventListener("supabase:refresh", refetch);
    globalThis.addEventListener("app:login", refetch);

    return () => {
      globalThis.removeEventListener("supabase:refresh", refetch);
      globalThis.removeEventListener("app:login", refetch);
    };
  }, [fetchLicenses]);

  const isAdmin = access.admin;
  const isPro = access.signals || access.algo;
  const isElite = access.algo && access.webinars; 
  const isProOnly = isPro && !isElite;

  const renderStats = () => {
    const statsConfig = [
      { label: "Active Algos", value: licenses.filter(l => l.is_active).length, icon: Activity, color: "text-emerald-500" },
      { label: "Win Rate", value: performanceStats.winRate, icon: Target, color: "text-cyan-500" },
      { label: "Signals Today", value: signals.length, icon: Zap, color: "text-yellow-500" },
      { label: "Total Pips", value: performanceStats.totalPips.toLocaleString(), icon: Clock, color: "text-emerald-500" }
    ];

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {statsConfig.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors"
          >
            <stat.icon className={cn("w-5 h-5 mb-4", stat.color)} />
            <div className="text-3xl font-bold text-white mb-1 tracking-tight tabular-nums">{stat.value}</div>
            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    );
  };
  const renderMarketPulse = () => {
    if (marketData.length === 0) return null;

    return (
      <div className="mb-12 overflow-hidden py-4 -mx-4 px-4 bg-white/5 border-y border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-12 whitespace-nowrap animate-ticker">
          {[...marketData, ...marketData].map((item, i) => (
            <div key={`${item.symbol}-${i}`} className="flex items-center gap-3">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{item.symbol}</span>
              <span className="text-sm font-bold text-white tabular-nums">${item.price}</span>
              <span className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded",
                item.up ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
              )}>
                {item.change}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLicenses = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          <div className="h-24 bg-white/5 rounded-3xl animate-pulse" />
          <div className="h-24 bg-white/5 rounded-3xl animate-pulse" />
        </div>
      );
    }

    if (licenses.length > 0) {
      return (
        <div className="grid grid-cols-1 gap-4">
          {licenses.map((license) => (
            <div key={license.id} className="group relative p-8 rounded-[36px] bg-black/40 border border-white/5 hover:border-emerald-500/30 transition-all">
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-[28px] bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight italic">
                      {(license as any).algo_bots?.name || "QUANT ENGINE v2"}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-[10px] font-mono text-gray-500">
                      <span className="bg-white/5 px-2 py-0.5 rounded uppercase">ID: {license.license_key.slice(0, 8)}...</span>
                      <span className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        EXP: {new Date(license.expires_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <span className={cn(
                  "px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border",
                  license.is_active ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"
                )}>
                  {license.is_active ? "ONLINE" : "EXPIRED"}
                </span>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[48px] bg-black/20">
        <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-8">No licensed algorithms detected on this account.</p>
        <Link to="/marketplace" className="inline-flex items-center px-10 py-4 rounded-2xl bg-emerald-500 text-black font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-emerald-500/20">
          Initialize Setup
        </Link>
      </div>
    );
  };

  const renderSignals = () => {
    if (signals.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 text-xs font-black uppercase tracking-[0.2em] italic">Awaiting new trade setups...</p>
        </div>
      );
    }

    return signals.map(s => (
      <div key={s.id} className="p-6 rounded-3xl bg-black/40 flex items-center justify-between border border-white/5 hover:bg-white/5 transition-colors">
        <div className="flex items-center gap-6">
          <div className={cn("w-3 h-3 rounded-full shadow-[0_0_12px]", s.direction === 'BUY' ? "bg-emerald-500 shadow-emerald-500" : "bg-red-500 shadow-red-500")} />
          <span className="text-lg font-bold text-white tracking-tight">{s.asset}</span>
          <span className={cn("text-[9px] font-black tracking-[0.2em] px-3 py-1 rounded-lg", s.direction === 'BUY' ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500")}>
            {s.direction}
          </span>
        </div>
        <span className="text-[11px] font-mono text-gray-600 font-black">
          {new Date(s.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    ));
  };

  const renderWebinars = () => {
    const registeredWebinars = webinars.filter(w => 
      registrations.some(r => r.webinar_id === w.id)
    );

    if (registeredWebinars.length === 0) {
      return (
        <div className="text-center py-12 px-6 border border-dashed border-white/5 rounded-3xl bg-black/20">
          <p className="text-[10px] uppercase font-black text-gray-500 tracking-[0.2em] mb-4 italic">
            NO SESSIONS REGISTERED
          </p>
          <Link to="/webinars" className="inline-flex py-3 px-6 bg-white/5 text-xs font-bold text-white rounded-xl hover:bg-emerald-500 hover:text-black transition-all">
            Join a Webinar
          </Link>
        </div>
      );
    }

    return (
      <AnimatePresence mode="popLayout">
        <div className="space-y-4">
          {registeredWebinars.map(w => (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              key={w.id} 
              className="p-6 rounded-[32px] bg-emerald-500/5 border border-emerald-500/20 hover:border-emerald-500 transition-all group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Enrolled Session</span>
              </div>
              <div className="text-sm font-black text-white mb-4 uppercase tracking-tighter leading-snug group-hover:text-emerald-400 transition-colors">
                {w.title}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest font-mono">
                  {new Date(w.date_time).toLocaleDateString()} at {new Date(w.date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <Link to="/webinar-feed" className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-emerald-500 hover:text-black transition-all">
                  <Video className="w-5 h-5 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    );
  };

  if (!user) {
     return (
       <div className="min-h-screen bg-black flex items-center justify-center">
         <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
       </div>
     );
  }

  return (
    <div className="relative min-h-screen bg-black pt-28 pb-32 px-4 selection:bg-emerald-500/30">
      <UrgencyBanner />
      <div className="max-w-7xl mx-auto relative z-10">
        {renderMarketPulse()}
        {!isElite && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 p-5 bg-gradient-to-r from-emerald-500/10 via-emerald-500/20 to-emerald-500/10 border border-emerald-500/20 rounded-[32px] flex items-center justify-between group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-emerald-500/5 animate-pulse" />
              {/* Profile Card */}
              <div className="p-6 rounded-[32px] bg-white/[0.03] border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4">
                  <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${userProfile?.isPro ? 'bg-emerald-500 text-black' : 'bg-white/10 text-white/40'}`}>
                    {userProfile?.role || 'TRADER'}
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center relative group">
                    <Users className="w-8 h-8 text-emerald-400" />
                    <div className="absolute inset-0 bg-emerald-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white uppercase tracking-tighter leading-none mb-1">
                      {userProfile?.full_name || user?.email?.split('@')[0] || 'Institutional Trader'}
                    </h2>
                    <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">
                      {userLead?.crm_metadata?.phone || "Phone Not Verified"}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-white/5">
                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Email</span>
                    <span className="text-[10px] font-mono text-white/80">{user?.email}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-white/5">
                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Region</span>
                    <span className="text-[10px] font-mono text-white/80">{userLead?.priority_tag || "GLOBAL"}</span>
                  </div>
                </div>
              </div>
            <div className="flex items-center gap-6 relative z-10 px-4">
              <div className="w-10 h-10 bg-emerald-500 text-black rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">
                  {isProOnly ? "Institutional Tier Expansion" : "Enroll in Institutional Tiers"}
                </h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                  {isProOnly ? "🚀 Upgrade to ELITE to unlock institutional algorithmic execution" : "🚀 Upgrade your plan to unlock full trading and execution power"}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setSelectedPlan({ 
                plan: isProOnly ? "elite" : "pro", 
                amount: isProOnly ? 249 : 99,
                productId: isProOnly ? 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2' : 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1'
              })}
              className="relative z-10 px-8 py-3 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-xl"
            >
              {isProOnly ? "Join Elite" : "Unlock Pro Access"}
            </button>
          </motion.div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-3 mb-2">
              <div className={cn("w-2 h-2 rounded-full", sessionReady ? "bg-emerald-500 shadow-[0_0_10px_#10b981]" : "bg-red-500 animate-pulse")} />
              <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">
                {sessionReady ? "SYSTEMS OPERATIONAL • LIVE CONNECTION" : "INITIALIZING QUANTUM PULSE • HANDSHAKING..."}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-none">
              Console <span className="text-emerald-500">01</span>
              <span className="block text-sm font-medium text-gray-400 mt-4 lowercase font-mono">
                authenticated id: {userProfile?.full_name || (user.email ? user.email.split('@')[0] : user.id.slice(0, 8))}
              </span>
            </h1>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3">
            {isAdmin && (
              <Link to="/admin" className="h-12 px-6 rounded-2xl bg-white text-black text-xs font-black flex items-center gap-2 hover:bg-gray-200 transition-all uppercase tracking-widest">
                <Settings className="w-4 h-4" />
                ADMIN TERMINAL
              </Link>
            )}
            <div className={cn(
              "h-12 px-6 rounded-2xl flex items-center border border-white/5 backdrop-blur-xl shadow-xl",
              isPro ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-white/5 text-gray-400 shadow-none"
            )}>
              <ShieldCheck className="w-4 h-4 mr-2" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                {isPro ? "PRO ACCESS UNLOCKED" : "FREE TIER"}
              </span>
            </div>
          </motion.div>
        </div>

        {renderStats()}

        {/* --- Daily Trader Checklist --- */}
        <section className="mb-12 p-10 rounded-[48px] bg-gradient-to-br from-emerald-500/10 via-black to-black border border-emerald-500/20 shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
              <ListChecks className="w-32 h-32 text-emerald-500" />
           </div>
           <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 relative z-10">
              <div className="flex-1">
                 <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic mb-4">Daily Precision Tasks</h2>
                 <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest max-w-xl">Complete your daily institutional preparation to maintain high-density execution standards.</p>
              </div>
              <div className="flex flex-wrap items-center gap-6">
                 {[
                   { id: "signal", label: "Review Daily Signal", done: signals.length > 0 },
                   { id: "bot", label: "Verify Bot Sync", done: licenses.some(l => l.is_active) },
                   { id: "academy", label: "Scan Academy", done: false }
                 ].map((task) => (
                    <div key={task.id} className={cn(
                      "flex items-center gap-4 px-6 py-4 rounded-3xl border transition-all",
                      task.done ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-500" : "bg-white/5 border-white/10 text-gray-500"
                    )}>
                       <div className={cn("w-6 h-6 rounded-full flex items-center justify-center border-2", task.done ? "border-emerald-500 bg-emerald-500 text-black" : "border-gray-800 bg-black/40")}>
                          {task.done && <ShieldCheck className="w-3.5 h-3.5" />}
                       </div>
                       <span className="text-[10px] font-black uppercase tracking-widest">{task.label}</span>
                    </div>
                 ))}
              </div>
           </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className={cn("p-10 rounded-[48px] bg-white/5 border border-white/10 backdrop-blur-3xl overflow-hidden relative group", !isElite && "min-h-[440px]")}>
              {!isElite && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-8 bg-black/80 backdrop-blur-xl rounded-[48px] animate-in fade-in duration-1000">
                  <div className="text-center space-y-6 max-w-sm">
                    <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-[40px] flex items-center justify-center mx-auto text-emerald-500 shadow-2xl relative">
                      <Lock className="w-10 h-10" />
                      <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Algo Discovery Locked</h3>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest leading-relaxed mt-4">
                        {isProOnly ? "Upgrade to ELITE and gain access to institutional algorithmic execution." : "Elite Tier Required for institutional algorithmic signals."}
                      </p>
                    </div>
                    <button 
                      onClick={() => setSelectedPlan({ plan: "elite", amount: 249 })}
                      className="px-12 py-5 bg-emerald-500 text-black font-black text-[11px] uppercase tracking-[0.3em] rounded-3xl hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-emerald-500/40"
                    >
                      Unlock Elite Terminal
                    </button>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-black text-white flex items-center gap-3 uppercase tracking-tighter italic">
                  <Activity className="w-6 h-6 text-emerald-500" />
                  Execution Terminal
                </h2>
                <Link to="/marketplace" className="text-[10px] font-black text-emerald-500 hover:text-emerald-400 transition-colors uppercase tracking-[0.2em]">ADD NEW KEY</Link>
              </div>
              
              <div className={cn("transition-all duration-700", !isElite && "blur-xl select-none pointer-events-none")}>
                {renderLicenses()}
              </div>
            </section>

            <section className="p-10 rounded-[48px] bg-white/5 border border-white/10 backdrop-blur-3xl relative group">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-black text-white flex items-center gap-3 uppercase tracking-tighter italic">
                  <Zap className="w-6 h-6 text-yellow-500" />
                  Elite Frequency
                </h2>
                <Link to="/signals" className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-[0.2em]">FULL FEED</Link>
              </div>

              {!isPro && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-8 bg-black/80 backdrop-blur-xl rounded-[48px] animate-in fade-in duration-1000">
                  <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-[32px] flex items-center justify-center mb-6 text-emerald-500 shadow-2xl relative">
                    <Lock className="w-10 h-10" />
                    <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic mb-2">Signals Locked</h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest text-center mb-8">Upgrade to PRO or ELITE for real-time institutional signals.</p>
                  <button 
                    onClick={() => setSelectedPlan({ plan: "pro", amount: 99, productId: 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1' })}
                    className="px-10 py-4 bg-emerald-500 text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:scale-110 transition-all shadow-xl shadow-emerald-500/20"
                  >
                    Unlock Discovery Feed
                  </button>
                </div>
              )}
              
              <div className={cn("space-y-3 relative transition-all duration-700", !isPro && "blur-[12px] select-none pointer-events-none")}>
                {renderSignals()}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section className="p-10 rounded-[48px] bg-emerald-500/5 border border-emerald-500/10 backdrop-blur-3xl relative group">
              <h2 className="text-xl font-black text-white mb-8 flex items-center gap-3 uppercase tracking-tighter italic">
                <Video className="w-6 h-6 text-emerald-500" />
                Live Sessions
              </h2>

              {!isElite && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-8 bg-black/80 backdrop-blur-sm rounded-[48px] text-center">
                  <Lock className="w-10 h-10 text-emerald-500/50 mb-4" />
                  <div className="text-[11px] font-black uppercase tracking-[0.15em] text-white/80 mb-6 leading-relaxed">
                    Elite Tier Required <br/> For Live Webinars
                  </div>
                  <button 
                    onClick={() => setSelectedPlan({ plan: "elite", amount: 249 })}
                    className="px-8 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-black text-[9px] uppercase tracking-[0.25em] rounded-xl hover:bg-emerald-500 hover:text-black transition-all"
                  >
                    Upgrade Now
                  </button>
                </div>
              )}
              
              <div className={cn("transition-all duration-700", !isElite && "blur-xl select-none pointer-events-none")}>
                {renderWebinars()}
              </div>
            </section>

            <section className="p-10 rounded-[48px] bg-white/5 border border-white/10 backdrop-blur-3xl group">
              <h2 className="text-xl font-black text-white mb-10 uppercase tracking-tighter italic">Quick Matrix</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Academy", icon: BookOpen, path: "/academy" },
                  { label: "Results", icon: Activity, path: "/results" },
                  { label: "Alerts", icon: Bell, href: BRANDING.whatsappUrl },
                  { label: "Support", icon: Target, path: "/contact" },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => item.path ? navigate(item.path) : window.open(item.href, "_blank")}
                    className="flex flex-col items-center gap-4 p-8 rounded-[40px] bg-black/40 border border-white/5 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all group/btn"
                  >
                    <item.icon className="w-7 h-7 text-emerald-500 group-hover/btn:scale-110 transition-transform" />
                    <span className="text-[9px] font-black uppercase text-gray-500 tracking-[0.1em] group-hover/btn:text-white transition-colors">{item.label}</span>
                  </button>
                ))}
              </div>
            </section>

            <ActivityPulse />

            {!isPro && (
              <section className="p-1.5 rounded-[52px] bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-2xl shadow-emerald-500/20 mt-4">
                <div className="p-10 rounded-[48px] bg-black">
                  <h3 className="text-xl font-black text-white mb-3 uppercase tracking-tighter italic">Join Elite</h3>
                  <p className="text-[11px] text-gray-400 mb-8 leading-relaxed font-medium">
                    Unlock institutional strategies, priority signals, and direct execution pipelines.
                  </p>
                  <Link 
                    to="/marketplace" 
                    className="flex items-center justify-center py-5 rounded-3xl bg-emerald-500 text-black font-black text-[10px] uppercase tracking-[0.25em] hover:bg-white transition-all shadow-xl shadow-emerald-500/20"
                  >
                    View Algos
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
          productId={(selectedPlan as any).productId}
          onClose={() => setSelectedPlan(null)}
        />
      )}
    </div>
  );
};
