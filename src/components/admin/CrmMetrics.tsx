import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Users, TrendingUp, Flame, DollarSign, Target, Activity } from "lucide-react";
import { publicSupabase, safeQuery } from "../../lib/supabase";

/**
 * Institutional CRM Metrics Dashboard (v1.24)
 * Provides real-time revenue intelligence and funnel visibility.
 */

interface CrmStats {
  totalLeads: number;
  hotLeads: number;
  stageCounts: Record<string, number>;
  avgScore: number;
  topTriggers: { type: string; count: number }[];
}

export const CrmMetrics = () => {
  const [stats, setStats] = useState<CrmStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const [leadsRes, eventsRes] = await Promise.all([
          safeQuery<any[]>(publicSupabase.from('leads').select('stage, score, is_hot')),
          safeQuery<any[]>(publicSupabase.from('user_events').select('event_type').limit(1000))
        ]);

        const leads = leadsRes || [];
        const events = eventsRes || [];

        // 1. Process Lead Aggregates
        const stageCounts: Record<string, number> = {
          NEW: 0,
          INTERESTED: 0,
          HIGH_INTENT: 0,
          PAYMENT_PENDING: 0,
          CONVERTED: 0
        };

        let totalScore = 0;
        let hotCount = 0;

        leads.forEach(l => {
          stageCounts[l.stage] = (stageCounts[l.stage] || 0) + 1;
          totalScore += (l.score || 0);
          if (l.is_hot) hotCount++;
        });

        // 2. Process Event Triggers
        const triggerMap: Record<string, number> = {};
        events.forEach(e => {
          triggerMap[e.event_type] = (triggerMap[e.event_type] || 0) + 1;
        });

        const topTriggers = Object.entries(triggerMap)
          .map(([type, count]) => ({ type, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setStats({
          totalLeads: leads.length,
          hotLeads: hotCount,
          stageCounts,
          avgScore: leads.length > 0 ? totalScore / leads.length : 0,
          topTriggers
        });

      } catch (err) {
        console.error("[CRM] Metrics Discovery Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Pulse every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading || !stats) return <div className="h-96 flex items-center justify-center text-gray-500 font-mono text-[10px] uppercase tracking-widest animate-pulse">Initializing Revenue Intelligence Pulse...</div>;

  return (
    <div className="space-y-8">
      {/* --- High Level Overview --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard 
          icon={<Users className="w-5 h-5 text-blue-400" />} 
          label="Total Leads" 
          value={stats.totalLeads.toString()} 
          subValue="Cross-surface"
        />
        <MetricCard 
          icon={<Flame className="w-5 h-5 text-rose-500" />} 
          label="Hot Leads" 
          value={stats.hotLeads.toString()} 
          subValue="Score > 50"
          highlight
        />
        <MetricCard 
          icon={<Target className="w-5 h-5 text-emerald-400" />} 
          label="Avg Score" 
          value={stats.avgScore.toFixed(1)} 
          subValue="Institutional Velocity"
        />
        <MetricCard 
          icon={<DollarSign className="w-5 h-5 text-cyan-400" />} 
          label="Conversion Est" 
          value={(stats.stageCounts.CONVERTED || 0).toString()} 
          subValue="Revenue Active"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* --- Conversion Funnel --- */}
        <div className="bg-[var(--color6)] border border-white/5 rounded-[2.5rem] p-10">
          <h3 className="text-white font-bold text-lg mb-8 flex items-center gap-3 uppercase tracking-tight">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            Conversion Funnel
          </h3>
          <div className="space-y-6">
            {Object.entries(stats.stageCounts).map(([stage, count]) => (
              <div key={stage} className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--color5)]">
                  <span>{stage}</span>
                  <span className="text-white">{count}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(count / stats.totalLeads) * 100}%` }}
                    className={`h-full ${stage === 'CONVERTED' ? 'bg-emerald-500' : 'bg-white/20'}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Top Behavioral Triggers --- */}
        <div className="bg-[var(--color6)] border border-white/5 rounded-[2.5rem] p-10">
          <h3 className="text-white font-bold text-lg mb-8 flex items-center gap-3 uppercase tracking-tight">
            <Activity className="w-5 h-5 text-cyan-500" />
            High-Intent Triggers
          </h3>
          <div className="space-y-4">
            {stats.topTriggers.map((trigger, i) => (
              <div key={trigger.type} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-mono text-[var(--color5)]">0{i+1}</span>
                  <span className="text-sm font-bold text-white uppercase tracking-tight">{trigger.type.replace('_', ' ')}</span>
                </div>
                <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-mono text-emerald-400">{trigger.count} Events</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ icon, label, value, subValue, highlight = false }: any) => (
  <div className={`p-8 rounded-[2.5rem] border transition-all ${highlight ? 'bg-rose-500/5 border-rose-500/20 shadow-[0_0_40px_rgba(244,63,94,0.1)]' : 'bg-[var(--color6)] border-white/5'}`}>
    <div className="mb-6">{icon}</div>
    <div className="text-[10px] font-mono font-bold text-[var(--color5)] uppercase tracking-[0.3em] mb-2">{label}</div>
    <div className="text-3xl font-black text-white tracking-tighter mb-1">{value}</div>
    <div className="text-[9px] font-mono text-[var(--color5)] uppercase tracking-widest">{subValue}</div>
  </div>
);
