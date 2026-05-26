import React from "react";
import { motion } from "motion/react";
import { BookOpen, Cpu, Terminal, ArrowRight, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { EliteButton } from "../ui/Button";

interface OperationalPillarsProps {
  onRequestBuild: () => void;
}

export const OperationalPillars: React.FC<OperationalPillarsProps> = ({ onRequestBuild }) => {
  const pillars = [
    {
      num: "01",
      icon: BookOpen,
      title: "Quant Academy",
      subtitle: "Webinar Masterclasses",
      description: "Elite educational platform delivering raw macro briefings, systematic trend tutorials, and live masterclass webinars led by global quantitative strategists.",
      cta: "Explore Masterclasses",
      link: "/webinars",
      isModal: false,
      color: "from-emerald-500/10 to-transparent border-emerald-500/10 hover:border-emerald-500/30",
      iconColor: "text-emerald-400"
    },
    {
      num: "02",
      icon: Cpu,
      title: "Systematic Machinery",
      subtitle: "Algorithmic Registry",
      description: "Licensing of pre-built, institutional-grade systematic algorithms. Clean, secure, drag-and-drop binaries optimized for MetaTrader 5 and TradingView.",
      cta: "View Algo Registry",
      link: "#performance",
      isModal: false,
      color: "from-cyan-500/10 to-transparent border-cyan-500/10 hover:border-cyan-500/30",
      iconColor: "text-cyan-400"
    },
    {
      num: "03",
      icon: Terminal,
      title: "Engineering Desk",
      subtitle: "Bespoke Coding Desk",
      description: "Custom systematic software development. Our quantitative architects code high-frequency execution bridges, custom indicators, and risk optimizers.",
      cta: "Request Bespoke Build",
      link: "#",
      isModal: true,
      color: "from-purple-500/10 to-transparent border-purple-500/10 hover:border-purple-500/30",
      iconColor: "text-purple-400"
    }
  ];

  const handlePillarCta = (e: React.MouseEvent, isModal: boolean, link: string) => {
    if (isModal) {
      e.preventDefault();
      onRequestBuild();
    } else if (link.startsWith("#")) {
      e.preventDefault();
      document.getElementById(link.substring(1))?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-20 md:py-32 bg-[#020202] relative overflow-hidden border-t border-white/5">
      {/* Background radial VFX */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/[0.02] blur-[130px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <div className="text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/[0.05] border border-emerald-500/[0.12] text-emerald-400 text-[10px] font-black uppercase tracking-[0.25em] mb-6"
          >
            <Award className="w-3.5 h-3.5" />
            Operational Framework &amp; Scope
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter mb-6 leading-[0.95]"
          >
            Seamless Software, <br />
            <span className="text-white/20">Three Strategic Scope Pillars.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/40 max-w-xl mx-auto text-xs sm:text-sm md:text-base leading-relaxed uppercase tracking-wider font-semibold"
          >
            We eliminate technical complexity. From advanced webinars to pre-built compiled algorithms and bespoke quantitative builds, our desk delivers peak mechanical performance.
          </motion.p>
        </div>

        {/* 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {pillars.map((pillar, idx) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className={`relative p-8 md:p-10 rounded-[2.5rem] bg-[#0A0A0A] border bg-gradient-to-b ${pillar.color} transition-all duration-500 flex flex-col justify-between group shadow-2xl hover:-translate-y-2`}
            >
              {/* Pillar Number */}
              <div className="absolute top-8 right-8 font-mono text-[9px] font-black text-white/10 uppercase tracking-widest">
                Protocol {pillar.num}
              </div>

              <div className="space-y-6">
                {/* Icon Container */}
                <div className={`w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center ${pillar.iconColor} group-hover:scale-110 transition-transform duration-500`}>
                  <pillar.icon className="w-6 h-6" />
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/30 block">
                    {pillar.subtitle}
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tight">
                    {pillar.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-white/45 leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              <div className="pt-10">
                {pillar.isModal ? (
                  <button
                    onClick={(e) => handlePillarCta(e, true, pillar.link)}
                    className="w-full flex items-center justify-center"
                  >
                    <EliteButton
                      variant="secondary"
                      size="sm"
                      fluid
                      rightIcon={<ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />}
                      className="group"
                    >
                      {pillar.cta}
                    </EliteButton>
                  </button>
                ) : (
                  <Link
                    to={pillar.link}
                    onClick={(e) => handlePillarCta(e, false, pillar.link)}
                    className="block w-full"
                  >
                    <EliteButton
                      variant="secondary"
                      size="sm"
                      fluid
                      rightIcon={<ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />}
                      className="group"
                    >
                      {pillar.cta}
                    </EliteButton>
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
