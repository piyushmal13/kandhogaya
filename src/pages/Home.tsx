import React from "react";
import { SuccessShowcase } from "../components/ui/SuccessShowcase";
import { SignupForm } from "../components/ui/SignupForm";
import { HeroSection } from "../components/home/HeroSection";
import { MarketTicker } from "../components/home/MarketTicker";
import { EcosystemSection } from "../components/home/EcosystemSection";
import { GlobalReach } from "../components/home/GlobalReach";
import { WebinarPromo } from "../components/home/WebinarPromo";
import { BlogSection } from "../components/home/BlogSection";
import { PerformanceHistory } from "../components/home/PerformanceHistory";
import { NewsletterPopup } from "../components/ui/NewsletterPopup";
import { WebinarBanner } from "../components/webinars/WebinarBanner";
import { AlgoGreatness } from "../components/AlgoGreatness";
import { cn } from "../utils/cn";
import { motion } from "motion/react";

export const Home = () => (
  <div className="bg-[#020202] min-h-screen relative overflow-hidden">
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
