import { motion } from 'motion/react';
import { institutionalVariants, staggerContainer } from '@/lib/motion';
import { Cpu, Zap } from 'lucide-react';
import { SovereignButton } from '@/components/ui/SovereignButton';

/**
 * SolutionsHero (v2.0)
 * 
 * High-impact entrance for the bespoke engineering surface.
 * Focus: Transition from courses to custom algorithmic machinery.
 */
export function SolutionsHero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-background py-20">
      {/* Background: Depth Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
      
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative z-10 max-w-6xl mx-auto px-6 text-center"
      >
        <motion.div 
          variants={institutionalVariants}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-bold uppercase tracking-widest mb-8"
        >
          <Cpu className="w-3 h-3" />
          <span>Bespoke Algorithmic Engineering</span>
        </motion.div>

        <motion.h1 
          variants={institutionalVariants}
          className="text-5xl md:text-7xl lg:text-8xl font-black font-sans tracking-tighter text-foreground mb-8 leading-[0.9] uppercase"
        >
          Custom Systems <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600">
            Built For Alpha
          </span>
        </motion.h1>

        <motion.p 
          variants={institutionalVariants}
          className="text-lg md:text-xl text-foreground/60 max-w-3xl mx-auto mb-12 leading-relaxed font-light tracking-wide uppercase"
        >
          We don't sell courses. We engineer proprietary trading edges. <br className="hidden md:block" />
          From strategy conceptualization to full-scale deployment on institutional infrastructure.
        </motion.p>

        <motion.div 
          variants={institutionalVariants}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <SovereignButton 
            variant="primary" 
            glowEffect={true} 
            size="xl"
            trackingEvent="solutions_cta_start"
            onClick={() => document.getElementById('configurator')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Build Your System
            <Zap className="ml-2 w-5 h-5" />
          </SovereignButton>
          
          <SovereignButton 
            variant="secondary" 
            size="xl"
            trackingEvent="solutions_case_studies"
            onClick={() => document.getElementById('case-studies')?.scrollIntoView({ behavior: 'smooth' })}
          >
            View Case Studies
          </SovereignButton>
        </motion.div>
      </motion.div>
    </section>
  );
}
