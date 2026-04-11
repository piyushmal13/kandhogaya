import { useQuery } from '@tanstack/react-query';
import { marketService } from '../services/marketService';
import { MarketPair } from '../types';

/**
 * Atomic Market Pulse Hook
 * Fetches global ticker data (XAUUSD, BTC, etc.) with institutional jitter.
 */
export function useMarketPulse() {
  return useQuery({
    queryKey: ['pulse_market'],
    queryFn: () => marketService.getMarketPairs(),
    refetchInterval: 15000,
    staleTime: 10000,
    // Ensure recovery on failure via Error Boundary compatibility
    retry: 3,
    retryDelay: (attempt) => Math.min(attempt * 1000, 5000),
  });
}
