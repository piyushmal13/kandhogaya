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
import { ReviewPromptModal } from "../components/ui/ReviewPromptModal";
import { ExitIntentModal } from "../components/ui/ExitIntentModal";
import { SocialProof } from "../components/home/SocialProof";
import { educationalOrganizationSchema, websiteSchema, faqSchema, goldAlgoCourseSchema } from "../utils/structuredData";
import { useState, useEffect } from "react";

const homeFaqs = [
  {
    question: "What is IFX Trades?",
    answer:
      "IFX Trades is an institutional forex education platform providing proprietary macro research, the Gold Algo Masterclass, and execution training for retail traders.",
  },
  {
    question: "How do I access the Gold Algo Masterclass?",
    answer:
      "The Masterclass is available via our academy portal. It covers advanced quantitative analysis and automated execution infrastructure.",
  },
  {
    question: "What markets are covered in your research?",
    answer:
      "Our macro research focuses heavily on XAUUSD (Gold), major forex pairs, and key global indices.",
  },
  {
    question: "Are you a broker?",
    answer:
      "No. IFX Trades is strictly an education and research organization. We do not accept deposits, execute trades, or hold client funds.",
  },
];

import { LazySection } from "../components/ui/LazySection";

export const Home = () => {
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    // Simulator trigger: review prompt simulates a user finishing a preview
    const timer = setTimeout(() => {
      setShowReviewModal(true);
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  return (
  <div className="min-h-screen relative overflow-hidden">
    <ReviewPromptModal isOpen={showReviewModal} onClose={() => setShowReviewModal(false)} />
    <ExitIntentModal />
    <PageMeta
      title="IFX Trades | Institutional Forex Education & Macro Research"
      description="Asia's leading institutional forex education platform. Master quantitative analysis with the best algo trading course in Dubai and India. Professional macro research."
      path="/"
      keywords={[
        "IFX Trades",
        "forex education Asia",
        "best algo trading course Dubai India",
        "institutional macro research",
        "trading academy"
      ]}
      structuredData={[educationalOrganizationSchema(), websiteSchema(), goldAlgoCourseSchema(), faqSchema(homeFaqs)]}
    />
    <HeroSection />
    <MarketTicker />
    <SocialProof />
    
    <LazySection placeholderHeight="600px">
      <WebinarPromo />
    </LazySection>

    <LazySection placeholderHeight="800px">
      <EcosystemSection />
    </LazySection>

    <LazySection placeholderHeight="700px">
      <GlobalReach />
    </LazySection>

    <LazySection placeholderHeight="600px">
      <AlgoGreatness />
    </LazySection>

    <LazySection placeholderHeight="800px">
      <BlogSection />
    </LazySection>

    <LazySection placeholderHeight="900px">
      <PerformanceHistory />
    </LazySection>

    <LazySection placeholderHeight="600px">
      <SuccessShowcase />
    </LazySection>

    <LazySection placeholderHeight="400px">
      <SignupForm />
    </LazySection>

    <NewsletterPopup />
  </div>
  );
};
