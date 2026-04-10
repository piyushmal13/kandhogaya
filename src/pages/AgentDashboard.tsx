import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
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
  LayoutDashboard
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { PageMeta } from "../components/site/PageMeta";

export const AgentDashboard = () => {
  const { userProfile, loading: authLoading } = useAuth();
  const { success, error: toastError } = useToast();
  const [affiliateCode, setAffiliateCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({
    clicks: 0,
    registrations: 0,
    commissions: 0,
    pendingPayouts: 0
  });

  // Strict institutional access control
  const isAgent = userProfile?.role === "agent" || userProfile?.role === "admin";

  useEffect(() => {
    if (userProfile?.id && isAgent) {
       fetchAffiliateData();
    }
  }, [userProfile, isAgent]);

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
        
        // Base stats from affiliate_codes
        let currentClicks = data.total_clicks || 0;
        let currentReg = data.total_registrations || 0;
        
        // Fetch commissions safely, fallback to 0 if agents record doesn't exist
        const { data: comms, error: commError } = await supabase
          .from("commissions")
          .select("amount, status")
          .filter("agent_id", "in", `(select id from agents where user_id = '${userProfile?.id}')`);
          
        let totalEarnings = 0;
        let pendingEarnings = 0;

        if (comms && !commError) {
           totalEarnings = comms.reduce((acc, c) => acc + (c.amount || 0), 0);
           pendingEarnings = comms.filter(c => c.status === 'PENDING').reduce((acc, c) => acc + (c.amount || 0), 0);
        }

        setStats({
          clicks: currentClicks,
          registrations: currentReg,
          commissions: totalEarnings,
          pendingPayouts: pendingEarnings
        });
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
      fetchAffiliateData();
    } catch (err: any) {
      toastError(err.message || "Failed to establish ID profile");
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
    success("Tracking URL Sequenced to Clipboard.");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!userProfile || !isAgent) {
    return <Navigate to="/dashboard" />;
  }

  const referralLink = affiliateCode ? `${globalThis.location.origin}?ref=${affiliateCode}` : "Establishing profile...";

  return (
    <div className="min-h-screen bg-[var(--color10)] pt-32 pb-24">
      <PageMeta 
        title="Agent Portal" 
        description="Monitor your institutional referral performance and manage your commissions."
        path="/agent"
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono tracking-widest mb-4 uppercase">
                <LayoutDashboard className="w-3 h-3" />
                Growth Protocol Active
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">
                Agent <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Terminal</span>
              </h1>
              <p className="text-gray-500 mt-4 max-w-xl text-sm font-bold uppercase tracking-widest leading-relaxed">
                Scaled revenue through institutional partnership. Manage your referral network and withdraw commissions with sub-second transparency.
              </p>
            </div>

            <div className="flex gap-4">
               <button onClick={fetchAffiliateData} className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                  <Activity className={loading ? "w-4 h-4 animate-spin" : "w-4 h-4"} />
                  Live Sync
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
             { label: "Total Clicks (Leads)", value: stats.clicks, icon: MousePointer2, color: "text-cyan-400", bg: "bg-cyan-500/10" },
             { label: "Registrations (Convs)", value: stats.registrations, icon: Users, color: "text-emerald-400", bg: "bg-emerald-500/10" },
             { label: "Total Earnings", value: `$${stats.commissions.toLocaleString()}`, icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10" },
             { label: "Pending Payout", value: `$${stats.pendingPayouts.toLocaleString()}`, icon: TrendingUp, color: "text-amber-400", bg: "bg-amber-500/10" }
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
                         {copied ? "Signals Duplicated" : "Duplicate Link"}
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
                          <span>Standard Algorithms</span>
                          <span className="text-emerald-500">20% Share</span>
                       </div>
                       <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                          <div className="w-[20%] h-full bg-emerald-500 shadow-[0_0_10px_var(--color8)]" />
                       </div>
                       <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-500">
                          <span>Enterprise Signals</span>
                          <span className="text-cyan-400">15% Share</span>
                       </div>
                       <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                          <div className="w-[15%] h-full bg-cyan-400 shadow-[0_0_10px_var(--color51)]" />
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
                 {/* Future Implementation: Stream LIVE tracking events here */}
                 <div className="text-center text-[10px] text-gray-600 uppercase tracking-widest font-black py-20 italic">
                    Acquiring Signal Stream...
                 </div>
              </div>

              <button className="w-full py-4 mt-8 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-white transition-all">
                 View Historical Logs
              </button>
           </motion.div>
        </div>
      </div>
    </div>
  );
};
