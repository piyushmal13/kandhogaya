import { useQuery } from '@tanstack/react-query';
import { signalService } from '../services/signalService';
import { Signal } from '../types';
export type { Signal };

/**
 * Atomic Signal Stream Hook
 * Fetches the latest algorithmic signals with a 5-second polling interval.
 */
export function useSignals() {
  return useQuery({
    queryKey: ['pulse_signals'],
    queryFn: () => signalService.getSignals(),
    // Institutional Polling: 5s interval for "Live" status
    refetchInterval: 5000, 
    staleTime: 3000,
    retry: 3,
    // Prevent UI crash on single node failure
    meta: {
      errorMessage: 'Failed to synchronize with Alpha Stream',
    },
  });
}
