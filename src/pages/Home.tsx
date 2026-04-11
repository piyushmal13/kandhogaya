import React, { useState, Suspense } from "react";
import { PageMeta } from "../components/site/PageMeta";
import { FortressHero } from "../components/home/FortressHero";
import { BrandAuthority } from "../components/home/BrandAuthority";
import { HowItWorks } from "../components/home/HowItWorks";
import { JourneySection } from "../components/home/JourneySection";
import { ConsultationSection } from "../components/home/ConsultationSection";
import { MarketTicker } from "../components/home/MarketTicker";
import { NewsletterPopup } from "../components/ui/NewsletterPopup";
import { ReviewPromptModal } from "../components/ui/ReviewPromptModal";
import { ExitIntentModal } from "../components/ui/ExitIntentModal";
import { educationalOrganizationSchema, websiteSchema, faqSchema, goldAlgoCourseSchema } from "../utils/structuredData";
import { motion, AnimatePresence } from "motion/react";

const homeFaqs = [
  {
    question: "What is IFX Trades?",
    answer: "IFX Trades is Asia's #1 institutional forex education platform, providing proprietary macro research and algorithmic execution training for global elite traders."
  },
  {
    question: "How do I request an institutional consultation?",
    answer: "Secure consultations can be requested via the Sovereign Inquiry section on our homepage. These sessions connect you directly with our senior quant specialists."
  }
];

export const Home = () => {
  const [showReviewModal, setShowReviewModal] = useState(false);

  return (
    <main className="min-h-screen bg-[#020202] text-[#F8FAFC] selection:bg-[#58F2B6]/30">
      <ReviewPromptModal isOpen={showReviewModal} onClose={() => setShowReviewModal(false)} />
      <ExitIntentModal />

      <PageMeta
        title="IFX Trades | Institutional Algorithmic Trading & Sovereign Intelligence"
        description="Asia's #1 institutional forex intelligence platform. Master sovereign algorithmic trading, live macro research & bespoke execution. Engineered for the disciplined 1%."
        path="/"
        structuredData={[
          educationalOrganizationSchema(),
          websiteSchema(),
          goldAlgoCourseSchema(),
          faqSchema(homeFaqs),
        ]}
      />

      {/* ── SOVEREIGN EXECUTION STACK ── */}
      <Suspense fallback={<div className="h-screen bg-[#020202]" />}>
        <FortressHero />
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <MarketTicker />
        </motion.div>

        <BrandAuthority />
        
        <HowItWorks />
        
        <JourneySection />
        
        <ConsultationSection />
      </Suspense>

      <NewsletterPopup />
    </main>
  );
};
