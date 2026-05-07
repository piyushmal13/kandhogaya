import { Globe, MessageSquare, Zap } from "lucide-react";

import { PageHero } from "../components/site/PageHero";
import { PageMeta } from "../components/site/PageMeta";
import { PageSection, SectionHeading } from "../components/site/PageSection";
import { Reveal } from "../components/site/Reveal";
import { BRANDING } from "../constants/branding";

const roles = [
  { title: "Principal Analyst", type: "Full-time", dept: "Research & Execution", icon: Zap },
  { title: "System Architect", type: "Remote", dept: "Engineering", icon: Globe },
  { title: "Institutional Strategist", type: "Contract", dept: "Corporate Relations", icon: MessageSquare },
];

export const Hiring = () => (
  <div className="relative overflow-hidden pb-16">
    <PageMeta
      title="Careers | Institutional Engineering"
      description="Explore open roles at IFX TRADES across quantitative research, system architecture, and institutional relations for the next generation of sovereign execution architecture."
      path="/hiring"
      keywords={["IFX TRADES careers", "quantitative analyst jobs", "system architecture careers", "fintech engineering roles"]}
    />

    <PageHero
      eyebrow="Careers"
      title={
        <>
          Build the <span className="site-title-gradient">infrastructure layer</span> institutional operators actually need.
        </>
      }
      description="IFX TRADES recruits individuals who prioritize execution quality, clarity, and building sovereign systems that eliminate market inefficiencies. We seek operators, analysts, and architects who think in frameworks."
      actions={[
        { label: "Open Application", href: `mailto:${BRANDING.careersEmail}` },
        { label: "About IFX TRADES", to: "/about", variant: "secondary" },
      ]}
      metrics={[
        { label: "Focus Areas", value: "Research, Engineering, Strategy", helper: "Roles that shape the sovereign architecture" },
        { label: "Team Style", value: "Remote-first", helper: "Built for asynchronous, high-context execution" },
      ]}
    />

    <PageSection>
      <SectionHeading
        eyebrow="Open Roles"
        title="Current hiring priorities."
        description="We recruit around leverage points inside the platform: research quality, engineering stability, and communication that sharpens institutional decision-making."
      />

      <div className="grid gap-6 md:grid-cols-3">
        {roles.map((role, index) => (
          <Reveal key={role.title} delay={index * 0.08} className="site-panel p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
              <role.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-6 text-xl font-black text-white uppercase italic tracking-tighter">{role.title}</h3>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.28em]">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-300 font-black">{role.type}</span>
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-emerald-400 font-black">{role.dept}</span>
            </div>
            <a
              href={`mailto:${BRANDING.careersEmail}`}
              className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all"
            >
              Initialize Application
            </a>
          </Reveal>
        ))}
      </div>
    </PageSection>

    <PageSection className="pt-0">
      <Reveal className="site-panel p-8 text-center md:p-10">
        <SectionHeading
          eyebrow="Open Application"
          title="Do not wait for the perfect role title."
          description="If your work sharpens research quality, accelerates execution, or improves institutional understanding, send a concise case for how you would raise the bar."
          align="center"
        />
        <a
          href={`mailto:${BRANDING.careersEmail}`}
          className="inline-flex rounded-full bg-emerald-500 px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-black shadow-[0_20px_40px_rgba(16,185,129,0.2)] hover:scale-105 transition-all italic"
        >
          Send Portfolio
        </a>
      </Reveal>
    </PageSection>
  </div>
);
