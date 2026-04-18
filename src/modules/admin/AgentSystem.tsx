import React, { useState, useEffect } from "react";
import { 
  Trophy, TrendingUp, Wallet, 
  User, RefreshCw, Search
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { cn } from "../../utils/cn";
import { useToast } from "../../contexts/ToastContext";

/**
 * Institutional Affiliate Management Terminal
 * Allows administrators to monitor partner performance, audit commissions,
 * and finalize settlement signals with cryptographic certainty.
 */
export const AgentSystem = () => {
  const { success, error: toastError } = useToast();
  const [affiliates, setAffiliates] = useState<any[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

      {/* 2. Top Performers Matrix */}
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
                 </div>
               ))}
            </div>
         </div>

         {/* 3. Settlement Audit queue */}
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
