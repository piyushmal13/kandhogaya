import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { tracker } from "../../core/tracker";

/**
 * Institutional Referral Discovery Loop
 * Silently captures ?ref=CODE URL parameters and persists them across the session
 * ensuring revenue attribution in the manual fulfillment pipeline.
 */
export const ReferralTracker = () => {
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get("ref");

  useEffect(() => {
    if (refCode) {
      // 1. Storage Persistence: Survival through page navigations
      localStorage.setItem("ifx_referral_code", refCode);
      
      // 2. Performance Tracking: Analytics discovery
      tracker.track("referral_click", { 
        code: refCode, 
        source: "url_param",
        protocol: "growth_engine_sprint4"
      });

      // 3. Structural Integrity: Clean the URL (Optional, but professional)
      // window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [refCode]);

  return null; // Silent operational component
};

/**
 * Helper to retrieve current attribution signal
 */
export const getReferralSignal = (): string | null => {
  return localStorage.getItem("ifx_referral_code");
};

/**
 * Helper to clear attribution post-conversion
 */
export const clearReferralSignal = () => {
  localStorage.removeItem("ifx_referral_code");
};
