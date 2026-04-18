import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { SovereignButton } from '@/components/ui/SovereignButton';
import { tracker } from '@/core/tracker';

const STUDIES = [
  {
    client: 'Dubai Family Office',
    industry: 'Gold / XAUUSD',
    result: '+34% Annualized',
    metric: '$2.4M Net Profit',
    tags: ['MT5', 'Sovereign-Config', 'Sovereign-Risk'],
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3'
  },
  {
    client: 'Singapore Prop Firm',
    industry: 'Multi-Asset',
    result: '84.2% Win Rate',
    metric: 'Passed FTMO $200K',
    tags: ['Python', 'Custom API', 'Sovereign-Backtest'],
    image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3'
  },
  {
    client: 'European Hedge Fund',
    industry: 'Forex/Indices',
    result: '-40% Drawdown Reduction',
    metric: 'Sharpe Ratio: 2.1',
    tags: ['AWS Lambda', 'Performance Opt', 'Sovereign-Sentry'],
    image: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3'
  }
];

export function CaseStudyShowcase() {
  return (
    <section id="case-studies" className="py-32 md:py-48 px-6 bg-[#020202] border-t border-white/[0.05] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[150px] rounded-full opacity-10 -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between mb-32 gap-10">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-shimmer mb-8"
            >
              Proven <br />
              <span className="italic font-serif text-gradient-emerald">Execution.</span>
            </motion.h2>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic">
              Our algorithms don't just work in backtests. They dominate live markets.
            </p>
          </div>
          <button 
            onClick={() => tracker.track("solutions_case_studies_click")}
            className="group px-10 py-5 border border-white/[0.08] text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl transition-all duration-500 hover:bg-white/[0.04] hover:border-white/[0.2] active:scale-95 flex items-center gap-3"
          >
            Access Institutional Audits <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {STUDIES.map((study, i) => (
            <motion.div
              key={study.client}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
              className="group relative rounded-[3.5rem] overflow-hidden border border-white/[0.06] bg-[#080B12] transition-all duration-700 hover:border-emerald-500/30 hover:shadow-2xl"
            >
              <div className="aspect-[4/5] overflow-hidden relative grayscale-[0.8] group-hover:grayscale-0 transition-all duration-1000 ease-out">
                <img src={study.image} alt={study.client} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-40 mix-blend-overlay group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080B12] via-[#080B12]/60 to-transparent" />
                <div className="absolute bottom-10 left-10 right-10">
                  <div className="flex flex-wrap gap-2.5 mb-6">
                    {study.tags.map(tag => (
                      <span key={tag} className="px-3 py-1.5 rounded-lg bg-emerald-500/10 backdrop-blur-xl text-[8px] font-black tracking-widest text-emerald-500 border border-emerald-500/20 uppercase italic">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-2">{study.client}</h3>
                  <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">{study.industry}</div>
                </div>
              </div>
              <div className="p-10 border-t border-white/[0.06] bg-[#080B12]">
                <div className="text-5xl font-black text-emerald-500 tracking-tighter mb-2 italic">{study.result}</div>
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">{study.metric}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
