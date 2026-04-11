import { AlgoGreatness } from "../components/AlgoGreatness";
import { PageMeta } from "../components/site/PageMeta";
import { BlogSection } from "../components/home/BlogSection";
import { EcosystemSection } from "../components/home/EcosystemSection";
import { GlobalReach } from "../components/home/GlobalReach";
import { FortressHero } from "../components/home/FortressHero";
import { MarketTicker } from "../components/home/MarketTicker";
import { WebinarPromo } from "../components/home/WebinarPromo";
import { PartnerLogos } from "../components/ui/PartnerLogos";
import { TrustGrid } from "../components/home/TrustGrid";
import { NewsletterPopup } from "../components/ui/NewsletterPopup";
import { SignupForm } from "../components/ui/SignupForm";
import { ReviewPromptModal } from "../components/ui/ReviewPromptModal";
import { ExitIntentModal } from "../components/ui/ExitIntentModal";
import { educationalOrganizationSchema, websiteSchema, faqSchema, goldAlgoCourseSchema } from "../utils/structuredData";
import { useState } from "react";
import { LazySection } from "../components/ui/LazySection";

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
    <div className="min-h-screen relative overflow-hidden">
      <ReviewPromptModal isOpen={showReviewModal} onClose={() => setShowReviewModal(false)} />
      <ExitIntentModal />

      {/* === FULL SEO METADATA — Keyword-dominant, intent-matched === */}
      <PageMeta
        title="IFX Trades | Best Forex & Algo Trading Course in India & Dubai"
        description="Asia's #1 institutional forex education platform. Master algo trading, live trading webinars & XAUUSD gold signals. Best forex course in India & Dubai. Join 12,400+ elite traders."
        path="/"
        keywords={[
          "IFX Trades",
          "forex education Asia",
          "best algo trading course India",
          "best algo trading course Dubai",
          "institutional forex education",
          "forex academy India",
          "forex webinar India",
          "live forex trading webinar 2026",
          "gold trading signals XAUUSD",
          "automated forex trading strategies",
          "AI forex trading bot MT5",
          "quantitative trading course India",
          "prop firm challenge strategy",
          "forex signals India live",
          "forex trading course for beginners India",
          "best online forex course UAE",
        ]}
        structuredData={[
          educationalOrganizationSchema(),
          websiteSchema(),
          goldAlgoCourseSchema(),
          faqSchema(homeFaqs),
        ]}
      />

      {/* === ABOVE THE FOLD — High-Authority Entrance === */}
      <FortressHero />
      <MarketTicker />

      {/* === NEXT LIVE WEBINAR — High-conversion section === */}
      <LazySection placeholderHeight="600px">
        <WebinarPromo />
      </LazySection>

      {/* === PLATFORM ECOSYSTEM === */}
      <LazySection placeholderHeight="800px">
        <EcosystemSection />
      </LazySection>

      {/* === GLOBAL REACH / GLOBE === */}
      <LazySection placeholderHeight="700px">
        <GlobalReach />
      </LazySection>

      {/* === ALGO FLAGSHIP PRODUCT === */}
      <LazySection placeholderHeight="600px">
        <AlgoGreatness />
      </LazySection>

      {/* === BLOG / THOUGHT LEADERSHIP === */}
      <LazySection placeholderHeight="800px">
        <BlogSection />
      </LazySection>

      {/* === INSTITUTIONAL ECOSYSTEM + PARTNERS === */}
      <LazySection placeholderHeight="1400px">
        <TrustGrid />
        <PartnerLogos />
      </LazySection>

      <NewsletterPopup />
    </div>
  );
};
