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
function getCachedPortfolioData(userId?: string): PortfolioData | undefined {
  if (!userId) return undefined;
  const cached = localStorage.getItem(`portfolio_cache_v1_${userId}`);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      return undefined;
    }
  }
  return undefined;
}

export function usePortfolioData() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['portfolio', user?.id],
    queryFn: async (): Promise<PortfolioData> => {
      if (!user?.id) {
        return { total: 0, change: 0, currency: 'USD', activeLicenses: 0, lastUpdated: null };
      }

      const cacheKey = `portfolio_cache_v1_${user.id}`;
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Portfolio database fetch timed out')), 3500)
      );

      try {
        // Parallel fetch: user performance + active licenses count
        const [perfRes, licenseRes] = await Promise.race([
          Promise.all([
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
          ]),
          timeoutPromise
        ]);

        const perf = perfRes.data;
        const licenseCount = licenseRes.count ?? 0;

        const data: PortfolioData = {
          total: perf?.total_balance ?? 0,
          change: perf?.daily_change ?? 0,
          currency: 'USD',
          activeLicenses: licenseCount,
          lastUpdated: perf?.last_updated ?? null,
        };

        localStorage.setItem(cacheKey, JSON.stringify(data));
        return data;
      } catch (error) {
        console.warn('Supabase fetch failed or timed out, falling back to local cache', error);
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          try {
            return JSON.parse(cached);
          } catch (e) {
            console.error('Invalid cache format', e);
          }
        }
        return { total: 0, change: 0, currency: 'USD', activeLicenses: 0, lastUpdated: null };
      }
    },
    initialData: () => getCachedPortfolioData(user?.id),
    staleTime: 30_000,
    refetchInterval: 60_000,
    enabled: !!user?.id,
    retry: 2,
  });
}
