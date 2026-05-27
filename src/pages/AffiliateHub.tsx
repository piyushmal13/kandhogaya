import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Users, 
  MousePointer2, 
  TrendingUp, 
  Copy, 
  Check, 
  DollarSign, 
  Wallet,
  ArrowUpRight,
  ShieldCheck,
  Activity,
  Zap,
  LayoutDashboard,
  Trophy,
  ArrowRight,
  Calculator,
  Percent,
  Layers,
  ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { PageMeta } from "../components/site/PageMeta";
import { DashboardLayout } from "@/components/institutional/DashboardLayout";
import { EliteButton } from "@/components/ui/Button";
import { useRealtime } from "../hooks/useRealtime";

export const AffiliateHub = () => {
  const { userProfile, loading: authLoading } = useAuth();
  const { success, error: toastError } = useToast();
  const [affiliateCode, setAffiliateCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [referredClients, setReferredClients] = useState<any[]>([]);
  const [commissionRate, setCommissionRate] = useState<number>(10.00);
  const [stats, setStats] = useState({
    clicks: 124, 
    registrations: 12,
    commissions: 450,
    pendingPayouts: 150
  });

  // Public Landing Page Interactive states
  const [calcVolume, setCalcVolume] = useState<number>(20);
  const [calcPlan, setCalcPlan] = useState<number>(499); // Avg algorithm sub value

  // Real-time referred clients synchronization hook
  const { data: realtimeLeads } = useRealtime<any>(
    'leads',
    affiliateCode ? `referred_by_code=${affiliateCode}` : undefined,
    (payload) => {
      if (payload.eventType === 'INSERT') {
        const newLead = payload.new as any;
        success(`Attribution Alert: New client ${newLead.full_name || newLead.email} registered with your link!`);
      }
    }
  );

  useEffect(() => {
    if (realtimeLeads && realtimeLeads.length > 0) {
      setReferredClients(realtimeLeads);
    }
  }, [realtimeLeads]);

  const getTierDetails = () => {
    const clicks = stats.clicks || 0;
    const earnings = stats.commissions || 0;
    if (clicks > 500 || earnings > 1000) {
      return { name: "VIP Infinite", color: "from-amber-400/20 to-amber-600/20 border-amber-500/30 text-amber-300", glow: "shadow-[0_0_35px_rgba(245,158,11,0.25)]" };
    }
    if (clicks > 200 || earnings > 500) {
      return { name: "Platinum Pro", color: "from-slate-400/20 to-slate-600/20 border-slate-400/30 text-slate-200", glow: "shadow-[0_0_25px_rgba(203,213,225,0.15)]" };
    }
    if (clicks > 100 || earnings > 200) {
      return { name: "Gold Associate", color: "from-yellow-500/20 to-yellow-600/20 border-yellow-500/30 text-yellow-300", glow: "shadow-[0_0_20px_rgba(234,179,8,0.15)]" };
    }
    return { name: "Silver Elite", color: "from-zinc-500/20 to-zinc-600/20 border-zinc-500/30 text-zinc-300", glow: "" };
  };

  const tier = getTierDetails();

  useEffect(() => {
    if (userProfile?.id) {
       fetchAffiliateData();
    } else {
       setLoading(false);
    }
  }, [userProfile]);

  const fetchAffiliateData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("affiliate_codes")
        .select("*")
        .eq("user_id", userProfile?.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setAffiliateCode(data.code);
        setCommissionRate(Number(data.commission_rate || 10.00));
        setStats({
          clicks: data.total_clicks || 0,
          registrations: data.total_registrations || 0,
          commissions: 0, 
          pendingPayouts: 0
        });

        // Fetch referred clients dynamically
        const { data: leadsData } = await supabase
          .from("leads")
          .select("id, email, full_name, created_at, stage, crm_metadata")
          .eq("referred_by_code", data.code)
          .order("created_at", { ascending: false });

        if (leadsData) {
          setReferredClients(leadsData);
        }
        
        // Fetch commissions from DB
        const { data: comms } = await supabase
          .from("commissions")
          .select("amount, status")
          .filter("agent_id", "in", `(select id from agents where user_id = '${userProfile?.id}')`);
          
        if (comms) {
           const total = comms.reduce((acc, c) => acc + (c.amount || 0), 0);
           const pending = comms.filter(c => c.status === 'PENDING').reduce((acc, c) => acc + (c.amount || 0), 0);
           setStats(prev => ({ ...prev, commissions: total, pendingPayouts: pending }));
        }
      }
    } catch (err) {
      console.error("Affiliate Discovery Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const generateCode = async () => {
    if (!userProfile?.id) return;
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc("generate_affiliate_code", { user_id: userProfile.id });
      if (error) throw error;
      setAffiliateCode(data);
      success("Institutional Referral Code Generated.");
    } catch (err: any) {
      toastError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    if (!affiliateCode) return;
    const link = `${globalThis.location.origin}?ref=${affiliateCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    success("Referral Link Safely Duplicated.");
  };

  const referralLink = affiliateCode ? `${globalThis.location.origin}?ref=${affiliateCode}` : "Login to generate...";

  // Loading indicator for authentication resolution
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#010203] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-400">Authenticating Signal...</span>
        </div>
      </div>
    );
  }

  // ── PUBLIC LANDING PAGE (For Logged-Out Visitors) ──
  if (!userProfile) {
    const estimatedCommission = Math.floor(calcVolume * calcPlan * 0.10);
    return (
      <div className="bg-[#010203] text-white selection:bg-emerald-500 selection:text-black min-h-screen pt-36 pb-24 overflow-hidden relative">
        <PageMeta 
          title="Elite Affiliate Program" 
          description="Become an institutional marketing partner. Earn 10% CPA standard commission sharing on premium algorithmic trades with sub-second transparency."
          path="/affiliate"
        />

        {/* Dynamic Glow Overlay */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[700px] bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* Header Block */}
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.25em]">
              <Trophy className="w-3.5 h-3.5" />
              Growth Protocol Network
            </div>
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-none italic">
              Elite Affiliate <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Partner</span> Desk.
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xl mx-auto font-medium">
              Join Asia's premier quantitative marketing framework. Refer your audience to our industry-leading backtest-verified execution systems and earn a baseline 10% CPA commission on every product purchase.
            </p>
            <div className="pt-4">
              <Link to="/login">
                <EliteButton variant="premium-gold" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Become an Active Partner
                </EliteButton>
              </Link>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-24">
            {[
              { label: "Standard CPA", value: "10% Payout", desc: "High baseline percentage rate" },
              { label: "Client Conversion", value: "14.8% Avg", desc: "Best-in-class product appeal" },
              { label: "Settlement Cycle", value: "48 Hours", desc: "Ultra-fast security auditing" },
              { label: "Attribution System", value: "100% Signal", desc: "Cryptographic client mapping" }
            ].map((m, idx) => (
              <div key={idx} className="p-6 rounded-[2rem] bg-white/[0.01] border border-white/5 text-center">
                <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400/60 block mb-2">{m.label}</span>
                <h3 className="text-2xl font-black text-white tracking-tighter mb-1 uppercase">{m.value}</h3>
                <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">{m.desc}</span>
              </div>
            ))}
          </div>

          {/* Interactive Calculator and Propositions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center max-w-6xl mx-auto">
            
            {/* Left Column: Interactive Calculator */}
            <div className="lg:col-span-6 bg-[#030508]/80 border border-white/10 rounded-[3rem] p-10 backdrop-blur-3xl relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-3 mb-8">
                <Calculator className="w-6 h-6 text-emerald-500" />
                <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">Referral Income Estimator</h2>
              </div>

              <div className="space-y-8">
                {/* Volume slider */}
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <span>Referred Clients / Month</span>
                    <span className="text-white font-mono text-xs">{calcVolume} Accounts</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="100" 
                    step="5"
                    value={calcVolume}
                    onChange={(e) => setCalcVolume(Number(e.target.value))}
                    className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                {/* Plan Cost selector */}
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <span>Average Subscription Value</span>
                    <span className="text-white font-mono text-xs">${calcPlan} USD</span>
                  </div>
                  <div className="flex gap-2">
                    {[299, 499, 999].map((val) => (
                      <button
                        key={val}
                        onClick={() => setCalcPlan(val)}
                        className={`flex-1 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                          calcPlan === val 
                            ? "bg-emerald-500 text-black border-emerald-500" 
                            : "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        ${val} {val === 499 && "(Avg)"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Estimate Result Display */}
                <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl text-center space-y-2 mt-4">
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.2em] block">ESTIMATED MONTHLY COMMISSION</span>
                  <div className="text-4xl sm:text-5xl font-black text-white tracking-tighter uppercase font-mono">
                    ${estimatedCommission.toLocaleString()}
                    <span className="text-xs text-gray-500 font-sans tracking-widest lowercase">/mo</span>
                  </div>
                  <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest block">Based on baseline 10% CPA conversion value</span>
                </div>
              </div>
            </div>

            {/* Right Column: Key Value Propositions */}
            <div className="lg:col-span-6 space-y-8">
              <div className="space-y-2">
                <span className="text-emerald-400 text-xs font-mono uppercase tracking-[0.3em] block">// PLATFORM INTEGRITY</span>
                <h2 className="text-3xl font-black uppercase tracking-tight italic text-white leading-tight">
                  Transparent Attribution Systems.
                </h2>
                <p className="text-gray-400 text-xs leading-relaxed font-medium">
                  We don't believe in manual tracking errors. Our referral portal operates on cryptographically-secure URL tags and browser enclaves, assuring every registration and signal purchase maps directly to your active agent.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    icon: Percent,
                    title: "Volume-Tier Commission Adjustments",
                    desc: "Deliver high referred volume and see your commission automatically adjusted up from 10% standard CPA to customized enterprise thresholds by our quant desks."
                  },
                  {
                    icon: Layers,
                    title: "Advanced Tracking Dashboard",
                    desc: "Gain instant dashboard access. View raw link clicks, successful conversion logs, geo-locations, and pending payouts in one central corporate terminal."
                  },
                  {
                    icon: ShieldCheck,
                    title: "Direct Bank Broker Settlement Protocols",
                    desc: "Commissions are audited automatically every 48 hours. Request instantaneous wire withdrawals or cryptocurrency transfers straight into your wallet."
                  }
                ].map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-black uppercase text-white tracking-tight leading-none">{item.title}</h3>
                      <p className="text-[11px] text-gray-400 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex items-center gap-4">
                <Link to="/login" className="inline-flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-[0.2em] hover:text-emerald-300 transition-colors group">
                  Become a Referral Partner
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </div>
    );
  }

  // ── DASHBOARD LAYOUT VIEW (For Authenticated Users) ──
  return (
    <DashboardLayout>
      <div className="pb-24">
      <PageMeta 
        title="Affiliate Hub" 
        description="Monitor your institutional referral performance and management your commissions."
        path="/affiliate"
      />

      <div className="max-w-7xl mx-auto px-4">
        {/* Header Terminal */}
        <div className="mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8"
          >
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono tracking-widest uppercase">
                  <LayoutDashboard className="w-3 h-3" />
                  Growth Protocol Active
                </div>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${tier.color} border border-white/10 text-[9px] font-black uppercase tracking-widest ${tier.glow}`}>
                  <Trophy className="w-3 h-3 text-emerald-400" />
                  {tier.name}
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">
                Affiliate <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Terminal</span>
              </h1>
              <p className="text-gray-500 mt-4 max-w-xl text-sm font-bold uppercase tracking-widest leading-relaxed">
                Scaled revenue through institutional partnership. Manage your referral network and withdraw commissions with sub-second transparency.
              </p>
            </div>

            <div className="flex gap-4">
               <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Live Feed
               </button>
               <button className="px-8 py-4 bg-emerald-500 text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-all flex items-center gap-2 shadow-xl shadow-emerald-500/20">
                  <Wallet className="w-4 h-4" />
                  Withdraw Funds
                  <ArrowUpRight className="w-4 h-4" />
               </button>
            </div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
           {[
             { label: "Total Clicks", value: stats.clicks, icon: MousePointer2, color: "text-cyan-400", bg: "bg-cyan-500/10" },
             { label: "Registrations", value: stats.registrations, icon: Users, color: "text-emerald-400", bg: "bg-emerald-500/10" },
             { label: "Total Earnings", value: `$${stats.commissions}`, icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10" },
             { label: "Pending Payout", value: `$${stats.pendingPayouts}`, icon: TrendingUp, color: "text-amber-400", bg: "bg-amber-500/10" }
           ].map((stat, i) => (
             <motion.div 
               key={stat.label}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className="p-8 bg-[var(--raised)] border border-white/5 rounded-[2.5rem] relative overflow-hidden group hover:border-white/10 transition-all"
             >
                <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform`}>
                   <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 italic">{stat.label}</div>
                <div className="text-3xl font-black text-white tracking-tighter uppercase">{stat.value}</div>
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <stat.icon className="w-24 h-24" />
                </div>
             </motion.div>
           ))}
        </div>

        {/* Action Board */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Referral Link Constructor */}
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             className="lg:col-span-2 p-10 bg-[var(--color50)] border border-white/5 rounded-[3rem] space-y-8"
           >
              <div className="flex items-center gap-4 mb-2">
                 <Zap className="w-6 h-6 text-emerald-500 animate-pulse" />
                 <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Attribution Signal Link</h2>
              </div>
              
              <div className="space-y-4">
                 <p className="text-xs text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                   Share your unique institutional signal link. Every asset discovery and purchase triggered through this link is cryptographically tied to your dashboard.
                 </p>
                 
                 <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 p-5 bg-black/40 border border-white/10 rounded-2xl text-emerald-500 font-mono text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                       {referralLink}
                    </div>
                    {affiliateCode ? (
                      <button 
                        onClick={copyLink}
                        className="px-8 py-5 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl"
                      >
                         {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                         {copied ? "Signals Duplicated" : "Duplicate Signal"}
                      </button>
                    ) : (
                      <button 
                        onClick={generateCode}
                        disabled={loading}
                        className="px-8 py-5 bg-emerald-500 text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50"
                      >
                         {loading ? <Activity className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                         Establish ID Profile
                      </button>
                    )}
                 </div>
              </div>

              <div className="pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Commission Hierarchy</h3>
                    <div className="space-y-3">
                       <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-500">
                          <span>Standard Algorithms & Signals</span>
                          <span className="text-emerald-500">{commissionRate}% CPA Share</span>
                       </div>
                       <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 shadow-[0_0_10px_var(--color8)] transition-all duration-1000" 
                            style={{ width: `${commissionRate}%` }}
                          />
                       </div>
                       <div className="text-[9px] text-gray-500 leading-relaxed font-bold uppercase tracking-wider">
                         By default, your account starts at 10.00% CPA commission. Custom higher percentages are dynamically assigned from the central admin desk based on broker referral volumes.
                       </div>
                    </div>
                 </div>
                 <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-3xl">
                    <h3 className="text-sm font-black text-emerald-500 uppercase tracking-widest italic mb-2">Automated Payouts</h3>
                    <p className="text-[10px] text-gray-500 font-bold leading-relaxed uppercase tracking-widest transition-all">
                       Commissions are audited every 48 hours. Withdrawal requests are processed instantly through your established settlement signal.
                    </p>
                 </div>
              </div>
           </motion.div>

            {/* Performance Board */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-10 bg-[var(--color50)] border border-white/5 rounded-[3rem] flex flex-col"
            >
               <h2 className="text-xl font-black text-white uppercase italic tracking-tighter mb-8 flex items-center gap-3">
                 <TrendingUp className="w-5 h-5 text-emerald-500" />
                 Network Feed
               </h2>
               
               <div className="space-y-6 flex-1">
                  {referredClients.slice(0, 4).map((client) => {
                     const status = client.stage === 'CONVERTED' ? 'VERIFIED' : 'PENDING';
                     const time = new Date(client.created_at).toLocaleDateString();
                     return (
                       <div key={client.id} className="flex items-start gap-4 pb-6 border-b border-white/5 last:border-0 animate-in fade-in duration-300">
                          <div className={`w-2 h-2 rounded-full mt-2 ${status === 'VERIFIED' ? 'bg-emerald-500 shadow-[0_0_8px_var(--color8)]' : 'bg-gray-700'}`} />
                          <div className="flex-1">
                             <div className="flex justify-between items-center mb-1">
                                <span className="text-[11px] font-bold text-white uppercase tracking-widest truncate max-w-[120px]" title={client.email}>
                                   {client.full_name || client.email.split('@')[0]}
                                </span>
                                <span className="text-[9px] font-mono text-gray-600">{time}</span>
                             </div>
                             <div className="flex justify-between items-center">
                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{client.crm_metadata?.location || 'Global'}</span>
                                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${status === 'VERIFIED' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-white/5 text-gray-600'}`}>{status}</span>
                             </div>
                          </div>
                       </div>
                     );
                  })}
                  {referredClients.length === 0 && (
                     <div className="text-center py-20 text-[10px] font-black uppercase text-gray-600 tracking-wider italic">
                        No recent activity
                     </div>
                  )}
               </div>

               <button className="w-full py-4 mt-8 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-white transition-all">
                  View Historical Logs
               </button>
            </motion.div>
         </div>

         {/* Referred Clients Directory Table */}
         <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 p-10 bg-[var(--color50)] border border-white/5 rounded-[3rem] overflow-hidden"
         >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
               <div>
                  <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Referred Network Directory</h2>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Real-time attribution & geographic intelligence</p>
               </div>
               <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{referredClients.length} Connections</span>
               </div>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-left border-separate border-spacing-y-2.5">
                  <thead>
                     <tr className="text-[9px] text-gray-500 uppercase font-black tracking-[0.2em] border-b border-white/5">
                        <th className="px-6 py-4">Client Email</th>
                        <th className="px-6 py-4">Full Name</th>
                        <th className="px-6 py-4">Geographic Origin</th>
                        <th className="px-6 py-4">Registration Date</th>
                     </tr>
                  </thead>
                  <tbody className="text-xs">
                     {referredClients.map((client) => {
                        const location = client.crm_metadata?.location || "Global";
                        return (
                           <tr key={client.id} className="bg-white/5 hover:bg-emerald-500/5 transition-all">
                              <td className="px-6 py-5 first:rounded-l-[20px] border-y border-l border-white/5 font-mono text-emerald-400">
                                 {client.email}
                              </td>
                              <td className="px-6 py-5 border-y border-white/5 font-black uppercase text-white tracking-wide">
                                 {client.full_name || "PROSPECTIVE CLIENT"}
                              </td>
                              <td className="px-6 py-5 border-y border-white/5">
                                 <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest text-zinc-300">
                                    {location}
                                  </span>
                              </td>
                              <td className="px-6 py-5 last:rounded-r-[20px] border-y border-r border-white/5 text-gray-500 font-mono">
                                 {new Date(client.created_at).toLocaleString()}
                              </td>
                           </tr>
                        );
                     })}
                     {referredClients.length === 0 && (
                        <tr>
                           <td colSpan={4} className="text-center py-20 bg-black/20 rounded-[20px] border border-dashed border-white/5 uppercase font-black text-gray-700 text-[10px] tracking-widest italic">
                              Awaiting first network connection registration.
                           </td>
                        </tr>
                      )}
                  </tbody>
               </table>
            </div>
         </motion.div>
      </div>
      </div>
    </DashboardLayout>
  );
};
