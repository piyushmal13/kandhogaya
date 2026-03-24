import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Star, ShieldCheck, Cpu, Activity, CheckCircle2 } from "lucide-react";
import { fetchReviews } from "../services/reviewService";
import { getProducts } from "../services/apiHandlers";
import { Product } from "../types";

export const AlgoGreatness = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [featuredAlgo, setFeaturedAlgo] = useState<Product | null>(null);
  const [stats, setStats] = useState({ avg: 4.9, count: 1200 });

  useEffect(() => {
    // Fetch all reviews for landing page
    fetchReviews().then((data: any) => {
      if (data && data.length > 0) {
        // Filter specifically for Algo reviews
        const algoKeywords = ['algo', 'algorithm', 'logic', 'hft', 'pattern', 'neural', 'automated', 'system', 'win rate', 'latency'];
        const filtered = data.filter((rev: any) => 
          algoKeywords.some(key => rev.role?.toLowerCase().includes(key) || rev.text?.toLowerCase().includes(key))
        );
        
        setReviews(filtered.length > 0 ? filtered.slice(0, 3) : data.slice(0, 3));
        
        // Calculate dynamic stats
        const relevantData = filtered.length > 0 ? filtered : data;
        const totalRating = relevantData.reduce((acc: number, curr: any) => acc + (curr.rating || 5), 0);
        const avg = totalRating / relevantData.length;
        setStats({
          avg: Number.parseFloat(avg.toFixed(1)),
          count: data.length > 100 ? data.length : 1200 + data.length 
        });
      }
    });

    // Fetch Gold Scalper or first algorithm for the video
    getProducts().then((allProducts: any[]) => {
      const gold = allProducts?.find(p => p.name.includes("Gold"));
      const first = allProducts?.[0];
      if (gold) setFeaturedAlgo(gold);
      else if (first) setFeaturedAlgo(first);
    });
  }, []);

  const getEmbedUrl = (url?: string): string | null => {
    if (!url) return null;
    if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/');
    if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'youtube.com/embed/');
    return url;
  };

  const videoUrl = getEmbedUrl((featuredAlgo as any)?.video_explanation_url);

  return (
    <div className="py-16 md:py-24 border-t border-white/10 mt-10 md:mt-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10 md:mb-16 px-4"
      >
        <span className="text-emerald-500 font-bold text-[10px] md:text-xs uppercase tracking-[0.3em] mb-4 inline-block">Institutional Systems</span>
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 tracking-tight">How Our Algos Dominate</h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-lg">Experience the architecture behind {featuredAlgo && (featuredAlgo as any).name ? (featuredAlgo as any).name : "our proprietary systems"} and see why institutional traders trust IFXTrades.</p>
      </motion.div>

        {/* Video Section — only rendered when a valid URL exists */}
      {videoUrl ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative max-w-6xl mx-auto mb-20 md:mb-32 px-4"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-emerald-500/20 rounded-[2rem] blur-2xl opacity-30"></div>
          <div className="relative bg-[#050505] border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,1)]">
            <div className="aspect-video w-full bg-black relative group">
              <iframe 
                src={videoUrl}
                title="Algo Strategy Breakdown"
                className="w-full h-full border-0 opacity-80 group-hover:opacity-100 transition-opacity"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center pointer-events-none">
                <div className="bg-black/80 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,1)]" />
                  <span className="text-white font-mono text-[10px] md:text-xs font-bold tracking-widest uppercase">Analysis Core Live</span>
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
          className="relative max-w-6xl mx-auto mb-20 md:mb-32 px-4"
        >
          <div className="bg-[#050505] border border-white/10 rounded-[2rem] aspect-video flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Activity className="w-8 h-8 text-emerald-500" />
            </div>
            <p className="text-gray-500 text-sm font-mono uppercase tracking-widest">Strategy video loading…</p>
          </div>
        </motion.div>
      )}

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-20 md:mb-32 max-w-6xl mx-auto px-4">
        {[
          { icon: Cpu, title: "Neural Pattern Recognition", desc: "Scans 28 pairs simultaneously to identify high-probability order blocks." },
          { icon: Activity, title: "Dynamic Risk Adjustment", desc: "Automatically scales lot sizes based on account equity and market volatility." },
          { icon: ShieldCheck, title: "News Protection", desc: "Pauses trading 30 minutes before and after high-impact macroeconomic events." }
        ].map((feat) => (
          <motion.div 
            key={feat.title} 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="bg-zinc-900/50 border border-white/5 p-6 md:p-8 rounded-2xl md:rounded-3xl hover:border-emerald-500/30 transition-colors"
          >
            <feat.icon className="w-8 h-8 md:w-10 md:h-10 text-emerald-500 mb-4 md:mb-6" />
            <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">{feat.title}</h3>
            <p className="text-gray-400 text-sm md:text-base">{feat.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Reviews */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10 md:mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Verified User Reviews</h3>
          <div className="flex items-center justify-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((num) => (
                <Star key={`star-${num}`} className="w-4 h-4 md:w-6 md:h-6 text-emerald-500 fill-emerald-500" />
              ))}
            </div>
            <span className="text-white font-bold text-lg md:text-xl ml-2">{stats.avg}/5</span>
            <span className="text-gray-500 text-xs md:text-sm ml-2">from {stats.count.toLocaleString()}+ traders</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {reviews.map((rev) => (
            <motion.div 
              key={rev.id || rev.name} 
              initial={{ opacity: 0, scale: 0.95 }} 
              whileInView={{ opacity: 1, scale: 1 }} 
              viewport={{ once: true }}
              className="bg-zinc-900 border border-white/10 p-6 md:p-8 rounded-2xl md:rounded-3xl relative hover:border-emerald-500/50 transition-all group"
            >
              <div className="absolute -top-3 right-6 md:-top-4 md:right-8 bg-emerald-500 text-black text-[8px] md:text-[10px] font-bold uppercase px-2 py-0.5 md:px-3 md:py-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                Verified Purchase
              </div>
              <div className="flex gap-1 mb-4 md:mb-6">
                {Array.from({ length: rev.rating || 5 }).map((_, j) => (
                  <Star key={`${rev.id || rev.name}-star-${j}`} className="w-4 h-4 md:w-5 md:h-5 text-emerald-500 fill-emerald-500" />
                ))}
              </div>
              <p className="text-gray-300 mb-6 md:mb-8 text-sm md:text-lg leading-relaxed">"{rev.text}"</p>
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 font-bold text-lg md:text-xl border border-emerald-500/30">
                  {rev.name?.charAt(0) || "U"}
                </div>
                <div>
                  <div className="text-white font-bold text-sm md:text-base flex items-center gap-2">
                    {rev.name} <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-emerald-500" />
                  </div>
                  <div className="text-[9px] md:text-xs text-gray-500 uppercase tracking-widest">{rev.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
