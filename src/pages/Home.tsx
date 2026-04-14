import React, { useState } from 'react';
import { AlgoGreatness } from "@/components/AlgoGreatness";
import { PageMeta } from "@/components/site/PageMeta";
import { EcosystemSection } from "@/components/home/EcosystemSection";
import { GlobalReach } from "@/components/home/GlobalReach";
import { HeroSection } from "@/components/home/HeroSection";
import { MarketTicker } from "@/components/home/MarketTicker";
import { PartnerLogos } from "@/components/ui/PartnerLogos";
import { TrustGrid } from "@/components/home/TrustGrid";
import { NewsletterPopup } from "@/components/ui/NewsletterPopup";
import { SignupForm } from "@/components/ui/SignupForm";
import { ReviewPromptModal } from "@/components/ui/ReviewPromptModal";
import { ExitIntentModal } from "@/components/ui/ExitIntentModal";
import { LazySection } from "@/components/ui/LazySection";
import { educationalOrganizationSchema, websiteSchema, faqSchema, goldAlgoCourseSchema, breadcrumbSchema } from "@/utils/structuredData";

// SEO FAQ — targets high-volume Q&A snippets in Google Search
const homeFaqs = [
  {
    question: "What is IFX Trades?",
    answer:
      "IFX Trades is Asia's #1 institutional forex education platform, providing proprietary macro research, the Gold Algo Masterclass, live trading webinars, and algorithmic execution training for retail and professional traders across India, Dubai, and globally.",
  },
  {
    question: "What is the best algo trading course in India and Dubai?",
    answer:
      "IFX Trades offers the Gold Algo Masterclass — the leading institutional algorithmic trading course in India and Dubai. It covers XAUUSD macro analysis, Python-based automation, MT5 Expert Advisor development, and systematic risk management.",
  },
  {
    question: "How do I join a free forex webinar?",
    answer:
      "You can register for free forex trading webinars on the IFX Trades Webinars page. We run live sessions covering gold trading, forex signals, and algo trading strategies for traders in India, UAE, and across Asia.",
  },
  {
    question: "What forex signals does IFX Trades provide?",
    answer:
      "IFX Trades provides live institutional-grade forex signals focused on XAUUSD (Gold), major currency pairs, and key global indices. Signals are based on quantitative macro analysis, not retail technical indicators.",
  },
  {
    question: "Is IFX Trades a broker?",
    answer:
      "No. IFX Trades is strictly an education and research organization. We do not accept deposits, execute trades, or hold client funds. We are a 100% education platform for forex, algo trading, and macro research.",
  },
  {
    question: "What markets are covered in IFX Trades research?",
    answer:
      "Our macro research focuses on XAUUSD (Gold), EURUSD, GBPUSD, USDJPY, and key global indices. Our algo trading courses cover both forex and cross-asset quantitative frameworks.",
  },
];

export const Home = () => {
  const [showReviewModal, setShowReviewModal] = useState(false);

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#020202]">
      <ReviewPromptModal isOpen={showReviewModal} onClose={() => setShowReviewModal(false)} />
      <ExitIntentModal />

      {/* === FULL SEO METADATA — Keyword-dominant, intent-matched === */}
      <PageMeta
        title="IFX Trades | Asia's Premier Institutional Algorithmic Training Desk"
        description="Master the markets with institutional-grade algorithmic execution, quantitative research, and macro diagnostics. Asia's most advanced desk for professional traders."
        path="/"
        keywords={[
          "IFX Trades",
          "institutional algorithmic trading",
          "quantitative analysis Dubai",
          "macro research India",
          "XAUUSD algo execution",
          "professional trader infrastructure",
          "sovereign desk training",
        ]}
        structuredData={[
          educationalOrganizationSchema(),
          websiteSchema(),
          goldAlgoCourseSchema(),
          faqSchema(homeFaqs),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Marketplace", path: "/marketplace" },
            { name: "Webinars", path: "/webinars" },
          ]),
        ]}
      />

      <div className="noise-overlay" />

      {/* === ABOVE THE FOLD — Dominant, Silent === */}
      <HeroSection />
      
      <div className="relative z-10 -mt-20 mb-32">
         <MarketTicker />
      </div>

      {/* === INFRASTRUCTURE & ECOSYSTEM — Direct value === */}
      <LazySection placeholderHeight="800px">
        <EcosystemSection />
      </LazySection>

      {/* === GLOBAL REACH / TELEMETRY === */}
      <LazySection placeholderHeight="700px">
        <GlobalReach />
      </LazySection>

      {/* === FLAGSHIP ALGO MODULE — The purchase target === */}
      <LazySection placeholderHeight="600px" className="py-24 sm:py-32">
        <AlgoGreatness />
      </LazySection>

      {/* === CORPORATE TRUST LAYER === */}
      <LazySection placeholderHeight="1400px">
        <div className="py-24 sm:py-40 bg-black/40 border-y border-white/5">
           <TrustGrid />
           <div className="mt-20">
             <PartnerLogos />
           </div>
        </div>
      </LazySection>

      {/* === CONVERSION ACQUISITION === */}
      <LazySection placeholderHeight="400px">
        <div className="py-32 mb-20">
           <SignupForm />
        </div>
      </LazySection>

      <NewsletterPopup />
    </div>
  );
};
