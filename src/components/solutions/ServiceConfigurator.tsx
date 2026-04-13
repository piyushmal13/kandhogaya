import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Code, Cpu, Gauge } from 'lucide-react';
import { SovereignButton } from '@/components/ui/SovereignButton';

const TIERS = [
  {
    id: 'essential',
    name: 'Sovereign Essential',
    price: '$2,500',
    timeline: '2-4 Weeks',
    description: 'Single-strategy automation for MT4/MT5.',
    features: ['Custom Indicator Integration', 'Basic Risk Management', 'Source Code Included', '30-Day Support'],
    icon: Code,
    popular: false
  },
  {
    id: 'professional',
    name: 'Quant Professional',
    price: '$7,500',
    timeline: '4-8 Weeks',
    description: 'Multi-asset strategy with advanced analytics.',
    features: ['Multi-Asset Correlation', 'Advanced Position Sizing', 'Real-time Dashboard', 'Rigorous Backtesting', '90-Day Priority Support'],
    icon: Cpu,
    popular: true
  },
  {
    id: 'institutional',
    name: 'Institutional Suite',
    price: 'Custom',
    timeline: '8-12 Weeks',
    description: 'High-frequency or complex multi-strategy systems.',
    features: ['HFT Capable Architecture', 'Custom Infrastructure Setup', 'Multi-Account Management', '24/7 Monitoring', 'Dedicated Engineering Lead'],
    icon: Gauge,
    popular: false
  }
];

export function ServiceConfigurator() {
  const [selected, setSelected] = useState('professional');

  return (
    <section id="configurator" className="py-32 px-6 bg-[#020202]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-6xl font-black font-heading text-white mb-6 uppercase italic tracking-tighter">Configure Your Edge</h2>
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-white/40 max-w-2xl mx-auto">
            Select the engineering tier that matches your strategy's complexity and scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TIERS.map((tier) => (
            <motion.div
              key={tier.id}
              whileHover={{ y: -10 }}
              onClick={() => setSelected(tier.id)}
              className={`relative p-10 rounded-[2.5rem] border cursor-pointer transition-all duration-500 overflow-hidden ${
                selected === tier.id 
                  ? 'border-[#58F2B6] bg-[#58F2B6]/5 shadow-[0_0_40px_rgba(88,242,182,0.15)]' 
                  : 'border-white/10 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]'
              }`}
            >
              {tier.popular && (
                <div className="absolute top-0 right-10 -translate-y-1/2 px-4 py-1.5 bg-[#58F2B6] text-black text-[9px] font-black uppercase tracking-widest rounded-full">
                  MOST POPULAR
                </div>
              )}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border transition-all ${
                selected === tier.id ? 'bg-[#58F2B6]/10 text-[#58F2B6] border-[#58F2B6]/30' : 'bg-white/5 text-white/40 border-white/10'
              }`}>
                <tier.icon className="w-6 h-6" />
              </div>
              
              <h3 className="text-2xl font-black italic uppercase tracking-tight text-white mb-2">{tier.name}</h3>
              <div className="text-4xl font-black text-[#58F2B6] mb-2">{tier.price}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#58F2B6]/60 mb-6">{tier.timeline} • {tier.description}</div>
              
              <ul className="space-y-4 mb-10 border-t border-white/5 pt-8">
                {tier.features.map(f => (
                  <li key={f} className="flex items-start gap-4 text-xs font-bold uppercase tracking-wide text-white/60">
                    <Check className={`w-4 h-4 shrink-0 mt-0.5 ${selected === tier.id ? 'text-[#58F2B6]' : 'text-white/20'}`} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <SovereignButton 
                variant={selected === tier.id ? 'primary' : 'secondary'} 
                className="w-full"
                glowEffect={selected === tier.id}
                trackingEvent={`select_tier_${tier.id}`}
              >
                {selected === tier.id ? 'Selected' : 'Select Tier'}
              </SovereignButton>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
