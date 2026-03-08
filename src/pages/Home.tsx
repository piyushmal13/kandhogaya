import React from "react";
import { SuccessShowcase } from "../components/SuccessShowcase";
import { HeroSection } from "../components/home/HeroSection";
import { MarketTicker } from "../components/home/MarketTicker";
import { EcosystemSection } from "../components/home/EcosystemSection";
import { GlobalReach } from "../components/home/GlobalReach";
import { WebinarPromo } from "../components/home/WebinarPromo";
import { BlogSection } from "../components/home/BlogSection";
import { PerformanceHistory } from "../components/home/PerformanceHistory";
import { NewsletterPopup } from "../components/NewsletterPopup";
import { cn } from "../utils/cn";
import { motion } from "motion/react";

export const Home = () => (
  <div className="bg-[#020202] min-h-screen relative overflow-hidden">
    <HeroSection />
    <MarketTicker />

    <WebinarPromo />

    <EcosystemSection />
    
    <GlobalReach />

    <BlogSection />

    <PerformanceHistory />

    <SuccessShowcase />

    <NewsletterPopup />
  </div>
);
