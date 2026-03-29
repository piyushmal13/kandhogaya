import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { tracker } from "../core/tracker";

/**
 * Institutional Referral Tracking Hook
 * Captures ?ref=CODE from URL and persists it in localStorage for institutional attribution.
 * Used at the root level (App.tsx) for whole-session coverage.
 */
export const useReferral = () => {
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get("ref");

  useEffect(() => {
    if (refCode) {
      // 1. Persistence Layer: Survival through page refreshes and navigations
      localStorage.setItem("ifx_referral_code", refCode);
      
      // 2. Intelligence Tracking: Register the attribution signal
      tracker.track("referral_capture", {
        code: refCode,
        timestamp: new Date().toISOString(),
        protocol: "growth_engine_sprint4"
      });

      console.log(`[Attribution] Referral signal captured: ${refCode}`);
    }
  }, [refCode]);
};

/**
 * Utility to extract the active referral signal for form submissions
 */
export const getActiveReferralCode = (): string | null => {
  return localStorage.getItem("ifx_referral_code");
};
