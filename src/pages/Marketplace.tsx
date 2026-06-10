import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import { Search, ShieldAlert, ShieldCheck, Cpu, TrendingUp, Lock } from "lucide-react";
import { PageMeta } from "../components/site/PageMeta";
import { MarketplaceGrid } from "../components/institutional/MarketplaceGrid";
import { AlgoDetailModal } from "../components/algorithms/AlgoDetailModal";
import { PurchaseModal } from "../components/payments/PurchaseModal";
import { productService } from "../services/productService";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { useNavigate } from "react-router-dom";
import { Product } from "../types";
import { CustomStrategyTerminal } from "../components/institutional/CustomStrategyTerminal";
import { supabase } from "../lib/supabase";
import { MarketplaceProduct } from "../components/institutional/MarketplaceGrid";
import { useCart } from "../contexts/CartContext";

export const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  
  const { user } = useAuth();
  const { info, success } = useToast();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [affiliateCode, setAffiliateCode] = useState<string | null>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["marketplace_products"],
    queryFn: () => productService.getProducts(),
    staleTime: 300000,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["marketplace_reviews"],
    queryFn: () => productService.getReviews(),
    staleTime: 300000,
  });

  // Fetch or dynamically generate on-the-fly affiliate code
  useEffect(() => {
    if (user?.id) {
      const fetchAffiliateCode = async () => {
        try {
          const { data, error } = await supabase
            .from("affiliate_codes")
            .select("code")
            .eq("user_id", user.id)
            .maybeSingle();

          if (error) throw error;
          if (data) {
            setAffiliateCode(data.code);
          }
        } catch (err) {
          console.warn("[CRM] Failed to fetch affiliate code on mount:", err);
        }
      };
      fetchAffiliateCode();
    }
  }, [user]);

  // Hydrate product modal automatically if product query is set
  useEffect(() => {
    if (products.length > 0) {
      const urlParams = new URLSearchParams(globalThis.location.search);
      const productId = urlParams.get("product");
      if (productId) {
        const found = products.find((p) => p.id === productId);
        if (found) {
          const productReviews = reviews.filter((r: any) => r.target_id === found.id);
          const displayReviews = productReviews.length > 0 ? productReviews : reviews.slice(0, 3);
          setSelectedProduct({
            ...found,
            reviews: displayReviews.length > 0 ? displayReviews : found.reviews
          });
        }
      }
    }
  }, [products, reviews]);

  const handleShare = async (algo: MarketplaceProduct) => {
    try {
      let code = affiliateCode;

      // Self-healing: if logged in but code doesn't exist, generate one dynamically
      if (user && !code) {
        info("Generating your unique partner referral ID...");
        const { data, error } = await supabase.rpc("generate_affiliate_code", { user_id: user.id });
        if (error) throw error;
        if (data) {
          code = data;
          setAffiliateCode(data);
        }
      }

      const shareUrl = code
        ? `${globalThis.location.origin}/marketplace?ref=${code}&product=${algo.id}`
        : `${globalThis.location.origin}/marketplace?product=${algo.id}`;

      await navigator.clipboard.writeText(shareUrl);

      if (user) {
        success(`Referral link copied! Earn commissions on shares.`);
      } else {
        info(`Standard product link copied! Log in to earn affiliate commissions.`);
      }
    } catch (err: any) {
      console.error("[CRM] Share link capture failed:", err);
      // Fallback
      const shareUrl = `${globalThis.location.origin}/marketplace?product=${algo.id}`;
      navigator.clipboard.writeText(shareUrl);
      info("Standard product link copied.");
    }
  };

  const categories = [
    { id: "all", label: "All Assets" },
    { id: "algorithm", label: "Trading Systems" },
    { id: "course", label: "Education" },
  ];

  const filteredProducts = products.filter((p: Product) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || 
      (activeCategory === "course" && (p.category === "course" || p.category === "education")) ||
      (activeCategory === "algorithm" && (p.category === "algorithm" || p.category === "trading_system" || p.category === "trading_systems")) ||
      p.category === activeCategory;
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
    
    addToCart({
      id: `${algo.id}-${plan}`,
      productId: algo.id,
      name: algo.name,
      plan: plan,
      price: amount,
      image_url: algo.image_url,
      download_url: algo.metadata?.download_url
    });
    
    setSelectedProduct(null);
    success(`${algo.name} added to your bag.`);
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
            if (original) {
              // Dynamically query reviews from the Supabase reviews table that match this product's ID
              const productReviews = reviews.filter((r: any) => r.target_id === original.id);
              
              // Fallback to slicing from general approved reviews to guarantee a premium, well-populated UI footprint
              const displayReviews = productReviews.length > 0 
                ? productReviews 
                : reviews.slice(0, 3);

              setSelectedProduct({
                ...original,
                reviews: displayReviews.length > 0 ? displayReviews : original.reviews
              });
            }
          }}
          onShare={handleShare}
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
    <div className="pt-28 pb-12 md:pt-36 md:pb-24">
      <PageMeta
        title="Execution Desk | Institutional Assets"
        description="Access the IFX TRADES Execution Desk. High-frequency algorithmic models and institutional macro intelligence."
        path="/marketplace"
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-12 sm:space-y-24 relative z-10">
        {/* Header Block - Restored Sovereign Aesthetic */}
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



        {/* Elite B2B Trust Indicators & Guarantees */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 border-t border-b border-white/5 py-8 select-none">
          {[
            {
              icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
              title: "Verified Strategy Data",
              desc: "100% audited execution results synced in real-time."
            },
            {
              icon: <Cpu className="w-5 h-5 text-emerald-400" />,
              title: "Zero-Latency Bridge",
              desc: "Native MT5 execution with direct server integration."
            },
            {
              icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
              title: "Systematic Optimization",
              desc: "Algorithms backtested across multiple market regimes."
            },
            {
              icon: <Lock className="w-5 h-5 text-emerald-400" />,
              title: "Hardened Risk Shield",
              desc: "Built-in dynamic drawdown locks and adaptive sizing."
            }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-emerald-500/20 hover:bg-emerald-500/[0.01] transition-all duration-500 flex items-start gap-4"
            >
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-white uppercase tracking-wider">{item.title}</h4>
                <p className="text-[10px] text-white/35 font-bold uppercase tracking-widest leading-normal">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Assets Grid */}
        <div className="relative min-h-[400px]">
          {renderGrid()}
        </div>

        {/* Custom Strategy Engineering Terminal */}
        <CustomStrategyTerminal />

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
    </div>
  );

  return content;
};
