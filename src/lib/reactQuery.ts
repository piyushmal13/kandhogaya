import { QueryClient } from '@tanstack/react-query';

/**
 * Multi-tier cache strategy — maps the enterprise caching plan to React Query.
 *
 * Tier 1  Signals / market data     →  30 s  (near real-time)
 * Tier 2  Webinars / registrations  →  5 min (live-ish)
 * Tier 3  Courses / blog / static   →  30 min (mostly-static)
 * Tier 4  Admin / sensitive         →  0 s   (always fresh)
 */
export const CACHE_TIERS = {
  realtime:  30_000,          // 30 s  — signals, ticker
  live:       5 * 60_000,     // 5 min — webinars, registrations
  standard:  60_000,          // 1 min — default
  static:    30 * 60_000,     // 30 min — courses, blog, legal
  admin:     0,               // 0 s   — admin queries always fresh
} as const;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:          CACHE_TIERS.standard,
      gcTime:             10 * 60_000,   // keep unused data 10 min in memory
      retry:              2,
      retryDelay:         (attempt) => Math.min(1000 * 2 ** attempt, 30_000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,          // re-fetch after network recovers
    },
    mutations: {
      retry: 1,
    },
  },
});
