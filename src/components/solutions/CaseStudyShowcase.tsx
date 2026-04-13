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
    tags: ['MT5', 'Sovereign-HFT', 'Sovereign-Risk'],
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
    tags: ['AWS Lambda', 'Latency Opt', 'Sovereign-Sentry'],
    image: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3'
  }
];

export function CaseStudyShowcase() {
  return (
    <section id="case-studies" className="py-32 px-6 bg-black/40 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-5xl lg:text-7xl font-black text-white font-heading mb-6 uppercase italic tracking-tighter">Proven <span className="text-[#58F2B6]">Execution</span></h2>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-white/40">Our algorithms don't just work in backtests. They dominate live markets.</p>
          </div>
          <SovereignButton variant="secondary" className="px-8" trackingEvent="view_all_case_studies" onClick={() => tracker.track("solutions_case_studies_click")}>
            View Audit Log <ArrowUpRight className="ml-2 w-4 h-4" />
          </SovereignButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {STUDIES.map((study, i) => (
            <motion.div
              key={study.client}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group relative rounded-[2.5rem] overflow-hidden border border-white/10 bg-white/[0.02] hover:border-[#58F2B6]/40 transition-all duration-700"
            >
              <div className="aspect-[4/5] overflow-hidden relative grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700">
                <img src={study.image} alt={study.client} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 mix-blend-overlay group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/80 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {study.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 rounded-md bg-[#58F2B6]/10 backdrop-blur-md text-[9px] font-black tracking-widest text-[#58F2B6] border border-[#58F2B6]/20 uppercase">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tight text-white">{study.client}</h3>
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mt-1">{study.industry}</div>
                </div>
              </div>
              <div className="p-8 border-t border-white/10 bg-[#020202]">
                <div className="text-4xl font-black text-[#58F2B6] font-heading tracking-tighter mb-1">{study.result}</div>
                <div className="text-xs font-bold uppercase tracking-widest text-white/50">{study.metric}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
