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
    features: ['Custom Indicator Integration', 'Basic Risk Management', 'Source Code Included', '30-Day Post-Deploy Support'],
    icon: Code,
    popular: false
  },
  {
    id: 'professional',
    name: 'Quant Professional',
    price: '$7,500',
    timeline: '4-8 Weeks',
    description: 'Multi-asset strategy with advanced analytics.',
    features: ['Multi-Asset Correlation', 'Advanced Position Sizing', 'Real-time Dashboard', 'Rigorous Backtesting Suite', '90-Day Priority Support'],
    icon: Cpu,
    popular: true
  },
  {
    id: 'institutional',
    name: 'Institutional Suite',
    price: 'Custom',
    timeline: '8-12 Weeks',
    description: 'Full-scale HFT or complex multi-strategy systems.',
    features: ['High-Frequency Execution', 'Custom Infrastructure Setup', 'Multi-Account Management', '24/7 Monitoring', 'Dedicated Engineering Lead'],
    icon: Gauge,
    popular: false
  }
];

export function ServiceConfigurator() {
  const [selected, setSelected] = useState('professional');

  return (
    <section id="configurator" className="py-32 px-6 bg-background relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary-400 mb-4 block">
            System Configurator
          </span>
          <h2 className="text-4xl lg:text-7xl font-black font-sans text-foreground mb-6 uppercase tracking-tighter">
            Configure Your Edge
          </h2>
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto font-light">
            Select the engineering tier that matches your strategy's complexity and scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TIERS.map((tier) => (
            <motion.div
              key={tier.id}
              whileHover={{ y: -10 }}
              onClick={() => setSelected(tier.id)}
              className={`relative p-8 md:p-12 rounded-[2.5rem] border cursor-pointer transition-all duration-500 ${
                selected === tier.id 
                  ? 'border-primary-500 bg-surface/80 shadow-[0_40px_100px_rgba(0,0,0,0.5),0_0_40px_rgba(88,242,182,0.1)] backdrop-blur-xl' 
                  : 'border-white/10 bg-white/[0.02] hover:border-white/30'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-5 py-1.5 bg-primary-500 text-black text-[10px] font-black tracking-widest rounded-full uppercase">
                  Institutional Standard
                </div>
              )}
              
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-colors border ${
                selected === tier.id ? 'bg-primary-500 text-black border-primary-500' : 'bg-white/5 text-primary-400 border-white/5'
              }`}>
                <tier.icon className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-black text-foreground mb-2 uppercase tracking-tight">{tier.name}</h3>
              <div className="text-4xl font-black text-foreground mb-1 tracking-tighter">{tier.price}</div>
              <div className="text-[10px] uppercase tracking-widest font-black text-primary-400 mb-8">{tier.timeline}</div>
              
              <ul className="space-y-4 mb-12">
                {tier.features.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-foreground/60">
                    <Check className={`w-4 h-4 shrink-0 ${selected === tier.id ? 'text-primary-400' : 'text-white/20'}`} />
                    <span className="font-light tracking-wide">{f}</span>
                  </li>
                ))}
              </ul>

              <SovereignButton 
                variant={selected === tier.id ? 'primary' : 'outline'}
                className="w-full"
                size="lg"
                glowEffect={selected === tier.id}
                trackingEvent={`select_tier_${tier.id}`}
              >
                {selected === tier.id ? 'Authorized' : 'Select Protocol'}
              </SovereignButton>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
