import { useRealtimeTable } from './useRealtime';
import { Webinar } from '../types';

/**
 * Hook for fetching a list of webinars with real-time updates
 * @param status Optional filter by status ('upcoming', 'live', 'past', 'all')
 */
export function useWebinars(status?: 'upcoming' | 'live' | 'past' | 'all') {
  const filter = status && status !== 'all' ? `status=eq.${status}` : undefined;
  
  const { rows, loading, error, refresh } = useRealtimeTable<Webinar>(
    'webinars',
    filter,
    { initialPageSize: 20 }
  );

  return {
    webinars: rows || [],
    data: rows || [], // compatibility
    loading,
    isLoading: loading,
    error,
    refreshWebinars: refresh
  };
}

/**
 * Hook for fetching a single webinar by ID with real-time updates
 * @param id Webinar ID
 */
export function useWebinar(id: string | undefined) {
  const { rows, loading, error, refresh } = useRealtimeTable<Webinar>(
    'webinars',
    id ? `id=eq.${id}` : undefined,
    { initialPageSize: 1 }
  );

  return {
    webinar: rows?.[0] || null,
    data: rows?.[0] || null, // alias
    loading,
    isLoading: loading,
    error,
    refreshWebinar: refresh
  };
}