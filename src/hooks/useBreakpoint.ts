import { useState, useEffect } from 'react';

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type BreakpointKey = keyof typeof breakpoints;

/**
 * useBreakpoint — Reactive viewport width hook.
 * SSR-safe: initializes to 0 on the server.
 */
export function useBreakpoint() {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    width,
    isMobile: width < breakpoints.md,
    isTablet: width >= breakpoints.md && width < breakpoints.lg,
    isDesktop: width >= breakpoints.lg,
    isWide: width >= breakpoints.xl,
    /** True if wider than the given breakpoint key */
    isAbove: (key: BreakpointKey) => width >= breakpoints[key],
    /** True if narrower than the given breakpoint key */
    isBelow: (key: BreakpointKey) => width < breakpoints[key],
  };
}
