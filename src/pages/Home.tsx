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
import { organizationSchema, websiteSchema, faqSchema } from "../utils/structuredData";

const homeFaqs = [
  {
    question: "What is IFXTrades?",
    answer:
      "IFXTrades is an institutional-grade trading intelligence platform providing live forex and gold signals, automated trading algorithms, a structured trading academy, and live webinars for serious retail traders.",
  },
  {
    question: "How do I receive trading signals?",
    answer:
      "Signals are delivered instantly via our private WhatsApp channel with exact entry zones, stop loss, and take profit levels for gold (XAUUSD) and major forex pairs.",
  },
  {
    question: "What markets do your algorithms cover?",
    answer:
      "Our algorithms cover XAUUSD (Gold), major forex pairs (EURUSD, GBPUSD, USDJPY), and select indices. Each strategy is backtested and forward-tested before release.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes, you can sign up for free to access the platform overview, live market ticker, and selected educational content. Signal subscriptions start at $20/month.",
  },
];

export const Home = () => (
  <div className="min-h-screen relative overflow-hidden">
    <PageMeta
      title="IFXTrades | Institutional Trading Intelligence"
      description="Institutional-grade algorithmic trading, live signals, trader education, and market intelligence for serious retail execution. Join 12,000+ traders."
      path="/"
      keywords={[
        "IFXTrades",
        "algo trading platform",
        "forex signals",
        "trading academy",
        "gold signals",
        "automated trading",
        "XAUUSD signals",
        "forex trading platform",
      ]}
      structuredData={[organizationSchema(), websiteSchema(), faqSchema(homeFaqs)]}
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
