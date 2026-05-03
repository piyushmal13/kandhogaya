import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import { Search, ShieldAlert } from "lucide-react";
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
    { id: "algorithm", label: "Trading Systems" },
    { id: "course", label: "Education" },
  ];

  const filteredProducts = products.filter((p: Product) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubscribe = async (algo: Product, plan: string) => {
    if (!user) {
      info("Authentication required for execution deployment.");
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
            type: p.category as any,
            price: p.price,
            category: p.category,
            description: p.description,
            isPremium: p.price > 1000,
            performance: p.performance ? {
              winRate: p.performance.win_rate || 72,
              monthlyReturn: p.performance.monthly_return || 12.4,
              sharpe: (p.performance as any).sharpe_ratio || 2.1
            } : undefined
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
    <div className={user ? "pb-24" : "pt-32 pb-24 md:pt-48 md:pb-48"}>
      <PageMeta
        title="Execution Desk | Institutional Assets"
        description="Access the IFX TRADES Execution Desk. High-frequency algorithmic models and institutional macro intelligence."
        path="/marketplace"
      />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 space-y-16">
        {/* Header Block */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          <div className="space-y-10 flex-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-emerald-500/[0.04] border border-emerald-500/[0.15] text-emerald-400 text-[10px] font-bold uppercase tracking-[0.2em]"
            >
              Asset Catalog
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight leading-[0.9]">
              Institutional <br />
              <span className="text-emerald-400">Allocations.</span>
            </h1>
            <p className="text-base md:text-xl text-white/40 max-w-2xl font-medium leading-relaxed">
              Professional execution models and systematic trading protocols designed for high-performance capital management and institutional risk governance.
            </p>
          </div>

          {/* Catalog Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-80 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="text"
                placeholder="Search Asset..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/30 focus:bg-white/[0.04] transition-all"
              />
            </div>
            <div className="flex p-1.5 bg-white/[0.02] border border-white/5 rounded-2xl">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
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
        <div className="relative min-h-[400px]">
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
          className="py-24 border-t border-white/5"
        >
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="order-2 lg:order-1 relative">
                 <div className="absolute inset-0 bg-emerald-500/5 blur-[100px] rounded-full opacity-30" />
                 <div className="relative rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
                    <img 
                      src="/brain/efc31965-26c1-4320-a414-7f19a27d9e96/mt5_elite_terminal_v2_1777798969670.png" 
                      alt="MT5 Elite Terminal" 
                      className="w-full h-auto"
                    />
                 </div>
              </div>
              <div className="order-1 lg:order-2 space-y-8">
                 <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-[0.2em]">
                    Infrastructure Layer
                 </div>
                 <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight italic uppercase">
                    Terminal <br />
                    <span className="text-emerald-400">Execution.</span>
                 </h2>
                 <p className="text-lg text-white/40 leading-relaxed font-medium">
                    Native MetaTrader 5 (MT5) integration with our proprietary bridge protocols. Experience zero-latency synchronization between our research models and your personal execution workstation.
                 </p>
                 <ul className="space-y-4">
                    {['Automated Liquidity Discovery', 'Algorithmic Risk Enforcement', 'Institutional Order Slicing'].map(feature => (
                       <li key={feature} className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-white/60">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
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
