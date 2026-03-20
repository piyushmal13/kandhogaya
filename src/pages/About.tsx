import { ArrowRight, Globe2, ShieldCheck, Workflow } from "lucide-react";

import { PageHero } from "../components/site/PageHero";
import { PageMeta } from "../components/site/PageMeta";
import { PageSection, SectionHeading } from "../components/site/PageSection";
import { Reveal } from "../components/site/Reveal";

const values = [
  {
    title: "Execution Discipline",
    description: "Every IFXTrades product is built around repeatable process, measurable risk, and post-trade review.",
    icon: ShieldCheck,
  },
  {
    title: "Global Market Context",
    description: "We frame retail decisions with the same macro, liquidity, and order-flow context used by professional desks.",
    icon: Globe2,
  },
  {
    title: "Systems Thinking",
    description: "Signals, education, and algorithms are designed as one operating model instead of disconnected products.",
    icon: Workflow,
  },
];

export const About = () => (
  <div className="relative overflow-hidden pb-16">
    <PageMeta
      title="About IFXTrades"
      description="Learn how IFXTrades combines institutional market structure, trader education, and algorithmic systems into one execution-focused platform."
      path="/about"
      keywords={["about IFXTrades", "institutional trading team", "algorithmic trading firm"]}
    />

    <PageHero
      eyebrow="Institutional DNA"
      title={
        <>
          Built to translate <span className="site-title-gradient">institutional-grade thinking</span> into retail execution.
        </>
      }
      description="IFXTrades was built for traders who want more than alerts and aesthetics. We combine market intelligence, systematic execution, and practical education into one disciplined surface."
      actions={[
        { label: "Explore Results", to: "/results", icon: <ArrowRight className="h-4 w-4" /> },
        { label: "Contact Desk", to: "/contact", variant: "secondary" },
      ]}
      metrics={[
        { label: "Founded", value: "2020", helper: "Built around disciplined retail execution" },
        { label: "Countries", value: "110+", helper: "Global trader participation" },
        { label: "Algorithms", value: "15+", helper: "Systematic tools and strategy modules" },
        { label: "Research Cadence", value: "Daily", helper: "Signals, webinars, and analysis" },
      ]}
      aside={
        <div className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-[11px] uppercase tracking-[0.32em] text-emerald-200/80">Mission</div>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Give serious retail traders access to the tools, process, and market context normally reserved for professional dealing environments.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-[11px] uppercase tracking-[0.32em] text-emerald-200/80">What We Build</div>
            <ul className="mt-3 space-y-3 text-sm text-slate-300">
              <li>Live signal infrastructure for structured execution.</li>
              <li>Algorithm licensing and systematic strategy layers.</li>
              <li>Education workflows that reinforce risk discipline.</li>
            </ul>
          </div>
        </div>
      }
    />

    <PageSection>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
        <Reveal className="site-panel p-8 md:p-10">
          <SectionHeading
            eyebrow="Why We Exist"
            title="Retail traders need better infrastructure, not more noise."
            description="For too long, retail traders have had to stitch together fragmented tools, inconsistent education, and reactive decision making. IFXTrades exists to replace that with a coordinated execution stack."
          />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-lg font-semibold text-white">Signals with context</div>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                We do not ship random entries. Signals are framed with setup logic, risk boundaries, and follow-through management.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-lg font-semibold text-white">Education with transfer value</div>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                The academy and webinar stack is structured so traders can apply the process independently, not just watch content passively.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="grid gap-6">
          {values.map((value, index) => (
            <Reveal key={value.title} delay={index * 0.08} className="site-panel-muted p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-300/10 text-emerald-200">
                  <value.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{value.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{value.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </PageSection>
  </div>
);
