import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Activity, Target, Zap, ShieldAlert, Cpu, Layers } from 'lucide-react';
import { usePortfolioData } from '@/hooks/usePortfolioData';
import { EliteButton } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

/**
 * PortfolioValue — Upgraded to Algorithmic Deployments Command Center
 * Focuses entirely on software licenses, Expert Advisor (EA) deployments, and co-location latency.
 * Purges all dollar balances and equity references.
 */
export function PortfolioValue() {
  const { data: portfolio, isLoading } = usePortfolioData();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="h-[280px] rounded-[2.5rem] bg-white/[0.02] animate-pulse border border-white/10" />
    );
  }

  const activeLicenses = portfolio?.activeLicenses ?? 0;
  const lastUpdated = portfolio?.lastUpdated ?? new Date().toISOString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative p-6 sm:p-10 rounded-[3rem] bg-gradient-to-br from-zinc-950 via-[#040608] to-black border border-white/10 backdrop-blur-3xl overflow-hidden group shadow-2xl space-y-8"
    >
      {/* Premium Ambient Lights */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-white/40 text-[9px] font-black uppercase tracking-[0.3em]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Algorithmic Command Center
            </div>
            <div className="text-[10px] text-gray-500 font-mono">NODE: IFX_DEPLOYMENT_CORE</div>
          </div>
        </div>
      </div>

      {/* Main Deployment Status & System Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Active EAs count */}
        <div className="lg:col-span-5 space-y-4">
          <div className="space-y-1">
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block">Systematic Engines</span>
            <div className="text-4xl sm:text-5xl lg:text-6xl font-black font-sans text-white tracking-tighter tabular-nums leading-none uppercase italic">
              {activeLicenses > 0 ? `${activeLicenses} Active` : "0 Deployed"}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {activeLicenses > 0 ? (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Layers className="w-3.5 h-3.5 animate-pulse" />
                <span>EAs Configured &amp; Active</span>
              </div>
            ) : (
              <span className="px-3 py-1.5 bg-white/[0.03] border border-white/5 rounded-xl text-[8px] font-black text-gray-500 uppercase tracking-widest">
                No active software keys deployed
              </span>
            )}
          </div>
        </div>

        {/* Dynamic Glowing Infrastructure Telemetry Graphic */}
        <div className="lg:col-span-7 h-28 relative rounded-2xl bg-black/40 border border-white/5 overflow-hidden p-4 flex flex-col justify-between">
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:15px_15px] pointer-events-none" />
          
          <div className="flex items-center justify-between text-[10px] text-white/40 font-mono tracking-wider relative z-10">
            <span>UPLINK SPEED: NY4 CO-LOCATED FIBER</span>
            <span className="text-emerald-400 font-bold">&lt;12ms LATENCY</span>
          </div>

          {/* Glowing Status Bar */}
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden relative z-10">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: activeLicenses > 0 ? '100%' : '15%' }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-[0_0_10px_#10B981]"
            />
          </div>

          <div className="flex items-center justify-between text-[8px] text-gray-500 font-mono relative z-10 uppercase tracking-widest">
            <span>Server: Dubai/India core gateway</span>
            <span>Uptime: 99.99% Guaranteed</span>
          </div>
        </div>

      </div>

      {/* Dynamic Key Specs Rail */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/5 relative z-10">
        {[
          { label: "Execution Model", value: "Expert Advisors", icon: Target, desc: "Bespoke MT5 systems" },
          { label: "Local Safety", value: "Drawdown Limiters", icon: ShieldAlert, desc: "Pre-packaged protection", color: "text-emerald-400" },
          { label: "Broker Leverage Limit", value: "1:100 Max", icon: Cpu, desc: "Capital control threshold" },
          { label: "Fiber Speed", value: "<12ms NY4", icon: Zap, desc: "Co-location fiber line", color: "text-cyan-400" },
        ].map((item, idx) => (
          <div key={idx} className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl flex items-start gap-3 hover:bg-white/[0.03] transition-all">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 shrink-0">
              <item.icon className={`w-4 h-4 ${item.color || 'text-white/60'}`} />
            </div>
            <div className="space-y-0.5">
              <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest block">{item.label}</span>
              <span className="text-xs font-black text-white uppercase tracking-tight block leading-tight">{item.value}</span>
              <span className="text-[8px] text-gray-600 font-medium block">{item.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Surface Controls Footer */}
      <div className="pt-4 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
        <div className="flex items-center gap-4 opacity-40">
          <div className="flex flex-col gap-0.5">
            <span className="text-[7px] font-black uppercase tracking-widest">Last Synced</span>
            <span className="text-[9px] font-mono text-white leading-none">
              {new Date(lastUpdated).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div className="flex flex-col gap-0.5">
            <span className="text-[7px] font-black uppercase tracking-widest">Platform Status</span>
            <span className="text-[9px] font-mono text-emerald-400 leading-none">Systems Verified</span>
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
            {activeLicenses > 0 ? 'Manage Licenses' : 'Deploy Algorithmic Engine'}
          </EliteButton>
        </div>
      </div>
    </motion.div>
  );
}
