import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageMeta } from "../components/site/PageMeta";
import { educationalOrganizationSchema, websiteSchema } from "../utils/structuredData";

// Institutional Components
import { FortressHero } from "../components/home/FortressHero";
import { OperationalPillars } from "../components/home/OperationalPillars";
import { BrandAuthority } from "../components/home/BrandAuthority";
import { PerformanceHistory } from "../components/home/PerformanceHistory";
import { JourneySection } from "../components/home/JourneySection";
import { CustomAlgoTeam } from "../components/home/CustomAlgoTeam";
import { ConsultationSection } from "../components/home/ConsultationSection";
import { TerminalShowcase } from "../components/home/TerminalShowcase";
import { EliteSocialProof } from "../components/institutional/EliteSocialProof";
import { PaymentGateways } from "../components/home/PaymentGateways";
import { WebinarHypeSection } from "../components/home/WebinarHypeSection";

const Home = () => {
  const navigate = useNavigate();
  const [isBookingOpen, setBookingOpen] = useState(false);
  const [defaultObjective, setDefaultObjective] = useState("");

  const triggerSessionRequest = () => {
    navigate("/contact");
  };

  const triggerBespokeBuildRequest = () => {
    navigate("/solutions/custom");
  };

  return (
    <>
      <PageMeta
        title="Institutional Quantitative Trading Desk"
        description="Elite B2B institutional quantitative analysis and strategy deployment desk. Access verified market telemetry and deploy robust execution models."
        path="/"
        keywords={[
          "IFX Trades",
          "institutional forex strategies",
          "quantitative analysis Dubai",
          "MT5 execution models India",
          "low latency infrastructure",
          "quantitative software desk",
          "forex insights Dubai",
          "best algorithmic trading course Dubai",
          "quantitative systematic desk UAE",
          "institutional VPS co-location Singapore"
        ]}
        structuredData={[educationalOrganizationSchema(), websiteSchema()]}
      />

      <main>
        {/* L1: Elite Execution Hero */}
        <FortressHero 
          onRequestSession={triggerSessionRequest}
          onRequestBuild={triggerBespokeBuildRequest}
        />

        {/* L2: Partner Matrix & Authority (Dynamic integrations) */}
        <BrandAuthority />

        {/* L2.5: Interactive Workstation Proof & WhatsApp Telemetry */}
        <TerminalShowcase />

        {/* L3: Operational Scope Pillars (What we actually do clearly explained) */}
        <OperationalPillars 
          onRequestBuild={triggerBespokeBuildRequest}
        />

        {/* L3.5: Secure Payment & Settlement Ingress */}
        <PaymentGateways />

        {/* L4: Institutional Performance Registry (Dynamic product cards loaded from Supabase) */}
        <PerformanceHistory />

        {/* L4.5: Our Story (Journey Timeline for Trust & Authority) */}
        <JourneySection />

        {/* L5: Custom Engineering Authority (Our story, team size, bespoke desk) */}
        <section className="hidden sm:block">
          <CustomAlgoTeam />
        </section>

        {/* L5.5: Global Network Social Proof & WhatsApp Telemetry */}
        <EliteSocialProof />

        {/* L5.7: Webinar Hype & Waitlist Capture */}
        <WebinarHypeSection />

        {/* L6: Capital Inquiry / Onboarding Intake Form */}
        <ConsultationSection />
      </main>
    </>
  );
};

export default Home;
