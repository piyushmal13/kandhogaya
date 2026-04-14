import React, { Suspense } from "react";
import { PageMeta } from "@/components/site/PageMeta";
import { SolutionsHero } from "@/components/solutions/SolutionsHero";
import { ServiceConfigurator } from "@/components/solutions/ServiceConfigurator";
import { CaseStudyShowcase } from "@/components/solutions/CaseStudyShowcase";
import { ConsultationSection } from "@/components/home/ConsultationSection";

/**
 * Solutions Page (v10.1)
 * 
 * Transitioned from "Course Grid" to "Bespoke Engineering Surface".
 * High-intent sales funnel focusing on custom algorithmic development and institutional setups.
 */
export const Solutions = () => {
  return (
    <main className="min-h-screen bg-[#020202] text-[#F8FAFC] selection:bg-[#58F2B6]/30">
      <PageMeta 
        title="Institutional Solutions | Bespoke Algorithmic Engineering"
        description="Asia's #1 institutional engineering hub. Custom algorithmic development, Educational Data Licenses, and private strategic consulting for elite capital deployments."
        path="/solutions"
        keywords={[
          "custom algorithmic trading bot",
          "MT5 expert advisor development",
          "institutional config bridge",
          "trading system engineering",
          "private quant consulting",
          "bespoke financial automation"
        ]}
      />

      <Suspense fallback={<div className="h-screen bg-[#020202]" />}>
        {/* 1. High-Impact Entrance */}
        <SolutionsHero />
        
        {/* 2. The Configurator (Revenue Engine) */}
        <ServiceConfigurator />
        
        {/* 3. The Trust Wall (Case Studies) */}
        <CaseStudyShowcase />
        
        {/* 4. Final Conversion Step */}
        <ConsultationSection />
      </Suspense>
    </main>
  );
};
