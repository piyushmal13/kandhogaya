import React, { useState } from "react";
import { PageMeta } from "../components/site/PageMeta";

// Institutional Components
import { FortressHero } from "../components/home/FortressHero";
import { OperationalPillars } from "../components/home/OperationalPillars";
import { SessionBookingModal } from "../components/ui/SessionBookingModal";
import { BrandAuthority } from "../components/home/BrandAuthority";
import { PerformanceHistory } from "../components/home/PerformanceHistory";
import { JourneySection } from "../components/home/JourneySection";
import { CustomAlgoTeam } from "../components/home/CustomAlgoTeam";
import { ConsultationSection } from "../components/home/ConsultationSection";

const Home = () => {
  const [isBookingOpen, setBookingOpen] = useState(false);
  const [defaultObjective, setDefaultObjective] = useState("");

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
      />

      <main>
        {/* L1: Elite Execution Hero */}
        <FortressHero 
          onRequestSession={triggerSessionRequest}
          onRequestBuild={triggerBespokeBuildRequest}
        />

        {/* L2: Partner Matrix & Authority (Dynamic integrations) */}
        <BrandAuthority />

        {/* L3: Operational Scope Pillars (What we actually do clearly explained) */}
        <OperationalPillars 
          onRequestBuild={triggerBespokeBuildRequest}
        />

        {/* L4: Institutional Performance Registry (Dynamic product cards loaded from Supabase) */}
        <PerformanceHistory />

        {/* L4.5: Our Story (Journey Timeline for Trust & Authority) */}
        <JourneySection />

        {/* L5: Custom Engineering Authority (Our story, team size, bespoke desk) */}
        <section className="hidden sm:block">
          <CustomAlgoTeam />
        </section>

        {/* L6: Capital Inquiry / Onboarding Intake Form */}
        <ConsultationSection />
      </main>

      {/* Global Interactive Intake Onboarding Modal Popup */}
      <SessionBookingModal 
        isOpen={isBookingOpen}
        onClose={() => setBookingOpen(false)}
        defaultObjective={defaultObjective}
      />
    </>
  );
};

export default Home;
