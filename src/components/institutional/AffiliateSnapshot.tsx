import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, TrendingUp, DollarSign, ArrowRight } from 'lucide-react';
import { supabase, publicSupabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { revenueSystem } from '@/services/crm/revenueSystem';

export function AffiliateSnapshot() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalEarnings: 0, pendingPayouts: 0, link: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        // Fetch affiliate link
        const { data: codeData } = await publicSupabase
          .from('affiliate_codes')
          .select('code')
          .eq('user_id', user.id)
          .maybeSingle();

        const link = codeData?.code ? `${window.location.origin}?ref=${codeData.code}` : '';

        // Fetch earnings
        const earnings = await revenueSystem.getAgentEarnings(user.id);
        
        // Fetch pending commissions specifically
        const { data: pendingCommissions } = await publicSupabase
          .from('commissions')
          .select('amount')
          .eq('agent_id', user.id)
          .eq('status', 'PENDING');

        const pending = (pendingCommissions || []).reduce((acc, c) => acc + Number(c.amount), 0);

        setStats({
          totalEarnings: earnings.total,
          pendingPayouts: pending,
          link
        });
      } catch (err) {
        console.error("Failed to fetch affiliate stats", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (isLoading) {
    return <div className="h-48 rounded-[2.5rem] bg-white/[0.02] border border-white/5 animate-pulse" />;
  }

  // If no affiliate link, don't show the widget prominently, or suggest they join.
  if (!stats.link) {
    return (
      <div className="p-6 rounded-[2.5rem] bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-500/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:opacity-20 transition-all">
          <Users size={64} className="text-blue-500" />
        </div>
        <div className="relative z-10">
          <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
            <TrendingUp size={14} /> Partnership Program
          </h3>
          <p className="text-white text-lg font-bold tracking-tight mb-4">Become an IFX Partner</p>
          <p className="text-gray-500 text-xs mb-6 max-w-[80%] leading-relaxed">
            Invite your network to access institutional tools and earn automated commissions on their acquisitions.
          </p>
          <Link 
            to="/affiliate"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-black transition-all"
          >
            Join Program <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-all">
        <Users size={80} className="text-emerald-500" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] flex items-center gap-2">
            <Users size={14} /> Partner Snapshot
          </h3>
          <Link to="/affiliate" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-all">
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
            <div className="text-[9px] text-gray-500 uppercase tracking-widest font-black mb-1">Total Earned</div>
            <div className="text-xl font-bold text-white tabular-nums flex items-center gap-1">
              <DollarSign size={16} className="text-emerald-500" />
              {stats.totalEarnings.toFixed(2)}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
            <div className="text-[9px] text-gray-500 uppercase tracking-widest font-black mb-1">Pending</div>
            <div className="text-xl font-bold text-white tabular-nums flex items-center gap-1">
              <DollarSign size={16} className="text-amber-500" />
              {stats.pendingPayouts.toFixed(2)}
            </div>
          </div>
        </div>

        <div>
          <div className="text-[9px] text-gray-500 uppercase tracking-widest font-black mb-2">Your Invite Link</div>
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              readOnly 
              value={stats.link} 
              className="flex-1 bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-[10px] text-white/60 font-mono outline-none focus:border-emerald-500/30 transition-colors"
            />
            <button 
              onClick={() => navigator.clipboard.writeText(stats.link)}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 text-[10px] font-black uppercase tracking-widest transition-colors"
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
