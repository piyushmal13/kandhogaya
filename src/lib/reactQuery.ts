import { QueryClient } from '@tanstack/react-query';

/**
 * IFX Trades — Institutional Cache Strategy v2
 *
 * Tier 1  realtime  — signals, market ticker    →  30s stale / 5m GC
 * Tier 2  live      — webinars, registrations   →  5m  stale / 15m GC
 * Tier 3  standard  — products, blog            →  10m stale / 30m GC
 * Tier 4  static    — courses, perf history     →  30m stale / 60m GC
 * Tier 5  admin     — admin queries             →  0s  stale (always fresh)
 *
 * CREDIT SAVING: Higher staleTime = fewer Supabase round-trips.
 * A page visited 10× in a session with 10m staleTime = 1 DB call, not 10.
 */
export const CACHE_TIERS = {
  realtime: 30_000,         // 30s  — signals, ticker
  live:      5 * 60_000,    // 5m   — webinars
  standard: 10 * 60_000,    // 10m  — products, blog
  static:   30 * 60_000,    // 30m  — courses, performance history
  admin:    0,              // 0s   — admin always fresh
} as const;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:            CACHE_TIERS.standard,     // default: 10m
      gcTime:               30 * 60_000,              // keep in memory 30m
      retry:                1,                        // 1 retry max (not 3)
      retryDelay:           (attempt) => Math.min(1000 * 2 ** attempt, 10_000),
      refetchOnWindowFocus: false,                    // key saving: no re-fetch on tab switch
      refetchOnReconnect:   true,                     // re-fetch after network drop
      refetchOnMount:       false,                    // don't re-fetch if data is fresh
    },
    mutations: {
      retry: 0, // mutations should never retry silently
    },
  },
});
