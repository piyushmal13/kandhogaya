import React, { useState, useEffect } from 'react';
import { Activity, Database, Server, Wifi, RefreshCw, Users } from 'lucide-react';
import { supabase, getCircuitStatus } from '../../lib/supabase';
import { cn } from '../../utils/cn';

export const SupabaseOpsHub = () => {
  const [metrics, setMetrics] = useState({
    users: 0,
    products: 0,
    subscriptions: 0,
    leads: 0
  });
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState(new Date());

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      // Execute health checks via count queries to verify RLS and DB speed
      const [{ count: users }, { count: products }, { count: subs }, { count: leads }] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('subscriptions').select('*', { count: 'exact', head: true }),
        supabase.from('leads').select('*', { count: 'exact', head: true })
      ]);

      setMetrics({
        users: users || 0,
        products: products || 0,
        subscriptions: subs || 0,
        leads: leads || 0
      });
      setLastSync(new Date());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // 30s pulse
    return () => clearInterval(interval);
  }, []);

  const circuitStatus = getCircuitStatus();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black uppercase tracking-widest text-white">Ops Hub <span className="text-emerald-500">Telemetry</span></h2>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Real-time database and circuit health</p>
        </div>
        <button 
          onClick={fetchMetrics}
          className="btn-institutional flex items-center gap-2"
        >
          <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          <span className="text-[10px]">Force Sync</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Circuit Breaker Status */}
        <div className="card-sovereign p-6 flex flex-col gap-4 border border-white/5 bg-black/40">
          <div className="flex items-center gap-3">
            <Wifi className={cn("w-6 h-6", circuitStatus === 'CLOSED' ? "text-emerald-500" : "text-rose-500")} />
            <div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Circuit Breaker</div>
              <div className={cn("text-lg font-black uppercase tracking-tighter", circuitStatus === 'CLOSED' ? "text-emerald-500" : "text-rose-500")}>
                {circuitStatus}
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400">
            {circuitStatus === 'CLOSED' ? 'Supabase connection is optimal. No transient failures detected.' : 'Connection degraded. System is operating in Resilience Mode.'}
          </p>
        </div>

        {/* Sync Status */}
        <div className="card-sovereign p-6 flex flex-col gap-4 border border-white/5 bg-black/40">
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-emerald-500" />
            <div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Last Pulse</div>
              <div className="text-lg font-black uppercase tracking-tighter text-white">
                {lastSync.toLocaleTimeString()}
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400">Next automatic telemetry pulse in 30 seconds.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Users', value: metrics.users, icon: Server },
          { label: 'Live Products', value: metrics.products, icon: Database },
          { label: 'Subscriptions', value: metrics.subscriptions, icon: Activity },
          { label: 'CRM Leads', value: metrics.leads, icon: Users },
        ].map((stat, i) => (
          <div key={i} className="card-sovereign p-4 border border-white/5 bg-black/40 flex flex-col items-center justify-center text-center gap-2">
            <stat.icon className="w-5 h-5 text-emerald-500 mb-1" />
            <div className="text-2xl font-black text-white">{loading ? '-' : stat.value}</div>
            <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
