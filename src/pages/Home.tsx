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
import { InstitutionalFAQ } from "../components/home/InstitutionalFAQ";
import { BlogSection } from "../components/home/BlogSection";
import { SocialProof } from "../components/home/SocialProof";
import AdBanner from "../components/ui/AdBanner";
import { CustomAlgoTeam } from "../components/home/CustomAlgoTeam";


import { faqSchema, educationalOrganizationSchema, websiteSchema, breadcrumbSchema } from "../utils/structuredData";

import { useQuery } from "@tanstack/react-query";
import { getFaqs } from "../services/apiHandlers";

const Home = () => {
  const { data: homeFaqs = [] } = useQuery({
    queryKey: ['home_faqs'],
    queryFn: async () => {
      const data = await getFaqs(10);
      if (!data || data.length === 0) {
        return [
          {
            title: "What is IFX Trades?",
            body: "IFX Trades is Asia's #1 institutional forex education and research platform, providing professional quantitative analysis and algorithmic infrastructure for modern market participants.",
          },
          {
            title: "Do you provide financial advice or signals?",
            body: "No. IFX Trades is strictly an educational and research desk. We do not provide financial advice, trading signals, or manage funds. All materials are for research and educational purposes only.",
          }
        ];
      }
      return data;
    },
    staleTime: 600000,
  });

  const formattedFaqs = homeFaqs.map((f: any) => ({
    question: f.title || f.question,
    answer: f.content || f.body || f.answer
  }));
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
          faqSchema(formattedFaqs),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Marketplace", path: "/marketplace" },
            { name: "Webinars", path: "/webinars" },
          ]),
        ]}
      />

      <main>
        {/* L1: Elite Execution Hero */}
        <FortressHero />

        {/* Editable advertisement banner (Supabase-driven) */}
        <AdBanner placement="home" />

        {/* L2: Partner Matrix & Authority */}
        <BrandAuthority />

        {/* L3: Why Institutional Standard */}
        <TrustGrid />

        {/* L3.5: Social Proof & Market Authority */}
        <SocialProof />

        {/* L4: Quantitative Lifecycle */}
        <HowItWorks />

        {/* L5: Institutional Performance Registry */}
        <PerformanceHistory />

        {/* L6: Engineering Journey */}
        <JourneySection />

        {/* L6.5: Custom Engineering Authority */}
        <section className="hidden sm:block">
          <CustomAlgoTeam />
        </section>


        {/* L7: Global Network */}
        <section className="hidden md:block">
          <GlobalReach />
        </section>

        {/* L8: Institutional Intelligence (Live from Supabase) */}
        <BlogSection />

        {/* L9: Masterclass Engagement */}
        <WebinarPromo />

        {/* L10: Institutional FAQ (Sovereign Data) */}
        <InstitutionalFAQ faqs={formattedFaqs} />

        {/* L11: Capital Inquiry / Consultation */}
        <ConsultationSection />
      </main>
    </>
  );
};

export default Home;
