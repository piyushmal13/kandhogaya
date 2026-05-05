import React, { useEffect, useState } from 'react';
import { History, ArrowUpRight, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

/**
 * RecentActivity (v2.0)
 * 
 * The Multi-Asset Ledger for the Sovereign Terminal.
 * Now connected to real-time Supabase telemetry.
 */
export function RecentActivity() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      if (!user) return;
      
      try {
        // Fetch webinar registrations as a proxy for activity
        const { data, error } = await supabase
          .from('webinar_registrations')
          .select(`
            id, created_at, payment_status,
            webinars ( title )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;

        const mapped = (data || []).map(reg => ({
          type: 'registration',
          title: (reg.webinars as any)?.title || 'Webinar Registration',
          date: formatDistanceToNow(new Date(reg.created_at), { addSuffix: true }),
          status: reg.payment_status === 'completed' ? 'Confirmed' : 'Pending',
          icon: Calendar,
          color: 'text-emerald-500'
        }));

        setActivities(mapped);
      } catch (err) {
        console.error("Activity fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [user]);

  if (loading) {
    return (
      <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/10 animate-pulse">
        <div className="h-4 w-32 bg-white/5 rounded mb-8" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-16 bg-white/5 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/10 backdrop-blur-xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />

      <h3 className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.4em] flex items-center gap-3 mb-8">
        <History className="w-3.5 h-3.5 text-emerald-500" />
        Operational Ledger
      </h3>

      <div className="space-y-3 relative z-10">
        {activities.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-white/5 rounded-2xl">
            <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">No Recent Telemetry</p>
          </div>
        ) : (
            <div 
              key={`${a.title}-${a.date}`} 
              className="group/row relative p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover/row:border-white/10 transition-colors`}>
                    <a.icon className={`w-5 h-5 ${a.color}`} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-black uppercase text-foreground leading-none">
                      {a.title}
                    </span>
                    <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">{a.date}</span>
                  </div>
                </div>
                <div className="text-right flex flex-col gap-0.5">
                  <div className="text-sm font-mono font-black text-emerald-500 tabular-nums">
                    {a.status}
                  </div>
                  <div className="text-[8px] font-black text-white/20 uppercase tracking-widest">System Record</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <button className="w-full mt-8 pt-6 text-[10px] font-black text-white/20 hover:text-emerald-500 border-t border-white/5 uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-2 group/btn">
        Full Audit Archive
        <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
      </button>
    </div>
  );
}
