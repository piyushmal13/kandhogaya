import { useState, useEffect } from "react";
import { 
  CheckCircle2, XCircle, Clock, 
  ShieldCheck, User, RefreshCw, Eye,
  ExternalLink, Phone, DollarSign, Package
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { cn } from "../../utils/cn";
import { tracker } from "@/core/tracker";

export const FulfillmentManager = () => {
  const [receipts, setReceipts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchPendingReceipts = async () => {
    setLoading(true);
    try {
      // DISCOVERY: Pending receipts joined with user and product metadata
      const { data, error } = await supabase
        .from('manual_payment_receipts')
        .select(`
          *,
          users(id, email, full_name),
          products(id, name)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReceipts(data || []);
    } catch (err) {
      console.error("Institutional Revenue Discovery Failure:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingReceipts();
  }, []);

  const approveFulfillment = async (receipt: any) => {
    if (!receipt?.id || !receipt?.user_id) return;
    
    setProcessingId(receipt.id);
    try {
      // 1. ORCHESTRATION: Determine fulfillment path (Tier vs Specific Product)
      const isTier = ['a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2'].includes(receipt.product_id);

      if (isTier) {
        // TIER FULFILLMENT: Release Global Entitlements
        const features = receipt.product_id === 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2' 
          ? ['signals', 'algo', 'webinars'] 
          : ['signals'];

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

        const entitlementInserts = features.map(f => ({
          user_id: receipt.user_id,
          feature: f,
          active: true,
          expires_at: expiresAt.toISOString()
        }));

        const { error: entError } = await supabase
          .from('user_entitlements')
          .insert(entitlementInserts);

        if (entError) throw entError;
      } else {
        // PRODUCT FULFILLMENT: Legacy bot license flow
        let { data: bot } = await supabase
          .from('algo_bots')
          .select('id')
          .eq('product_id', receipt.product_id)
          .maybeSingle();

        if (!bot) {
          const { data: newBot, error: botError } = await supabase
            .from('algo_bots')
            .insert({
              product_id: receipt.product_id,
              name: receipt.products?.name || 'Institutional Bot',
              version: 'v1.0'
            })
            .select()
            .single();
          
          if (botError) throw botError;
          bot = newBot;
        }

        const key = `IFX-${Math.random().toString(36).toUpperCase().substring(2, 6)}-${Math.random().toString(36).toUpperCase().substring(2, 6)}`;
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

        const { error: licError } = await supabase
          .from('bot_licenses')
          .insert({
            user_id: receipt.user_id,
            algo_id: bot.id,
            license_key: key,
            is_active: true,
            expires_at: expiresAt.toISOString()
          });

        if (licError) throw licError;
      }

      // 2. ORCHESTRATION: Finalize Revenue Status
      const { error: updError } = await supabase
        .from('manual_payment_receipts')
        .update({ status: 'approved' })
        .eq('id', receipt.id);

      if (updError) throw updError;

      // 3. ORCHESTRATION: Track Performance Discovery
      await tracker.track("payment_fulfilled", { 
        receipt_id: receipt.id, 
        user_id: receipt.user_id,
        product_id: receipt.product_id 
      });
      
      // Local Sync: Zero Latency Refresh
      setReceipts(prev => prev.filter(r => r.id !== receipt.id));
      console.log(`[REVENUE] Entitlement Released: ${receipt.user_id}`);
    } catch (err) {
      console.error("Institutional Fulfillment Execution Failure:", err);
    } finally {
      setProcessingId(null);
    }
  };

  const rejectFulfillment = async (id: string) => {
    const reason = globalThis.prompt("Institutional Rejection Reason Required:");
    if (!reason) return;

    setProcessingId(id);
    try {
      const { error } = await supabase
        .from('manual_payment_receipts')
        .update({ 
          status: 'rejected',
          rejection_reason: reason 
        })
        .eq('id', id);

      if (error) throw error;
      setReceipts(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error("Institutional Rejection Failed:", err);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Fulfillment Terminal</h2>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2">Active manual payment verification and entitlement release</p>
        </div>
        <button onClick={fetchPendingReceipts} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group">
           <RefreshCw className={cn("w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors", loading && "animate-spin")} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {receipts.length === 0 ? (
          <div className="bg-black/40 border border-white/5 p-20 rounded-[48px] text-center flex flex-col items-center">
             <CheckCircle2 className="w-16 h-16 text-gray-800 mb-6" />
             <div className="text-xl font-black text-gray-600 uppercase italic">Revenue Pipeline Clear</div>
             <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.3em] mt-3 italic">All manual receipts have been audited.</p>
          </div>
        ) : (
          receipts.map((receipt) => (
            <div key={receipt.id} className="group bg-[var(--raised)] border border-white/10 p-10 rounded-[48px] shadow-2xl relative overflow-hidden transition-all hover:border-emerald-500/30">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                <DollarSign className="w-32 h-32 text-white" />
              </div>

              <div className="flex flex-col xl:flex-row items-center gap-10 relative z-10">
                <div className="w-20 h-20 bg-amber-500/10 rounded-[28px] flex items-center justify-center text-amber-500 ring-1 ring-amber-500/20 group-hover:bg-amber-500 group-hover:text-black transition-all">
                   <Clock className="w-10 h-10" />
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">{receipt.users?.full_name || "Institutional Client"}</h3>
                    <span className="px-3 py-1 bg-amber-500/[0.08] border border-amber-500/20 rounded-full text-[9px] font-black text-amber-500 uppercase tracking-widest italic animate-pulse">Verification Required</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-6 mt-4">
                     <span className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest transition-colors group-hover:text-white"><User className="w-3.5 h-3.5 text-emerald-500" /> {receipt.users?.email}</span>
                     <span className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest transition-colors group-hover:text-white"><Phone className="w-3.5 h-3.5 text-emerald-500" /> {receipt.whatsapp_number}</span>
                     <span className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest transition-colors group-hover:text-white"><Package className="w-3.5 h-3.5 text-emerald-500" /> {receipt.products?.name}</span>
                     <span className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest"><DollarSign className="w-3.5 h-3.5" /> ${receipt.amount}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full xl:w-auto">
                   <button 
                    onClick={() => {
                        const { data } = supabase.storage.from('receipts').getPublicUrl(receipt.storage_path);
                        if (data?.publicUrl) globalThis.open(data.publicUrl, '_blank');
                    }}
                    className="flex-1 xl:flex-none p-5 bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-white/10 flex items-center justify-center gap-3 transition-all"
                   >
                      <Eye className="w-4 h-4" />
                      Auditing Artifact
                      <ExternalLink className="w-3 h-3 text-gray-500" />
                   </button>
                   <button 
                     onClick={() => approveFulfillment(receipt)}
                     disabled={processingId === receipt.id}
                     className="flex-1 xl:flex-none p-5 bg-emerald-500 text-black font-black text-[10px] uppercase tracking-widest rounded-2xl hover:scale-105 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-emerald-500/20"
                   >
                     {processingId === receipt.id ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          Release Assets
                          <ShieldCheck className="w-4 h-4" />
                        </>
                      )}
                   </button>
                   <button 
                    onClick={() => rejectFulfillment(receipt.id)}
                    className="w-14 h-14 bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-xl"
                   >
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
