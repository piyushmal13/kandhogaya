import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  CheckCircle, 
  XCircle, 
  Hourglass, 
  ExternalLink,
  ShieldAlert
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useAuth } from "@/contexts/AuthContext";

interface PaymentProof {
  id: string;
  user_id: string;
  plan: string;
  amount: number;
  screenshot_url: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export const PaymentManager = () => {
  const { userProfile } = useAuth();
  const [proofs, setProofs] = useState<PaymentProof[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [actioningId, setActioningId] = useState<string | null>(null);

  const fetchProofs = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("payment_proofs")
        .select("*")
        .order("created_at", { ascending: false });

      if (filter !== "all") {
        query = query.eq("status", filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setProofs(data || []);
    } catch (err) {
      console.error("Institutional Payment Discovery Signal: Failed to retrieve proofs.", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProofs();
  }, [filter]);

  const handleAction = async (id: string, status: "approved" | "rejected") => {
    if (userProfile?.role !== "admin") {
      console.error("Institutional Security Signal: Unauthorized command attempt.");
      return;
    }

    setActioningId(id);
    try {
      const { error } = await supabase
        .from("payment_proofs")
        .update({ status })
        .eq("id", id);
      
      if (error) throw error;
      
      // Real-time local state update for zero-latency execution
      setProofs(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error("Institutional Command Signal: Failed to update proof status.", err);
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Discovery Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-emerald-500" />
            Payment Fulfillment Console
          </h1>
          <p className="text-sm text-gray-500 mt-2">Verify high-fidelity payment proofs and fulfill subscription entitlements.</p>
        </div>

        <div className="flex items-center gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
          {["all", "pending", "approved", "rejected"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                filter === f ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20" : "text-gray-500 hover:text-white"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {(() => {
        if (loading) {
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-white/5 rounded-[32px] animate-pulse border border-white/5" />
              ))}
            </div>
          );
        }

        if (proofs.length > 0) {
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {proofs.map((proof) => {
                const getStatusStyles = () => {
                  switch (proof.status) {
                    case 'pending': return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
                    case 'approved': return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
                    case 'rejected': return "bg-red-500/10 text-red-500 border-red-500/20";
                    default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
                  }
                };

                return (
                  <div key={proof.id} className="group relative p-8 rounded-[36px] bg-white/5 border border-white/10 hover:border-white/20 transition-all backdrop-blur-xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <div className="text-[10px] font-mono text-gray-500 mb-1 uppercase tracking-tighter">PLAN FULFILLMENT</div>
                          <div className="text-xl font-black text-white uppercase tracking-tight">{proof.plan}</div>
                        </div>
                        <div className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border",
                          getStatusStyles()
                        )}>
                          {proof.status}
                        </div>
                      </div>

                      <div className="space-y-4 mb-8">
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                          <span className="text-xs text-gray-500">Amount Signal</span>
                          <span className="text-sm font-bold text-white tracking-widest">${proof.amount}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                          <span className="text-xs text-gray-500">Identity Signal</span>
                          <span className="text-[10px] font-mono text-gray-400 group-hover:text-emerald-500 transition-colors uppercase">{proof.user_id.split('-')[0]}...</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-xs text-gray-500">Arrival Signal</span>
                          <span className="text-xs text-gray-400 uppercase tracking-tighter">
                            {new Date(proof.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <a 
                        href={proof.screenshot_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-white/10 transition-all uppercase tracking-widest group/btn"
                      >
                        <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                        View Asset Discovery
                      </a>

                      {proof.status === 'pending' && (
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => handleAction(proof.id, 'approved')}
                            disabled={actioningId === proof.id}
                            className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-emerald-500 text-black text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(proof.id, 'rejected')}
                            disabled={actioningId === proof.id}
                            className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-black uppercase tracking-widest hover:bg-red-500/20 active:scale-95 transition-all disabled:opacity-50"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        }

        return (
          <div className="text-center py-32 border-2 border-dashed border-white/5 rounded-[48px]">
            <Hourglass className="w-16 h-16 text-gray-800 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-gray-500 tracking-tight">Zero Pending Proof Signals</h3>
            <p className="text-sm text-gray-600 mt-2 max-w-xs mx-auto">Arrival queue is empty. All institutional payment flows are fully synchronized.</p>
          </div>
        );
      })()}

    </div>
  );
};
