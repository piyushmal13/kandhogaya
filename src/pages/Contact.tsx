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
    <div className="relative overflow-hidden pb-16">
      <PageMeta
        title="Contact"
        description="Contact IFXTrades for support, partnership inquiries, algorithm licensing, or signal access questions."
        path="/contact"
        keywords={["contact IFXTrades", "trading support", "algo licensing"]}
      />

      <PageHero
        eyebrow="Support Surface"
        title={
          <>
            Talk to the <span className="site-title-gradient">IFXTrades desk</span> without friction.
          </>
        }
        description="Use the contact desk for support, partnerships, billing, and product access questions. The UI is upgraded, but the underlying contact flow still writes directly into the existing Supabase table."
        actions={[
          { label: "WhatsApp Desk", href: BRANDING.whatsappUrl },
          { label: "Email Support", href: `mailto:${BRANDING.supportEmail}`, variant: "secondary" },
        ]}
        metrics={[
          { label: "Support Window", value: "24/5", helper: "Aligned with active market participation" },
          { label: "Channels", value: "WhatsApp + Email", helper: "Fastest direct routes to the team" },
        ]}
      />

      <PageSection>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-6">
            <Reveal className="site-panel p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-300/10 text-emerald-200">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">WhatsApp Support</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Fastest route for active members, onboarding, signal access, and operational questions.
                  </p>
                  <a
                    href={BRANDING.whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex text-sm font-semibold text-emerald-200 hover:text-white"
                  >
                    Chat with the desk
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08} className="site-panel-muted p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-300/10 text-emerald-200">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Email Support</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Best for technical help, billing questions, partnerships, and enterprise-style requests.
                  </p>
                  <a
                    href={`mailto:${BRANDING.supportEmail}`}
                    className="mt-4 inline-flex text-sm font-semibold text-emerald-200 hover:text-white"
                  >
                    {BRANDING.supportEmail}
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal className="site-panel p-8 md:p-10">
            <SectionHeading
              eyebrow="Contact Form"
              title="Send a focused request."
              description="Use the form when you need a documented thread or a structured follow-up from the team."
            />

            {status === "success" ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-300" />
                <h3 className="mt-6 text-3xl font-semibold text-white">Message received</h3>
                <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-300">
                  Your request is now stored in the current contact pipeline. The team can review it without any backend rewiring.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-8 inline-flex rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
                      Name
                    </label>
                    <input
                      required
                      value={formData.name}
                      onChange={(event) => updateField("name", event.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-emerald-300/40"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
                      Email
                    </label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-emerald-300/40"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
                    Subject
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(event) => updateField("subject", event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-emerald-300/40"
                  >
                    <option>General Inquiry</option>
                    <option>Algo Licensing</option>
                    <option>Bespoke Engineering</option>
                    <option>Partnership</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(event) => updateField("message", event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-emerald-300/40"
                    placeholder="How can we help you?"
                  />
                </div>

                {status === "error" ? (
                  <p className="text-sm text-red-400">
                    Failed to send the message. Please retry or contact support directly.
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-300 px-6 py-3 text-sm font-semibold text-slate-950 disabled:opacity-70"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending message
                    </>
                  ) : (
                    "Send Message"
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
