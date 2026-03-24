import React from "react";
import { motion } from "motion/react";
import { Zap, Cpu, GraduationCap, BarChart3, Globe, Workflow } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    title: "AI Signal Engine",
    desc: "Proprietary HFT algorithms scanning 40+ assets in real-time.",
    icon: Zap,
    link: "/signals",
    color: "from-emerald-500/20 to-cyan-500/20",
    glow: "neon-glow-emerald"
  },
  {
    title: "Elite Academy",
    desc: "Institutional trading floor mentorship and certified courses.",
    icon: GraduationCap,
    link: "/courses",
    color: "from-purple-500/20 to-pink-500/20",
    glow: "neon-glow-purple"
  },
  {
    title: "Bot Ecosystem",
    desc: "Automated trading execution with low-latency API integration.",
    icon: Cpu,
    link: "/products",
    color: "from-blue-500/20 to-indigo-500/20",
    glow: "neon-glow-cyan"
  },
  {
    title: "Live Analysis",
    desc: "Daily market breakdowns and real-time trade ideas.",
    icon: BarChart3,
    link: "/signals",
    color: "from-orange-500/20 to-red-500/20",
    glow: "shadow-[0_0_20px_rgba(249,115,22,0.3)]"
  }
];

export const EcosystemSection = () => {
  return (
    <section className="py-24 bg-[#020202] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.03),transparent_70%)]" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono tracking-[0.2em] uppercase mb-6"
          >
            <Globe className="w-3.5 h-3.5" />
            Global Infrastructure
          </motion.div>
          <h2 className="text-white text-4xl md:text-6xl font-bold tracking-tighter mb-6">
            The IFX <span className="gradient-text">Ecosystem</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed font-mono">
            Professional-grade tools and intelligence for the modern decentralized trader.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={s.link} className="block group">
                <div className="glass-card h-full p-8 border-white/5 hover:border-white/10 transition-all duration-500 relative overflow-hidden flex flex-col items-center text-center">
                  <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  <div className={`w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 relative z-10 ${s.glow}`}>
                    <s.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-4 relative z-10 group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed font-mono relative z-10 mb-8">{s.desc}</p>
                  
                  <div className="mt-auto flex items-center gap-2 text-[10px] font-mono text-emerald-500 tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 uppercase font-black">
                    Enter Portal <Workflow className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
