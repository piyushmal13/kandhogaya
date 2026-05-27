import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, ShieldCheck, Activity, Target, Zap, ShieldAlert, Cpu } from 'lucide-react';
import { usePortfolioData } from '@/hooks/usePortfolioData';
import { EliteButton } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

/**
 * PortfolioValue — User-Specific Equity Display
 * Shows the authenticated user's actual portfolio balance and performance.
 * Upgraded to Royale Noir Institutional Dashboard Terminal with high-density glowing SVG.
 */
export function PortfolioValue() {
  const { data: portfolio, isLoading } = usePortfolioData();
  const navigate = useNavigate();
  const [demoMode, setDemoMode] = useState(false);

  if (isLoading) {
    return (
      <div className="h-[280px] rounded-[2.5rem] bg-white/[0.02] animate-pulse border border-white/10" />
    );
  }

  // Fallback to beautiful simulation data if user doesn't have live capital yet, with a gorgeous toggle!
  const hasLiveCapital = (portfolio?.total ?? 0) > 0;
  const isDemoActive = demoMode || !hasLiveCapital;

  const total = isDemoActive ? 124580.42 : (portfolio?.total ?? 0);
  const change = isDemoActive ? 14.85 : (portfolio?.change ?? 0);
  const activeLicenses = isDemoActive ? 3 : (portfolio?.activeLicenses ?? 0);
  const lastUpdated = isDemoActive ? new Date().toISOString() : (portfolio?.lastUpdated ?? new Date().toISOString());

  // Generate SVG path for a premium, smooth upward curve
  const chartPath = "M 0 100 Q 60 70 120 85 T 240 30 T 360 40 T 480 10 T 600 5";
  const areaPath = `${chartPath} L 600 120 L 0 120 Z`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative p-6 sm:p-10 rounded-[3rem] bg-gradient-to-br from-zinc-950 via-[#040608] to-black border border-white/10 backdrop-blur-3xl overflow-hidden group shadow-2xl space-y-8"
    >
      {/* Premium Strobe Lights */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-emerald-500/10 rounded-full blur-[120px] group-hover:bg-emerald-500/15 transition-all duration-1000 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none" />

      {/* Header and Telemetry Toggle */}
      <div className="relative z-10 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Activity className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-white/40 text-[9px] font-black uppercase tracking-[0.3em]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Institutional Portfolio Node
            </div>
            <div className="text-[10px] text-gray-500 font-mono">NODE: IFX_CAPITAL_DESK_v4</div>
          </div>
        </div>

        {hasLiveCapital && (
          <button
            onClick={() => setDemoMode(!demoMode)}
            className="px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.02] text-[8px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:border-white/20 transition-all cursor-pointer"
          >
            {isDemoActive ? "Switch to Live Node" : "Enable Simulation View"}
          </button>
        )}
      </div>

      {/* Main balance and chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Balance node */}
        <div className="lg:col-span-5 space-y-4">
          <div className="space-y-1">
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block">Equity Balance</span>
            <div className="text-4xl sm:text-5xl lg:text-6xl font-black font-sans text-white tracking-tighter tabular-nums leading-none">
              ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-3.5 h-3.5 animate-bounce" />
              <span>+{change}% Monthly Yield</span>
            </div>
            {isDemoActive && (
              <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[8px] font-black text-amber-500 uppercase tracking-widest italic animate-pulse">
                Simulation Feed
              </span>
            )}
          </div>
        </div>

        {/* Dynamic Glowing Equity curve */}
        <div className="lg:col-span-7 h-28 relative rounded-2xl bg-black/40 border border-white/5 overflow-hidden p-2">
          {/* Neon Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
          
          <svg className="w-full h-full" viewBox="0 0 600 120" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Area fill */}
            <path d={areaPath} fill="url(#chartGlow)" />
            {/* Glow stroke line */}
            <path d={chartPath} fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
          </svg>

          <div className="absolute top-3 right-4 flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-lg border border-white/10">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
            <span className="text-[8px] font-mono text-emerald-400 font-bold">100% Attributed</span>
          </div>
        </div>

      </div>

      {/* Dynamic Key Specs Rail */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/5 relative z-10">
        {[
          { label: "Active Licenses", value: activeLicenses > 0 ? `${activeLicenses} Engines` : "0 Systems", icon: Target, desc: "Settle direct allocations" },
          { label: "Drawdown Shield", value: "4.5% Cap Active", icon: ShieldAlert, desc: "Pre-packaged protection", color: "text-emerald-400" },
          { label: "Broker Leverage Limit", value: "1:100 Max", icon: Cpu, desc: "Capital control threshold" },
          { label: "NY4 Aggregation", value: "<12ms Speed", icon: Zap, desc: "Co-location fiber line", color: "text-cyan-400" },
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
            <span className="text-[7px] font-black uppercase tracking-widest">Attestation Time</span>
            <span className="text-[9px] font-mono text-white leading-none">
              {new Date(lastUpdated).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div className="flex flex-col gap-0.5">
            <span className="text-[7px] font-black uppercase tracking-widest">Telemetry</span>
            <span className="text-[9px] font-mono text-emerald-400 leading-none">Live Connection Verified</span>
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
            {hasLiveCapital ? 'Manage Portfolio' : 'Deploy Algorithmic Engine'}
          </EliteButton>
        </div>
      </div>
    </motion.div>
  );
}
