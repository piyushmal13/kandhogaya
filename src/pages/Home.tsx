import React from "react";
import { PageMeta } from "../components/site/PageMeta";

// Institutional Components
import { FortressHero } from "../components/home/FortressHero";
import { BrandAuthority } from "../components/home/BrandAuthority";
import { TrustGrid } from "../components/home/TrustGrid";
import { PerformanceHistory } from "../components/home/PerformanceHistory";
import { GlobalReach } from "../components/home/GlobalReach";
import { WebinarPromo } from "../components/home/WebinarPromo";
import { HowItWorks } from "../components/home/HowItWorks";
import { JourneySection } from "../components/home/JourneySection";
import { ConsultationSection } from "../components/home/ConsultationSection";

import { faqSchema, educationalOrganizationSchema, websiteSchema, breadcrumbSchema } from "../utils/structuredData";

const homeFaqs = [
  {
    question: "What is IFX Trades?",
    answer:
      "IFX Trades is Asia's #1 institutional forex education and research platform, providing professional quantitative analysis and algorithmic infrastructure for modern market participants.",
  },
  {
    question: "Do you provide financial advice or signals?",
    answer:
      "No. IFX Trades is strictly an educational and research desk. We do not provide financial advice, trading signals, or manage funds. All materials are for research and educational purposes only.",
  },
  {
    question: "How can I access the institutional research?",
    answer:
      "Access is provided through our Master Terminal desk. Professional members gain access to our quantitative analysis, macro research, and execution infrastructure frameworks.",
  },
  {
    question: "Is IFX Trades a broker?",
    answer:
      "No. IFX Trades is strictly an education and research organization. We do not accept deposits, execute trades, hold client funds, or provide brokerage services.",
  },
];

const Home = () => {
  return (
    <>
      <PageMeta
        title="Institutional Algorithmic Research & Education"
        description="Asia's #1 Institutional Research Desk. Professional quantitative analysis, macro intelligence, and algorithmic education for modern market participants."
        path="/"
        keywords={[
          "IFX Trades",
          "institutional forex research",
          "quantitative analysis Dubai",
          "macro research India",
          "professional trader infrastructure",
          "master terminal training",
        ]}
        structuredData={[
          educationalOrganizationSchema(),
          websiteSchema(),
          faqSchema(homeFaqs),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Marketplace", path: "/marketplace" },
            { name: "Webinars", path: "/webinars" },
          ]),
        ]}
      />

      <main>
        {/* L1: Sovereign Execution Hero */}
        <FortressHero />

        {/* L2: Partner Matrix & Authority */}
        <BrandAuthority />

        {/* L3: Why Institutional Standard */}
        <TrustGrid />

        {/* L4: Quantitative Lifecycle */}
        <HowItWorks />

        {/* L5: Institutional Performance Registry */}
        <PerformanceHistory />

        {/* L6: Engineering Journey */}
        <JourneySection />

        {/* L7: Global Network */}
        <GlobalReach />

        {/* L8: Masterclass Engagement */}
        <WebinarPromo />

        {/* L9: Capital Inquiry / Consultation */}
        <ConsultationSection />
      </main>
    </>
  );
};

export default Home;
