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

export const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [purchaseDetails, setPurchaseDetails] = useState<{ plan: string, amount: number, productId: string, downloadUrl?: string } | null>(null);
  
  const { user } = useAuth();
  const { info, success } = useToast();
  const navigate = useNavigate();

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
    
    setPurchaseDetails({
      plan: `${algo.name} (${plan})`,
      amount,
      productId: algo.id,
      downloadUrl: algo.metadata?.download_url
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
        {/* Apple-Style Hero Block */}
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto space-y-6 sm:space-y-10 pt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-black/40 backdrop-blur-2xl border border-white/10 text-white/80 text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(255,255,255,0.05)]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Institutional Marketplace
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-7xl md:text-[6.5rem] font-black mb-4 sm:mb-6 text-white tracking-tighter leading-[0.85] uppercase"
          >
            Algorithmic <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500">Perfection.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm sm:text-lg md:text-xl text-zinc-400 max-w-3xl font-medium leading-relaxed"
          >
            Deploy pre-audited quantitative models compiled directly into secure, standalone execution binaries. Connect systems to your brokerage host platforms with sub-1.2ms matching latency.
          </motion.p>

          {/* Institutional Blueprint (Advanced Marketplace Instructions) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-4xl w-full pt-4 font-mono select-none"
          >
            <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 space-y-3">
              <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                1. Algorithmic Architecture
              </h4>
              <p className="text-[9px] text-zinc-400 leading-normal uppercase tracking-wider font-bold">
                Strategies are compiled directly into secure MT5 (.EX5) binaries. The logic runs completely on client infrastructure with no capital custody.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 space-y-3">
              <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                2. Live Platform Deployment
              </h4>
              <p className="text-[9px] text-zinc-400 leading-normal uppercase tracking-wider font-bold">
                Deploy systems on dedicated cross-connected VPS systems (Equinix NY4/LD4 Datacenters). Connect via direct DMA protocols for latency-free execution.
              </p>
            </div>
          </motion.div>
        </div>

        {/* High-End Glassmorphic Control Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-4 sm:p-6 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6"
        >
          <div className="flex w-full lg:w-auto p-1.5 bg-white/[0.03] border border-white/5 rounded-2xl shrink-0 overflow-x-auto snap-x hide-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-1 sm:flex-none px-6 sm:px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer whitespace-nowrap snap-center ${
                  activeCategory === cat.id
                     ? "bg-white text-black shadow-lg"
                     : "text-zinc-500 hover:text-white hover:bg-white/5"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-[400px] group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors duration-300" />
            <input
              type="text"
              placeholder="Search Execution Models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-xs sm:text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all duration-300 font-medium"
            />
          </div>
        </motion.div>



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

      {/* Purchase Modal Overlay */}
      <AnimatePresence>
        {purchaseDetails && (
          <PurchaseModal 
            plan={purchaseDetails.plan}
            amount={purchaseDetails.amount}
            productId={purchaseDetails.productId}
            downloadUrl={purchaseDetails.downloadUrl}
            onClose={() => setPurchaseDetails(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );

  return content;
};
