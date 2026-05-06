import React from 'react';
import { motion } from 'motion/react';
import { Activity, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { Button } from '../ui/Button';

// ── TYPES ──
export interface MarketplaceProduct {
  id: string;
  name: string;
  type: 'algorithm' | 'course';
  price: number;
  isPremium?: boolean;
  performance?: {
    winRate: number;
    sharpe?: number;
    monthlyReturn?: number;
  };
  imageUrl?: string;
  category?: string;
  description?: string;
}

interface MarketplaceGridProps {
  products: MarketplaceProduct[];
  isLoading?: boolean;
  onSelect?: (product: MarketplaceProduct) => void;
}

// ── COMPONENTS ──

const SkeletonCard = () => (
  <div className="relative overflow-hidden rounded-[2.5rem] bg-white/5 border border-white/10 aspect-[4/5] p-8 space-y-6">
    <div className="h-4 w-1/4 bg-white/10 rounded-full animate-pulse" />
    <div className="h-12 w-3/4 bg-white/10 rounded-xl animate-pulse" />
    <div className="h-40 w-full bg-white/10 rounded-2xl animate-pulse" />
    <div className="space-y-3">
      <div className="h-4 w-full bg-white/10 rounded-full animate-pulse" />
      <div className="h-4 w-2/3 bg-white/10 rounded-full animate-pulse" />
    </div>
    <div className="absolute bottom-8 left-8 right-8 h-12 bg-white/10 rounded-2xl animate-pulse" />
  </div>
);

const LiveIndicator = () => (
  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
    </span>
    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest font-mono">Demo Environment</span>
  </div>
);

export const MarketplaceGrid: React.FC<MarketplaceGridProps> = ({ products, isLoading, onSelect }) => {
  const { isEnabled: showPremiumBadges } = useFeatureFlag('show_premium_badges', true);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((id) => (
          <SkeletonCard key={`skel-asset-${id}`} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
      {products.map((product, index) => (
        <motion.article
          key={product.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="group relative perspective-deep"
        >
          {/* Card Container - 3D Tilt Wrapper */}
          <motion.div 
            whileHover={{ rotateX: -2, rotateY: 5, scale: 1.02 }}
            className={cn(
              "relative h-full overflow-hidden rounded-[3.5rem] bg-black/40 backdrop-blur-3xl border border-white/5 transition-all duration-700 preserve-3d",
              "hover:border-emerald-500/20 shadow-2xl",
              "flex flex-col p-12 z-10"
            )}
          >
            {/* Asset Shimmer Overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-700 z-10">
               <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            </div>

            {/* Proof Image Background */}
            {product.imageUrl && (
              <div className="absolute inset-0 z-0 opacity-[0.05] group-hover:opacity-20 transition-opacity duration-700">
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
              </div>
            )}

            {/* Header: Meta & Status */}
            <div className="flex justify-between items-start mb-12 relative z-20">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] font-mono">
                      {product.category || product.type}
                   </span>
                </div>
                {product.type === 'algorithm' && (
                  <div className="flex items-center gap-3 text-[10px] font-black text-emerald-400 uppercase tracking-widest font-mono">
                    <Activity className="w-3 h-3" />
                    Load: {(Math.random() * 20 + 80).toFixed(1)}%
                  </div>
                )}
              </div>
              
              {showPremiumBadges && product.isPremium && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                  <Lock className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.1em]">Elite Tier</span>
                </div>
              )}
            </div>

            {/* Asset Content */}
            <div className="flex-1 space-y-8 relative z-20">
              <h3 className="text-4xl font-black text-white leading-none uppercase tracking-tighter group-hover:text-emerald-400 transition-colors">
                {product.name}
              </h3>
              
              <p className="text-white/30 text-base leading-relaxed line-clamp-3 font-medium">
                {product.description || "Institutional grade execution model designed for liquid indices and global currency markets."}
              </p>

              {/* Advanced Performance Analytics */}
              {product.type === 'algorithm' && product.performance && (
                <div className="grid grid-cols-2 gap-8 py-8 border-y border-white/5 my-10 bg-white/[0.01] px-6 rounded-3xl">
                  <div className="space-y-2">
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.25em]">Alpha Rate</span>
                    <div className="text-3xl font-black text-emerald-400 font-mono">
                      {product.performance.winRate}%
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.25em]">Target CAGR</span>
                    <div className="text-3xl font-black text-white font-mono">
                      {product.performance.monthlyReturn || '12.4'}%
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Deployment Action */}
            <div className="mt-12 flex items-center justify-between relative z-20">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-2">Base Allocation</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-black text-emerald-500">$</span>
                  <span className="text-4xl font-black text-white tracking-tighter">
                    {product.price}
                  </span>
                </div>
              </div>

              <button
                className="rounded-2xl px-8 py-5 h-auto text-[11px] font-black uppercase tracking-[0.2em] bg-[#58F2B6] hover:bg-[#58F2B6]/90 text-black shadow-[0_0_20px_rgba(88,242,182,0.3)] transition-all"
                onClick={() => onSelect?.(product)}
              >
                Deploy System
              </button>
            </div>
          </motion.div>

          {/* Ambient Perspective Glow */}
          <div className="absolute -inset-4 bg-emerald-500/10 blur-[100px] rounded-full opacity-0 group-hover:opacity-40 transition-all duration-1000 -z-10" />
        </motion.article>
      ))}
    </div>
  );
};
