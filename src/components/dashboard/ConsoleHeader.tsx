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
      statusColor = "bg-emerald-500 shadow-[0_0_10px_#10b981]";
      statusText = "SYSTEMS OPERATIONAL • LIVE CONNECTION";
    } else {
      statusColor = "bg-yellow-500 animate-pulse";
      statusText = "RESILIENCE MODE • SYNCING...";
    }
  }
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className={cn("w-2 h-2 rounded-full transition-all duration-700", statusColor)} />
          <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">
            {statusText}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-none">
          Console <span className="text-emerald-500">01</span>
          <span className="block text-sm font-medium text-gray-400 mt-4 lowercase font-mono">
            authenticated id: {userProfile?.full_name || (user?.email ? user.email.split('@')[0] : user?.id?.slice(0, 8))}
          </span>
        </h1>
      </motion.div>

      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3">
        {isAdmin && (
          <Link to="/admin" className="h-12 px-6 rounded-2xl bg-white text-black text-xs font-black flex items-center gap-2 hover:bg-gray-200 transition-all uppercase tracking-widest">
            <Settings className="w-4 h-4" />
            ADMIN TERMINAL
          </Link>
        )}
        <div className={cn(
          "h-12 px-6 rounded-2xl flex items-center border border-white/5 backdrop-blur-xl shadow-xl",
          isPro ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-white/5 text-gray-400 shadow-none"
        )}>
          <ShieldCheck className="w-4 h-4 mr-2" />
          <span className="text-[10px] font-black uppercase tracking-widest">
            {isPro ? "PRO ACCESS UNLOCKED" : "FREE TIER"}
          </span>
        </div>
      </motion.div>
    </div>
  );
};
