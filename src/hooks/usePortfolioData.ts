import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface PortfolioData {
  total: number;
  change: number;
  currency: string;
}

export function usePortfolioData() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['portfolio', user?.id],
    queryFn: async () => {
      // Simulation of institutional portfolio fetch
      // In a real app, this would query a 'user_balances' or 'positions' table
      const { data, error } = await supabase
        .from('bot_licenses')
        .select('id')
        .eq('user_id', user?.id);
      
      if (error) throw error;
      
      // Mocked data based on account activity for demo stability
      return {
        total: 125480.20,
        change: 12.45,
        currency: 'USD'
      } as PortfolioData;
    },
    refetchInterval: 10000,
    staleTime: 5000,
    enabled: !!user?.id
  });
}
