import { motion } from 'framer-motion';
import { institutionalVariants, staggerContainer } from '@/lib/motion';
import { institutionalSpacing } from '@/config/spacing';
import { Award, Clock, Code, Globe, Headphones, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const reasons = [
  {
    icon: Award,
    title: 'Since 2018',
    desc: '7+ years of proven algorithmic engineering. 12,400+ clients served globally.',
  },
  {
    icon: Code,
    title: 'Source Code Included',
    desc: 'You own 100% of your algorithm. No black boxes, no vendor lock-in.',
  },
  {
    icon: Shield,
    title: 'No Broker Restrictions',
    desc: 'Deploy anywhere. We build platform-agnostic systems for maximum flexibility.',
  },
  {
    icon: Clock,
    title: 'Fast Turnaround',
    desc: "Most projects delivered in 2-4 weeks. Your edge shouldn't wait.",
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    desc: 'Markets never sleep. Neither does our monitoring and support team.',
  },
  {
    icon: Globe,
    title: 'Global Deployment',
    desc: 'Clients across 40+ countries. Multi-timezone, multi-language support.',
  },
];

export function WhyChooseUsSection() {
  return (
    <section className={cn(institutionalSpacing.section, "bg-black/40 relative border-y border-white/5")}>
      <div className={cn(institutionalSpacing.container)}>
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-6xl font-black text-white uppercase italic tracking-tighter leading-none mb-6">
            Why 12,400+ Clients Trust <span className="text-emerald-400">IFX</span>
          </h2>
          <p className="text-xl text-white/40 max-w-3xl mx-auto font-medium leading-relaxed">
            We're not just developers. We're traders who understand what moves markets.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.title}
              variants={institutionalVariants}
              transition={{ delay: i * 0.08 }}
              className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/5 backdrop-blur-sm hover:border-emerald-500/30 transition-all duration-500 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                <reason.icon className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-3 italic">{reason.title}</h3>
              <p className="text-white/50 leading-relaxed font-medium">{reason.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10"
        >
          {[
            { value: '12,400+', label: 'Clients Served' },
            { value: '84.2%', label: 'Success Rate' },
            { value: '40+', label: 'Countries' },
            { value: '2018', label: 'Established' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={institutionalVariants}
              transition={{ delay: i * 0.1 }}
              className="text-center p-8 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/10 transition-colors"
            >
              <div className="text-4xl lg:text-5xl font-black text-emerald-400 mb-2 tracking-tighter">{stat.value}</div>
              <div className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
