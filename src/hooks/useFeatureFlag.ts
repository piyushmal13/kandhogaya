import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getCache, setCache } from '@/utils/cache';
import { tracker } from '@/core/tracker';

/**
 * Institutional Core: useFeatureFlag
 * Connects directly to Supabase platform_flags to dynamically enable/disable 
 * UI nodes (like the Sovereign glow) without redeployments.
 * 
 * @param flagName - The unique config string in platform_flags (e.g. 'enable_glow_effect')
 * @param defaultValue - Fallback value if the query fails or network is offline
 */
export const useFeatureFlag = (flagName: string, defaultValue: boolean = false) => {
  const [isEnabled, setIsEnabled] = useState<boolean>(defaultValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchFlag = async () => {
      // 1. Check local cache (respecting 5 min TTL)
      const cached = getCache(`ff_${flagName}`);
      if (cached !== null) {
        setIsEnabled(cached);
        setLoading(false);
        return;
      }

      // 2. Fetch from Database
      try {
        const { data, error } = await supabase
          .from('platform_flags')
          .select('is_enabled')
          .eq('flag_name', flagName)
          .single();

        if (error) throw error;

        if (isMounted && data) {
          setIsEnabled(data.is_enabled);
          setCache(`ff_${flagName}`, data.is_enabled, 300); // 5 min TTL
        }
      } catch (err: any) {
        // Silent Degradation — do not spike the UI if DB is under load
        tracker.track("feature_flag_fetch_warning", { flag: flagName, error: err.message });
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFlag();
    return () => { isMounted = false; };
  }, [flagName]);

  return { isEnabled, loading };
};
