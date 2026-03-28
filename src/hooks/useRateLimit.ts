import { useState, useCallback, useRef } from "react";

/**
 * useRateLimit Hook
 * Institutional Safeguard: Prevents duplicate requests and abuse.
 */
export const useRateLimit = (limitMs: number = 3000) => {
  const [isLimited, setIsLimited] = useState(false);
  const lastCallRef = useRef<number>(0);

  const executeSafe = useCallback((action: () => void) => {
    const now = Date.now();
    if (now - lastCallRef.current < limitMs) {
      console.warn("[SecurityEngine] Rate Limit Active. Request Deprecated.");
      setIsLimited(true);
      setTimeout(() => setIsLimited(false), 1000);
      return false;
    }

    lastCallRef.current = now;
    action();
    return true;
  }, [limitMs]);

  return {
    isLimited,
    executeSafe
  };
};
