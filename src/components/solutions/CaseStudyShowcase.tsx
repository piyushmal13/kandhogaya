import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { SovereignButton } from '@/components/ui/SovereignButton';

const STUDIES = [
  {
    client: 'Dubai Family Office',
    industry: 'Gold / XAUUSD',
    result: '+34% Annualized',
    metric: '$2.4M Net Profit',
    tags: ['MT5', 'Alpha-HFT', 'Quantum-Risk'],
    image: 'https://images.unsplash.com/photo-1611974717482-48240acdf16c?q=80&w=2670&auto=format&fit=crop'
  },
  {
    client: 'Singapore Prop Firm',
    industry: 'Multi-Asset',
    result: '84.2% Win Rate',
    metric: 'Passed $200K Audit',
    tags: ['Python', 'Direct API', 'Backtest-v4'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop'
  },
  {
    client: 'European Hedge Fund',
    industry: 'Forex/Indices',
    result: '-40% Drawdown',
    metric: 'Sharpe Ratio: 2.1',
    tags: ['AWS Nodes', 'Low Latency', 'Sentry-Pulse'],
    image: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?q=80&w=2670&auto=format&fit=crop'
  }
];

export function CaseStudyShowcase() {
  return (
    <section id="case-studies" className="py-32 px-6 bg-black/40 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary-400 mb-4 block">
              Validation Protocol
            </span>
            <h2 className="text-5xl lg:text-7xl font-black text-white font-sans mb-4 uppercase tracking-tighter">
              Proven <span className="text-primary-400">Execution.</span>
            </h2>
            <p className="text-xl text-foreground/60 font-light leading-relaxed">
              Our algorithms don't just work in backtests. They dominate live market liquidity.
            </p>
          </div>
          <SovereignButton variant="outline" size="lg" trackingEvent="view_all_cases">
            Audit Archive <ArrowUpRight className="ml-2 w-4 h-4" />
          </SovereignButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {STUDIES.map((study, i) => (
            <motion.div
              key={study.client}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="group relative rounded-[2.5rem] overflow-hidden border border-white/5 bg-[#0A0A0A] hover:border-primary-500/30 transition-all duration-700"
            >
              <div className="aspect-[4/5] overflow-hidden relative">
                <img 
                   src={study.image} 
                   alt={study.client} 
                   className="w-full h-full object-cover opacity-50 group-hover:opacity-80 group-hover:scale-105 transition-all duration-1000" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/20 to-transparent" />
                
                <div className="absolute bottom-10 left-10 right-10">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {study.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-xl text-[9px] font-black uppercase tracking-widest text-white/50 border border-white/10">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">{study.client}</h3>
                </div>
              </div>
              
              <div className="p-10 border-t border-white/5 flex flex-col gap-2">
                <div className="text-4xl font-black text-primary-400 tracking-tighter uppercase">{study.result}</div>
                <div className="text-xs font-black uppercase tracking-widest text-foreground/30">{study.metric}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
