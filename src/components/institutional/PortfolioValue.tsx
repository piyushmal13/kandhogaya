import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Activity, Target, Calendar, Package, Layers } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { EliteButton } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

/**
 * PortfolioValue — Repurposed as "Account Summary"
 * Displays real data: Active Licenses, Webinar Subscriptions, and Purchased Assets.
 */
export function PortfolioValue() {
  const { data: dashData, isLoading } = useDashboardData();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="h-[280px] rounded-[2.5rem] bg-white/[0.02] animate-pulse border border-white/10" />
    );
  }

  const activeLicenses = dashData?.licenses?.filter(l => l.is_active).length || 0;
  const webinarSubs = dashData?.webinarRegistrations?.length || 0;
  const purchases = dashData?.purchases?.length || 0;
  const lastUpdated = new Date().toISOString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative p-6 sm:p-10 rounded-[3rem] bg-gradient-to-br from-[#020406] to-[#010203] border border-white/10 backdrop-blur-3xl overflow-hidden group shadow-2xl space-y-8"
    >
      {/* Ambient Glow */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-white/40 text-[9px] font-black uppercase tracking-[0.3em]">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              Account Snapshot
            </div>
            <div className="text-xl font-bold text-white tracking-tight">Your Assets</div>
          </div>
        </div>
      </div>

      {/* Main Asset Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        
        {/* Active Licenses */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all flex flex-col items-start gap-4 group/card">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-3xl font-black text-white tabular-nums">{activeLicenses}</div>
            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Active Licenses</div>
          </div>
        </div>

        {/* Total Purchases */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all flex flex-col items-start gap-4 group/card">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="text-3xl font-black text-white tabular-nums">{purchases}</div>
            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Total Purchases</div>
          </div>
        </div>

        {/* Webinar Subs */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all flex flex-col items-start gap-4 group/card">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="text-3xl font-black text-white tabular-nums">{webinarSubs}</div>
            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Webinar Registrations</div>
          </div>
        </div>

      </div>

      {/* Surface Controls Footer */}
      <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
        <div className="flex items-center gap-4 opacity-40">
          <div className="flex flex-col gap-0.5">
            <span className="text-[7px] font-black uppercase tracking-widest">Last Synced</span>
            <span className="text-[9px] font-mono text-white leading-none">
              {new Date(lastUpdated).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div className="flex flex-col gap-0.5">
            <span className="text-[7px] font-black uppercase tracking-widest">Account Status</span>
            <span className="text-[9px] font-mono text-blue-400 leading-none">Verified & Active</span>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto shrink-0">
          <EliteButton
            variant="elite"
            glowEffect={true}
            size="sm"
            className="w-full md:w-auto font-black uppercase tracking-widest text-[9px] py-3.5 px-6"
            onClick={() => navigate('/marketplace')}
            trackingEvent="portfolio_marketplace"
          >
            Explore Marketplace
          </EliteButton>
        </div>
      </div>
    </motion.div>
  );
}
