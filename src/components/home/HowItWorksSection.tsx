import { motion } from 'framer-motion';
import { institutionalVariants, staggerContainer } from '@/lib/motion';
import { institutionalSpacing } from '@/config/spacing';
import { MessageSquare, Code, TestTube, Rocket, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  {
    icon: MessageSquare,
    step: '01',
    title: 'Share Your Strategy',
    desc: 'Tell us your trading logic, entry/exit rules, and risk parameters. No code needed—just your edge.',
  },
  {
    icon: Code,
    step: '02',
    title: 'We Engineer It',
    desc: 'Our developers code your algorithm in MT4/MT5/cTrader with institutional-grade standards.',
  },
  {
    icon: TestTube,
    step: '03',
    title: 'Rigorous Backtesting',
    desc: 'We validate against historical tick-data to ensure profitability before live deployment.',
  },
  {
    icon: Rocket,
    step: '04',
    title: 'Live Deployment',
    desc: 'Your bot goes live on your infrastructure. We handle setup, monitoring, and optimization.',
  },
  {
    icon: Shield,
    step: '05',
    title: 'Ongoing Support',
    desc: '24/7 maintenance, updates, and performance tuning to keep your edge sharp.',
  },
];

export function HowItWorksSection() {
  return (
    <section className={cn(institutionalSpacing.section, "bg-background relative overflow-hidden")}>
      {/* Background Accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent" />
      
      <div className={cn(institutionalSpacing.container, "relative z-10")}>
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
            <span className="uppercase tracking-widest font-black text-[10px]">From Idea to Execution</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-black text-white uppercase italic tracking-tighter leading-none mb-6">
            You Bring the Strategy.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              We Build the System.
            </span>
          </h2>
          
          <p className="text-xl text-white/40 max-w-3xl mx-auto font-medium">
            Five steps from your trading concept to a fully automated, profit-generating algorithm.
          </p>
        </motion.div>

        {/* Process Steps */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
        >
          {steps.map((step) => (
            <motion.div
              key={step.step}
              variants={institutionalVariants}
              className="relative group"
            >
              {/* Connector Line (Desktop) */}
              <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-emerald-500/30 to-transparent -z-10" />
              
              {/* Card */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm h-full group-hover:border-emerald-500/50 transition-colors">
                {/* Step Number */}
                <div className="text-5xl font-black text-emerald-500/10 mb-4 font-mono">{step.step}</div>
                
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <step.icon className="w-6 h-6 text-emerald-400" />
                </div>
                
                {/* Content */}
                <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2 italic">{step.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-lg text-white/40 mb-8 font-medium italic">
            Ready to automate your trading edge?
          </p>
          <a
            href="#consult"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest text-sm transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:-translate-y-1"
          >
            Start Your Project
            <Rocket className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
