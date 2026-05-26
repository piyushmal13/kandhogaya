import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface PortfolioData {
  total: number;
  change: number;
  currency: string;
  activeLicenses: number;
  lastUpdated: string | null;
}

/**
 * User-Specific Portfolio Data Hook
 * Fetches the authenticated user's equity, performance, and license count.
 * Falls back gracefully if no user-specific data exists yet.
 */
export function usePortfolioData() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['portfolio', user?.id],
    queryFn: async (): Promise<PortfolioData> => {
      if (!user?.id) {
        return { total: 0, change: 0, currency: 'USD', activeLicenses: 0, lastUpdated: null };
      }

      // Parallel fetch: user performance + active licenses count
      const [perfRes, licenseRes] = await Promise.all([
        supabase
          .from('performance_results')
          .select('total_balance, daily_change, last_updated')
          .eq('user_id', user.id)
          .order('last_updated', { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from('bot_licenses')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_active', true)
      ]);

      const perf = perfRes.data;
      const licenseCount = licenseRes.count ?? 0;

      return {
        total: perf?.total_balance ?? 0,
        change: perf?.daily_change ?? 0,
        currency: 'USD',
        activeLicenses: licenseCount,
        lastUpdated: perf?.last_updated ?? null,
      };
    },
    staleTime: 30_000,
    refetchInterval: 60_000,
    enabled: !!user?.id,
    retry: 2,
  });
}
