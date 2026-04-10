import { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import { Code, TestTube, Rocket, Shield } from 'lucide-react';

const processSteps = [
  {
    id: '01',
    title: 'Strategy',
    desc: 'You define the edge. Entry, exit, risk management.',
    icon: Code,
    colSpan: 'col-span-12 md:col-span-6',
    height: 'h-96',
    gradient: 'from-emerald-500/20 to-transparent'
  },
  {
    id: '02',
    title: 'Engineering',
    desc: 'We code. Institutional-grade, source-included.',
    icon: TestTube,
    colSpan: 'col-span-12 md:col-span-6',
    height: 'h-96',
    gradient: 'from-cyan-500/20 to-transparent'
  },
  {
    id: '03',
    title: 'Validation',
    desc: 'Tick-data backtesting. Monte Carlo. Stress tests.',
    icon: Shield,
    colSpan: 'col-span-12 md:col-span-4',
    height: 'h-80',
    gradient: 'from-amber-500/20 to-transparent'
  },
  {
    id: '04',
    title: 'Deployment',
    desc: 'Live on your infrastructure. 24/7 monitoring.',
    icon: Rocket,
    colSpan: 'col-span-12 md:col-span-8',
    height: 'h-80',
    gradient: 'from-emerald-500/20 to-transparent'
  }
];

function BentoCard({ step, index }: { step: typeof processSteps[0], index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1]);
  
  // Dynamic border gradient
  const borderX = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const bg = useMotionTemplate`linear-gradient(${borderX}deg, rgba(16,185,129,0.3), transparent)`; // 16,185,129 is emerald-500 hex approx

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity }}
      className={`${step.colSpan} ${step.height} relative group`}
    >
      <motion.div
        style={{ background: bg }}
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />
      
      <div className="relative h-full p-8 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl overflow-hidden hover:border-white/20 transition-colors">
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
        
        {/* Step Number */}
        <div className="absolute top-6 right-6 text-6xl font-bold text-white/[0.03] font-heading">
          {step.id}
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              <step.icon className="w-7 h-7 text-emerald-400" />
            </div>
            <h3 className="text-3xl font-bold text-foreground mb-3 font-heading">{step.title}</h3>
            <p className="text-foreground/60 text-lg leading-relaxed max-w-sm">{step.desc}</p>
          </div>
          
          {/* Progress Line */}
          <div className="mt-8 h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              transition={{ duration: 1.5, delay: index * 0.2 }}
              className="h-full bg-emerald-500"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ProcessBento() {
  return (
    <section className="py-32 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-bold text-foreground font-heading mb-6">
            How It Works
          </h2>
          <p className="text-xl text-foreground/60 max-w-2xl">
            Five steps from your concept to a live, profit-generating system.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-6">
          {processSteps.map((step, index) => (
            <BentoCard key={step.id} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
