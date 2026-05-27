import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Check, Code, Cpu, Gauge } from 'lucide-react';

const TIERS = [
  {
    id: 'essential',
    name: 'Elite Essential',
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
    features: ['High-Performance Architecture', 'Custom Infrastructure Setup', 'Multi-Account Management', '24/7 Monitoring', 'Dedicated Engineering Lead'],
    icon: Gauge,
    popular: false
  }
];

export function ServiceConfigurator() {
  const [selected, setSelected] = useState('professional');

  return (
    <section id="configurator" className="py-32 md:py-48 px-6 bg-[#020202] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00A3FF]/10 blur-[120px] rounded-full opacity-20 -z-10" />
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-32">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-shimmer mb-8 text-center"
          >
            Configure <br />
            <span className="italic font-serif text-gradient-gold">Your Edge.</span>
          </motion.h2>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 max-w-2xl mx-auto italic">
            Select the engineering tier that matches your strategy's complexity and scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {TIERS.map((tier, idx) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -15 }}
              onClick={() => setSelected(tier.id)}
              className={`relative p-12 rounded-[3.5rem] border cursor-pointer transition-all duration-700 overflow-hidden ${
                selected === tier.id 
                  ? 'border-[#00A3FF]/30 bg-[#00A3FF]/[0.03] shadow-[0_40px_80px_rgba(0,163,255,0.15)] scale-[1.02]' 
                  : 'border-white/[0.06] bg-white/[0.01] hover:border-white/[0.15] hover:bg-white/[0.03]'
              }`}
            >
              {tier.popular && (
                <div className="absolute top-0 right-12 -translate-y-1/2 px-5 py-2 bg-[#00A3FF] text-black text-[9px] font-black uppercase tracking-[0.3em] rounded-full shadow-[0_10px_20px_rgba(0,163,255,0.3)]">
                  Most Popular
                </div>
              )}
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-10 border transition-all duration-700 ${
                selected === tier.id ? 'bg-[#00A3FF] text-black border-[#00A3FF] shadow-[0_0_30px_rgba(0,163,255,0.3)]' : 'bg-white/5 text-white/30 border-white/10'
              }`}>
                <tier.icon className="w-7 h-7" />
              </div>
              
              <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-4">{tier.name}</h3>
              <div className="text-5xl font-black text-white tracking-tighter mb-4">
                {tier.price}
                {tier.price !== 'Custom' && <span className="text-sm font-black text-[#00A3FF]/40 ml-2 uppercase tracking-widest">USD</span>}
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00A3FF]/60 mb-10 italic">
                {tier.timeline} • {tier.description}
              </div>
              
              <ul className="space-y-6 mb-12 border-t border-white/[0.06] pt-10">
                {tier.features.map(f => (
                  <li key={f} className="flex items-start gap-5 text-[11px] font-black uppercase tracking-widest text-white/50 leading-relaxed">
                    <Check className={`w-4 h-4 shrink-0 mt-0.5 ${selected === tier.id ? 'text-[#00A3FF]' : 'text-white/10'}`} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link 
                to="/consultation"
                className={`block text-center w-full relative overflow-hidden rounded-2xl px-10 py-5 font-black uppercase tracking-[0.3em] text-[10px] transition-all duration-500 cursor-pointer ${
                  selected === tier.id 
                    ? 'bg-white text-black hover:scale-[1.02]' 
                    : 'bg-white/[0.05] text-white hover:bg-white/[0.1] hover:scale-[1.02]'
                }`}
              >
                {selected === tier.id ? 'Initiate Build Protocol' : 'Configure Tier'}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
