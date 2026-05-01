import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Institutional Referral Handler
 * 
 * Captures '?ref=XYZ' from URL and persists to localStorage.
 * This ensures sales attribution even through multi-session browsing cycles.
 */
export const ReferralHandler = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const refCode = params.get('ref');

    if (refCode) {
      localStorage.setItem('ifx_referral_code', refCode);
      
      // Update session session storage for current workflow
      sessionStorage.setItem('last_referral_signal', refCode);
    }
  }, [location]);

  return null;
};
