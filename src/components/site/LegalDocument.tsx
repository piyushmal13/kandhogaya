import type { ReactNode } from "react";

import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import { PageMeta } from "./PageMeta";
import { PageHero } from "./PageHero";
import { PageSection } from "./PageSection";

interface LegalDocumentProps {
  title: string;
  description: string;
  path: string;
  updated: string;
  children: ReactNode;
}

export const LegalDocument = ({
  title,
  description,
  path,
  updated,
  children,
}: LegalDocumentProps) => (
  <div className="relative overflow-hidden pb-16">
    <PageMeta title={title} description={description} path={path} keywords={["legal", title.toLowerCase()]} />

    <PageHero
      eyebrow="Compliance"
      title={
        <>
          {title} for the <span className="site-title-gradient">IFXTrades</span> platform.
        </>
      }
      description={description}
      metrics={[
        { label: "Applies To", value: "All Visitors", helper: "Retail, education, and client interactions" },
        { label: "Last Updated", value: updated, helper: "Reviewed for the current product surface" },
      ]}
    />

    <PageSection className="pt-0">
      <div className="site-panel mx-auto max-w-4xl p-8 md:p-10">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-emerald-200/90 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="site-copy prose prose-invert max-w-none">
          {children}
        </div>
      </div>
    </PageSection>
  </div>
);
