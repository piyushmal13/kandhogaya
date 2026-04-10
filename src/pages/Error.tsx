import { DashboardLayout } from '../components/institutional/DashboardLayout';
import { SovereignButton } from '../components/ui/Button';
import { motion } from 'framer-motion';
import { AlertTriangle, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Institutional Error Surface (404 / 500).
 * Replaces generic browser errors with a sovereign, high-authority 
 * fallback that maintains platform immersion.
 */
export function InstitutionalError() {
  const navigate = useNavigate();

  return (
    <DashboardLayout showBreadcrumb={false}>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <motion.div
           initial={{ scale: 0.9, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="space-y-8"
        >
          <div className="relative inline-flex">
             <div className="absolute inset-0 blur-3xl bg-red-500/20 rounded-full" />
             <div className="relative w-24 h-24 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                <AlertTriangle className="w-12 h-12" />
             </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-8xl font-black italic uppercase tracking-tighter text-white leading-none">
               404 <span className="text-red-500">ERR</span>
            </h1>
            <p className="text-xl font-black text-white/40 uppercase tracking-[0.3em]">
               Signal Lost. Cluster path not resolved.
            </p>
          </div>

          <p className="max-w-md mx-auto text-[11px] font-medium text-white/20 uppercase tracking-[0.2em] leading-relaxed">
             The requested node is currently offline or does not exist within the Sovereign grid. Verify your uplink parameters or return to the base omni-view.
          </p>

          <div className="pt-8">
            <SovereignButton 
              onClick={() => navigate('/dashboard')}
              className="px-10 py-5 bg-white text-black hover:bg-emerald-500 transition-all rounded-2xl"
            >
              <div className="flex items-center gap-3 font-black uppercase tracking-widest text-[11px]">
                 <Home className="w-4 h-4" />
                 Return to Base
              </div>
            </SovereignButton>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
