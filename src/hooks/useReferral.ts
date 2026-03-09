import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * useReferral Hook
 * Captures the 'agent' parameter from the URL and stores it in session storage.
 * This allows the platform to track which agent referred the user during signup/purchase.
 */
export const useReferral = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const agentId = params.get("agent");

    if (agentId) {
      console.log(`[REFERRAL] Captured Agent ID: ${agentId}`);
      sessionStorage.setItem("ifx_referral_agent", agentId);
    }
  }, [location]);
};
