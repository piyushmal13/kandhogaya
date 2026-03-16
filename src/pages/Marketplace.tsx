import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Zap, ShieldCheck, Activity, TrendingUp } from "lucide-react";
import { AlgoCard } from "../components/algorithms/AlgoCard";
import { AlgoDetailModal } from "../components/algorithms/AlgoDetailModal";
import { getProducts } from "../services/apiHandlers";
import { Product } from "../types";

export const Marketplace = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlgo, setSelectedAlgo] = useState<Product | null>(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = filter === "All" 
    ? products 
    : products.filter(p => (p.category || "").includes(filter));

  const handleSubscribe = async (algo: Product, plan: string) => {
    console.log(`Subscribing to ${algo.name} (${plan})`);
    alert(`Redirecting to checkout for ${algo.name} - ${plan} Plan`);
  };

  return (
    <div className="min-h-screen bg-[#0A192F] pt-20 pb-20">
      
      {/* --- Hero Section --- */}
      <section className="relative py-20 overflow-hidden bg-[#0A192F]">
        {/* --- Institutional Background System --- */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* 1. Ambient Spotlight (Top Center) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.15),transparent_70%)] opacity-60" />

          {/* 2. Large Structural Grid - Static & Stable */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:120px_120px] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)]" />

          {/* 3. Subtle Horizon Glow (Bottom) */}
          <div className="absolute bottom-0 left-0 right-0 h-[300px] bg-gradient-to-t from-emerald-900/10 to-transparent opacity-40" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono tracking-widest mb-6"
          >
            <Zap className="w-3 h-3" />
            ALGO MARKETPLACE
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tighter"
          >
            Professional Trading <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
              Algorithms
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed mb-12"
          >
            Automated strategies designed by the IFXTrades research desk. Execute disciplined strategies based on market structure and quantitative models.
          </motion.p>

          {/* Filters */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {["All", "Scalping", "Swing", "Low Risk", "High Risk"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f === "Low Risk" ? "Low" : f === "High Risk" ? "High" : f === "Scalping" ? "High-Frequency Scalping" : f === "Swing" ? "Swing Trading" : f)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  (filter === f || (f === "Low Risk" && filter === "Low") || (f === "High Risk" && filter === "High") || (f === "Scalping" && filter === "High-Frequency Scalping") || (f === "Swing" && filter === "Swing Trading"))
                    ? "bg-emerald-500 text-black font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5"
                }`}
              >
                {f}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- Algo Grid --- */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((algo, i) => (
              <motion.div
                key={algo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <AlgoCard algo={algo} onSelect={setSelectedAlgo} />
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No algorithms found matching your criteria.
          </div>
        )}
      </section>

      {/* --- Trust Signals --- */}
      <section className="border-t border-white/5 bg-[#0A192F] py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-500">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-white font-bold mb-2">Verified Strategy</h3>
            <p className="text-gray-400 text-sm">Every algorithm passes rigorous backtesting and forward-testing phases.</p>
          </div>
          <div className="p-6">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-500">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-white font-bold mb-2">Backtested Performance</h3>
            <p className="text-gray-400 text-sm">Transparent performance metrics based on historical tick data.</p>
          </div>
          <div className="p-6">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-500">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-white font-bold mb-2">Institutional Desk</h3>
            <p className="text-gray-400 text-sm">Built by the same team managing our proprietary capital.</p>
          </div>
        </div>
      </section>

      {/* --- Detail Modal --- */}
      <AnimatePresence>
        {selectedAlgo && (
          <AlgoDetailModal 
            algo={selectedAlgo} 
            onClose={() => setSelectedAlgo(null)} 
            onSubscribe={handleSubscribe} 
          />
        )}
      </AnimatePresence>

    </div>
  );
};
