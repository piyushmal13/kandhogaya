import React from "react";
import { motion } from "motion/react";
import { ArrowRight, ShieldCheck, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { EliteButton } from "../ui/Button";

interface OperationalPillarsProps {
  onRequestBuild: () => void;
}

// ── CUSTOM HIGH-FIDELITY GEOMETRIC SVGS (Zero Cheap outlines) ──

const AcademyIcon = () => (
  <svg className="w-6 h-6 text-blue-400 group-hover:scale-105 transition-transform duration-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="18" x2="21" y2="6" strokeDasharray="3 3" opacity="0.3" />
    <line x1="3" y1="14" x2="21" y2="2" strokeDasharray="3 3" opacity="0.3" />
    <path d="M3 20 L9 14 L14 15.5 L21 7" stroke="#00A3FF" strokeWidth="2.5" />
    <circle cx="21" cy="7" r="2" fill="#00A3FF" />
  </svg>
);

const MachineryIcon = () => (
  <svg className="w-6 h-6 text-cyan-400 group-hover:scale-105 transition-transform duration-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="16" width="3.5" height="5" rx="0.5" fill="#00A3FF" opacity="0.8" stroke="none" />
    <rect x="8" y="11" width="3.5" height="10" rx="0.5" fill="#00D2FF" opacity="0.8" stroke="none" />
    <rect x="13" y="6" width="3.5" height="15" rx="0.5" fill="#8B5CF6" opacity="0.8" stroke="none" />
    <rect x="18" y="2" width="3.5" height="19" rx="0.5" fill="#3B82F6" opacity="0.8" stroke="none" />
  </svg>
);

const EngineeringIcon = () => (
  <svg className="w-6 h-6 text-purple-400 group-hover:scale-105 transition-transform duration-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="4" r="1.5" fill="#8B5CF6" />
    <circle cx="4" cy="12" r="1.5" fill="#00A3FF" />
    <circle cx="20" cy="12" r="1.5" fill="#00E5FF" />
    <circle cx="12" cy="20" r="1.5" fill="#3B82F6" />
    <line x1="12" y1="5.5" x2="4" y2="12" />
    <line x1="12" y1="5.5" x2="20" y2="12" />
    <line x1="4" y1="12" x2="12" y2="19.5" />
    <line x1="20" y1="12" x2="12" y2="19.5" />
    <circle cx="12" cy="12" r="2.5" fill="#ffffff" opacity="0.15" />
  </svg>
);

export const OperationalPillars: React.FC<OperationalPillarsProps> = ({ onRequestBuild }) => {
  const pillars = [
    {
      num: "01",
      icon: AcademyIcon,
      title: "Quant Academy",
      subtitle: "Webinar Masterclasses",
      description: "Webinar masterclasses led by global quants, breaking down raw macro indicators and systematic trend-following models.",
      cta: "Explore Masterclasses",
      link: "/webinars",
      isModal: false,
      color: "from-blue-500/10 to-transparent border-blue-500/10 hover:border-blue-500/30",
      iconColor: "text-blue-400"
    },
    {
      num: "02",
      icon: MachineryIcon,
      title: "Systematic Machinery",
      subtitle: "Algorithmic Registry",
      description: "High-fidelity systematic models. Deploy fully compiled binary files (.ex5, .ex4) directly on secure MT4/MT5 and TradingView architectures.",
      cta: "View Algo Registry",
      link: "#performance",
      isModal: false,
      color: "from-cyan-500/10 to-transparent border-cyan-500/10 hover:border-cyan-500/30",
      iconColor: "text-cyan-400"
    },
    {
      num: "03",
      icon: EngineeringIcon,
      title: "Engineering Desk",
      subtitle: "Bespoke Coding Desk",
      description: "Custom strategic programming. Our quantitative desk engineers bespoke FIX API liquidity bridges, low-latency indicators, and rigorous drawdown guardrails.",
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
    <section className="py-20 md:py-32 bg-[var(--bg-base)] relative overflow-hidden border-t border-white/5">
      {/* Background radial VFX */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/[0.02] blur-[130px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <div className="text-center mb-16 md:mb-24">


          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter mb-6 leading-[0.95]"
          >
            High-Fidelity Software, <br />
            <span className="text-white/20">Three Strategic Scope Pillars.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/40 max-w-xl mx-auto text-xs sm:text-sm leading-relaxed uppercase tracking-wider font-semibold"
          >
            We compile quantitative solutions with absolute precision. From developer webinars to drag-and-drop compiled binaries and custom API integrations, our desk delivers clean execution parameters.
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
                  <pillar.icon />
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
                    className="w-full flex items-center justify-center cursor-pointer"
                  >
                    <EliteButton
                      variant="secondary"
                      size="sm"
                      fluid
                      rightIcon={<ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />}
                      className="group animate-none"
                    >
                      {pillar.cta}
                    </EliteButton>
                  </button>
                ) : (
                  <Link
                    to={pillar.link}
                    onClick={(e) => handlePillarCta(e, false, pillar.link)}
                    className="block w-full cursor-pointer"
                  >
                    <EliteButton
                      variant="secondary"
                      size="sm"
                      fluid
                      rightIcon={<ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />}
                      className="group animate-none"
                    >
                      {pillar.cta}
                    </EliteButton>
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* B2B Operational Scope & Compliance Division Grid */}
        <div className="mt-16 md:mt-24 pt-12 border-t border-white/[0.04] grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
          {/* Section 1: Core Operations */}
          <div className="bg-[#05070a]/60 border border-white/[0.04] rounded-[2rem] p-8 backdrop-blur-md relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#00A3FF]/10 border border-[#00A3FF]/20 flex items-center justify-center text-[#00A3FF]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[8px] font-mono tracking-[0.25em] text-[#00A3FF] uppercase font-black block">Fulfillment Directives</span>
                  <h3 className="text-lg font-black uppercase text-white tracking-tight mt-0.5">Core Operational Scope</h3>
                </div>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="text-emerald-400 font-mono text-xs font-black">✓</span>
                  <div>
                    <h5 className="text-[11px] font-black uppercase text-white tracking-wider">Systematic Software Licensing</h5>
                    <p className="text-[10px] text-white/40 leading-relaxed font-bold uppercase tracking-wider mt-0.5">Handover of compiled MT5 EX5 binaries, volatility scripts, and custom execution algorithms directly to client environments.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-400 font-mono text-xs font-black">✓</span>
                  <div>
                    <h5 className="text-[11px] font-black uppercase text-white tracking-wider">Bespoke Engineering Desk</h5>
                    <p className="text-[10px] text-white/40 leading-relaxed font-bold uppercase tracking-wider mt-0.5">Custom development of low-latency FIX API bridge routers, systematic indicators, and drawdown safety layers on a project-by-project contract basis.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-400 font-mono text-xs font-black">✓</span>
                  <div>
                    <h5 className="text-[11px] font-black uppercase text-white tracking-wider">Broker & Liquidity Integrations</h5>
                    <p className="text-[10px] text-white/40 leading-relaxed font-bold uppercase tracking-wider mt-0.5">Partnership protocols with brokerage houses, including global outsourced developer staffing, liquidity bridge custom configurations, and margin education program setups.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-400 font-mono text-xs font-black">✓</span>
                  <div>
                    <h5 className="text-[11px] font-black uppercase text-white tracking-wider">Quantitative Research & Webinars</h5>
                    <p className="text-[10px] text-white/40 leading-relaxed font-bold uppercase tracking-wider mt-0.5">Publishing factual market structure models, ATR regime analysis spreadsheets, and hosting developer masterclasses for active clients.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 2: Exclusions */}
          <div className="bg-[#05070a]/60 border border-white/[0.04] rounded-[2rem] p-8 backdrop-blur-md relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[8px] font-mono tracking-[0.25em] text-amber-500/80 uppercase font-black block">Regulatory Purge</span>
                  <h3 className="text-lg font-black uppercase text-white tracking-tight mt-0.5">Explicit Scope Exclusions</h3>
                </div>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="text-amber-500 font-mono text-xs font-black">✕</span>
                  <div>
                    <h5 className="text-[11px] font-black uppercase text-white tracking-wider">No Capital Custody or Deposits</h5>
                    <p className="text-[10px] text-white/40 leading-relaxed font-bold uppercase tracking-wider mt-0.5">We do NOT accept trader deposits, execute account funding, or manage client capital. All operations are run strictly inside clients' self-hosted environments.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-500 font-mono text-xs font-black">✕</span>
                  <div>
                    <h5 className="text-[11px] font-black uppercase text-white tracking-wider">No Brokerage or Clearing Affiliations</h5>
                    <p className="text-[10px] text-white/40 leading-relaxed font-bold uppercase tracking-wider mt-0.5">We are NOT a broker, clearinghouse, custodian, or financial intermediary. Clients maintain complete autonomy over their choice of execution counterparties.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-500 font-mono text-xs font-black">✕</span>
                  <div>
                    <h5 className="text-[11px] font-black uppercase text-white tracking-wider">No Investment or Trade Advising</h5>
                    <p className="text-[10px] text-white/40 leading-relaxed font-bold uppercase tracking-wider mt-0.5">We do NOT provide retail trade recommendations, financial advice, or speculative return forecasts. All materials are delivered for educational and research parameters only.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
