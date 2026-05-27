import { motion } from 'motion/react';
import { institutionalVariants, staggerContainer } from '@/lib/motion';
import { Cpu, Zap } from 'lucide-react';

/**
 * SolutionsHero (v2.1 - Ice-Blue Edition)
 * 
 * High-impact entrance for the bespoke engineering surface.
 * Focus: Transition from courses to custom algorithmic machinery.
 */
export function SolutionsHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#020202] py-32 md:py-64">
      {/* Background: Depth Grid & Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(0,163,255,0.08)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
      </div>
      
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative z-10 max-w-7xl mx-auto px-6 text-center"
      >
        <motion.div 
          variants={institutionalVariants}
          className="mb-12"
        >
          <div className="site-pill border-[#00A3FF]/20 bg-[#00A3FF]/5 text-[#00A3FF]">
            <Cpu className="w-4 h-4" />
            <span>Bespoke Algorithmic Engineering</span>
          </div>
        </motion.div>

        <motion.h1 
          variants={institutionalVariants}
          className="text-shimmer mb-10 leading-[0.9]"
        >
          Custom Systems <br />
          <span className="italic font-serif text-gradient-gold">Built For Alpha.</span>
        </motion.h1>

        <motion.p 
          variants={institutionalVariants}
          className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-16 leading-relaxed font-light tracking-wide"
        >
          We don't sell retail trading courses. We engineer proprietary systematic trading models <br className="hidden md:block" />
          and compile secure execution bridges optimized directly for institutional infrastructure.
        </motion.p>

        <motion.div 
          variants={institutionalVariants}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <button 
            onClick={() => document.getElementById('configurator')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-vault px-14 py-5 bg-[#00A3FF] hover:bg-[#008BE3] text-black font-black uppercase tracking-widest text-xs rounded-2xl flex items-center gap-2 shadow-[0_20px_40px_rgba(0,163,255,0.15)] transition-all cursor-pointer"
          >
            Build Your System
            <Zap className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => document.getElementById('case-studies')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-obsidian px-14 py-5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all cursor-pointer"
          >
            View Case Studies
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
