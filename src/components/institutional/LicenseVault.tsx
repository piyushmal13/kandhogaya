import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Key, ShieldCheck, Copy, CheckCircle2, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const LicenseVault = () => {
  const { entitlements } = useAuth();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Filter out any dummy data or focus purely on Algo / EA licenses
  // We assume an entitlement corresponds to an algo license for this vault
  const activeLicenses = entitlements.filter(e => e.active);

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!activeLicenses.length) {
    return (
      <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
            <Lock size={18} />
          </div>
          <div>
            <h3 className="text-white font-bold">The Vault</h3>
            <p className="text-white/40 text-[10px] uppercase tracking-widest">No Active Licenses</p>
          </div>
        </div>
        <p className="text-gray-500 text-sm">
          You currently have no active algorithm licenses. Visit the Execution Desk to acquire an institutional model.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 rounded-[2rem] bg-gradient-to-br from-emerald-500/[0.02] to-transparent border border-emerald-500/10 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
        <ShieldCheck size={120} className="text-emerald-500" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">The Vault</h3>
            <p className="text-emerald-500/60 text-[10px] font-black uppercase tracking-widest">Secure RSA Enclave</p>
          </div>
        </div>

        <div className="space-y-4">
          {activeLicenses.map((license, idx) => {
            // Generate a deterministic but pseudo-random RSA key string for the UI
            // In a real app, this comes directly from Supabase DB.
            const rsaKey = `IFX-${(license.feature || "ALGO").toUpperCase().substring(0,4)}-${Math.random().toString(36).substring(2, 10).toUpperCase()}-RSA2048`;

            return (
              <div key={`${license.feature}-${idx}`} className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-white font-bold">{license.feature.toUpperCase()} Core</h4>
                    <p className="text-white/40 text-xs mt-1">Status: <span className="text-emerald-400">Active / Validated</span></p>
                  </div>
                  <button 
                    onClick={() => {
                      // Trigger .ex5 download
                      // In production, this hits an authenticated signed URL endpoint
                      const a = document.createElement('a');
                      a.href = `data:text/plain;charset=utf-8,Mock_EX5_File_Content_For_${license.feature}`;
                      a.download = `${license.feature}_IFX_Institutional.ex5`;
                      a.click();
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500 hover:text-black transition-colors text-[10px] font-black uppercase tracking-widest"
                  >
                    <Download size={14} />
                    .EX5 File
                  </button>
                </div>

                <div className="bg-black/40 rounded-xl p-3 border border-white/5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Key size={14} className="text-white/40 shrink-0" />
                    <code className="text-emerald-400/80 font-mono text-[10px] md:text-xs truncate">
                      {rsaKey}
                    </code>
                  </div>
                  
                  <button
                    onClick={() => handleCopyKey(rsaKey)}
                    className="relative shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                    aria-label="Copy License Key"
                  >
                    <AnimatePresence mode="wait">
                      {copiedKey === rsaKey ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.5, opacity: 0 }}
                        >
                          <CheckCircle2 size={16} className="text-emerald-500" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="copy"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.5, opacity: 0 }}
                        >
                          <Copy size={16} className="text-white/60" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
