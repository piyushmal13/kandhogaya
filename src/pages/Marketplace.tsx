import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import { Search, ShieldAlert, Zap, Activity } from "lucide-react";
import { PageMeta } from "../components/site/PageMeta";
import { MarketplaceGrid } from "../components/institutional/MarketplaceGrid";
import { AlgoDetailModal } from "../components/algorithms/AlgoDetailModal";
import { PurchaseModal } from "../components/payments/PurchaseModal";
import { productService } from "../services/productService";
import { useAuth } from "../contexts/AuthContext";
import { DashboardLayout } from "../components/institutional/DashboardLayout";
import { useToast } from "../contexts/ToastContext";
import { useNavigate } from "react-router-dom";
import { Product } from "../types";
import { EliteSocialProof } from "../components/institutional/EliteSocialProof";
import { CustomStrategyTerminal } from "../components/institutional/CustomStrategyTerminal";
import { ResizedImage } from "../components/ui/ResizedImage";

export const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [purchaseDetails, setPurchaseDetails] = useState<{ plan: string, amount: number, productId: string } | null>(null);
  
  const { user } = useAuth();
  const { info } = useToast();
  const navigate = useNavigate();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["marketplace_products"],
    queryFn: () => productService.getProducts(),
    staleTime: 300000,
  });

  const categories = [
    { id: "all", label: "All Assets" },
    { id: "algorithm", label: "Algorithmic Models" },
    { id: "course", label: "Quantitative Education" },
  ];

  const filteredProducts = products.filter((p: Product) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubscribe = async (algo: Product, plan: string) => {
    if (!user) {
      info("Authentication required for protocol deployment.");
      navigate("/login");
      return;
    }

    const priceMap: Record<string, number> = {
      'Monthly': algo.price,
      'Quarterly': algo.long_plan_offers?.find(o => o.duration === 'Quarterly')?.price || (algo.price * 3 * 0.8),
      'Yearly': algo.long_plan_offers?.find(o => o.duration === 'Yearly')?.price || (algo.price * 12 * 0.7),
      'Lifetime': algo.long_plan_offers?.find(o => o.duration === 'Lifetime')?.price || (algo.price * 50)
    };

    const amount = priceMap[plan] || algo.price;
    
    setPurchaseDetails({
      plan: `${algo.name} (${plan})`,
      amount,
      productId: algo.id
    });
    
    setSelectedProduct(null);
  };

  const renderGrid = () => {
    if (isLoading) {
      return <MarketplaceGrid products={[]} isLoading={true} />;
    }
    
    if (filteredProducts.length > 0) {
      return (
        <MarketplaceGrid
          products={filteredProducts.map((p: Product) => ({
            id: p.id,
            name: p.name,
            type: 'algorithm',
            price: p.price,
            category: p.risk_classification || 'Institutional',
            description: p.description,
            imageUrl: p.image_url,
            isPremium: p.price > 1000,
            performance: {
              winRate: 82, // Hardened baseline
              monthlyReturn: p.monthly_roi_pct || (p.performance?.roi_pct) || 12.4,
              sharpe: 2.1
            }
          }))}
          onSelect={(p) => {
            const original = products.find(o => o.id === p.id);
            if (original) setSelectedProduct(original);
          }}
        />
      );
    }

    return (
      <div className="py-32 flex flex-col items-center justify-center space-y-6 text-center border border-dashed border-white/5 rounded-[3rem]">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
           <ShieldAlert className="w-8 h-8 text-white/20" />
        </div>
        <div className="space-y-2">
           <h3 className="text-xl font-bold text-white italic">No Assets Matching Filter</h3>
           <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.3em] font-mono">Adjust your criteria or refresh the catalog</p>
        </div>
      </div>
    );
  };

  const content = (
    <div className={user ? "pb-24" : "pt-24 pb-12 md:pt-48 md:pb-48"}>
      <PageMeta
        title="Execution Desk | Institutional Algorithmic Assets"
        description="Access the IFX TRADES Execution Desk. Sovereign algorithmic models, quantitative education, and institutional macro intelligence."
        path="/marketplace"
        keywords={["algorithmic models", "quantitative education", "institutional trading assets", "market intelligence", "forex algorithms"]}
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-12 space-y-10 md:space-y-16">
        {/* Header Block */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 md:gap-12">
          <div className="space-y-6 md:space-y-10 flex-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-emerald-500/[0.04] border border-emerald-500/[0.15] text-emerald-400 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em]"
            >
              Institutional Asset Catalog
            </motion.div>
            <h1 className="text-[clamp(2.5rem,10vw,5rem)] lg:text-[8rem] font-black mb-2 md:mb-6 text-white tracking-tighter leading-[0.9] md:leading-[0.85] uppercase italic">
              Quantitative <br />
              <span className="text-emerald-400">Allocations.</span>
            </h1>
            <p className="text-base md:text-xl text-white/40 max-w-2xl font-medium leading-relaxed">
              Professional execution models and systematic protocols designed for high-performance capital management and institutional risk governance. Secure your allocation to our proprietary alpha strategies today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2 md:pt-4">
              <button 
                onClick={() => document.getElementById('asset-catalog')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 md:px-8 py-3.5 md:py-4 bg-emerald-500 hover:bg-emerald-400 text-black text-[10px] md:text-[11px] font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
              >
                 Secure Allocation
              </button>
              <button 
                onClick={() => navigate('/consultation')}
                className="px-6 md:px-8 py-3.5 md:py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] md:text-[11px] font-black uppercase tracking-widest rounded-xl transition-all"
              >
                 Request Engineering Review
              </button>
            </div>
          </div>

          {/* Catalog Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <div className="relative w-full sm:w-80 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="text"
                placeholder="Search Asset..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/30 focus:bg-white/[0.04] transition-all"
              />
            </div>
            <div className="flex p-1.5 bg-white/[0.02] border border-white/5 rounded-2xl w-full sm:w-auto overflow-x-auto scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    activeCategory === cat.id
                       ? "bg-emerald-500 text-black"
                       : "text-white/40 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Assets Grid */}
        <div id="asset-catalog" className="relative min-h-[400px]">
          {renderGrid()}
        </div>

        {/* Custom Strategy Engineering Terminal */}
        <CustomStrategyTerminal />

        {/* Elite Social Proof & Performance Validation */}
        <EliteSocialProof />

        {/* MT5 Institutional Showcase */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="py-12 md:py-24 border-t border-white/5"
        >
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-center">
              <div className="order-2 lg:order-1 relative">
                 <div className="absolute inset-0 bg-emerald-500/5 blur-[100px] rounded-full opacity-30" />
                 <div className="relative rounded-3xl md:rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl aspect-video bg-white/5">
                    <ResizedImage 
                      src="mt5_elite_terminal_v2.png" 
                      bucket="images"
                      alt="MT5 Elite Terminal" 
                      className="w-full h-full object-cover"
                    />
                 </div>
              </div>
              <div className="order-1 lg:order-2 space-y-6 md:space-y-8">
                 <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-[0.2em]">
                    Infrastructure Layer
                 </div>
                 <h2 className="text-[clamp(2rem,6vw,5rem)] md:text-7xl font-black text-white tracking-tighter leading-[0.9] italic uppercase">
                    Terminal <br />
                    <span className="text-emerald-400">Execution.</span>
                 </h2>
                 <p className="text-base md:text-lg text-white/40 leading-relaxed font-medium">
                    Native MetaTrader 5 (MT5) integration with our proprietary bridge protocols. Experience zero-latency synchronization between our research models and your institutional execution node.
                 </p>
                 
                 <div className="flex flex-wrap gap-3 md:gap-4">
                    {['MT5 Bridge EA', 'Risk Governance DLL', 'Institutional Indicators'].map(asset => (
                       <div key={asset} className="flex items-center gap-3 md:gap-4 p-4 md:p-5 rounded-2xl bg-white/[0.02] border border-white/5 group/asset hover:border-emerald-500/20 transition-all cursor-pointer">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover/asset:bg-emerald-500 group-hover/asset:text-black transition-all">
                             <Zap className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/50 group-hover/asset:text-white transition-colors">{asset}</span>
                       </div>
                    ))}
                 </div>

                 <ul className="space-y-3 md:space-y-4 pt-4 md:pt-6">
                    {['Automated Liquidity Discovery', 'Algorithmic Risk Enforcement', 'Institutional Order Slicing'].map(feature => (
                       <li key={feature} className="flex items-center gap-3 md:gap-4 text-[10px] md:text-[11px] font-black uppercase tracking-widest text-white/60">
                          <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500" />
                          {feature}
                       </li>
                    ))}
                 </ul>
              </div>
           </div>
        </motion.div>
      </div>

      {/* Detail Modal Overlay */}
      <AnimatePresence>
        {selectedProduct && (
          <AlgoDetailModal
            onClose={() => setSelectedProduct(null)}
            algo={selectedProduct}
            onSubscribe={handleSubscribe}
          />
        )}
      </AnimatePresence>

      {/* Purchase Modal Overlay */}
      <AnimatePresence>
        {purchaseDetails && (
          <PurchaseModal 
            plan={purchaseDetails.plan}
            amount={purchaseDetails.amount}
            productId={purchaseDetails.productId}
            onClose={() => setPurchaseDetails(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );

  if (user) {
    return <DashboardLayout>{content}</DashboardLayout>;
  }

  return content;
};
