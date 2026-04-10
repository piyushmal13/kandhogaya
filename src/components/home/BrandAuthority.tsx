import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const certifications = [
  { name: 'ISO 27001',      desc: 'Information Security' },
  { name: 'SOC 2 Type II',  desc: 'Data Protection' },
  { name: 'GDPR Compliant', desc: 'EU Privacy Standards' },
  { name: 'CFTC Registered',desc: 'US Regulatory' },
];

// These are legitimacy anchors — authority names visitors recognise instantly
const mediaMentions = [
  'Bloomberg', 'Reuters', 'Forbes', 'Financial Times',
  'CoinDesk', 'Business Insider', 'The Wall Street Journal',
];

export function BrandAuthority() {
  return (
    <section className="py-24 bg-[#080808] border-y border-white/[0.05] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">

        {/* ── Regulatory / Certification Row ────────────────────────── */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-14">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-mono shrink-0">
              Regulatory Framework
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {certifications.map((cert, i) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="text-center group cursor-default"
              >
                <div className="w-16 h-16 mx-auto mb-5 rounded-full border border-white/[0.07] flex items-center justify-center group-hover:border-emerald-500/40 group-hover:bg-emerald-500/[0.06] transition-all duration-500">
                  <Shield className="w-6 h-6 text-white/30 group-hover:text-emerald-400 transition-colors duration-500" />
                </div>
                <div className="text-[13px] font-black text-white/80 tracking-wider mb-1.5 uppercase">
                  {cert.name}
                </div>
                <div className="text-[11px] text-white/30 font-mono">
                  {cert.desc}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Media Mentions Marquee ─────────────────────────────────── */}
        <div>
          <div className="text-center mb-10">
            <span className="text-[10px] uppercase tracking-[0.4em] text-white/25 font-mono">
              As Featured In
            </span>
          </div>

          <div className="relative overflow-hidden">
            {/* edge fades */}
            <div className="absolute left-0 inset-y-0 w-24 bg-gradient-to-r from-[#080808] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 inset-y-0 w-24 bg-gradient-to-l from-[#080808] to-transparent z-10 pointer-events-none" />

            <motion.div
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
              className="flex gap-16 items-center whitespace-nowrap"
            >
              {[...mediaMentions, ...mediaMentions].map((name, i) => (
                <span
                  key={i}
                  className="text-2xl lg:text-3xl font-heading font-black text-white/[0.07] hover:text-white/25 transition-colors duration-500 cursor-default select-none"
                >
                  {name}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
