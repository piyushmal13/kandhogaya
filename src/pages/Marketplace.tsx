import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { Zap, ShieldCheck, Activity, TrendingUp } from "lucide-react";
import { PurchaseModal } from "../components/payments/PurchaseModal";
import { DashboardLayout } from '../components/institutional/DashboardLayout';
import { PageMeta } from "../components/site/PageMeta";
import { productService } from "../services/productService";
import { Product } from "../types";
import { AlgoDetailModal } from "../components/algorithms/AlgoDetailModal";
import { MarketplaceGrid } from "../components/institutional/MarketplaceGrid";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { useNavigate } from "react-router-dom";

export const Marketplace = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlgo, setSelectedAlgo] = useState<Product | null>(null);
  const [purchaseDetails, setPurchaseDetails] = useState<{ plan: string, amount: number, productId: string } | null>(null);
  const [filter, setFilter] = useState("All");
  const [assetFilter, setAssetFilter] = useState("All");
  const [riskFilter, setRiskFilter] = useState("All");

  const { user } = useAuth();
  const { info } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts();
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (algo: Product, plan: string) => {
    if (!user) {
      info("Please sign in to subscribe.");
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
    
    setSelectedAlgo(null);
  };

  const filteredProducts = products.filter((product) => {
    const matchesAsset = assetFilter === "All" || (product.supported_assets || []).some(a => a.includes(assetFilter));
    const matchesRisk = riskFilter === "All" || (product.risk_profile || "Medium") === riskFilter;
    const matchesCategory = filter === "All" || (product.category || "").includes(filter);
    return matchesAsset && matchesRisk && matchesCategory;
  });

  return (
    <DashboardLayout>
      <PageMeta
        title="Algorithm Marketplace"
        description="Explore IFXTrades trading algorithms, strategy filters, and subscription-ready systematic products."
        path="/marketplace"
        keywords={["trading algorithms", "algo marketplace", "MT5 trading bots"]}
      />

      <div className="space-y-12">
        {/* Institutional Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-[0.8]">
               Quant <span className="text-emerald-500">Terminal</span>
            </h1>
            <p className="text-sm text-white/40 max-w-2xl font-medium uppercase tracking-widest leading-relaxed">
              Systematic intelligence engineered for institutional liquidity. Execute high-probability models derived from sovereign capital flow and macroeconomic structural analysis.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            {["All", "Scalping", "Swing", "Trend Following"].map((label) => (
              <button
                key={label}
                onClick={() => setFilter(label)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all duration-300 border ${
                  filter === label
                    ? "bg-emerald-500 text-black border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                    : "bg-white/5 text-white/30 hover:text-white border-white/5"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Filters Matrix */}
        <div className="flex flex-wrap items-center gap-12 py-8 border-y border-white/5">
           <div className="flex items-center gap-6">
              <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] font-mono">Terminal Focus</span>
              <div className="flex gap-6">
                {["All", "Forex", "Indices", "Gold"].map(a => (
                  <button 
                    key={a}
                    onClick={() => setAssetFilter(a)}
                    className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:tracking-[0.4em] ${assetFilter === a ? 'text-emerald-500' : 'text-white/40 hover:text-white'}`}
                  >
                    {a}
                  </button>
                ))}
              </div>
           </div>
           <div className="flex items-center gap-6 pl-12 border-l border-white/5">
              <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] font-mono">Risk Class</span>
              <div className="flex gap-6">
                {["All", "Low", "Medium", "High"].map(r => (
                  <button 
                    key={r}
                    onClick={() => setRiskFilter(r)}
                    className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:tracking-[0.4em] ${riskFilter === r ? 'text-emerald-500' : 'text-white/40 hover:text-white'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
           </div>
        </div>

        <section className="relative z-20">
          <MarketplaceGrid 
            isLoading={loading}
            products={filteredProducts.map(algo => ({
              id: algo.id,
              name: algo.name,
              type: (algo.category?.toLowerCase() === 'course' ? 'course' : 'algorithm') as 'course' | 'algorithm',
              price: algo.price,
              isPremium: algo.price > 150 || algo.category === 'Premium',
              performance: algo.performance ? {
                winRate: algo.performance.win_rate,
                sharpe: (algo.performance as any).sharpe || 2.4,
                monthlyReturn: algo.performance.monthly_return
              } : undefined,
              category: algo.category,
              description: algo.description
            }))}
            onSelect={(p) => {
              const original = products.find(o => o.id === p.id);
              if (original) setSelectedAlgo(original);
            }}
          />

          {!loading && filteredProducts.length === 0 && (
            <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-20 text-center">
               <div className="text-xl font-black text-white/20 uppercase italic">No Algorithms Match Your Criteria</div>
               <p className="text-[9px] font-black text-white/10 uppercase tracking-[0.4em] mt-3">Adjust institutional filters to locate target nodes.</p>
            </div>
          )}
        </section>

        {/* Authority Benchmarks */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-12 border-t border-white/5">
          {[
            { icon: ShieldCheck, title: "Verified Integrity", desc: "Every algorithm passes rigorous institutional backtesting on raw exchange tick data." },
            { icon: Activity, title: "Live Telemetry", desc: "Real-time win rates and monthly returns synced directly via MT5/Supabase link." },
            { icon: TrendingUp, title: "Quant Origin", desc: "Built by the proprietary desk managing institutional capital. High-alpha execution." }
          ].map((item, i) => (
            <div key={i} className="space-y-4 group">
              <div className="w-12 h-12 bg-grad-primary/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20 group-hover:bg-grad-primary/20 transition-all">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-[12px] text-white font-black uppercase italic tracking-tighter transition-colors group-hover:text-emerald-400">{item.title}</h3>
              <p className="text-white/40 text-[10px] font-medium uppercase tracking-widest leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>
      </div>

      <AnimatePresence>
        {selectedAlgo && (
          <AlgoDetailModal 
            algo={selectedAlgo} 
            onClose={() => setSelectedAlgo(null)} 
            onSubscribe={handleSubscribe} 
          />
        )}
      </AnimatePresence>

      {purchaseDetails && (
        <PurchaseModal 
          plan={purchaseDetails.plan}
          amount={purchaseDetails.amount}
          productId={purchaseDetails.productId}
          onClose={() => setPurchaseDetails(null)}
        />
      )}
    </DashboardLayout>
  );
};
