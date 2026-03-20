import React from "react";

import { AlgoGreatness } from "../components/AlgoGreatness";
import { PageMeta } from "../components/site/PageMeta";
import { BlogSection } from "../components/home/BlogSection";
import { EcosystemSection } from "../components/home/EcosystemSection";
import { GlobalReach } from "../components/home/GlobalReach";
import { HeroSection } from "../components/home/HeroSection";
import { MarketTicker } from "../components/home/MarketTicker";
import { PerformanceHistory } from "../components/home/PerformanceHistory";
import { WebinarPromo } from "../components/home/WebinarPromo";
import { NewsletterPopup } from "../components/ui/NewsletterPopup";
import { SignupForm } from "../components/ui/SignupForm";
import { SuccessShowcase } from "../components/ui/SuccessShowcase";
import { WebinarBanner } from "../components/webinars/WebinarBanner";

export const Home = () => (
  <div className="min-h-screen relative overflow-hidden">
    <PageMeta
      title="IFXTrades"
      description="Institutional-grade algorithmic trading, live signals, trader education, and market intelligence for serious retail execution."
      path="/"
      keywords={["IFXTrades", "algo trading platform", "forex signals", "trading academy"]}
    />
    <WebinarBanner />
    <HeroSection />
    <MarketTicker />
    <WebinarPromo />
    <EcosystemSection />
    <GlobalReach />
    <AlgoGreatness />
    <BlogSection />
    <PerformanceHistory />
    <SuccessShowcase />
    <SignupForm />
    <NewsletterPopup />
  </div>
);
