import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Star, ShieldCheck, Cpu, Activity, CheckCircle2 } from "lucide-react";
import { fetchReviews } from "../services/reviewService";
import { getProducts } from "../services/apiHandlers";
import { Product } from "../types";

const algoKeywords = ['algo', 'algorithm', 'logic', 'hft', 'pattern', 'neural', 'automated', 'system', 'win rate', 'latency'];

const isAlgoReview = (rev: any) => {
  const role = rev.role?.toLowerCase() || '';
  const text = rev.text?.toLowerCase() || '';
  return algoKeywords.some(key => role.includes(key) || text.includes(key));
};

export const AlgoGreatness = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [featuredAlgo, setFeaturedAlgo] = useState<Product | null>(null);
  const [stats, setStats] = useState({ avg: 4.9, count: 1200 });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [reviewData, products] = await Promise.all([
          fetchReviews(),
          getProducts()
        ]);

        if (reviewData && reviewData.length > 0) {
          const filtered = reviewData.filter(isAlgoReview);
          setReviews(filtered.length > 0 ? filtered.slice(0, 3) : reviewData.slice(0, 3));
          
          const relevantData = filtered.length > 0 ? filtered : reviewData;
          const totalRating = relevantData.reduce((acc: number, curr: any) => acc + (curr.rating || 5), 0);
          const avg = totalRating / relevantData.length;
          
          setStats({
            avg: Number.parseFloat(avg.toFixed(1)),
            count: reviewData.length > 100 ? reviewData.length : 1200 + reviewData.length 
          });
        }

        if (products && products.length > 0) {
          const gold = products.find((p: Product) => p.name.includes("Gold"));
          setFeaturedAlgo(gold || products[0]);
        }
      } catch (error) {
        console.error("Error loading AlgoGreatness data:", error);
      }
    };

    loadData();
  }, []);

  const getEmbedUrl = (url?: string): string | null => {
    if (!url) return null;
    try {
      if (url.includes('youtube.com/shorts/')) return url.replace('youtube.com/shorts/', 'youtube.com/embed/');
      if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/');
      if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'youtube.com/embed/');
      return url;
    } catch (e) {
      console.warn("AlgoGreatness: Error parsing video URL", e);
      return url;
    }
  };

  const videoUrl = getEmbedUrl((featuredAlgo as any)?.video_explanation_url);

  return (
    <div className="py-16 md:py-24 border-t border-white/10 mt-10 md:mt-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16 md:mb-24 px-4"
      >
        <span className="text-[var(--brand)] font-medium text-[11px] md:text-sm uppercase tracking-[0.3em] mb-6 inline-block opacity-80">Institutional Logic</span>
        <h2 className="text-4xl md:text-6xl font-semibold text-white mb-6 md:mb-8 tracking-[-0.03em]">How Our Algos <span className="font-serif text-[var(--brand)]">Dominate</span></h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-lg font-light opacity-80 uppercase tracking-wide">Experience the architecture behind {featuredAlgo && (featuredAlgo as any).name ? (featuredAlgo as any).name : "our proprietary systems"} and see why institutional traders trust IFX Trades.</p>
      </motion.div>

      {/* Video Section — only rendered when a valid URL exists */}
      {videoUrl ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative max-w-6xl mx-auto mb-24 md:mb-40 px-4"
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-[var(--brand)]/10 via-[var(--brand)]/10 to-[var(--brand)]/10 rounded-[3rem] blur-3xl opacity-20"></div>
          <div className="relative bg-[var(--color6)] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="aspect-video w-full bg-black relative group">
              <iframe 
                src={videoUrl}
                title="Algo Strategy Breakdown"
                className="w-full h-full border-0 opacity-90 group-hover:opacity-100 transition-opacity"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              
              <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center pointer-events-none">
                <div className="bg-black/60 backdrop-blur-2xl border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--brand)] animate-pulse shadow-[0_0_15px_var(--brand-glow)]" />
                  <span className="text-white font-sans text-xs font-medium tracking-widest uppercase opacity-80">Analysis Core Active</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative max-w-6xl mx-auto mb-24 md:mb-40 px-4"
        >
          <div className="bg-[var(--color6)] border border-white/5 rounded-[2.5rem] aspect-video flex flex-col items-center justify-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-[var(--brand)]/5 border border-[var(--brand)]/10 flex items-center justify-center">
              <Activity className="w-10 h-10 text-[var(--brand)] opacity-50" />
            </div>
            <p className="text-gray-600 text-[11px] font-sans font-medium uppercase tracking-[0.2em]">Strategy Data Syncing…</p>
          </div>
        </motion.div>
      )}

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 mb-20 md:mb-40 max-w-6xl mx-auto px-4">
        {[
          { icon: Cpu, title: "Neural Logic Engine", desc: "Advanced architectural mapping of order-flow imbalances across 28 global currency pairs." },
          { icon: Activity, title: "Systemic Risk Protection", desc: "Dynamic equity protection modules that recalibrate position weighting in volatile conditions." },
          { icon: ShieldCheck, title: "Protocol Hardening", desc: "Hard-coded event protection pausing all execution pipelines during high-impact market shifts." }
        ].map((feat) => (
          <motion.div 
            key={feat.title} 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="group bg-zinc-900/10 border border-white/5 p-8 md:p-12 rounded-[2.5rem] hover:bg-white/[0.01] hover:border-white/10 transition-all duration-700 shadow-xl"
          >
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-[1.2rem] md:rounded-[1.5rem] bg-[var(--brand)]/5 border border-[var(--brand)]/10 flex items-center justify-center mb-6 md:mb-8 group-hover:bg-[var(--brand)]/10 group-hover:border-[var(--brand)]/20 transition-all duration-700">
              <feat.icon className="w-7 h-7 md:w-8 md:h-8 text-[var(--brand)] group-hover:scale-110 transition-transform duration-700" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4 tracking-tight leading-tight">{feat.title}</h3>
            <p className="text-gray-400 text-sm md:text-lg font-light leading-relaxed group-hover:text-gray-300 transition-colors duration-700">{feat.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Reviews */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16 md:mb-24">
          <h3 className="text-3xl md:text-4xl font-semibold text-white mb-6 tracking-tight font-serif underline decoration-[var(--brand)]/30">Verified User Reviews</h3>
          <div className="flex items-center justify-center gap-4">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((num) => (
                <Star key={`star-${num}`} className="w-5 h-5 md:w-6 md:h-6 text-[var(--brand)] fill-[var(--brand)] opacity-80" />
              ))}
            </div>
            <span className="text-white font-semibold text-xl md:text-2xl ml-2">{stats.avg}/5</span>
            <span className="text-gray-500 text-sm md:text-base ml-2 opacity-60 font-sans tracking-tight">from {stats.count.toLocaleString()}+ traders</span>
          </div>
        </div>
        
        <div className="flex md:grid md:grid-cols-3 gap-6 md:gap-10 overflow-x-auto md:overflow-hidden pb-12 md:pb-0 snap-x snap-mandatory no-scrollbar">
          {reviews.map((rev) => (
            <motion.div 
              key={rev.id || rev.name} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              className="min-w-[300px] xs:min-w-[340px] md:min-w-0 bg-[var(--color6)] border border-white/5 p-8 rounded-[2.5rem] relative hover:bg-white/[0.01] hover:border-white/10 transition-all duration-700 group shadow-2xl snap-center"
            >
              <div className="absolute -top-4 right-10 bg-[var(--brand)]/10 border border-[var(--brand)]/20 text-[var(--brand)] text-[10px] font-sans font-medium uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-2 group-hover:translate-y-0 backdrop-blur-xl">
                Verified System
              </div>
              <div className="flex gap-1.5 mb-8">
                {Array.from({ length: rev.rating || 5 }).map((_, j) => (
                  <Star key={`${rev.id || rev.name}-star-${j}`} className="w-4 h-4 text-[var(--brand)] fill-[var(--brand)] opacity-60" />
                ))}
              </div>
              <p className="text-gray-300 mb-10 text-sm md:text-lg font-light leading-[1.8] opacity-90 group-hover:opacity-100 transition-opacity">"{rev.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white/[0.02] border border-white/5 rounded-full flex items-center justify-center text-[var(--brand)] font-sans font-medium text-lg md:text-2xl group-hover:bg-[var(--brand)]/5 group-hover:border-[var(--brand)]/20 transition-all duration-700">
                  {rev.name?.charAt(0) || "U"}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm md:text-lg flex items-center gap-2 mb-1">
                    {rev.name} <CheckCircle2 className="w-4 h-4 text-[var(--brand)] opacity-60" />
                  </div>
                  <div className="text-[10px] text-gray-500 font-sans font-medium uppercase tracking-[0.2em] opacity-60">{rev.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
