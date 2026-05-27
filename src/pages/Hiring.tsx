import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Briefcase, ShieldCheck, Code2, TrendingUp, ArrowRight, Globe, Cpu, CheckCircle2, AlertCircle, Users, BarChart3, Star, Building, Landmark } from "lucide-react";
import { PageMeta } from "../components/site/PageMeta";
import { Reveal } from "../components/site/Reveal";
import { BRANDING } from "../constants/branding";
import { supabase } from "../lib/supabase";
import { EliteButton } from "../components/ui/Button";

export const Hiring = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  // Read target tab from url parameter: 'b2b' for broker sourcing, 'careers' for joining us
  const initialMode = searchParams.get("mode") === "careers" ? "careers" : "b2b";
  const [activeTab, setActiveTab] = useState<"b2b" | "careers">(initialMode);

  // Sync state if query param changes dynamically (e.g. user clicks different footer links)
  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "careers") {
      setActiveTab("careers");
    } else if (mode === "b2b") {
      setActiveTab("b2b");
    }
  }, [searchParams]);

  const handleTabChange = (tab: "b2b" | "careers") => {
    setActiveTab(tab);
    setSearchParams({ mode: tab });
  };

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
    engagementType: activeTab === "b2b" ? "Single Role Staffing Outsource" : "Individual Quant Developer seeking placement"
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
      const payloadSubject = activeTab === "b2b" 
        ? `B2B Broker Sourcing - ${formData.specialization}`
        : `Quant Application - ${formData.specialization}`;
      
      const payloadSource = activeTab === "b2b"
        ? "B2B Broker Sourcing Desk"
        : "Internal Careers Portal";

      const priorityTag = activeTab === "b2b" ? "B2B Broker" : "Quant Applicant";

      const { error } = await supabase
        .from("leads")
        .insert([
          {
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone || null,
            subject: payloadSubject,
            message: formData.trackRecord,
            source: payloadSource,
            status: "new",
            stage: "NEW",
            priority_tag: priorityTag,
            crm_metadata: {
              specialization: formData.specialization,
              portfolio_link: activeTab === "careers" ? formData.portfolioLink : null,
              backtest_fidelity: activeTab === "careers" ? formData.backtestFidelity : null,
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
          engagementType: activeTab === "b2b" ? "Single Role Staffing Outsource" : "Individual Quant Developer seeking placement"
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
        title={activeTab === "b2b" 
          ? "Sovereign B2B Broker Talent Recruitment Desk" 
          : "IFX Trades Careers — Join the Quantitative Desk"}
        description={activeTab === "b2b"
          ? "Sourcing the world's finest systems developers, BDMs, CRM experts, and marketing specialists for premium global CMT/CFT brokerages."
          : "Work with elite quantitative architects, macro strategists, and systems engineers behind Asia's top low-latency algorithmic desk."}
        path="/hiring"
        keywords={["quant jobs", "broker talent sourcing", "C++ HFT developer roles", "MT4/MT5 bridge developers", "forex marketing recruitment"]}
      />

      {/* Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/2 rounded-full blur-[150px] pointer-events-none" />

      {/* Hero Section */}
      <div className="relative pt-32 pb-16 md:pt-40 md:pb-20 border-b border-white/[0.03] bg-gradient-to-b from-[#010203] to-[#020203]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          
          {/* Elegant Interactive Dynamic Tabs */}
          <div className="inline-flex p-1.5 rounded-full bg-white/[0.02] border border-white/[0.05] mb-12 shadow-2xl backdrop-blur-3xl">
            <button
              onClick={() => handleTabChange("b2b")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                activeTab === "b2b"
                  ? "bg-emerald-500 text-black shadow-lg"
                  : "text-white/40 hover:text-white"
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              B2B Broker Sourcing Desk
            </button>
            <button
              onClick={() => handleTabChange("careers")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                activeTab === "careers"
                  ? "bg-emerald-500 text-black shadow-lg"
                  : "text-white/40 hover:text-white"
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              IFX Careers Portal
            </button>
          </div>

          <Reveal delay={0.05}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.25em] mb-8">
              {activeTab === "b2b" ? (
                <>
                  <Briefcase className="h-3.5 w-3.5" /> GLOBAL CMT/CFT BROKER TALENT DESK
                </>
              ) : (
                <>
                  <ShieldCheck className="h-3.5 w-3.5" /> IFX CORE PROPRIETARY ENCLAVE
                </>
              )}
            </span>
          </Reveal>

          {activeTab === "careers" && (
            <Reveal delay={0.07}>
              <div className="mb-6 p-3 px-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest inline-flex items-center gap-2.5 animate-pulse mx-auto">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                🔥 WE ARE HIRING — Join our Quantitative Desk Operations
              </div>
            </Reveal>
          )}
          
          <Reveal delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
              {activeTab === "b2b" ? (
                <>
                  Sourcing the World's Finest <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">Brokerage &amp; Algo Talent</span>
                </>
              ) : (
                <>
                  Join Asia's Premier <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">Sovereign Quant Desk</span>
                </>
              )}
            </h1>
          </Reveal>
          
          <Reveal delay={0.15}>
            <p className="text-lg md:text-xl text-white/50 max-w-3xl mx-auto font-light leading-relaxed mb-12">
              {activeTab === "b2b" ? (
                "We stand at the absolute summit of systematic execution. We actively source and vet low-latency developers, B2B sales professionals, CRM integration engineers, and marketing specialists for the top CMT/CFT brokers globally."
              ) : (
                "Join the senior developers, macro strategists, and systems engineers behind our ultra-low latency sovereign node networks. We operate on absolute mathematical probability, C++ cores, and verified edge."
              )}
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <a href="#vetting-form" className="w-full sm:w-auto">
                <EliteButton variant="elite" size="lg" fluid glowEffect rightIcon={<ArrowRight className="h-4 w-4" />}>
                  {activeTab === "b2b" ? "Submit Staffing Request" : "Submit Quant Application"}
                </EliteButton>
              </a>
              
              <a href="#vetting-form" className="w-full sm:w-auto">
                <EliteButton variant="secondary" size="lg" fluid>
                  {activeTab === "b2b" ? "Hire Vetted Specialists" : "Vetting Pipeline Rules"}
                </EliteButton>
              </a>
            </div>
          </Reveal>

          {/* Quick Metrics */}
          <div className="mt-16 md:mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto border border-white/[0.05] bg-[#050608]/40 backdrop-blur-md rounded-2xl p-8">
            <div className="text-center sm:text-left sm:border-r border-white/5 sm:pr-8">
              <div className="text-3xl font-extrabold text-white">
                {activeTab === "b2b" ? "40+ Brokerages" : "Sub-1.2ms"}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-[#849396] mt-2 font-mono">
                {activeTab === "b2b" ? "Active Global Clients" : "Engine Target Latency"}
              </div>
            </div>
            <div className="text-center sm:text-left sm:border-r border-white/5 sm:px-8">
              <div className="text-3xl font-extrabold text-white">Top 1.5%</div>
              <div className="text-[10px] uppercase tracking-widest text-[#849396] mt-2 font-mono">Quant Vetting Rigor</div>
            </div>
            <div className="text-center sm:text-left sm:pl-8">
              <div className="text-3xl font-extrabold text-white">100% Secure</div>
              <div className="text-[10px] uppercase tracking-widest text-[#849396] mt-2 font-mono">Supabase CRM Sync</div>
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
                <ShieldCheck className="h-4 w-4" /> VETTING & ALGORITHMIC VERIFICATION
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">
                {activeTab === "b2b" 
                  ? "Standard of excellence for CMT/CFT brokers." 
                  : "We only hire developers of absolute caliber."}
              </h2>
              <p className="text-white/50 leading-relaxed">
                {activeTab === "b2b" ? (
                  "Modern high-frequency trading requires more than standard resume matching. Our vetting desk operates a multi-stage quantitative check verifying practical system integration efficiency, low-latency code resilience, compliant CRM data operations, and direct MT4/MT5 bridge latency limits."
                ) : (
                  "IFX Trades does not recruit based on generic credentials. Every developer, architect, or macro researcher entering our core desk must undergo rigorous testing: concurrency loops, kernel-bypass audits, and GARCH volatility regime resilience validation."
                )}
              </p>
              <div className="flex flex-col gap-3 pt-2">
                <div className="flex items-center gap-3 text-sm text-white/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {activeTab === "b2b" ? "Solarflare kernel-bypass optimization check" : "Demonstrated lock-free concurrency loops in C++ / Rust"}
                </div>
                <div className="flex items-center gap-3 text-sm text-white/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {activeTab === "b2b" ? "Compliance CRM gateway protocol setup" : "Cryptographic track record validation via verified links"}
                </div>
                <div className="flex items-center gap-3 text-sm text-white/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {activeTab === "b2b" ? "Deep-market margin rules validation" : "Understanding of prime-of-prime ECN routing mechanics"}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2} className="relative">
            <div className="site-panel p-8 relative overflow-hidden border border-emerald-500/10 bg-[#050608]/40">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
              <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider font-mono text-emerald-400 border-b border-white/5 pb-3">
                {activeTab === "b2b" ? "// B2B CO-LOCATION DIRECTIVE" : "// CORE ENCLAVE STATEMENTS"}
              </h3>
              <p className="text-sm font-mono text-white/70 leading-relaxed mb-6">
                {activeTab === "b2b" ? (
                  "\"IFX Trades supplies critical human infrastructure to the world's most capital-intensive CMT/CFT brokerages. When directors arrive on our desk, they obtain access to the absolute top tier of low-latency talent, ready to integrate into $10B+ operational models.\""
                ) : (
                  "\"We operate as an elite quantitative software laboratory. We do not sell hope or signals. We license high-fidelity systematic models, and we expect our core team to share that focus on mechanical, objective execution.\""
                )}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center text-xs font-bold text-emerald-400 font-mono">
                  {activeTab === "b2b" ? "B2B" : "DESK"}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    {activeTab === "b2b" ? "Global Sourcing Desk" : "Quantitative Council"}
                  </div>
                  <div className="text-[10px] text-[#849396] font-mono">
                    {activeTab === "b2b" ? "IFX GENERAL MANAGEMENT" : "IFX EXECUTIVE HEAD"}
                  </div>
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
                {activeTab === "b2b" ? "BROKER STAFFING CAPABILITIES" : "CORE SPECIALTIES REQUIRED"}
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">
                {activeTab === "b2b" 
                  ? "Vetted Brokerage Support Specializations" 
                  : "Target Operational Specialties"}
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
                  <div className="text-[9px] uppercase tracking-widest text-[#849396] font-mono">
                    {activeTab === "b2b" ? "Target Placements" : "Core Enclave Scope"}
                  </div>
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
                  {activeTab === "b2b" 
                    ? "SECURE B2B BROKERAGE INTAKE // SOURCING PIPELINE"
                    : "SECURE CAREERS PIPELINE // TIER-1 QUANT VETTING"}
                </span>
                <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                  {activeTab === "b2b" 
                    ? "Brokerage Staffing & Sourcing Desk"
                    : "Core Enclave Application Portal"}
                </h2>
                <p className="text-white/40 text-sm max-w-xl mx-auto leading-relaxed">
                  {activeTab === "b2b" ? (
                    "Specify your technical requirements. Sourcing requests are cryptographically serialized and directly mapped into our private secure CRM enclave."
                  ) : (
                    "Submit your technical credentials and quantitative track records directly to our Risk and Quantitative Council."
                  )}
                </p>
              </div>

              {submitSuccess ? (
                <div className="text-center py-12 px-6 rounded-2xl bg-emerald-500/[0.02] border border-emerald-500/20 max-w-2xl mx-auto">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mx-auto mb-6">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">
                    {activeTab === "b2b" ? "Staffing Brief Authenticated" : "Application Authenticated"}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed max-w-md mx-auto mb-8">
                    Your request record has been securely logged into the IFX Leads CRM. An institutional validation analyst will review your profile metrics within 48 business hours.
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
                        {activeTab === "b2b" ? "Brokerage / Corporate Name *" : "Full Legal Name *"}
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        placeholder={activeTab === "b2b" ? "e.g. Sovereign Markets Corp" : "e.g. Dr. Lawrence Vance"}
                        className="w-full bg-[#090b0e] border border-white/10 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-black text-white/60 uppercase tracking-widest font-mono">
                        {activeTab === "b2b" ? "Authorized Corporate Email *" : "Secure Personal Email *"}
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder={activeTab === "b2b" ? "e.g. operations@sovereignmarkets.com" : "e.g. vance@quantres.net"}
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
                        {activeTab === "b2b" ? "Target Sourcing Role" : "Quantitative Core Specialization"}
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

                  {activeTab === "careers" && (
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
                  )}

                  <div className="space-y-2">
                    <label className="block text-xs font-black text-white/60 uppercase tracking-widest font-mono">
                      {activeTab === "b2b" ? "Broker Engagement Model" : "Engagement Category"}
                    </label>
                    <select
                      name="engagementType"
                      value={formData.engagementType}
                      onChange={handleInputChange}
                      className="w-full bg-[#090b0e] border border-white/10 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors appearance-none"
                      style={{ backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%23BAC9CC\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center', backgroundSize: '1.25rem', backgroundRepeat: 'no-repeat' }}
                    >
                      {activeTab === "b2b" ? (
                        <>
                          <option value="Single Role Staffing Outsource">Single Role Staffing Outsource</option>
                          <option value="Complete Multi-Role Broker Outsource">Complete Multi-Role Broker Outsource</option>
                          <option value="Dedicated Quantitative Team Setup">Dedicated Quantitative Team Setup</option>
                        </>
                      ) : (
                        <>
                          <option value="Individual Quant Developer seeking placement">Individual Quant Developer seeking placement</option>
                          <option value="Asset Manager seeking custom talent alignment">Asset Manager seeking custom talent alignment</option>
                          <option value="Venture/Desk requiring bespoke algorithm outsourcing">Venture/Desk requiring bespoke algorithm outsourcing</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-black text-white/60 uppercase tracking-widest font-mono">
                      {activeTab === "b2b" 
                        ? "Staffing Objectives & System Specifications *" 
                        : "Operational Track Record & Sourcing Summary *"}
                    </label>
                    <textarea
                      name="trackRecord"
                      value={formData.trackRecord}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      placeholder={activeTab === "b2b"
                        ? "Describe the exact platform integrations, margin matrices, or target sales parameters required for your brokerage..."
                        : "Outline your backtest parameters, low-latency optimizations, CRM API integration layouts, or strategic B2B acquisition achievements..."}
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
                      {activeTab === "b2b" ? "Transmit Staffing Request" : "Transmit Secure Application"}
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
