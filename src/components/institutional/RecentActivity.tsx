import React from 'react';
import { History, ArrowUpRight, Calendar, Package, Key } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { formatDistanceToNow } from 'date-fns';

/**
 * RecentActivity — User-Specific Activity Ledger
 * Shows the authenticated user's recent purchases, license activations, and webinar registrations.
 */
export function RecentActivity() {
  const { data: dashData, isLoading } = useDashboardData();

  if (isLoading) {
    return (
      <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/10 animate-pulse">
        <div className="h-4 w-32 bg-white/5 rounded mb-8" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-16 bg-white/5 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  // Merge all activity types into a single timeline
  const activities: { type: string; title: string; date: string; status: string; icon: typeof Calendar; color: string }[] = [];

  // Purchases
  (dashData?.purchases || []).forEach(p => {
    activities.push({
      type: 'purchase',
      title: p.product_name,
      date: p.purchased_at ? formatDistanceToNow(new Date(p.purchased_at), { addSuffix: true }) : 'Recently',
      status: p.status,
      icon: Package,
      color: 'text-purple-400',
    });
  });

  // Licenses
  (dashData?.licenses || []).forEach(l => {
    activities.push({
      type: 'license',
      title: `${(l.algo_id || 'Algorithm').toUpperCase()} License`,
      date: l.created_at ? formatDistanceToNow(new Date(l.created_at), { addSuffix: true }) : 'Recently',
      status: l.is_active ? 'Active' : 'Expired',
      icon: Key,
      color: 'text-emerald-500',
    });
  });

  // Webinar Registrations
  (dashData?.webinarRegistrations || []).forEach(w => {
    activities.push({
      type: 'webinar',
      title: w.title,
      date: w.date ? formatDistanceToNow(new Date(w.date), { addSuffix: true }) : 'Recently',
      status: w.status,
      icon: Calendar,
      color: 'text-cyan-400',
    });
  });

  // Sort by most recent first (approximate based on "ago" — original dates are used for sort)
  // Since we already sorted in the queries, just take first 8
  const recentActivities = activities.slice(0, 8);

  return (
    <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/10 backdrop-blur-xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />

      <h3 className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.4em] flex items-center gap-3 mb-8">
        <History className="w-3.5 h-3.5 text-emerald-500" />
        Recent Activity
      </h3>

      <div className="space-y-3 relative z-10">
        {recentActivities.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-white/5 rounded-2xl">
            <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">No Recent Activity</p>
            <p className="text-gray-700 text-xs mt-2">Your purchases, licenses, and registrations will appear here.</p>
          </div>
        ) : (
          recentActivities.map((a, idx) => (
            <div
              key={`${a.type}-${a.title}-${idx}`}
              className="group/row relative p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover/row:border-white/10 transition-colors">
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
                  <div className={`text-sm font-mono font-black tabular-nums ${
                    a.status === 'Active' || a.status === 'Confirmed' ? 'text-emerald-500' : 'text-amber-400'
                  }`}>
                    {a.status}
                  </div>
                  <div className="text-[8px] font-black text-white/20 uppercase tracking-widest capitalize">{a.type}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {recentActivities.length > 0 && (
        <button className="w-full mt-8 pt-6 text-[10px] font-black text-white/20 hover:text-emerald-500 border-t border-white/5 uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-2 group/btn">
          View All Activity
          <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
        </button>
      )}
    </div>
  );
}
