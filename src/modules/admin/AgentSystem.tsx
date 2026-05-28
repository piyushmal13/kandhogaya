import React, { useState, useEffect } from "react";
import { 
  Trophy, TrendingUp, Wallet, 
  User, RefreshCw, Search, Settings
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { cn } from "../../utils/cn";
import { useToast } from "../../contexts/ToastContext";

/**
 * Institutional Affiliate Management Terminal
 * Allows administrators to monitor partner performance, audit commissions,
 * manage commission rates, and update global dynamic tier configurations.
 */
export const AgentSystem = () => {
  const { success, error: toastError } = useToast();
  const [affiliates, setAffiliates] = useState<any[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Global Dynamic Tier Settings
  const [globalSettings, setGlobalSettings] = useState({
    default_rate: 10,
    threshold: 4,
    escalated_rate: 20
  });

  const fetchAffiliateData = async () => {
    setLoading(true);
    try {
      // 1. DISCOVERY: Get performance codes
      const { data: codes, error: codeError } = await supabase
        .from('affiliate_codes')
        .select(`
          *,
          users!inner(full_name, email)
        `);

      if (codeError) throw codeError;

      // 2. DISCOVERY: Get pending and paid commissions
      const { data: comms, error: commError } = await supabase
        .from('commissions')
        .select(`
          *,
          leads(email),
          users:agent_id(full_name, email)
        `);

      if (commError) throw commError;

      // Enhance comms with referral codes from the codes we already fetched
      const enhancedComms = (comms || []).map(comm => ({
        ...comm,
        agent_code: codes?.find(c => c.user_id === comm.agent_id)?.code || 'Direct'
      }));

      // 3. Fetch Global Settings from Feature Flags
      const { data: flag } = await supabase
        .from('feature_flags')
        .select('value')
        .eq('key', 'affiliate_settings')
        .maybeSingle();

      if (flag?.value) {
        const val = flag.value as any;
        setGlobalSettings({
          default_rate: Number(val.default_rate) || 10,
          threshold: Number(val.threshold) || 4,
          escalated_rate: Number(val.escalated_rate) || 20
        });
      }

      setAffiliates(codes || []);
      setCommissions(enhancedComms);
    } catch (err: any) {
      console.error("Affiliate Audit Discovery Failure:", err);
      toastError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAffiliateData();
  }, []);

  const approvePayout = async (commissionId: string) => {
    try {
      const { error } = await supabase
        .from('commissions')
        .update({ status: 'PAID' })
        .eq('id', commissionId);

      if (error) throw error;
      success("Settlement Signal Authorized.");
      fetchAffiliateData();
    } catch (err: any) {
      toastError(err.message);
    }
  };

  const updateCommissionRate = async (affiliateId: string, rate: number) => {
    try {
      const { error } = await supabase
        .from('affiliate_codes')
        .update({ commission_rate: rate })
        .eq('id', affiliateId);

      if (error) throw error;
      success(`Authorized commission rate updated to ${rate}%.`);
      fetchAffiliateData();
    } catch (err: any) {
      toastError(err.message);
    }
  };

  const saveGlobalSettings = async () => {
    try {
      // Fetch key first to see if it exists
      const { data: existingFlag } = await supabase
        .from('feature_flags')
        .select('id')
        .eq('key', 'affiliate_settings')
        .maybeSingle();

      if (existingFlag) {
        const { error } = await supabase
          .from('feature_flags')
          .update({
            value: globalSettings,
            enabled: true
          })
          .eq('key', 'affiliate_settings');
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('feature_flags')
          .insert({
            key: 'affiliate_settings',
            value: globalSettings,
            enabled: true
          });
        if (error) throw error;
      }
      
      success("Global Affiliate escalation settings updated!");
    } catch (err: any) {
      toastError(err.message);
    }
  };

  const filteredAffiliates = affiliates.filter(a => 
    a.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.users?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      
      {/* 1. Header & Global Analytics */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
           <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Affiliate <span className="text-emerald-500">Fleet</span></h2>
           <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mt-2 italic">Institutional Lead Generation & Attribution Hub</p>
        </div>

        <div className="flex items-center gap-4">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-hover:text-emerald-500 transition-colors" />
              <input 
                type="text"
                placeholder="DISCOVER PARTNER..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-zinc-900 border border-white/10 rounded-2xl py-4 pl-12 pr-8 text-[10px] font-black tracking-widest text-white focus:border-emerald-500 transition-all w-64 uppercase"
              />
           </div>
           <button onClick={fetchAffiliateData} className="p-4 bg-zinc-900 border border-white/10 rounded-2xl hover:border-emerald-500 transition-all">
              <RefreshCw className={cn("w-5 h-5 text-gray-500", loading && "animate-spin")} />
           </button>
        </div>
      </div>

      {/* 2. Global Tier Parameters Management */}
      <div className="p-8 bg-zinc-900 border border-white/5 rounded-[40px] space-y-6 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
            <Settings size={120} className="text-emerald-500" />
         </div>
         <div className="flex items-center gap-3 relative z-10">
            <Settings className="w-5 h-5 text-emerald-500" />
            <h3 className="text-xs font-black text-white uppercase tracking-widest italic">Global Affiliate Dynamic Tier Rules</h3>
         </div>
         <p className="text-xs text-white/40 max-w-2xl leading-relaxed">
            Configure default and escalated settings below. When an affiliate generates sales above the threshold, their commission rate will automatically escalate to the bonus rate.
         </p>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            <div className="space-y-2">
               <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block">Default Base Rate (%)</label>
               <input 
                 type="number"
                 value={globalSettings.default_rate}
                 onChange={(e) => setGlobalSettings({...globalSettings, default_rate: Number(e.target.value)})}
                 className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-xs font-mono text-white outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/40"
               />
            </div>
            <div className="space-y-2">
               <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block">Escalation Threshold (Sales)</label>
               <input 
                 type="number"
                 value={globalSettings.threshold}
                 onChange={(e) => setGlobalSettings({...globalSettings, threshold: Number(e.target.value)})}
                 className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-xs font-mono text-white outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/40"
               />
            </div>
            <div className="space-y-2">
               <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block">Escalated Bonus Rate (%)</label>
               <input 
                 type="number"
                 value={globalSettings.escalated_rate}
                 onChange={(e) => setGlobalSettings({...globalSettings, escalated_rate: Number(e.target.value)})}
                 className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-xs font-mono text-white outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/40"
               />
            </div>
         </div>
         <button 
           onClick={saveGlobalSettings}
           className="px-6 py-3.5 bg-emerald-500 text-black text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
         >
            Save Parameter Matrix
         </button>
      </div>

      {/* 3. Top Performers Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest italic flex items-center gap-3">
               <Trophy className="w-4 h-4 text-amber-500" />
               Partner Network Performance
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {filteredAffiliates.map((aff) => (
                 <div key={aff.id} className="p-8 bg-zinc-900 border border-white/5 rounded-[40px] hover:border-white/10 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                       <TrendingUp className="w-20 h-20 text-emerald-500" />
                    </div>
                    
                    <div className="flex items-center gap-4 mb-6">
                       <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                          <User className="w-6 h-6 text-gray-400" />
                       </div>
                       <div>
                          <div className="text-[11px] font-black text-white uppercase tracking-wider">{aff.users?.full_name || 'Partner'}</div>
                          <div className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mt-0.5">{aff.code}</div>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/5">
                       <div>
                          <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-1">Total Clicks</span>
                          <span className="text-2xl font-black text-white italic">{aff.total_clicks || 0}</span>
                       </div>
                       <div>
                          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest block mb-1">Registrations</span>
                          <span className="text-2xl font-black text-emerald-500 italic">{aff.total_registrations || 0}</span>
                       </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-white/5">
                       <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-3">Commission Rate Setting</span>
                       <div className="grid grid-cols-4 gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/5">
                          {[10, 20, 30, 40].map((rate) => (
                             <button
                                key={rate}
                                onClick={() => updateCommissionRate(aff.id, rate)}
                                className={cn(
                                   "py-2.5 rounded-xl text-[10px] font-black transition-all",
                                   Number(aff.commission_rate || 10) === rate
                                      ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                                      : "text-gray-400 hover:text-white hover:bg-white/5"
                                )}
                             >
                                {rate}%
                             </button>
                          ))}
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* 4. Settlement Audit queue */}
         <div className="bg-[var(--raised)] border border-white/5 rounded-[48px] p-10 flex flex-col">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest italic mb-8 flex items-center gap-3">
               <Wallet className="w-4 h-4 text-emerald-500" />
               Settlement Audit queue
            </h3>

            <div className="space-y-6 flex-1 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
               {commissions.length === 0 ? (
                 <div className="py-20 text-center opacity-30 italic text-[10px] font-black uppercase tracking-widest">
                    No Pending Settlements
                 </div>
               ) : (
                 commissions.map((comm) => (
                    <div key={comm.id} className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-4">
                       <div className="flex justify-between items-start">
                          <div>
                             <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] block mb-1">Affiliate</span>
                             <span className="text-[11px] font-black text-white uppercase tracking-wider">{comm.agent_code}</span>
                             <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest block mt-0.5">{comm.users?.email}</span>
                          </div>
                          <div className={cn(
                            "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                            comm.status === 'PAID' ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                          )}>
                             {comm.status}
                          </div>
                       </div>

                       <div className="flex justify-between items-end">
                          <div>
                             <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] block mb-1">Commission</span>
                             <span className="text-xl font-black text-emerald-500 italic">${comm.amount.toLocaleString()}</span>
                          </div>
                          {comm.status !== 'PAID' && (
                             <button 
                               onClick={() => approvePayout(comm.id)}
                               className="px-6 py-3 bg-emerald-500 text-black text-[9px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-lg shadow-emerald-500/10"
                             >
                                Finalize
                             </button>
                          )}
                       </div>
                    </div>
                 ))
               )}
            </div>

            <button className="w-full mt-10 py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:scale-105 transition-all shadow-2xl">
               Audit historical Payouts
            </button>
         </div>
      </div>
    </div>
  );
};
