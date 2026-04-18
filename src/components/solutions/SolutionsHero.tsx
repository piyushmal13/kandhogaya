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
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#020202] py-32 md:py-64">
      {/* Background: Depth Grid & Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_70%)]" />
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
          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-emerald-500/[0.04] border border-emerald-500/[0.15] text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em] mb-12"
        >
          <Cpu className="w-4 h-4" />
          <span>Bespoke Algorithmic Engineering</span>
        </motion.div>

        <motion.h1 
          variants={institutionalVariants}
          className="text-shimmer mb-10 leading-[0.9]"
        >
          Custom Systems <br />
          <span className="italic font-serif text-gradient-emerald">Built For Alpha.</span>
        </motion.h1>

        <motion.p 
          variants={institutionalVariants}
          className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-16 leading-relaxed font-light tracking-wide"
        >
          We don't sell courses. We engineer proprietary trading edges. <br className="hidden md:block" />
          From strategy conceptualization to full-scale deployment on institutional infrastructure.
        </motion.p>

        <motion.div 
          variants={institutionalVariants}
          className="flex flex-col sm:flex-row gap-8 justify-center items-center"
        >
          <button 
            onClick={() => document.getElementById('configurator')?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative px-12 py-6 bg-white text-black font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.05] hover:shadow-[0_20px_40px_rgba(255,255,255,0.1)] active:scale-95 flex items-center gap-4"
          >
            Build Your System
            <Zap className="w-5 h-5 group-hover:scale-125 transition-transform text-emerald-600" />
          </button>
          
          <button 
            onClick={() => document.getElementById('case-studies')?.scrollIntoView({ behavior: 'smooth' })}
            className="group px-12 py-6 border border-white/[0.08] text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl transition-all duration-500 hover:bg-white/[0.04] hover:border-white/[0.2] active:scale-95"
          >
            View Case Studies
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
