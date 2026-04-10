import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Focus management for institutional accessibility.
 * Ensures that screen readers announce route changes by shifting focus
 * to the main execution stage.
 */
export function useFocusRoute() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Shifting focus to the main container for screen reader orientation
    const main = document.querySelector('main');
    if (main) {
      main.setAttribute('tabIndex', '-1');
      main.focus();
      // Optional: Smooth scroll to top on route change
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname]);
}
