import React, { useState } from "react";
import { PageMeta } from "../components/site/PageMeta";

// Institutional Components
import { FortressHero } from "../components/home/FortressHero";
import { OperationalPillars } from "../components/home/OperationalPillars";
import { SessionBookingModal } from "../components/ui/SessionBookingModal";
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
import { AdBanner } from "../components/ui/AdBanner";
import { CustomAlgoTeam } from "../components/home/CustomAlgoTeam";

import { InstitutionalAlgorithms } from "../components/home/InstitutionalAlgorithms";

import { faqSchema, educationalOrganizationSchema, websiteSchema, breadcrumbSchema } from "../utils/structuredData";

import { useQuery } from "@tanstack/react-query";
import { getFaqs } from "../services/apiHandlers";
import { useFlags } from "../hooks/useFlags";

const Home = () => {
  const [isBookingOpen, setBookingOpen] = useState(false);
  const [defaultObjective, setDefaultObjective] = useState("");
  
  const { flags } = useFlags();
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

  const triggerSessionRequest = () => {
    setDefaultObjective("General Session Consultation Request");
    setBookingOpen(true);
  };

  const triggerBespokeBuildRequest = () => {
    setDefaultObjective("Bespoke Quantitative Algorithm Custom Build Request");
    setBookingOpen(true);
  };

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
        <FortressHero 
          onRequestSession={triggerSessionRequest}
          onRequestBuild={triggerBespokeBuildRequest}
        />

        {/* L1.5: [NEW] Operational Scope Pillars */}
        <OperationalPillars 
          onRequestBuild={triggerBespokeBuildRequest}
        />

        {/* Editable advertisement banner (Supabase-driven) */}
        <AdBanner placement="home" />

        {/* L2: Partner Matrix & Authority */}
        {flags.home_brand_authority && <BrandAuthority />}

        {/* L3: Why Institutional Standard */}
        {flags.home_trust_grid && <TrustGrid />}

        {/* L3.1: Bespoke Algorithmic Machinery (Main Business) */}
        {flags.home_institutional_algorithms && <InstitutionalAlgorithms />}

        {/* L3.5: Social Proof & Market Authority */}
        {flags.institutional_reviews_live && <SocialProof />}

        {/* L4: Quantitative Lifecycle */}
        {flags.home_how_it_works && <HowItWorks />}

        {/* L5: Institutional Performance Registry */}
        {flags.home_performance_history && <PerformanceHistory />}

        {/* L6: Engineering Journey */}
        {flags.home_journey && <JourneySection />}

        {/* L6.5: Custom Engineering Authority */}
        {flags.home_custom_algo_team && (
          <section className="hidden sm:block">
            <CustomAlgoTeam />
          </section>
        )}

        {/* L7: Global Network */}
        {flags.home_global_reach && (
          <section className="hidden md:block">
            <GlobalReach />
          </section>
        )}

        {/* L8: Institutional Intelligence (Live from Supabase) */}
        {flags.home_blog && <BlogSection />}

        {/* L9: Masterclass Engagement */}
        {flags.home_webinar_promo && <WebinarPromo />}

        {/* L10: Institutional FAQ (Sovereign Data) */}
        {flags.home_faq && <InstitutionalFAQ faqs={formattedFaqs} />}

        {/* L11: Capital Inquiry / Consultation */}
        {flags.home_consultation && <ConsultationSection />}
      </main>

      {/* Global Interactive Intake Onboarding Modal */}
      <SessionBookingModal 
        isOpen={isBookingOpen}
        onClose={() => setBookingOpen(false)}
        defaultObjective={defaultObjective}
      />
    </>
  );
};

export default Home;
