import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { CACHE_TIERS } from '../lib/reactQuery';

// ── Type ──────────────────────────────────────────────────────────────────────
export type FlagKey =
  // Core module toggles (present in DB)
  | 'signals'
  | 'algo'
  | 'academy'
  | 'webinars'
  | 'marketplace'
  | 'admin_panel'
  | 'sponsor_banners'
  | 'affiliate_system'
  | 'beta_signals'
  // Management flags (upserted at boot)
  | 'show_retail_brokers'
  | 'webinar_registration_open'
  | 'show_affiliate_hub'
  | 'algo_marketplace_live'
  | 'urgency_banner_active'
  | 'maintenance_mode'
  | 'webinar_realtime_updates';

type Flags = Record<FlagKey, boolean>;

// ── Defaults (shown when Supabase is unreachable) ─────────────────────────────
const FLAG_DEFAULTS: Flags = {
  // Core modules
  signals:                   true,
  algo:                      true,
  academy:                   true,
  webinars:                  true,
  marketplace:               true,
  admin_panel:               true,
  sponsor_banners:           true,
  affiliate_system:          true,
  beta_signals:              false,
  // Management
  show_retail_brokers:       false,
  webinar_registration_open: true,
  show_affiliate_hub:        true,
  algo_marketplace_live:     true,
  urgency_banner_active:     true,
  maintenance_mode:          false,
  webinar_realtime_updates:  false,
};

// ── Hook ──────────────────────────────────────────────────────────────────────
/**
 * useFlags()
 *
 * Reads feature flags from the `platform_flags` Supabase table.
 * Falls back to safe defaults if the table doesn't exist yet or if the
 * network is unavailable — the UI never crashes because of a missing flag.
 *
 * Cache: 5 min (live tier) — changes from the Admin panel propagate within 5 min
 * without a page reload. Force-refresh anytime via queryClient.invalidateQueries({queryKey:['flags']}).
 *
 * Usage:
 *   const { flags, loading } = useFlags();
 *   if (flags.maintenance_mode) return <MaintenancePage />;
 */
export function useFlags() {
  const { data, isLoading } = useQuery({
    queryKey:  ['flags'],
    queryFn:   async (): Promise<Flags> => {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('key, enabled');

      if (error) {
        // Table not yet created — return defaults silently
        console.warn('[useFlags] platform_flags not available, using defaults:', error.message);
        return FLAG_DEFAULTS;
      }

      const remote: Partial<Flags> = {};
      (data ?? []).forEach((row: { key: string; enabled: boolean }) => {
        remote[row.key as FlagKey] = row.enabled;
      });

      // Merge with defaults so any missing flags stay safe
      return { ...FLAG_DEFAULTS, ...remote };
    },
    staleTime:     CACHE_TIERS.live,
    gcTime:        10 * 60_000,
    retry:         1,
    // Never suspend — always show the UI with defaults while loading
    placeholderData: FLAG_DEFAULTS,
  });

  return {
    flags:   data ?? FLAG_DEFAULTS,
    loading: isLoading,
  };
}

// ── Convenience selector ──────────────────────────────────────────────────────
/** One-liner for a single flag: const isOpen = useFlag('webinar_registration_open'); */
export function useFlag(key: FlagKey): boolean {
  const { flags } = useFlags();
  return flags[key];
}
