import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, ShieldCheck, Code2, TrendingUp, ArrowRight, Globe, Cpu, CheckCircle2, AlertCircle, Users, BarChart3, Star } from "lucide-react";
import { PageMeta } from "../components/site/PageMeta";
import { Reveal } from "../components/site/Reveal";
import { BRANDING } from "../constants/branding";
import { supabase } from "../lib/supabase";
import { EliteButton } from "../components/ui/Button";

export const Hiring = () => {
  const careerTiers = [
    {
      title: "Ultra-Low Latency C++ / Rust Systems Developer",
      domain: "FIX Engines, MT4/MT5 Bridges & Low-Latency Execution Infrastructure",
      reqs: "Expertise in kernel-bypass (Solarflare EF_VI), concurrency patterns, and real-time socket programming to route orders in under 50 microseconds.",
      placement: "Sovereign Prop Desks & Prime-of-Prime Liquidity Tunnels",
      icon: Code2,
    },
    {
      title: "Senior Institutional Business Development Manager (BDM)",
      domain: "CMT/CFT Brokerage Acquisition & High-Volume Asset Management Deals",
      reqs: "Proven track record closing seven-figure liquidity deals, deep networks with institutional brokers, and structuring volume-based rebate schedules.",
      placement: "Corporate FX Sales & Global Affiliate Desk Scaling",
      icon: TrendingUp,
    },
    {
      title: "CRM, MT4/MT5 Gateway & API Integration Specialist",
      domain: "Institutional Middle Office, Bridge Setup & Deep Telemetry Syncing",
      reqs: "Expertise integrating comprehensive CRM APIs with MT4/MT5 servers, customized margin rules, and secure real-time trade synchronizations.",
      placement: "Global Broker Back-Office & Supervised Liquidity Setup",
      icon: Cpu,
    },
    {
      title: "Institutional FX Marketing Specialist & Lead Designer",
      domain: "Premium Corporate Presence, Campaign Growth & Trust Architecture",
      reqs: "Crafting highly tailored high-net-worth B2B broker marketing strategies, quantitative brand visual engineering, and targeted elite conversion funnels.",
      placement: "Direct Global Brand Desk & Affiliate Network Scaling",
      icon: Users,
    }
  ];

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    specialization: "Ultra-Low Latency C++ / Rust Systems Developer",
    trackRecord: "",
    portfolioLink: "",
    backtestFidelity: "",
    engagementType: "Individual Quant Developer seeking placement"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [trackingId, setTrackingId] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.trackRecord) {
      setSubmitError("Please fill out all required fields (*).");
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const generatedId = Math.random().toString(36).substring(2, 12).toUpperCase();
      
      const { error } = await supabase
        .from("leads")
        .insert([
          {
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone || null,
            subject: `B2B Broker Sourcing Registration - ${formData.specialization}`,
            message: formData.trackRecord,
            source: "B2B Talent Desk Portal",
            status: "new",
            stage: "NEW",
            priority_tag: "Vetted Quant",
            crm_metadata: {
              specialization: formData.specialization,
              portfolio_link: formData.portfolioLink,
              backtest_fidelity: formData.backtestFidelity,
              engagement_type: formData.engagementType,
              tracking_id: `IFX-TDK-${generatedId}`,
              submitted_at: new Date().toISOString()
            }
          }
        ]);

      if (error) {
        console.error("Supabase error inserting candidate:", error);
        setSubmitError(`System rejection: ${error.message}`);
      } else {
        setTrackingId(`IFX-TDK-${generatedId}`);
        setSubmitSuccess(true);
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          specialization: "Ultra-Low Latency C++ / Rust Systems Developer",
          trackRecord: "",
          portfolioLink: "",
          backtestFidelity: "",
          engagementType: "Individual Quant Developer seeking placement"
        });
      }
    } catch (err: any) {
      console.error("Vetting Exception Trapped:", err);
      setSubmitError("An unexpected transmission anomaly occurred. Please verify your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-hidden min-h-screen bg-[#020203] text-[#BAC9CC] font-sans pb-24">
      <PageMeta
        title="Global B2B Broker Talent Desk & Quant Sourcing"
        description="Asia's leading recruitment pipeline supplying elite software engineers, BDMs, CRM integrators, and marketing specialists to CMT/CFT brokers globally."
        path="/hiring"
        keywords={["quant jobs", "broker talent sourcing", "C++ HFT developer roles", "MT4/MT5 bridge developers", "forex marketing recruitment"]}
      />

      {/* Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/2 rounded-full blur-[150px] pointer-events-none" />

      {/* Hero Section */}
      <div className="relative pt-32 pb-16 md:pt-48 md:pb-24 border-b border-white/[0.03] bg-gradient-to-b from-[#010203] to-[#020203]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <Reveal delay={0.05}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.25em] mb-8">
              <Briefcase className="h-3.5 w-3.5" /> GLOBAL CMT/CFT BROKER TALENT RESOURCE
            </span>
          </Reveal>
          
          <Reveal delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
              Sourcing the World's Finest <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">Brokerage & Algo Talent</span>
            </h1>
          </Reveal>
          
          <Reveal delay={0.15}>
            <p className="text-lg md:text-xl text-white/50 max-w-3xl mx-auto font-light leading-relaxed mb-12">
              We stand at the absolute summit of quantitative FX execution. We actively source and vet elite software developers, B2B sales professionals, CRM integration engineers, and high-conversion marketing specialists for the most sophisticated CMT and CFT brokers globally.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <a href="#vetting-form" className="w-full sm:w-auto">
                <EliteButton variant="elite" size="lg" fluid glowEffect rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Register Your Profile
                </EliteButton>
              </a>
              
              <a href="#vetting-form" className="w-full sm:w-auto">
                <EliteButton variant="secondary" size="lg" fluid>
                  Hire Top-Tier Specialists
                </EliteButton>
              </a>
            </div>
          </Reveal>

          {/* Quick Metrics */}
          <div className="mt-16 md:mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto border border-white/[0.05] bg-[#050608]/40 backdrop-blur-md rounded-2xl p-8">
            <div className="text-center sm:text-left sm:border-r border-white/5 sm:pr-8">
              <div className="text-3xl font-extrabold text-white">40+ Brokers</div>
              <div className="text-[10px] uppercase tracking-widest text-[#849396] mt-2 font-mono">Globally Sourced</div>
            </div>
            <div className="text-center sm:text-left sm:border-r border-white/5 sm:px-8">
              <div className="text-3xl font-extrabold text-white">Top 1.5%</div>
              <div className="text-[10px] uppercase tracking-widest text-[#849396] mt-2 font-mono">Quant Vetting Standards</div>
            </div>
            <div className="text-center sm:text-left sm:pl-8">
              <div className="text-3xl font-extrabold text-white">100% Secure</div>
              <div className="text-[10px] uppercase tracking-widest text-[#849396] mt-2 font-mono">Supabase Sync Pipeline</div>
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
                <ShieldCheck className="h-4 w-4" /> COMPLIANCE & ELITE RECRUITMENT
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">
                Vetting standard for sovereign-class brokers.
              </h2>
              <p className="text-white/50 leading-relaxed">
                Modern high-frequency trading requires more than standard resume matching. Our vetting desk operates a multi-stage quantitative check verifying practical system integration efficiency, low-latency code resilience, compliant CRM data operations, and direct MT4/MT5 bridge latency limits.
              </p>
              <div className="flex flex-col gap-3 pt-2">
                <div className="flex items-center gap-3 text-sm text-white/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Solarflare kernel-bypass optimization check
                </div>
                <div className="flex items-center gap-3 text-sm text-white/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Compliance CRM gateway protocol setup
                </div>
                <div className="flex items-center gap-3 text-sm text-white/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Deep-market margin rules validation
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2} className="relative">
            <div className="site-panel p-8 relative overflow-hidden border border-emerald-500/10 bg-[#050608]/40">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
              <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider font-mono text-emerald-400 border-b border-white/5 pb-3">
                // EXECUTIVE PLATFORM STATUS
              </h3>
              <p className="text-sm font-mono text-white/70 leading-relaxed mb-6">
                "IFX Trades supplies critical human infrastructure to the world's most capital-intensive CMT/CFT brokerages. When directors arrive on our desk, they obtain access to the absolute top tier of low-latency talent, ready to integrate into $10B+ operational models."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center text-xs font-bold text-emerald-400 font-mono">
                  B2B
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Global Talent Desk</div>
                  <div className="text-[10px] text-[#849396] font-mono">IFX OPERATIONAL SYSTEM</div>
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
                BROKER STAFFING CAPABILITIES
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">
                Vetted Brokerage Support Specializations
              </h2>
              <p className="text-white/50 max-w-2xl mx-auto">
                We track, vet, and place premium-class experts across the following critical brokerage divisions:
              </p>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2">
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

        {/* Interactive Vetting Form Section */}
        <section id="vetting-form" className="scroll-mt-24">
          <Reveal className="site-panel p-8 md:p-12 relative overflow-hidden bg-gradient-to-b from-[#05070a]/90 to-[#020305]/95 border border-emerald-500/15 rounded-3xl shadow-2xl">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/[0.02] rounded-full blur-3xl pointer-events-none" />
            
            <div className="max-w-3xl mx-auto">
              <div className="text-center space-y-4 mb-10">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-black uppercase tracking-widest font-mono">
                  SECURE DATA SYNCHRONIZATION // SUPABASE ACTIVE
                </span>
                <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                  Talent Desk Registration Portal
                </h2>
                <p className="text-white/40 text-sm max-w-xl mx-auto leading-relaxed">
                  Enter your operational capability metrics. Candidate profiles are cryptographically serialized and directly mapped into our private secure CRM enclave.
                </p>
              </div>

              {submitSuccess ? (
                <div className="text-center py-12 px-6 rounded-2xl bg-emerald-500/[0.02] border border-emerald-500/20 max-w-2xl mx-auto">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mx-auto mb-6">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">Application Authenticated</h3>
                  <p className="text-white/60 text-sm leading-relaxed max-w-md mx-auto mb-8">
                    Your professional broker application record has been securely logged into the IFX Leads CRM. An institutional validation analyst will review your profile metrics within 48 business hours.
                  </p>
                  <div className="bg-black/40 border border-white/5 p-4 rounded-xl font-mono text-xs max-w-xs mx-auto">
                    <div className="text-[#849396] uppercase tracking-wider mb-1">CRM Log Receipt</div>
                    <div className="text-emerald-400 font-bold tracking-widest">{trackingId}</div>
                  </div>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="mt-8 text-xs text-white/40 hover:text-white uppercase tracking-widest transition-colors font-mono underline"
                  >
                    Submit Another Record
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {submitError && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-mono">
                      <AlertCircle className="h-5 w-5 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-xs font-black text-white/60 uppercase tracking-widest font-mono">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. Dr. Lawrence Vance"
                        className="w-full bg-[#090b0e] border border-white/10 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-black text-white/60 uppercase tracking-widest font-mono">
                        Secure Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. vance@quantres.net"
                        className="w-full bg-[#090b0e] border border-white/10 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-xs font-black text-white/60 uppercase tracking-widest font-mono">
                        Contact Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="e.g. +1 (555) 019-2834"
                        className="w-full bg-[#090b0e] border border-white/10 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-black text-white/60 uppercase tracking-widest font-mono">
                        Domain Specialization
                      </label>
                      <select
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleInputChange}
                        className="w-full bg-[#090b0e] border border-white/10 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors appearance-none"
                        style={{ backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%23BAC9CC\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center', backgroundSize: '1.25rem', backgroundRepeat: 'no-repeat' }}
                      >
                        <option value="Ultra-Low Latency C++ / Rust Systems Developer">Ultra-Low Latency C++ / Rust Systems Developer</option>
                        <option value="Senior Institutional Business Development Manager (BDM)">Senior Institutional Business Development Manager (BDM)</option>
                        <option value="CRM, MT4/MT5 Gateway & API Integration Specialist">CRM, MT4/MT5 Gateway & API Integration Specialist</option>
                        <option value="Institutional FX Marketing Specialist & Lead Designer">Institutional FX Marketing Specialist & Lead Designer</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-xs font-black text-white/60 uppercase tracking-widest font-mono">
                        GitHub / Portfolio URI
                      </label>
                      <input
                        type="url"
                        name="portfolioLink"
                        value={formData.portfolioLink}
                        onChange={handleInputChange}
                        placeholder="e.g. https://github.com/quant-architect"
                        className="w-full bg-[#090b0e] border border-white/10 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-black text-white/60 uppercase tracking-widest font-mono">
                        Verified Backtest / Track Record Link
                      </label>
                      <input
                        type="url"
                        name="backtestFidelity"
                        value={formData.backtestFidelity}
                        onChange={handleInputChange}
                        placeholder="e.g. https://myfxbook.com/members/fidelity-log"
                        className="w-full bg-[#090b0e] border border-white/10 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-black text-white/60 uppercase tracking-widest font-mono">
                      Engagement Category
                    </label>
                    <select
                      name="engagementType"
                      value={formData.engagementType}
                      onChange={handleInputChange}
                      className="w-full bg-[#090b0e] border border-white/10 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors appearance-none"
                      style={{ backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%23BAC9CC\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center', backgroundSize: '1.25rem', backgroundRepeat: 'no-repeat' }}
                    >
                      <option value="Individual Quant Developer seeking placement">Individual Quant Developer seeking placement</option>
                      <option value="Asset Manager seeking custom talent alignment">Asset Manager seeking custom talent alignment</option>
                      <option value="Venture/Desk requiring bespoke algorithm outsourcing">Venture/Desk requiring bespoke algorithm outsourcing</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-black text-white/60 uppercase tracking-widest font-mono">
                      Operational Track Record & Sourcing Summary *
                    </label>
                    <textarea
                      name="trackRecord"
                      value={formData.trackRecord}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      placeholder="Outline your backtest parameters, low-latency optimizations, CRM API integration layouts, or strategic B2B acquisition achievements..."
                      className="w-full bg-[#090b0e] border border-white/10 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <div className="pt-4">
                    <EliteButton
                      type="submit"
                      disabled={isSubmitting}
                      isLoading={isSubmitting}
                      variant="elite"
                      size="lg"
                      fluid
                      rightIcon={<ArrowRight className="h-4 w-4" />}
                    >
                      Transmit Secure Vetting Request
                    </EliteButton>
                  </div>
                </form>
              )}
            </div>
          </Reveal>
        </section>
      </div>
    </div>
  );
};
