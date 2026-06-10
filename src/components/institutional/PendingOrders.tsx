import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Package, Clock, CheckCircle2, ShieldAlert } from "lucide-react";
import { cn } from "@/utils/cn";

export const PendingOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from("manual_payment_receipts")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (err) {
        console.error("Failed to fetch pending orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();

    const channel = supabase
      .channel('public:manual_payment_receipts')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'manual_payment_receipts', 
        filter: `user_id=eq.${user.id}` 
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setOrders(prev => [payload.new, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setOrders(prev => prev.map(o => o.id === payload.new.id ? payload.new : o));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (loading) {
    return <div className="h-40 bg-white/5 animate-pulse rounded-3xl border border-white/5" />;
  }

  if (orders.length === 0) {
    return null; // Don't show the widget if there are no orders
  }

  return (
    <div className="bg-[#040608]/80 backdrop-blur-xl rounded-[2rem] border border-white/10 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-blue-500/20" />
      
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-tight uppercase">Acquisition Queue</h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Real-time status of your institutional asset purchases</p>
          </div>
        </div>

        <div className="space-y-4">
          {orders.map((order) => {
            const isApproved = order.status === 'approved';
            const isRejected = order.status === 'rejected';
            const items = order.metadata?.items || [];
            
            return (
              <div key={order.id} className="p-5 bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-2xl transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center border",
                      isApproved ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" :
                      isRejected ? "bg-red-500/10 border-red-500/20 text-red-500" :
                      "bg-yellow-500/10 border-yellow-500/20 text-yellow-500"
                    )}>
                      {isApproved ? <CheckCircle2 className="w-5 h-5" /> :
                       isRejected ? <ShieldAlert className="w-5 h-5" /> :
                       <Clock className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="text-white font-bold tracking-tight">
                        {items.length > 0 ? items.map((i: any) => i.name).join(', ') : (order.metadata?.plan_name || 'Asset Purchase')}
                      </div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-widest font-mono mt-1">
                        {new Date(order.created_at).toLocaleDateString()} • ${order.amount}
                      </div>
                    </div>
                  </div>
                  
                  <div className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-center",
                    isApproved ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                    isRejected ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                    "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 animate-pulse"
                  )}>
                    {isApproved ? "Fulfillment Complete" :
                     isRejected ? "Audit Failed" :
                     "Audit In Progress"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
