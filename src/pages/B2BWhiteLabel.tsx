import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Building, 
  ShieldCheck, 
  Send, 
  Cpu, 
  Zap, 
  Globe, 
  Server, 
  Layout, 
  Smartphone,
  CreditCard,
  Network
} from "lucide-react";
import { leadService } from "../services/crm/leadService";
import { useToast } from "../contexts/ToastContext";
import { PageMeta } from "../components/site/PageMeta";

export const B2BWhiteLabel = () => {
  const { success, error: toastError } = useToast();
  const [orgName, setOrgName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [audienceSize, setAudienceSize] = useState("0 - 1,000 clients");
  const [timeline, setTimeline] = useState("Immediate (< 30 days)");
  const [requirements, setRequirements] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [trackingId, setTrackingId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName || !contactName || !email || !requirements) return;

    setIsSubmitting(true);
    try {
      const generatedId = Math.random().toString(36).substring(2, 12).toUpperCase();
      const result = await leadService.createLead({
        email: email.trim(),
        source: "b2b_whitelabel_desk",
        stage: "B2B_PARTNER",
        crm_metadata: {
          organization_name: orgName.trim(),
          contact_officer: contactName.trim(),
          audience_size: audienceSize,
          target_timeline: timeline,
          custom_requirements: requirements.trim(),
          tracking_id: `IFX-WLB-${generatedId}`,
          system_telemetry: {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
          }
        }
      });

      if (result.success) {
        setTrackingId(`IFX-WLB-${generatedId}`);
        success("B2B White Label Partner Brief safely logged.");
        setIsSuccess(true);
        setOrgName("");
        setContactName("");
        setEmail("");
        setRequirements("");
      } else {
        toastError(result.error || "Failed to submit request.");
      }
    } catch (err) {
      console.error("B2B White Label Submission Error:", err);
      toastError("Network connection interrupted. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#010203] text-white selection:bg-emerald-500 selection:text-black min-h-screen pt-36 pb-24 overflow-hidden relative">
      <PageMeta 
        title="B2B Turnkey White Label Solutions" 
        description="Launch your proprietary algorithmic brokerage inside 30 days. Complete turnkey solutions including branded consoles, custom logos, payment processing, and deep ECN aggregates."
        path="/b2b/white-label"
      />

      {/* Ambient background VFX */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[700px] bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.25em]">
            <Server className="w-3.5 h-3.5 animate-pulse" />
            Turnkey Enterprise Ecosystem
          </div>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-none italic">
            Your Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">White Label</span> Partner.
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xl mx-auto font-medium">
            Since 2019, we have spent 6-7 years helping partner firms establish, brand, and scale their trading operations. We supply everything you need: a custom website, professional design, MT4/MT5 server bridges, payment processing systems, and back-office management dashboards.
          </p>
        </div>

        {/* Dynamic Deliverables Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-24">
          {[
            { label: "Bespoke Frontend", value: "Custom Website", desc: "Tailored design and corporate styling" },
            { label: "Corporate Identity", value: "Branded Logos", desc: "Designed by premium finance creatives" },
            { label: "Execution Layer", value: "MT4 / MT5 Desk", desc: "Robust algorithmic server pipelines" },
            { label: "Billing & Settlement", value: "Fiat & Crypto", desc: "Integrated multi-currency gateways" }
          ].map((m, idx) => (
            <div key={idx} className="p-6 rounded-[2rem] bg-white/[0.01] border border-white/5 text-center">
              <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400/60 block mb-2">{m.label}</span>
              <h3 className="text-2xl font-black text-white tracking-tighter mb-1 uppercase">{m.value}</h3>
              <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">{m.desc}</span>
            </div>
          ))}
        </div>

        {/* Split Grid: Deliverables detail & Intake form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start max-w-6xl mx-auto">
          
          {/* Left panel: Core Value Props */}
          <div className="lg:col-span-6 space-y-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[8px] font-black uppercase tracking-[0.25em]">
                Complete Brokerage in a Box
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tight italic">
                6+ Years of Trusted Infrastructure Delivery.
              </h2>
            </div>

            <div className="space-y-8">
              {[
                { 
                  icon: Layout, 
                  title: "Custom Website & Brand Styling", 
                  desc: "We design a professional, high-converting frontend website featuring your custom brand logo, matching colors, clean typography, and a tailored visual identity." 
                },
                { 
                  icon: Cpu, 
                  title: "Pre-Configured System Connectivity", 
                  desc: "Provide your clients with automated trading signals and system execution directly inside their accounts, powered by our backtest-verified models." 
                },
                { 
                  icon: Smartphone, 
                  title: "Client & Admin Portals", 
                  desc: "Supply your clients with secure dashboards to track account balances, deposits, and affiliate commissions, while you monitor everything from a centralized admin panel." 
                },
                { 
                  icon: CreditCard, 
                  title: "Payment & Checkout Integration", 
                  desc: "Set up a secure payment flow supporting bank wires, credit card checkout networks, and major cryptocurrencies for seamless deposits and withdrawals." 
                }
              ].map((prop, idx) => (
                <div key={idx} className="flex gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0 border border-emerald-500/20">
                    <prop.icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-base font-black uppercase text-white tracking-tight leading-none">{prop.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed font-medium">{prop.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel: Intake Form */}
          <div className="lg:col-span-6">
            <div className="p-10 rounded-[3rem] bg-[#030508]/80 border border-white/10 backdrop-blur-3xl shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
              {!isSuccess ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">White Label Strategic Intake</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Connect with an enterprise integration analyst.</p>
                  </div>

                  {/* Organization Name */}
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black uppercase tracking-widest text-emerald-400">Organization Name</label>
                    <input 
                      type="text" 
                      required 
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder="e.g. Apex Trading International"
                      className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-emerald-500/30 transition-all font-medium"
                    />
                  </div>

                  {/* Authorized Officer */}
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black uppercase tracking-widest text-emerald-400">Authorized Officer / Representative</label>
                    <input 
                      type="text" 
                      required 
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Sarah Sterling"
                      className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-emerald-500/30 transition-all font-medium"
                    />
                  </div>

                  {/* Corporate Email */}
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black uppercase tracking-widest text-emerald-400">Corporate Email Address</label>
                    <input 
                      type="email" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. integration@apextrading.com"
                      className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-emerald-500/30 transition-all font-mono"
                    />
                  </div>

                  {/* Dropdowns */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black uppercase tracking-widest text-emerald-400">Est. Audience Size</label>
                      <select 
                        value={audienceSize}
                        onChange={(e) => setAudienceSize(e.target.value)}
                        className="w-full bg-[#030508] border border-white/5 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-emerald-500/30 transition-all font-medium"
                      >
                        <option value="0 - 1,000 clients">0 - 1,000 clients</option>
                        <option value="1,000 - 5,000 clients">1,000 - 5,000 clients</option>
                        <option value="5,000 - 20,000 clients">5,000 - 20,000 clients</option>
                        <option value="Above 20,000 clients">Above 20,000 clients</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black uppercase tracking-widest text-emerald-400">Target Launch Window</label>
                      <select 
                        value={timeline}
                        onChange={(e) => setTimeline(e.target.value)}
                        className="w-full bg-[#030508] border border-white/5 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-emerald-500/30 transition-all font-medium"
                      >
                        <option value="Immediate (< 30 days)">Immediate (&lt; 30 days)</option>
                        <option value="Short Term (1 - 3 months)">Short Term (1 - 3 mos)</option>
                        <option value="Strategic (3 - 6 months)">Strategic (3 - 6 mos)</option>
                      </select>
                    </div>
                  </div>

                  {/* Requirements Textarea */}
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black uppercase tracking-widest text-emerald-400">White Label Strategy & Custom Requirements</label>
                    <textarea 
                      required
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      placeholder="Please summarize your target market, custom integrations needed (MT4, MT5, or custom web terminal), billing preferences, and brand vision..."
                      rows={4}
                      className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-emerald-500/30 transition-all font-medium resize-none"
                    />
                  </div>

                  {/* Submit button */}
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        Transmit Partnership Request
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="text-center py-10 space-y-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-2xl">
                    <ShieldCheck className="w-8 h-8 animate-pulse" />
                  </div>
                  <h4 className="text-white font-black text-xl uppercase tracking-tighter">Brief Registered</h4>
                  <p className="text-xs text-gray-400 leading-relaxed max-w-sm mx-auto">
                    Your white label partnership ingestion brief has been securely established. An enterprise specialist has been assigned to lead your integration audit.
                  </p>
                  <div className="bg-black/40 border border-white/5 p-4 rounded-xl font-mono text-xs max-w-xs mx-auto">
                    <div className="text-[#849396] uppercase tracking-wider mb-1">Receipt Hash</div>
                    <div className="text-emerald-400 font-bold tracking-widest">{trackingId}</div>
                  </div>
                  <button 
                    onClick={() => setIsSuccess(false)}
                    className="px-6 py-2.5 border border-white/5 bg-white/[0.02] hover:bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
