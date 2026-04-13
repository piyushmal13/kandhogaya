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
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <div className="relative min-h-screen overflow-hidden font-sans">
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
          className="relative w-full bg-[var(--color4)] text-white text-center p-6 sm:p-8 md:p-12 text-[10px] md:text-sm font-black uppercase tracking-[0.2em] z-50 border-t border-white/10"
        >
          <div className="max-w-7xl mx-auto px-4 leading-relaxed">
            <span className="opacity-50">CRITICAL INSTITUTIONAL NOTICE:</span> IFX Trades is strictly an education & research platform. <br className="sm:hidden" /> We license algorithms, deliver courses, and provide macro analysis. <strong className="text-white underline">WE ARE NOT A BROKER.</strong> <br className="hidden md:block" /> We do not accept deposits, execute trades, or handle client funds.
          </div>
        </div>
        <SpeedInsights />
      </div>
    </>
  );
};
