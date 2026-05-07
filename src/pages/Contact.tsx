import React, { useState } from "react";
import { CheckCircle2, Loader2, Mail, MessageSquare } from "lucide-react";

import { PageHero } from "../components/site/PageHero";
import { PageMeta } from "../components/site/PageMeta";
import { PageSection, SectionHeading } from "../components/site/PageSection";
import { Reveal } from "../components/site/Reveal";
import { BRANDING } from "../constants/branding";
import { sendContactMessage } from "../services/apiHandlers";

type ContactStatus = "idle" | "loading" | "success" | "error";

const initialFormState = {
  name: "",
  email: "",
  subject: "General Inquiry",
  message: "",
};

export const Contact = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [status, setStatus] = useState<ContactStatus>("idle");

  const updateField = (field: keyof typeof initialFormState, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("loading");

    try {
      const { success, error } = await sendContactMessage(
        formData.name,
        formData.email,
        formData.subject,
        formData.message
      );

      if (!success) throw new Error(error);

      setStatus("success");
      setFormData(initialFormState);
    } catch (error) {
      console.error("[Contact Form Error]:", error);
      setStatus("error");
    }
  };

  return (
    <div className="relative overflow-hidden pt-32 pb-32">
      <PageMeta
        title="Institutional Intelligence Desk | Contact IFX TRADES"
        description="Secure high-fidelity communication with the IFX TRADES Intelligence Desk. Direct connectivity for institutional partnerships, algorithmic licensing, and bespoke engineering requests."
        path="/contact"
        keywords={["contact IFX TRADES", "institutional intelligence", "algo licensing desk", "quantitative partnership", "market engineering support"]}
      />

      <PageHero
        eyebrow="Institutional Intelligence Desk"
        title={
          <>
            Direct Connectivity to the <br />
            <span className="text-emerald-500">IFX Engineering Desk.</span>
          </>
        }
        description="Secure high-fidelity communication for institutional partners, algorithmic licensees, and professional research enclaves. Our desk operates with zero friction and absolute technical transparency."
        actions={[
          { label: "WhatsApp Secure", href: BRANDING.whatsappUrl },
          { label: "Direct Email", href: `mailto:${BRANDING.supportEmail}`, variant: "secondary" },
        ]}
        metrics={[
          { label: "Response SLA", value: "< 2 Hours", helper: "During active market cycles" },
          { label: "Encryption", value: "End-to-End", helper: "Secure institutional data handling" },
        ]}
      />

      <PageSection>
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-12">
            <Reveal className="space-y-6">
              <div className="site-pill">
                <CheckCircle2 size={14} />
                <span>Why IFX Intelligence?</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase leading-none">
                Engineering <br />
                <span className="text-white/40">Differentiation.</span>
              </h2>
              <p className="text-white/50 text-lg leading-relaxed font-medium">
                Unlike non-institutional providers, IFX operates as a sovereign engineering hub. Every interaction with our desk is backed by quantitative rigor and institutional heritage.
              </p>
            </Reveal>

            <div className="grid gap-6">
              {[
                { 
                  title: "Sovereign Infrastructure", 
                  desc: "We own our C++ and Python stacks. No third-party dependencies in our core execution logic.",
                  icon: MessageSquare 
                },
                { 
                  title: "Quant Council Oversight", 
                  desc: "Every partnership is reviewed by our internal risk governance team for long-term viability.",
                  icon: Mail 
                },
                { 
                  title: "Verified Performance", 
                  desc: "Direct access to audited research and algorithmic backtest enclaves for verified licensees.",
                  icon: CheckCircle2 
                }
              ].map((item, idx) => (
                <Reveal key={idx} delay={idx * 0.1} className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 transition-all group">
                   <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2 group-hover:text-emerald-400 transition-colors">{item.title}</h3>
                   <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
                </Reveal>
              ))}
            </div>

            <div className="p-8 rounded-[2.5rem] bg-emerald-500/[0.03] border border-emerald-500/10 text-center">
               <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em] mb-4">Institutional Trust Compliance</div>
               <div className="flex justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all">
                  <span className="text-xs font-black text-white uppercase tracking-widest italic">Bank-Grade Security</span>
                  <span className="text-xs font-black text-white uppercase tracking-widest italic">End-to-End Encryption</span>
               </div>
            </div>
          </div>

          <Reveal className="site-panel p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl pointer-events-none" />
            
            <div className="mb-10">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic mb-4">Secure Intake Form</h3>
              <p className="text-white/40 text-sm font-medium">Structured requests for priority queue placement.</p>
            </div>

            {status === "success" ? (
              <div className="py-20 text-center">
                <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-400" />
                <h3 className="mt-8 text-3xl font-black text-white uppercase tracking-tight">Transmission Secured</h3>
                <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-white/40 font-medium">
                  Your request has been prioritized for our quantitative desk review. Expect direct synchronization within 2 business hours.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="btn-ghost mt-10"
                >
                  New Transmission
                </button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-3 block text-[9px] font-black uppercase tracking-[0.3em] text-white/30">
                      Operator Name
                    </label>
                    <input
                      required
                      value={formData.name}
                      onChange={(event) => updateField("name", event.target.value)}
                      className="w-full rounded-xl border border-white/5 bg-white/[0.02] px-5 py-4 text-white outline-none focus:border-emerald-500/30 transition-all font-medium"
                      placeholder="Enter identity..."
                    />
                  </div>
                  <div>
                    <label className="mb-3 block text-[9px] font-black uppercase tracking-[0.3em] text-white/30">
                      Verified Email
                    </label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      className="w-full rounded-xl border border-white/5 bg-white/[0.02] px-5 py-4 text-white outline-none focus:border-emerald-500/30 transition-all font-medium"
                      placeholder="operator@nexus.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-3 block text-[9px] font-black uppercase tracking-[0.3em] text-white/30">
                    Inquiry Protocol
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(event) => updateField("subject", event.target.value)}
                    className="w-full rounded-xl border border-white/5 bg-white/[0.02] px-5 py-4 text-white outline-none focus:border-emerald-500/30 transition-all font-medium appearance-none"
                  >
                    <option>Core Intelligence</option>
                    <option>Algo Licensing</option>
                    <option>Bespoke Engineering</option>
                    <option>Partnership Protocol</option>
                  </select>
                </div>
                <div>
                  <label className="mb-3 block text-[9px] font-black uppercase tracking-[0.3em] text-white/30">
                    Strategic Context
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(event) => updateField("message", event.target.value)}
                    className="w-full rounded-xl border border-white/5 bg-white/[0.02] px-5 py-4 text-white outline-none focus:border-emerald-500/30 transition-all font-medium"
                    placeholder="Describe your requirement..."
                  />
                </div>

                {status === "error" ? (
                  <p className="text-xs text-red-500 font-bold uppercase tracking-widest">
                    Transmission Fault: System busy.
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn-vault w-full py-5"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Synchronizing...
                    </>
                  ) : (
                    "Authorize Transmission"
                  )}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </PageSection>
    </div>
  );
};
