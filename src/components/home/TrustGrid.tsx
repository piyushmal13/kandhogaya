import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Target, Zap, TrendingUp, Globe, Award } from 'lucide-react';
import { cn } from '../../utils/cn';

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Institutional Integrity",
    desc: "Rigorous quantitative models verified through exchange tick-data backtesting. Zero retail manipulation.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  },
  {
    icon: Target,
    title: "Precision Execution",
    desc: "High-performance algorithmic execution systems designed for MT5 and institutional liquidity pools.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10"
  },
  {
    icon: TrendingUp,
    title: "Performance Audited",
    desc: "Every signal and trade is archived for public transparency. Institutional grade win-rates, verified.",
    color: "text-purple-400",
    bg: "bg-purple-500/10"
  },
  {
    icon: Zap,
    title: "Market Intelligence",
    desc: "Proprietary XAUUSD macro research and high-frequency signals delivered via the Elite Terminal.",
    color: "text-amber-500",
    bg: "bg-amber-500/10"
  },
  {
    icon: Globe,
    title: "Global Compliance",
    desc: "Operational across India, Dubai, and Singapore. Adhering to the highest educational standards.",
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    icon: Award,
    title: "Certified Excellence",
    desc: "Recipient of Asia's Top Forex Intelligence Award 2025. Leading the algorithmic revolution.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10"
  }
];

export const TrustGrid = () => {
  return (
    <section className="py-32 bg-[var(--color10)] border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.03),transparent_70%)]" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-500 text-[10px] font-black uppercase tracking-[0.4em] mb-6"
          >
            Institutional Blueprint
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none"
          >
            The <span className="text-emerald-500">Corporate</span> Ecosystem
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-sm md:text-base font-bold uppercase tracking-widest mt-6 max-w-2xl mx-auto italic"
          >
            Designed by quants. Executed by machines. Trusted by thousands of elite traders across the globe.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 rounded-[3rem] bg-[var(--color6)] border border-white/5 group hover:border-emerald-500/20 transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className={cn(
                "w-16 h-16 rounded-[2rem] flex items-center justify-center mb-8 border border-white/5 transition-all group-hover:scale-110",
                pillar.bg, pillar.color
              )}>
                <pillar.icon className="w-7 h-7" />
              </div>

              <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-4 group-hover:text-emerald-400 transition-colors">
                {pillar.title}
              </h3>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                {pillar.desc}
              </p>

              <div className="mt-8 pt-8 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">Protocol Verified</span>
                    <div className="w-8 h-[2px] bg-emerald-500/20" />
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
