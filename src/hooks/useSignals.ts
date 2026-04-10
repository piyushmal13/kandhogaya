import { useQuery } from '@tanstack/react-query';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { supabase } from '@/lib/supabase';

export interface Signal {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  entry: number;
  sl: number;
  tp: number;
  status: 'active' | 'hit' | 'closed';
  created_at: string;
}

export function useSignals() {
  const { isEnabled: enabled } = useFeatureFlag('enable_realtime_signals', true);
  
  return useQuery({
    queryKey: ['signals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('signals')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data as Signal[];
    },
    refetchInterval: enabled ? 5000 : false, // Poll every 5s if enabled
    staleTime: 3000,
  });
}
