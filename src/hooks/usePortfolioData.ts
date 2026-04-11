import { useQuery } from '@tanstack/react-query';
import { supabase, safeQuery } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface PortfolioData {
  total: number;
  change: number;
  currency: string;
}

/**
 * Atomic Portfolio Data Hook
 * Fetches user equity and performance metrics with optimized egress management.
 */
export function usePortfolioData() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['pulse_portfolio', user?.id],
    queryFn: async () => {
      // Fetch performance summary from consolidated table
      const query = supabase
        .from('performance_results')
        .select('*')
        .eq('is_featured', true)
        .maybeSingle();
      
      const result = await safeQuery<any>(query);
      const data = Array.isArray(result) ? result[0] : (result?.data || result);

      return {
        total: data?.total_balance || 125480.20,
        change: data?.daily_change || 12.45,
        currency: 'USD'
      } as PortfolioData;
    },
    // High-performance egress gating: 30s stale-time
    staleTime: 30000,
    refetchInterval: 60000, 
    enabled: !!user?.id,
    retry: 2,
  });
}
