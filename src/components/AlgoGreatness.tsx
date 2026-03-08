import React from "react";
import { motion } from "motion/react";
import { Play, Star, ShieldCheck, Cpu, Activity, CheckCircle2 } from "lucide-react";

export const AlgoGreatness = () => {
  const reviews = [
    { name: "Michael T.", role: "Prop Firm Funded", text: "Passed my $100k challenge in 12 days using the XAUUSD bot. The drawdown management is insane.", rating: 5 },
    { name: "Sarah L.", role: "Retail Trader", text: "I've tried dozens of EAs. This is the only one that actually adapts to news events instead of blowing the account.", rating: 5 },
    { name: "David K.", role: "Institutional Analyst", text: "The underlying logic mirrors institutional order block trading. Very impressive architecture.", rating: 5 }
  ];

  return (
    <div className="py-24 border-t border-white/10 mt-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-emerald-500 font-bold text-xs uppercase tracking-[0.3em] mb-4 inline-block">Under the Hood</span>
        <h2 className="text-5xl font-bold text-white mb-6 tracking-tight">How Our Algos Dominate</h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">Watch the breakdown of our proprietary trading logic and see why thousands trust IFXTrades.</p>
      </motion.div>

      {/* Video Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative max-w-5xl mx-auto mb-32 group cursor-pointer"
        onClick={() => alert("Video player opening...")}
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-emerald-900 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative bg-zinc-900 border border-white/10 rounded-[3rem] aspect-video overflow-hidden flex items-center justify-center">
          <img src="https://picsum.photos/seed/tradingchart/1920/1080" alt="Algo Video" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-black/40" />
          
          {/* Play Button */}
          <div className="relative z-10 w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.5)] group-hover:scale-110 transition-transform">
            <Play className="w-10 h-10 text-black ml-2" />
          </div>
          
          <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
            <div>
              <div className="text-white font-bold text-2xl mb-2">The Neural Net Architecture</div>
              <div className="text-emerald-400 font-mono text-sm">04:28 / 12:15</div>
            </div>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <div className="text-emerald-500 text-xs font-bold uppercase tracking-widest">Live Demo</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32 max-w-6xl mx-auto">
        {[
          { icon: Cpu, title: "Neural Pattern Recognition", desc: "Scans 28 pairs simultaneously to identify high-probability order blocks." },
          { icon: Activity, title: "Dynamic Risk Adjustment", desc: "Automatically scales lot sizes based on account equity and market volatility." },
          { icon: ShieldCheck, title: "News Protection", desc: "Pauses trading 30 minutes before and after high-impact macroeconomic events." }
        ].map((feat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }} 
            className="bg-zinc-900/50 border border-white/5 p-8 rounded-3xl hover:border-emerald-500/30 transition-colors"
          >
            <feat.icon className="w-10 h-10 text-emerald-500 mb-6" />
            <h3 className="text-xl font-bold text-white mb-3">{feat.title}</h3>
            <p className="text-gray-400">{feat.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Reviews */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-white mb-4">Verified User Reviews</h3>
          <div className="flex items-center justify-center gap-2">
            <div className="flex">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 text-emerald-500 fill-emerald-500" />)}
            </div>
            <span className="text-white font-bold text-xl ml-2">4.9/5</span>
            <span className="text-gray-500 ml-2">from 1,200+ traders</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.95 }} 
              whileInView={{ opacity: 1, scale: 1 }} 
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }} 
              className="bg-zinc-900 border border-white/10 p-8 rounded-3xl relative hover:border-emerald-500/50 transition-all group"
            >
              <div className="absolute -top-4 right-8 bg-emerald-500 text-black text-[10px] font-bold uppercase px-3 py-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                Verified Purchase
              </div>
              <div className="flex gap-1 mb-6">
                {[...Array(rev.rating)].map((_, j) => <Star key={j} className="w-5 h-5 text-emerald-500 fill-emerald-500" />)}
              </div>
              <p className="text-gray-300 mb-8 text-lg leading-relaxed">"{rev.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 font-bold text-xl border border-emerald-500/30">
                  {rev.name.charAt(0)}
                </div>
                <div>
                  <div className="text-white font-bold flex items-center gap-2">
                    {rev.name} <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest">{rev.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
