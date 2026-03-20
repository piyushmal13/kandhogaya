import { ArrowRight, Compass } from "lucide-react";

import { PageHero } from "../components/site/PageHero";
import { PageMeta } from "../components/site/PageMeta";

export const NotFound = () => (
  <div className="relative overflow-hidden pb-20">
    <PageMeta
      title="Page Not Found"
      description="The requested IFXTrades page could not be found. Return to the platform overview or explore the live trading sections."
      path="/404"
      robots="noindex,follow"
    />

    <PageHero
      eyebrow="Navigation Error"
      title={
        <>
          This page is off the grid. <span className="site-title-gradient">Return to the trading surface.</span>
        </>
      }
      description="The route you requested does not exist or has moved. Use the main navigation to get back into signals, algorithms, education, or results."
      actions={[
        { label: "Go Home", to: "/", icon: <ArrowRight className="h-4 w-4" /> },
        { label: "View Signals", to: "/signals", variant: "secondary", icon: <Compass className="h-4 w-4" /> },
      ]}
      metrics={[
        { label: "Signals", value: "Live", helper: "Current trade desks and strategy access" },
        { label: "Research", value: "Updated", helper: "Daily insights, webinars, and education" },
      ]}
    />
  </div>
);
