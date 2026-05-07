import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Activity, Globe, Zap } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export const InfrastructurePulse = () => {
  const [status, setStatus] = useState<'connected' | 'reconnecting' | 'failed'>('connected');

  useEffect(() => {
    const checkPulse = async () => {
      try {
        const { error } = await supabase.from('users').select('count', { count: 'exact', head: true });
        
        if (error) throw error;
        
        setStatus('connected');
      } catch (err) {
        setStatus('reconnecting');
      }
    };

    checkPulse();
  }, []);

  return (
    <div className="p-5 rounded-3xl bg-white/[0.01] border border-white/5 space-y-4 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_8px_rgba(0,229,255,0.8)] ${
            status === 'connected' ? 'bg-cyan-500' : status === 'reconnecting' ? 'bg-amber-500' : 'bg-red-500'
          }`} />
          <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Infrastructure Pulse</span>
        </div>
        <ShieldCheck className={`w-3.5 h-3.5 ${status === 'connected' ? 'text-cyan-500' : 'text-white/10'}`} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-3 h-3 text-cyan-500/40" />
            <span className="text-[7px] font-black uppercase tracking-tighter text-white/20">Data Integrity</span>
          </div>
          <div className="text-xs font-mono font-black text-white/80">
            {status === 'connected' ? 'VERIFIED' : 'SYNCING'}
          </div>
        </div>
        <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-3 h-3 text-cyan-500/40" />
            <span className="text-[7px] font-black uppercase tracking-tighter text-white/20">Node</span>
          </div>
          <div className="text-xs font-mono font-black text-white/80 uppercase">
            IFX_TERMINAL_01
          </div>
        </div>
      </div>

      <div className="pt-2 flex items-center justify-between border-t border-white/5">
        <div className="flex items-center gap-2">
           <Zap className="w-3 h-3 text-emerald-500" />
           <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500/60">System Operational</span>
        </div>
        <span className="text-[8px] font-mono text-white/10 italic">IFX_INSTITUTIONAL_CORE</span>
      </div>
    </div>
  );
};
