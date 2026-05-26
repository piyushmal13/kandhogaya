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
  LayoutDashboard
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { PageMeta } from "../components/site/PageMeta";
import { DashboardLayout } from "@/components/institutional/DashboardLayout";

export const AffiliateHub = () => {
  const { userProfile } = useAuth();
  const { success, error: toastError } = useToast();
  const [affiliateCode, setAffiliateCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [referredClients, setReferredClients] = useState<any[]>([]);
  const [stats, setStats] = useState({
    clicks: 124, // Mock if newly created
    registrations: 12,
    commissions: 450,
    pendingPayouts: 150
  });

  useEffect(() => {
    if (userProfile?.id) {
       fetchAffiliateData();
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
        setStats({
          clicks: data.total_clicks || 0,
          registrations: data.total_registrations || 0,
          commissions: 0, // Calculated from commissions table
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
        
        // Fetch commissions (Mocking for now as we transition to SQL commissions)
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono tracking-widest mb-4 uppercase">
                <LayoutDashboard className="w-3 h-3" />
                Growth Protocol Active
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
