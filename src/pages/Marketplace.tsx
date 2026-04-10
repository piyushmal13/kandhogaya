import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { Zap, ShieldCheck, Activity, TrendingUp } from "lucide-react";
import { PurchaseModal } from "../components/payments/PurchaseModal";

import { PageMeta } from "../components/site/PageMeta";
import { AlgoCard } from "../components/algorithms/AlgoCard";
import { AlgoDetailModal } from "../components/algorithms/AlgoDetailModal";
import { productService } from "../services/productService";
import { Product } from "../types";
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

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const filteredProducts = products.filter((product) => {
    const matchesAsset = assetFilter === "All" || (product.supported_assets || []).some(a => a.includes(assetFilter));
    const matchesRisk = riskFilter === "All" || (product.risk_profile || "Medium") === riskFilter;
    const matchesCategory = filter === "All" || (product.category || "").includes(filter);
    return matchesAsset && matchesRisk && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[var(--color10)]">
      <PageMeta
        title="Algorithm Marketplace"
        description="Explore IFXTrades trading algorithms, strategy filters, and subscription-ready systematic products."
        path="/marketplace"
        keywords={["trading algorithms", "algo marketplace", "MT5 trading bots"]}
      />

      <section ref={ref} className="relative min-h-[70vh] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[var(--color30)] to-[var(--color7)] pt-32 pb-24">
        <motion.div style={{ y, opacity }} className="absolute inset-0 overflow-hidden pointer-events-none will-change-transform">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.12),transparent_70%)] opacity-80" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:120px_120px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]" />
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono tracking-widest mb-6">
            <Zap className="w-3 h-3" />
            ALGO MARKETPLACE
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="text-6xl md:text-9xl font-black text-white mb-10 tracking-tighter leading-[0.85] uppercase italic font-serif">
            Quant <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-500 to-emerald-500">Terminal</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-lg md:text-2xl text-gray-400 max-w-4xl mx-auto leading-relaxed mb-16 font-medium opacity-80">
            Systematic intelligence engineered for institutional liquidity. Execute high-probability models derived from sovereign capital flow and macroeconomic structural analysis.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="space-y-8">
            {/* Strategy Filter */}
            <div className="flex flex-wrap justify-center gap-3">
              {["All", "Scalping", "Swing", "Trend Following", "Event-Driven"].map((label) => (
                <button
                  key={label}
                  onClick={() => setFilter(label)}
                  className={`px-6 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all duration-300 ${
                    filter === label
                      ? "bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                      : "bg-white/5 text-gray-400 hover:text-white border border-white/5"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Asset & Risk Filter */}
            <div className="flex flex-wrap justify-center gap-12 pt-10 border-t border-white/5">
              <div className="flex items-center gap-6">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] font-mono">Terminal Focus</span>
                <div className="flex gap-6">
                  {["All", "Forex", "Crypto", "Indices", "Gold"].map(a => (
                    <button 
                      key={a}
                      onClick={() => setAssetFilter(a)}
                      className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:tracking-[0.4em] ${assetFilter === a ? 'text-emerald-500' : 'text-gray-600 hover:text-gray-400'}`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] font-mono">Risk Class</span>
                <div className="flex gap-6">
                  {["All", "Low", "Medium", "High"].map(r => (
                    <button 
                      key={r}
                      onClick={() => setRiskFilter(r)}
                      className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:tracking-[0.4em] ${riskFilter === r ? 'text-emerald-500' : 'text-gray-600 hover:text-gray-400'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-24 relative z-20 -mt-20">
        {loading ? (
          <div className="flex items-center justify-center py-40">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((algo, index) => (
              <motion.div 
                key={algo.id} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true, margin: "-100px" }} 
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              >
                <AlgoCard algo={algo} onSelect={setSelectedAlgo} />
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 ? (
          <div className="bg-[var(--color7)] border border-white/5 rounded-[3rem] p-20 text-center">
             <div className="text-xl font-black text-gray-600 uppercase italic">No Algorithms Match Your Criteria</div>
             <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.3em] mt-3">Try adjusting your institutional filters.</p>
          </div>
        ) : null}
      </section>

      <section className="bg-[var(--color6)] py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-6">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-500 border border-emerald-500/10">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl text-white font-black uppercase italic tracking-tighter">Verified Integrity</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Every algorithm passes rigorous institutional backtesting and forward-testing phases on real exchange tick data.</p>
          </div>
          <div className="space-y-6">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-500 border border-emerald-500/10">
              <Activity className="w-8 h-8" />
            </div>
            <h3 className="text-xl text-white font-black uppercase italic tracking-tighter">Live Performance</h3>
            <p className="text-gray-500 text-sm leading-relaxed">View real-time win rates and monthly returns directly within the marketplace. Transparency is our baseline.</p>
          </div>
          <div className="space-y-6">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-500 border border-emerald-500/10">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h3 className="text-xl text-white font-black uppercase italic tracking-tighter">Quant Desk Origin</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Built by the same quantitative team managing proprietary capital. These are not tools; they are assets.</p>
          </div>
        </div>
      </section>

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
    </div>
  );
};
