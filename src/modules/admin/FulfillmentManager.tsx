import React, { useState, useEffect } from "react";
import { 
  CheckCircle2, XCircle, Clock, 
  ShieldCheck, User, RefreshCw, Eye
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { cn } from "../../utils/cn";
import { tracker } from "@/core/tracker";

export const FulfillmentManager = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchPendingFulfillments = async () => {
    setLoading(true);
    try {
      // Discovery: Leads at 'payment_pending' stage
      const { data, error } = await supabase
        .from('sales_pipeline')
        .select(`
          *,
          users(id, email, full_name, user_metadata)
        `)
        .eq('stage', 'payment_pending')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (err) {
      console.error("Institutional Fulfillment Discovery Failure:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingFulfillments();
  }, []);

  const approveFulfillment = async (lead: any) => {
    setProcessingId(lead.user_id);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      // 1. Orchestration: Register Revenue
      const { error: revError } = await supabase
        .from('sales_tracking')
        .insert([{
          user_id: lead.user_id,
          sale_amount: 125, // Logic for tier-based pricing discovery
          currency: 'USD',
          status: 'success'
        }]);
      
      if (revError) throw revError;

      // 2. Orchestration: Generate License (Institutional API Flow)
      const res = await fetch("/api/admin/licenses", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ 
          user_id: lead.user_id, 
          algo_id: 'institutional_v2', // Automated selection
          duration_days: 30 
        })
      });

      if (!res.ok) throw new Error("License orchestration failed");

      // 3. Orchestration: Pipeline Finalization
      await tracker.track("payment_fulfilled", { user_id: lead.user_id });
      
      // Local Refresh
      setLeads(prev => prev.filter(l => l.user_id !== lead.user_id));
      console.log(`[Fulfillment] User Entitlement Released: ${lead.user_id}`);
    } catch (err) {
      console.error("Institutional Fulfillment Execution Failure:", err);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Fulfillment Terminal</h2>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2">Active payment verification and entitlement release</p>
        </div>
        <button onClick={fetchPendingFulfillments} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
           <RefreshCw className={cn("w-5 h-5 text-gray-400", loading && "animate-spin")} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {leads.length === 0 ? (
          <div className="bg-black/40 border border-white/5 p-20 rounded-[48px] text-center flex flex-col items-center">
             <CheckCircle2 className="w-16 h-16 text-gray-800 mb-6" />
             <div className="text-xl font-black text-gray-600 uppercase italic">Pipeline Clear</div>
             <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.3em] mt-3">All institutional entitlements has been fulfilled</p>
          </div>
        ) : (
          leads.map((lead) => (
            <div key={lead.user_id} className="group bg-zinc-900 border border-white/10 p-10 rounded-[48px] shadow-2xl relative overflow-hidden transition-all hover:border-emerald-500/30">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                <Clock className="w-32 h-32 text-white" />
              </div>

              <div className="flex flex-col lg:flex-row items-center gap-10 relative z-10">
                <div className="w-20 h-20 bg-amber-500/10 rounded-[28px] flex items-center justify-center text-amber-500 ring-1 ring-amber-500/20 group-hover:bg-amber-500 group-hover:text-black transition-all">
                   <Clock className="w-10 h-10" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">{lead.users?.full_name || "Traders Entry"}</h3>
                    <span className="px-3 py-1 bg-amber-500/[0.08] border border-amber-500/20 rounded-full text-[9px] font-black text-amber-500 uppercase tracking-widest italic">Verification Pending</span>
                  </div>
                  <div className="flex items-center gap-6 mt-4">
                     <span className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest"><User className="w-3.5 h-3.5" /> {lead.users?.email}</span>
                     <span className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest"><Clock className="w-3.5 h-3.5" /> SECONDS AGO</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full lg:w-auto">
                   <button className="flex-1 lg:flex-none p-5 bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-white/10 flex items-center justify-center gap-3">
                      <Eye className="w-4 h-4" />
                      Auditing Receipt
                   </button>
                   <button 
                     onClick={() => approveFulfillment(lead)}
                     disabled={processingId === lead.user_id}
                     className="flex-1 lg:flex-none p-5 bg-emerald-500 text-black font-black text-[10px] uppercase tracking-widest rounded-2xl hover:scale-105 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                   >
                     {processingId === lead.user_id ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          Release Entitlement
                          <ShieldCheck className="w-4 h-4" />
                        </>
                      )}
                   </button>
                   <button className="w-14 h-14 bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center rounded-2xl hover:bg-red-500 hover:text-white transition-all">
                      <XCircle className="w-6 h-6" />
                   </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
