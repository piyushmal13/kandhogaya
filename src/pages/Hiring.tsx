import React from "react";
import { Link } from "react-router-dom";
import { Briefcase, ShieldCheck, Code2, TrendingUp, ChevronRight, ArrowRight, Globe, Cpu } from "lucide-react";
import { PageMeta } from "../components/site/PageMeta";
import { Reveal } from "../components/site/Reveal";
import { BRANDING } from "../constants/branding";

export const Hiring = () => {
  const careerTiers = [
    {
      title: "Lead Machine Learning Quant",
      domain: "Neural Regime Detection & Alpha Mining",
      reqs: "Deep experience with PyTorch, PyMC, and high-frequency G10 Forex modeling.",
      placement: "Institutional Prop Desks & Custom Algo Pipelines",
      icon: Cpu,
    },
    {
      title: "Ultra-Low Latency Developer",
      domain: "FIX Engines & Custom Trading Bridges",
      reqs: "Expert C++ or Rust systems programmer. High-performance concurrency master.",
      placement: "HFT Funds & Institutional Liquidity Integrators",
      icon: Code2,
    },
    {
      title: "SMC Strategy Architect",
      domain: "Volume & Market Structure Automation",
      reqs: "Advanced PineScript/MQL5 engineering. Proven historical backtest fidelity.",
      placement: "Elite Capital Desks & Custom Retail Bridges",
      icon: TrendingUp,
    }
  ];

  return (
    <div className="relative overflow-hidden min-h-screen bg-[#020203] text-[#BAC9CC] font-sans pb-24">
      <PageMeta
        title="Global B2B Talent Desk & Quant Careers"
        description="Join Asia's premier B2B quant talent network. We vet elite trading system architects and match them with top-tier global institutions."
        path="/hiring"
        keywords={["quant jobs", "forex algorithmic careers", "B2B trading developer recruitment", "C++ HFT developer roles"]}
      />

      {/* Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/2 rounded-full blur-[150px] pointer-events-none" />

      {/* Hero Section */}
      <div className="relative pt-32 pb-16 md:pt-48 md:pb-24 border-b border-white/[0.03] bg-gradient-to-b from-[#010203] to-[#020203]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <Reveal delay={0.05}>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.25em] mb-8">
              <Briefcase className="h-3 w-3" /> Global B2B Talent Desk
            </span>
          </Reveal>
          
          <Reveal delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
              Empowering Asia's <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">Elite Quant Talent</span>
            </h1>
          </Reveal>
          
          <Reveal delay={0.15}>
            <p className="text-lg md:text-xl text-white/50 max-w-3xl mx-auto font-light leading-relaxed mb-12">
              IFX Trades has transitioned from a retail academy to a global B2B matchmaking engine. We vet the world's most resilient algorithmic architects and custom strategy engineers, bridging them directly with top-tier financial institutions and custom development desks.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/academy"
                className="group w-full sm:w-auto relative inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-xs font-black text-black uppercase tracking-[0.25em] overflow-hidden shadow-[0_10px_30px_rgba(255,255,255,0.15)] hover:shadow-[0_10px_40px_rgba(16,185,129,0.3)] transition-all duration-500"
              >
                <div className="absolute inset-0 bg-emerald-400 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                <span className="relative z-10 flex items-center gap-2">
                  Apply for Vetting
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              
              <Link
                to="/academy"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-xs font-black text-white uppercase tracking-[0.25em] hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                Hire Elite Quants
              </Link>
            </div>
          </Reveal>

          {/* Quick Metrics */}
          <div className="mt-16 md:mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto border border-white/[0.05] bg-[#050608]/40 backdrop-blur-md rounded-2xl p-8">
            <div className="text-center sm:text-left sm:border-r border-white/5 sm:pr-8">
              <div className="text-3xl font-extrabold text-white">99.8%</div>
              <div className="text-[10px] uppercase tracking-widest text-[#849396] mt-2 font-mono">Backtest Model Fidelity</div>
            </div>
            <div className="text-center sm:text-left sm:border-r border-white/5 sm:px-8">
              <div className="text-3xl font-extrabold text-white">Vetted</div>
              <div className="text-[10px] uppercase tracking-widest text-[#849396] mt-2 font-mono">Elite Proprietary Roster</div>
            </div>
            <div className="text-center sm:text-left sm:pl-8">
              <div className="text-3xl font-extrabold text-white">Direct</div>
              <div className="text-[10px] uppercase tracking-widest text-[#849396] mt-2 font-mono">B2B Institutional Sourcing</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="max-w-5xl mx-auto px-6 py-20 space-y-24">
        {/* Core Methodology */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <Reveal delay={0.1}>
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest font-mono">
                <ShieldCheck className="h-4 w-4" /> VETTING STANDARDS
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">
                Our strict algorithmic vetting pipeline.
              </h2>
              <p className="text-white/50 leading-relaxed">
                We do not recruit based on generic résumés or retail training credentials. Every candidate entering our Global B2B Talent Desk undergoes comprehensive quantitative validation: structural code auditing, live historical forward-testing under rigorous regime filters, and capital exposure drawdown resilience verification.
              </p>
              <div className="flex flex-col gap-3 pt-2">
                <div className="flex items-center gap-3 text-sm text-white/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Code Optimization & Execution Cleanliness Audits
                </div>
                <div className="flex items-center gap-3 text-sm text-white/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Regime-shift GARCH Volatility Resilience Verification
                </div>
                <div className="flex items-center gap-3 text-sm text-white/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Verified MyFxBook / Track Record Cryptographic Validation
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2} className="relative">
            <div className="site-panel p-8 relative overflow-hidden border border-emerald-500/10 bg-[#050608]/40">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
              <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider font-mono text-emerald-400 border-b border-white/5 pb-3">
                // PLATFORM DIRECTIVE
              </h3>
              <p className="text-sm font-mono text-white/70 leading-relaxed mb-6">
                "IFX Trades is Asia's most prominent institutional matchmaking ecosystem. Rather than educating retail traders, we focus heavily on discovering, vetting, and positioning the region's elite quantitative developers and strategic minds."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center text-xs font-bold text-emerald-400 font-mono">
                  B2B
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Institutional Matchmaking</div>
                  <div className="text-[10px] text-[#849396] font-mono">IFX EXECUTIVE OFFICE</div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Priority Talent Categories */}
        <section className="space-y-12">
          <Reveal>
            <div className="text-center space-y-4">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-mono">
                TALENT CAPABILITIES
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">
                Vetted Quant Specializations
              </h2>
              <p className="text-white/50 max-w-2xl mx-auto">
                These represent the absolute focal points of our talent matching network. We track, vet, and place developers in these primary domains:
              </p>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-3">
            {careerTiers.map((tier, index) => (
              <Reveal key={tier.title} delay={index * 0.08} className="site-panel p-6 bg-[#040506]/80 hover:border-emerald-500/20 transition-all duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <tier.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-6 text-lg font-bold text-white tracking-tight">{tier.title}</h3>
                <div className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider mt-1">{tier.domain}</div>
                <p className="mt-4 text-sm text-white/50 leading-relaxed font-light">{tier.reqs}</p>
                <div className="mt-6 border-t border-white/5 pt-4">
                  <div className="text-[9px] uppercase tracking-widest text-[#849396] font-mono">Target Placements</div>
                  <div className="text-xs font-semibold text-white mt-1">{tier.placement}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Action Panel */}
        <section>
          <Reveal className="site-panel p-10 text-center relative overflow-hidden bg-gradient-to-r from-[#030507] to-[#05080c] border border-emerald-500/10">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.03),transparent)]" />
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
              Ready to execute institutional alignment?
            </h2>
            <p className="text-white/50 max-w-xl mx-auto leading-relaxed mb-8">
              Whether you are an asset manager seeking to fill complex quant needs, or an elite system designer ready to undergo rigorous portfolio vetting.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Link
                to="/academy"
                className="group relative inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-xs font-bold text-black uppercase tracking-[0.2em] overflow-hidden shadow-lg hover:shadow-xl transition-all"
              >
                <div className="absolute inset-0 bg-emerald-400 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                <span className="relative z-10 flex items-center gap-2">
                  Enter Talent Desk <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              
              <a
                href={`mailto:${BRANDING.careersEmail}`}
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-xs font-bold text-white uppercase tracking-[0.2em] hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                Direct Inquiry
              </a>
            </div>
          </Reveal>
        </section>
      </div>
    </div>
  );
};
