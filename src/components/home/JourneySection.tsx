import { motion } from 'framer-motion';
import { TrendingUp, Award, Globe, Users } from 'lucide-react';
import {
  staggerContainer,
  institutionalVariants,
  fadeUp,
  slideInFromLeft,
  slideInFromRight,
} from '@/lib/motion';
import { institutionalSpacing } from '@/config/spacing';
import { cn } from '@/lib/utils';

const milestones = [
  {
    year: '2018',
    title: 'Foundation',
    desc: 'IFX Trades established — first proprietary algorithmic framework deployed for sovereign desk operators in Dubai.',
    icon: TrendingUp,
    color: 'text-emerald-400',
    border: 'border-emerald-500/30',
    glow: 'bg-emerald-500/10',
  },
  {
    year: '2020',
    title: 'Expansion',
    desc: 'Launched the Institutional Academy. Over 1,000 analysts trained across 15 countries in the first cohort.',
    icon: Users,
    color: 'text-cyan-400',
    border: 'border-cyan-500/30',
    glow: 'bg-cyan-500/10',
  },
  {
    year: '2022',
    title: 'Recognition',
    desc: "Awarded Asia's Top Forex Intelligence Platform. Strategic partnership agreements signed with Tier-1 liquidity providers.",
    icon: Award,
    color: 'text-amber-400',
    border: 'border-amber-500/30',
    glow: 'bg-amber-500/10',
  },
  {
    year: '2024',
    title: 'Sovereignty',
    desc: '12,400+ graduates active across 40+ countries. 84.2% verified signal accuracy. Recognised as the premier institutional education house in Asia.',
    icon: Globe,
    color: 'text-emerald-400',
    border: 'border-emerald-500/30',
    glow: 'bg-emerald-500/10',
  },
];

const statsBar = [
  { value: '12,400+', label: 'Graduates', sublabel: 'Global Network' },
  { value: '84.2%', label: 'Signal Accuracy', sublabel: 'Verified Performance' },
  { value: '40+', label: 'Countries', sublabel: 'Active Operators' },
  { value: '2018', label: 'Established', sublabel: 'Years of Excellence' },
];

export function JourneySection() {
  return (
    <section
      className={cn('relative overflow-hidden', institutionalSpacing.section)}
      aria-label="IFX Trades institutional history and milestones"
    >
      {/* Ambient background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.03] to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(16,185,129,0.04),transparent)] pointer-events-none" />

      <div className={cn(institutionalSpacing.maxWidth, institutionalSpacing.container, 'relative z-10')}>

        {/* ── SECTION HEADER ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className={cn('text-center', institutionalSpacing.sectionHeader)}
        >
          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-4 font-mono">
            Est. 2018 · Dubai, UAE
          </p>
          <h2 className="text-4xl lg:text-6xl font-black text-white uppercase italic tracking-tighter leading-none mb-6">
            Our Journey to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Institutional Excellence
            </span>
          </h2>
          <p className="text-lg text-white/40 max-w-2xl mx-auto font-medium leading-relaxed">
            From a single trading desk in Dubai to a global network of sovereign analysts.
            This is the architecture of authority.
          </p>
        </motion.div>

        {/* ── TIMELINE ── */}
        <div className="relative">
          {/* Vertical spine — desktop only */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent hidden lg:block" />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="space-y-16 lg:space-y-24"
          >
            {milestones.map((m, index) => {
              const isEven = index % 2 === 0;
              const contentVariant = isEven ? slideInFromLeft : slideInFromRight;

              return (
                <motion.div
                  key={m.year}
                  variants={institutionalVariants}
                  className={cn(
                    'flex flex-col gap-8 items-center',
                    'lg:flex-row',
                    !isEven && 'lg:flex-row-reverse'
                  )}
                >
                  {/* ── Content Block ── */}
                  <motion.div
                    variants={contentVariant}
                    className={cn('flex-1', isEven ? 'lg:text-right' : 'lg:text-left')}
                  >
                    <div
                      className={cn(
                        'inline-flex items-center gap-3 px-4 py-2 rounded-full border mb-4',
                        m.glow,
                        m.border,
                        m.color
                      )}
                    >
                      <m.icon className="w-4 h-4" />
                      <span className="text-[11px] font-black uppercase tracking-[0.3em]">{m.year}</span>
                    </div>
                    <h3 className="text-3xl lg:text-4xl font-black text-white uppercase italic tracking-tighter mb-3">
                      {m.title}
                    </h3>
                    <p className="text-white/50 leading-relaxed max-w-md ml-auto" style={{ marginLeft: isEven ? 'auto' : undefined }}>
                      {m.desc}
                    </p>
                  </motion.div>

                  {/* ── Centre Node ── */}
                  <div className="relative z-10 hidden lg:flex items-center justify-center">
                    <div className={cn('w-5 h-5 rounded-full ring-4 ring-black border-2', m.border, m.glow)} />
                  </div>

                  {/* ── Spacer ── */}
                  <div className="flex-1 hidden lg:block" />
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* ── STATS BAR ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className={cn(
            'mt-24 grid grid-cols-2 lg:grid-cols-4',
            institutionalSpacing.grid
          )}
        >
          {statsBar.map((stat) => (
            <motion.div
              key={stat.label}
              variants={institutionalVariants}
              className="text-center p-6 lg:p-8 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm hover:bg-white/[0.05] hover:border-white/10 transition-all duration-500"
            >
              <div className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2 tracking-tighter">
                {stat.value}
              </div>
              <div className="text-sm font-black text-white uppercase tracking-widest mb-1">
                {stat.label}
              </div>
              <div className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-mono">
                {stat.sublabel}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
