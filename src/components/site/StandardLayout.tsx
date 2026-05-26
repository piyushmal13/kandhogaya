import React from "react";
import { Navbar } from "../ui/Navbar";
import { Footer } from "../ui/Footer";
import { WhatsAppButton } from "../ui/WhatsAppButton";
import { SiteBackdrop } from "./SiteBackdrop";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { ScrollToTop } from "../ScrollToTop";
import { useReferral } from "../../hooks/useReferral";

const ReferralHandler = () => {
  useReferral();
  return null;
};

export const StandardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ScrollToTop />
      <ReferralHandler />
      <div className="relative min-h-screen overflow-x-hidden font-sans">
        <div className="noise-overlay" />
        <SiteBackdrop />
        
        <Navbar />
        
        <main id="main-content" className="relative z-10">
          {children}
        </main>
        
        <Footer />
        
        <WhatsAppButton />
        
        <div 
          id="regulatory-notice"
          className="relative w-full bg-[#020304] text-[#4F5A69] text-center p-3 text-[8px] font-black uppercase tracking-[0.2em] z-50 border-t border-white/5"
        >
          <div className="max-w-7xl mx-auto px-4 leading-relaxed">
            <span className="opacity-50 italic">Legal Notice:</span> IFX Trades is strictly an education & research platform. We license algorithmic modules, deliver quantitative courses, and provide macro analysis. <strong className="text-white/40">WE ARE NOT A BROKER.</strong> We do not accept deposits, execute trades, or handle client funds.
          </div>
        </div>
        <SpeedInsights />
      </div>
    </>
  );
};
