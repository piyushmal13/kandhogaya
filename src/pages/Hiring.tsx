import { Globe, MessageSquare, Zap } from "lucide-react";

import { PageHero } from "../components/site/PageHero";
import { PageMeta } from "../components/site/PageMeta";
import { PageSection, SectionHeading } from "../components/site/PageSection";
import { Reveal } from "../components/site/Reveal";
import { BRANDING } from "../constants/branding";

const roles = [
  { title: "Senior Analyst", type: "Full-time", dept: "Trading", icon: Zap },
  { title: "Full Stack Engineer", type: "Remote", dept: "Engineering", icon: Globe },
  { title: "Content Strategist", type: "Contract", dept: "Marketing", icon: MessageSquare },
];

export const Hiring = () => (
  <div className="relative overflow-hidden pb-16">
    <PageMeta
      title="Hiring"
      description="Explore open roles at IFXTrades across trading, engineering, and content for the next generation of retail trading infrastructure."
      path="/hiring"
      keywords={["IFXTrades careers", "trading jobs", "quant trading careers"]}
    />

    <PageHero
      eyebrow="Careers"
      title={
        <>
          Build the <span className="site-title-gradient">infrastructure layer</span> serious traders actually need.
        </>
      }
      description="IFXTrades hires people who care about execution quality, clarity, and building systems that reduce noise for the end user. We are interested in operators, analysts, and engineers who think in frameworks."
      actions={[
        { label: "Open Application", href: `mailto:${BRANDING.careersEmail}` },
        { label: "About IFXTrades", to: "/about", variant: "secondary" },
      ]}
      metrics={[
        { label: "Focus Areas", value: "Trading, Engineering, Content", helper: "Roles that shape the product surface end-to-end" },
        { label: "Team Style", value: "Remote-first", helper: "Built for asynchronous, high-context work" },
      ]}
    />

    <PageSection>
      <SectionHeading
        eyebrow="Open Roles"
        title="Current hiring priorities."
        description="We recruit around leverage points inside the platform: research quality, engineering stability, and communication that sharpens decision making."
      />

      <div className="grid gap-6 md:grid-cols-3">
        {roles.map((role, index) => (
          <Reveal key={role.title} delay={index * 0.08} className="site-panel p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-300/10 text-emerald-200">
              <role.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-white">{role.title}</h3>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.28em]">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-300">{role.type}</span>
              <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-emerald-100">{role.dept}</span>
            </div>
            <button
              type="button"
              onClick={() => alert("Application form opening...")}
              className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Apply Now
            </button>
          </Reveal>
        ))}
      </div>
    </PageSection>

    <PageSection className="pt-0">
      <Reveal className="site-panel p-8 text-center md:p-10">
        <SectionHeading
          eyebrow="Open Application"
          title="Do not wait for the perfect role title."
          description="If your work sharpens research quality, accelerates execution, or improves trader understanding, send a concise case for how you would raise the bar."
          align="center"
        />
        <a
          href={`mailto:${BRANDING.careersEmail}`}
          className="inline-flex rounded-full bg-emerald-300 px-6 py-3 text-sm font-semibold text-slate-950"
        >
          Send Portfolio
        </a>
      </Reveal>
    </PageSection>
  </div>
);
