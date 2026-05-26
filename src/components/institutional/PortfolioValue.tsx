import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, ShieldCheck } from 'lucide-react';
import { usePortfolioData } from '@/hooks/usePortfolioData';
import { EliteButton } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

/**
 * PortfolioValue — User-Specific Equity Display
 * Shows the authenticated user's actual portfolio balance and performance.
 */
export function PortfolioValue() {
  const { data: portfolio, isLoading } = usePortfolioData();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="h-[180px] rounded-[2.5rem] bg-white/[0.02] animate-pulse border border-white/10" />
    );
  }

  const total = portfolio?.total ?? 0;
  const change = portfolio?.change ?? 0;
  const isPositive = change >= 0;
  const hasData = total > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative p-8 md:p-12 rounded-[2.5rem] bg-white/[0.02] border border-white/10 backdrop-blur-xl overflow-hidden group shadow-2xl"
    >
      {/* Institutional Gloss */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-500/10 rounded-full blur-[100px] group-hover:bg-primary-500/20 transition-all duration-1000" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-foreground/40 text-[10px] font-black uppercase tracking-[0.4em] mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-primary-400" />
            Your Portfolio
          </div>

          {hasData ? (
            <>
              <div className="text-6xl lg:text-7xl font-black font-sans text-foreground tracking-tighter tabular-nums mb-3">
                ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>

              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                isPositive ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>{isPositive ? '+' : ''}{change}% Monthly Yield</span>
              </div>
            </>
          ) : (
            <>
              <div className="text-3xl lg:text-4xl font-black font-sans text-foreground/60 tracking-tighter mb-3">
                No Active Performance Data
              </div>
              <p className="text-foreground/30 text-sm max-w-md">
                Subscribe to an algorithm from the Marketplace to start tracking your portfolio performance here.
              </p>
            </>
          )}
        </div>

        <div className="flex flex-col gap-3 w-full md:w-auto">
          <EliteButton
            variant="elite"
            glowEffect={true}
            size="lg"
            className="w-full md:w-auto"
            onClick={() => navigate('/marketplace')}
            trackingEvent="portfolio_marketplace"
          >
            {hasData ? 'Manage Portfolio' : 'Browse Algorithms'}
          </EliteButton>
          {portfolio?.activeLicenses ? (
            <div className="text-center text-[10px] text-emerald-400/60 font-black uppercase tracking-widest">
              {portfolio.activeLicenses} Active License{portfolio.activeLicenses !== 1 ? 's' : ''}
            </div>
          ) : null}
        </div>
      </div>

      {/* Surface Metadata */}
      {hasData && portfolio?.lastUpdated && (
        <div className="mt-12 flex items-center gap-6 border-t border-white/5 pt-6 opacity-30">
          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-black uppercase tracking-widest">Last Updated</span>
            <span className="text-[10px] font-mono">
              {new Date(portfolio.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-black uppercase tracking-widest">Data Source</span>
            <span className="text-[10px] font-mono">Verified Performance</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
