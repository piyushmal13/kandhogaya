import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { Zap, ShieldCheck, Activity, TrendingUp } from "lucide-react";

import { PageMeta } from "../components/site/PageMeta";
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

  const filteredProducts = filter === "All" ? products : products.filter((product) => (product.category || "").includes(filter));

  const handleSubscribe = async (algo: Product, plan: string) => {
    console.log(`Subscribing to ${algo.name} (${plan})`);
    alert(`Redirecting to checkout for ${algo.name} - ${plan} Plan`);
  };

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <div className="min-h-screen bg-[#020202]">
      <PageMeta
        title="Algorithm Marketplace"
        description="Explore IFXTrades trading algorithms, strategy filters, and subscription-ready systematic products."
        path="/marketplace"
        keywords={["trading algorithms", "algo marketplace", "MT5 trading bots"]}
      />

      <section ref={ref} className="relative min-h-[70vh] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#020617] to-[#0a0a0a] pt-32 pb-24">
        <motion.div style={{ y, opacity }} className="absolute inset-0 overflow-hidden pointer-events-none will-change-transform">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.12),transparent_70%)] opacity-80" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:120px_120px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]" />
        </motion.div>

        {/* Floating background elements */}
        <div className="absolute inset-0 max-w-7xl mx-auto pointer-events-none hidden md:block">
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-10 top-1/4 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute right-10 bottom-1/4 w-40 h-40 bg-cyan-500/5 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono tracking-widest mb-6">
            <Zap className="w-3 h-3" />
            ALGO MARKETPLACE
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="text-5xl md:text-8xl font-bold text-white mb-8 tracking-tighter leading-tight">
            Professional Trading <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Algorithms</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-lg md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-12 font-light">
            Automated strategies designed by the IFXTrades quantitative research desk. Execute disciplined strategies based on strict market structure and probabilistic models.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="flex flex-wrap justify-center gap-4">
            {["All", "Scalping", "Swing", "Low Risk", "High Risk"].map((label) => (
              <button
                key={label}
                onClick={() => setFilter(label === "Low Risk" ? "Low" : label === "High Risk" ? "High" : label === "Scalping" ? "High-Frequency Scalping" : label === "Swing" ? "Swing Trading" : label)}
                className={`px-8 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${
                  (filter === label || (label === "Low Risk" && filter === "Low") || (label === "High Risk" && filter === "High") || (label === "Scalping" && filter === "High-Frequency Scalping") || (label === "Swing" && filter === "Swing Trading"))
                    ? "bg-emerald-500 text-black shadow-[0_0_30px_rgba(16,185,129,0.4)] scale-105"
                    : "bg-[#111820]/80 backdrop-blur-xl text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
                }`}
              >
                {label}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-24 relative z-20 -mt-10">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
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
          <div className="text-center py-20 text-gray-500">
            No algorithms found matching your criteria.
          </div>
        ) : null}
      </section>

      <section className="border-t border-white/5 bg-[#020202] py-24">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <motion.div whileHover={{ y: -5 }} className="p-8 bg-[#0a0a0a] rounded-3xl border border-white/5">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-500 border border-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl text-white font-bold mb-3">Verified Strategy</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Every algorithm passes rigorous backtesting and forward-testing phases.</p>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="p-8 bg-[#0a0a0a] rounded-3xl border border-white/5">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-500 border border-emerald-500/20">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-xl text-white font-bold mb-3">Backtested Performance</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Transparent performance metrics based on historical tick data.</p>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="p-8 bg-[#0a0a0a] rounded-3xl border border-white/5">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-500 border border-emerald-500/20">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl text-white font-bold mb-3">Institutional Desk</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Built by the same quantitative team managing our proprietary capital.</p>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {selectedAlgo ? (
          <AlgoDetailModal algo={selectedAlgo} onClose={() => setSelectedAlgo(null)} onSubscribe={handleSubscribe} />
        ) : null}
      </AnimatePresence>
    </div>
  );
};
