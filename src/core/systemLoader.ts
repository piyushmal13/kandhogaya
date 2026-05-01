import { supabase } from "@/lib/supabase";
import { setFlags } from "./featureFlags";
import { retentionEngine } from "../services/crm/retentionEngine";

/**
 * System Loader — Optimized
 * PERF: Replaced select('*') with only the columns featureFlags engine needs.
 * PERF: The realtime channel refetch also uses specific columns.
 */
export const loadSystem = async () => {
  try {
    const { data } = await supabase
      .from("feature_flags")
      .select("key, value, is_enabled");

    if (data) {
      // Map is_enabled (DB column) to enabled (featureFlags engine)
      setFlags(data.map((f: any) => ({ key: f.key, enabled: f.is_enabled ?? false })));
    }

    // Silent background inactivity check
    retentionEngine.detectInactivity().catch(() => {});

    // Real-time feature flag sync (specific columns only)
    supabase
      .channel('feature_flags_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'feature_flags' },
        async () => {
          const { data: updated } = await supabase
            .from("feature_flags")
            .select("key, value, is_enabled");
          if (updated) setFlags(updated.map((f: any) => ({ key: f.key, enabled: f.is_enabled ?? false })));
        }
      )
      .subscribe();

  } catch {
    // Silent fail — feature flags are non-critical
  }
};
