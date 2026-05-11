import React from 'react';
import { motion } from 'motion/react';
import { Cpu, Code2, Layers, Terminal, Zap, ChevronRight, Binary, Globe } from 'lucide-react';
import { Button } from '../ui/Button';

const TechNode = ({ icon: Icon, title, description, delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.8 }}
    className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] hover:border-emerald-500/20 transition-all group relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
      <Icon size={100} />
    </div>
    
    <div className="relative z-10">
      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-bold text-white mb-4 tracking-tight uppercase italic">{title}</h3>
      <p className="text-sm text-white/40 leading-relaxed font-light">
        {description}
      </p>
    </div>
  </motion.div>
);

export const InstitutionalAlgorithms = () => {
  return (
    <section className="py-24 md:py-40 relative overflow-hidden bg-[#020202]">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/[0.02] rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
          <div className="space-y-10 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-emerald-500/[0.05] border border-emerald-500/[0.1] text-emerald-400 text-[10px] font-black uppercase tracking-[0.4em]"
            >
              Core Engineering Desk
            </motion.div>
            
            <h2 className="text-5xl md:text-8xl font-black text-white leading-[0.85] tracking-tighter uppercase italic">
              Bespoke <br />
              <span className="text-emerald-500">Algorithmic</span> <br />
              Machinery.
            </h2>
            
            <p className="text-lg md:text-xl text-white/40 max-w-xl font-light leading-relaxed mx-auto lg:mx-0">
              We develop proprietary execution engines using Python, C++, and advanced quantitative logic. Our systems are engineered for institutional-grade reliability and lightning-fast market response.
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-white/60 uppercase tracking-widest">
                <Binary size={14} className="text-emerald-500" /> Python 3.11+
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-white/60 uppercase tracking-widest">
                <Code2 size={14} className="text-emerald-500" /> C++ Performance Core
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-white/60 uppercase tracking-widest">
                <Globe size={14} className="text-emerald-500" /> FIX/REST API
              </div>
            </div>

            <div className="pt-6">
              <Button variant="elite" className="px-10 py-5">
                Request Custom Build <ChevronRight size={18} />
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-[4rem] bg-gradient-to-br from-white/[0.05] to-transparent border border-white/[0.1] p-8 md:p-16 relative overflow-hidden group">
               <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05] group-hover:opacity-[0.1] transition-opacity" />
               <div className="absolute inset-0 bg-emerald-500/[0.02] blur-[100px]" />
               
               <div className="relative h-full flex flex-col justify-center space-y-12">
                  <div className="flex items-center justify-between">
                     <div className="space-y-2">
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Compiler Sync</span>
                        <div className="text-3xl font-black text-white italic">0.2ms Execution</div>
                     </div>
                     <Terminal className="text-emerald-500/40 w-12 h-12" />
                  </div>

                  <div className="space-y-6">
                     {[
                       { label: 'Latency Optimization', value: 99.99 },
                       { label: 'Risk Intelligence', value: 87.4 },
                       { label: 'Data Processing', value: 94.2 }
                     ].map((metric, i) => (
                       <div key={metric.label} className="space-y-2">
                          <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-white/30">
                             <span>{metric.label}</span>
                             <span className="text-emerald-500">{metric.value}%</span>
                          </div>
                          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               whileInView={{ width: `${metric.value}%` }}
                               transition={{ delay: i * 0.2, duration: 1 }}
                               className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400" 
                             />
                          </div>
                       </div>
                     ))}
                  </div>

                  <div className="pt-4 flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                        <Zap size={18} className="text-emerald-400" />
                     </div>
                     <span className="text-[11px] font-black text-white/60 uppercase tracking-[0.2em]">Engine v8.2 Elite Activated</span>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <TechNode 
            icon={Cpu}
            title="Core Architecture"
            description="Parallel processing cores optimized for high-frequency market data ingestion and signal verification."
            delay={0.1}
          />
          <TechNode 
            icon={Layers}
            title="Multi-Layer Logic"
            description="Complex heuristic models that combine trend, volatility, and institutional order flow into a single decision matrix."
            delay={0.2}
          />
          <TechNode 
            icon={Binary}
            title="Quantitative Edge"
            description="Statistical arbitrage and mean reversion algorithms developed specifically for Gold and Global Currency pairs."
            delay={0.3}
          />
        </div>
      </div>
    </section>
  );
};
