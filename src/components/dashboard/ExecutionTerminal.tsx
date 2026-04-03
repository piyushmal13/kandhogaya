import React from "react";
import { Link } from "react-router-dom";
import { Activity, ShieldCheck, Clock, Lock } from "lucide-react";
import { cn } from "@/utils/cn";
import { BotLicense } from "@/types";

interface ExtendedLicense extends BotLicense {
  algo_bots?: {
    name: string;
    version: string;
  };
}

interface ExecutionTerminalProps {
  licenses: ExtendedLicense[];
  loading: boolean;
  isElite: boolean;
  onUpgrade: () => void;
}

export const ExecutionTerminal: React.FC<ExecutionTerminalProps> = ({
  licenses,
  loading,
  isElite,
  onUpgrade
}) => {
  const renderLicenses = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          <div className="h-32 bg-white/5 rounded-[40px] animate-pulse" />
          <div className="h-32 bg-white/5 rounded-[40px] animate-pulse" />
        </div>
      );
    }

    if (licenses.length > 0) {
      return (
        <div className="grid grid-cols-1 gap-6">
          {licenses.map((license) => (
            <div key={license.id} className="group relative p-8 rounded-[40px] bg-black/40 border border-white/5 hover:border-emerald-500/30 transition-all overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent group-hover:via-emerald-500/40 transition-all duration-700" />
              
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-[30px] bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-all relative">
                    <ShieldCheck className="w-10 h-10" />
                    {license.is_active && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-black rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight italic">
                      {license.algo_bots?.name || "QUANT ENGINE v2"}
                    </div>
                    <div className="flex items-center gap-6 mt-3 text-[10px] font-mono text-gray-500 uppercase tracking-widest font-black">
                      <span className="bg-white/5 px-2.5 py-1 rounded-md border border-white/5">KEY: {license.license_key.slice(0, 12)}...</span>
                      <span className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-emerald-500" />
                        UNTIL: {new Date(license.expires_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={cn(
                    "px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border transition-all",
                    license.is_active ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]" : "bg-red-500/10 text-red-500 border-red-500/20"
                  )}>
                    {license.is_active ? "ENGINE ONLINE" : "ENGINE OFFLINE"}
                  </span>
                  {license.is_active && <span className="text-[8px] font-black text-emerald-500/40 uppercase tracking-widest font-mono">LATENCY: 12ms</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="text-center py-24 border border-dashed border-white/10 rounded-[56px] bg-emerald-500/[0.02]">
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em] mb-10 opacity-60">NO QUANT KEYS DETECTED IN CURRENT CLEARANCE</p>
        <Link to="/marketplace" className="inline-flex items-center px-12 py-5 rounded-3xl bg-emerald-500 text-black font-black text-[11px] uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-emerald-500/20">
          Initialize Terminal
        </Link>
      </div>
    );
  };

  return (
    <section className={cn("p-12 rounded-[56px] bg-black border border-white/5 backdrop-blur-3xl overflow-hidden relative group", !isElite && "min-h-[480px]")}>
      {!isElite && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-12 bg-black/90 backdrop-blur-2xl rounded-[56px] animate-in fade-in duration-1000">
          <div className="text-center space-y-8 max-w-sm">
            <div className="w-28 h-28 bg-emerald-500/10 border border-emerald-500/20 rounded-[48px] flex items-center justify-center mx-auto text-emerald-500 shadow-2xl relative">
              <Lock className="w-12 h-12" />
              <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full animate-pulse" />
            </div>
            <div>
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Terminal Access Restricted</h3>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] leading-loose mt-6 opacity-80">
                Institutional clearance required for algorithmic execution. Upgrade to Elite tier for full terminal functionality.
              </p>
            </div>
            <button 
              onClick={onUpgrade}
              className="w-full py-6 bg-emerald-500 text-black font-black text-[12px] uppercase tracking-[0.4em] rounded-[2rem] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-emerald-500/40"
            >
              Request Access
            </button>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-3xl font-black text-white flex items-center gap-4 uppercase tracking-tighter italic font-serif">
          <Activity className="w-8 h-8 text-emerald-500" />
          Execution Hub
        </h2>
        <Link to="/marketplace" className="text-[11px] font-black text-emerald-500 hover:text-emerald-400 transition-all uppercase tracking-[0.3em] hover:tracking-[0.4em]">PROVISION NEW KEY</Link>
      </div>
      
      <div className={cn("transition-all duration-1000", !isElite && "blur-2xl grayscale select-none pointer-events-none")}>
        {renderLicenses()}
      </div>
    </section>
  );
};
