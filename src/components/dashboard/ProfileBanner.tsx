import React from "react";
import { motion } from "motion/react";
import { Users, ShieldCheck } from "lucide-react";

interface ProfileBannerProps {
  userProfile?: any;
  user: any;
  userLead: any;
  isProOnly: boolean;
  onUpgrade: (plan: string, amount: number, productId: string) => void;
}

export const ProfileBanner: React.FC<ProfileBannerProps> = ({
  userProfile,
  user,
  userLead,
  isProOnly,
  onUpgrade
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-10 p-5 bg-gradient-to-r from-emerald-500/10 via-emerald-500/20 to-emerald-500/10 border border-emerald-500/20 rounded-[32px] flex flex-col lg:flex-row items-center justify-between group overflow-hidden relative gap-6"
    >
      <div className="absolute inset-0 bg-emerald-500/5 animate-pulse" />
      
      {/* Profile Info */}
      <div className="p-6 rounded-[32px] bg-white/[0.03] border border-white/5 relative overflow-hidden group min-w-[320px]">
        <div className="absolute top-0 right-0 p-4">
          <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${userProfile?.isPro ? 'bg-emerald-500 text-black' : 'bg-white/10 text-white/40'}`}>
            {userProfile?.role || 'TRADER'}
          </div>
        </div>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center relative group">
            <Users className="w-8 h-8 text-emerald-400" />
            <div className="absolute inset-0 bg-emerald-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white uppercase tracking-tighter leading-none mb-1">
              {userProfile?.full_name || user?.email?.split('@')[0] || 'Institutional Trader'}
            </h2>
            <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">
              {userLead?.crm_metadata?.phone || "Phone Not Verified"}
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-white/5">
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Email</span>
            <span className="text-[10px] font-mono text-white/80">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-white/5">
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Region</span>
            <span className="text-[10px] font-mono text-white/80">{userLead?.priority_tag || "GLOBAL"}</span>
          </div>
        </div>
      </div>

      {/* Upgrade CTA */}
      <div className="flex-1 flex flex-col lg:flex-row items-center gap-6 relative z-10 px-4">
        <div className="flex items-center gap-6">
          <div className="w-10 h-10 bg-emerald-500 text-black rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">
              {isProOnly ? "Institutional Tier Expansion" : "Enroll in Institutional Tiers"}
            </h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
              {isProOnly ? "🚀 Upgrade to ELITE to unlock institutional algorithmic execution" : "🚀 Upgrade your plan to unlock full trading and execution power"}
            </p>
          </div>
        </div>
        <button 
          onClick={() => onUpgrade(
            isProOnly ? "elite" : "pro", 
            isProOnly ? 249 : 99,
            isProOnly ? 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2' : 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1'
          )}
          className="relative z-10 px-8 py-3 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-xl whitespace-nowrap ml-auto"
        >
          {isProOnly ? "Join Elite" : "Unlock Pro Access"}
        </button>
      </div>
    </motion.div>
  );
};
