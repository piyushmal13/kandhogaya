import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Settings, ShieldCheck } from "lucide-react";
import { cn } from "@/utils/cn";
import { getSupabaseHealth } from "@/lib/supabase";

interface ConsoleHeaderProps {
  sessionReady: boolean;
  userProfile?: any;
  user: any;
  isAdmin: boolean;
  isPro: boolean;
}

export const ConsoleHeader: React.FC<ConsoleHeaderProps> = ({ 
  sessionReady, 
  userProfile, 
  user, 
  isAdmin, 
  isPro 
}) => {
  const isHealthy = getSupabaseHealth();
  
  // Refactored logic to satisfy SonarQube complexity audits
  let statusColor = "bg-red-500 animate-pulse";
  let statusText = "INITIALIZING QUANTUM PULSE • HANDSHAKING...";

  if (sessionReady) {
    if (isHealthy) {
      statusColor = "bg-emerald-500 shadow-[0_0_10px_var(--color8)]";
      statusText = "SYSTEMS OPERATIONAL • LIVE CONNECTION";
    } else {
      statusColor = "bg-yellow-500 animate-pulse";
      statusText = "RESILIENCE MODE • SYNCING...";
    }
  }
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <div className="flex items-center gap-4">
          <div className={cn("w-2.5 h-2.5 rounded-full transition-all duration-1000", statusColor)} />
          <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-zinc-500 flex items-center gap-2">
            {statusText}
          </span>
        </div>
        <div className="relative">
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none italic font-serif">
            Workstation <span className="text-emerald-500">01</span>
          </h1>
          <div className="mt-6 flex items-center gap-4 overflow-hidden">
             <div className="h-px bg-white/5 flex-1" />
             <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em] font-mono whitespace-nowrap">
               AUTHENTICATED NODE: {userProfile?.full_name || (user?.email ? user.email.split('@')[0].toUpperCase() : "ANONYMOUS_CORE")}
             </span>
             <div className="h-px bg-white/5 flex-1" />
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-4">
        {isAdmin && (
          <Link to="/admin" className="h-14 px-8 rounded-2xl bg-white text-black text-[11px] font-black flex items-center gap-3 hover:translate-y-[-2px] hover:shadow-[0_20px_40px_rgba(255,255,255,0.1)] transition-all uppercase tracking-[0.3em]">
            <Settings className="w-4 h-4" />
            ADMIN_TERMINAL
          </Link>
        )}
        <div className={cn(
          "h-14 px-8 rounded-2xl flex items-center border transition-all duration-700",
          isPro 
            ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/10 shadow-[inner_0_1px_0_rgba(255,255,255,0.02)]" 
            : "bg-white/[0.02] text-zinc-500 border-white/[0.05]"
        )}>
          <ShieldCheck className={cn("w-4 h-4 mr-3", isPro ? "text-emerald-500" : "text-zinc-600")} />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] font-mono">
            {isPro ? "CLEARANCE: PRO" : "CLEARANCE: L1"}
          </span>
        </div>
      </motion.div>
    </div>
  );
};
