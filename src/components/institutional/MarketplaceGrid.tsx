import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Lock, TrendingUp } from 'lucide-react';
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
    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest font-mono italic">Flux Live</span>
  </div>
);

export const MarketplaceGrid: React.FC<MarketplaceGridProps> = ({ products, isLoading, onSelect }) => {
  const { isEnabled: showPremiumBadges } = useFeatureFlag('show_premium_badges', true);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {new Array(6).fill(null).map((_, i) => (
          <SkeletonCard key={`skel-asset-${i}`} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {products.map((product, index) => (
        <motion.article
          key={product.id}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: index * 0.05, ease: [0.23, 1, 0.32, 1] as const }}
          className="group relative"
          itemScope
          itemType="https://schema.org/Product"
        >
          {/* Card Container - Royale Noir Depth */}
          <div 
            className={cn(
              "relative h-full overflow-hidden rounded-[3rem] bg-white/[0.02] backdrop-blur-3xl border border-white/5 transition-all duration-700",
              "hover:-translate-y-3 hover:bg-white/[0.04] hover:border-emerald-500/20 shadow-royale",
              "flex flex-col p-10 z-10"
            )}
          >
            {/* Header: Meta & Badges */}
            <div className="flex justify-between items-start mb-10">
              <div className="space-y-3">
                <span 
                  className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.3em] font-mono italic"
                  itemProp="category"
                >
                  {product.category || product.type}
                </span>
                {product.type === 'algorithm' && <LiveIndicator />}
              </div>
              
              {showPremiumBadges && product.isPremium && (
                <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30">
                  <Lock className="w-3.5 h-3.5 text-gold" />
                  <span className="text-[10px] font-black text-gold uppercase tracking-[0.2em]">Imperial</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 space-y-6">
              <h3 
                className="text-3xl md:text-4xl font-black text-white leading-[0.9] uppercase italic tracking-tighter group-hover:text-emerald-400 transition-colors"
                itemProp="name"
              >
                {product.name}
              </h3>
              
              <p 
                className="text-gray-400 text-base leading-relaxed line-clamp-2 font-medium opacity-80"
                itemProp="description"
              >
                {product.description || "Institutional grade execution model designed for liquid equity and sovereign debt markets."}
              </p>

              {/* Hardware Accelerated Performance Grid */}
              {product.type === 'algorithm' && product.performance && (
                <div className="grid grid-cols-2 gap-6 py-6 border-y border-white/5 my-8">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Alpha Pulse</span>
                    <div className="flex items-center gap-2">
                       <span className="text-2xl font-black text-emerald-400 font-mono tracking-tighter">
                        {product.performance.winRate}%
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Momentum</span>
                    <div className="flex items-center gap-2">
                       <span className="text-2xl font-black text-white font-mono tracking-tighter">
                        {product.performance.monthlyReturn || '12.4'}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer: Pricing & Action */}
            <div className="mt-10 flex items-center justify-between">
              <div itemProp="offers" itemScope itemType="https://schema.org/Offer" className="flex flex-col">
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1.5">Node Value</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-black text-white">$</span>
                  <span 
                    className="text-3xl font-black text-white tracking-tighter"
                    itemProp="price"
                  >
                    {product.price}
                  </span>
                  <meta itemProp="priceCurrency" content="USD" />
                </div>
              </div>

              <Button
                variant="sovereign"
                size="lg"
                className="rounded-[20px]"
                onClick={() => onSelect?.(product)}
                trackingEvent="view_product"
                trackingData={{ productId: product.id, productName: product.name }}
              >
                Deploy Node
              </Button>
            </div>
          </div>

          {/* Background Ambient Glow (GPU Accelerated) */}
          <div className="absolute -inset-2 bg-emerald-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -z-10" />
        </motion.article>
      ))}
    </div>
  );
};
