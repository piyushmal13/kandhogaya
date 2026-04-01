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
          <div className="h-24 bg-white/5 rounded-3xl animate-pulse" />
          <div className="h-24 bg-white/5 rounded-3xl animate-pulse" />
        </div>
      );
    }

    if (licenses.length > 0) {
      return (
        <div className="grid grid-cols-1 gap-4">
          {licenses.map((license) => (
            <div key={license.id} className="group relative p-8 rounded-[36px] bg-black/40 border border-white/5 hover:border-emerald-500/30 transition-all">
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-[28px] bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight italic">
                      {license.algo_bots?.name || "QUANT ENGINE v2"}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-[10px] font-mono text-gray-500">
                      <span className="bg-white/5 px-2 py-0.5 rounded uppercase">ID: {license.license_key.slice(0, 8)}...</span>
                      <span className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        EXP: {new Date(license.expires_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <span className={cn(
                  "px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border",
                  license.is_active ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"
                )}>
                  {license.is_active ? "ONLINE" : "EXPIRED"}
                </span>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[48px] bg-black/20">
        <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-8">No licensed algorithms detected on this account.</p>
        <Link to="/marketplace" className="inline-flex items-center px-10 py-4 rounded-2xl bg-emerald-500 text-black font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-emerald-500/20">
          Initialize Setup
        </Link>
      </div>
    );
  };

  return (
    <section className={cn("p-10 rounded-[48px] bg-white/5 border border-white/10 backdrop-blur-3xl overflow-hidden relative group", !isElite && "min-h-[440px]")}>
      {!isElite && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-8 bg-black/80 backdrop-blur-xl rounded-[48px] animate-in fade-in duration-1000">
          <div className="text-center space-y-6 max-w-sm">
            <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-[40px] flex items-center justify-center mx-auto text-emerald-500 shadow-2xl relative">
              <Lock className="w-10 h-10" />
              <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Algo Discovery Locked</h3>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest leading-relaxed mt-4">
                Elite Tier Required for institutional algorithmic signals.
              </p>
            </div>
            <button 
              onClick={onUpgrade}
              className="px-12 py-5 bg-emerald-500 text-black font-black text-[11px] uppercase tracking-[0.3em] rounded-3xl hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-emerald-500/40"
            >
              Unlock Elite Terminal
            </button>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-2xl font-black text-white flex items-center gap-3 uppercase tracking-tighter italic">
          <Activity className="w-6 h-6 text-emerald-500" />
          Execution Terminal
        </h2>
        <Link to="/marketplace" className="text-[10px] font-black text-emerald-500 hover:text-emerald-400 transition-colors uppercase tracking-[0.2em]">ADD NEW KEY</Link>
      </div>
      
      <div className={cn("transition-all duration-700", !isElite && "blur-xl select-none pointer-events-none")}>
        {renderLicenses()}
      </div>
    </section>
  );
};
