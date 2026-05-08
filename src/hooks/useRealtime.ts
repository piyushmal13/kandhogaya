import { useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';

export type RealtimeEvent<T> = {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: T | null;
  old: T | null;
  timestamp: number;
};

/**
 * Helper to process realtime events and update row state.
 */
function handleRealtimePayload<T>(prev: T[], payload: any): T[] {
  switch (payload.eventType) {
    case 'INSERT':
      if (prev.some(row => (row as any).id === payload.new.id)) {
        return prev;
      }
      return [payload.new as T, ...prev];
    case 'UPDATE':
      return prev.map(row => 
        (row as any).id === payload.new.id ? payload.new as T : row
      );
    case 'DELETE':
      return prev.filter(row => (row as any).id !== payload.old.id);
    default:
      return prev;
  }
}

/**
 * Core realtime table hook with generic typing.
 */
export function useRealtimeTable<T = any>(
  table: any,
  filter?: string,
  options?: {
    initialPageSize?: number;
    enabled?: boolean;
    onChange?: (event: RealtimeEvent<T>) => void;
  }
): { rows: T[]; loading: boolean; error: Error | null; refresh: () => Promise<void> } {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { initialPageSize = 100, enabled = true, onChange } = options || {};

  const fetchInitial = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);

      let query = supabase.from(table as any)
        .select('*')
        .limit(initialPageSize) as any;

      if (filter) {
        if (filter.includes(',') || filter.includes('(')) {
          query = query.or(filter);
        } else {
          const [col, rest] = filter.split('=');
          if (rest?.includes('.')) {
            const [op, val] = rest.split('.');
            query = query.filter(col, op as any, val);
          } else {
            query = query.or(filter);
          }
        }
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setRows(data || []);
    } catch (err: any) {
      setError(err);
      console.error(`[Realtime] Failed to fetch ${table}:`, err);
    } finally {
      setLoading(false);
    }
  }, [table, filter, initialPageSize, enabled]);

  useEffect(() => {
    if (!enabled) return;

    fetchInitial();

    const channel = supabase
      .channel(`realtime-${table}-${filter || 'all'}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          filter: filter || undefined
        },
        (payload) => {
          const event: RealtimeEvent<T> = {
            eventType: payload.eventType as any,
            new: payload.new as T,
            old: payload.old as T,
            timestamp: Date.now()
          };

          if (onChange) {
            onChange(event);
          }

          setRows(prev => handleRealtimePayload<T>(prev, payload));
        }
      )
      .subscribe((status) => {
        if (status !== 'SUBSCRIBED') {
          console.warn(`[Realtime] Channel ${table} subscription status:`, status);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, filter, enabled, fetchInitial, onChange]);

  return {
    rows,
    loading,
    error,
    refresh: fetchInitial
  };
}

/**
 * Specialized hook for signals (trading signals with real-time updates)
 */
export function useSignals() {
  const { rows: signals, loading, error, refresh } = useRealtimeTable<any>(
    'signals',
    'status=eq.active',
    { initialPageSize: 50 }
  );

  return {
    signals: signals || [],
    loading,
    error,
    refreshSignals: refresh
  };
}

/**
 * Hook for fetching a list of webinars with real-time updates
 * @param status Optional filter by status ('upcoming', 'live', 'past', 'all')
 */
export function useWebinars(status?: 'upcoming' | 'live' | 'past' | 'all') {
  const filter = status && status !== 'all' ? `status=eq.${status}` : undefined;

  const { rows, loading, error, refresh } = useRealtimeTable<any>(
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
  const { rows, loading, error, refresh } = useRealtimeTable<any>(
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



/**
 * Hook for user's active algo licenses
 */
export function useUserLicenses(userId: string) {
  const { rows: licenses, loading, error, refresh } = useRealtimeTable<any>(
    'bot_licenses',
    `user_id=eq.${userId}`,
    { initialPageSize: 50 }
  );

  const activeLicenses = licenses?.filter(l =>
    l.status === 'active' &&
    (!l.expires_at || new Date(l.expires_at) > new Date())
  ) || [];

  return {
    licenses: activeLicenses,
    allLicenses: licenses || [],
    loading,
    error,
    refreshLicenses: refresh
  };
}

/**
 * Hook for watching a specific product's price/availability changes
 */
export function useProductWatch(productId: string) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (!error && data) {
        setProduct(data);
      }
      setLoading(false);
    };

    fetchProduct();

    const channel = supabase
      .channel(`product-${productId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'products',
          filter: `id=eq.${productId}`
        },
        (payload) => {
          setProduct(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [productId]);

  return { product, loading };
}

/**
 * Hook for real-time market data (price ticks)
 */
export function useMarketData(symbols?: string[]) {
  const { rows: marketData, loading, error, refresh } = useRealtimeTable<any>(
    'market_data',
    symbols ? `symbol=in.(${symbols.join(',')})` : undefined,
    { initialPageSize: 50 }
  );

  return {
    marketData: marketData || [],
    loading,
    error,
    refreshMarketData: refresh
  };
}

/**
 * Legacy wrapper for backward compatibility.
 * Accepts optional mapper to transform rows.
 */
export function useRealtime<T = any>(
  table: any,
  filter?: string,
  _options?: any,
  mapper?: (row: any) => T
) {
  const { rows, loading, error, refresh } = useRealtimeTable<any>(table, filter);
  const data = useMemo(() => mapper ? rows.map(mapper) : (rows as T), [rows, mapper]);
  return { data, loading, error, refresh };
}

/**
 * Hook for aggregated dashboard metrics (real-time)
 */
export function useDashboardMetrics() {
  const [metrics, setMetrics] = useState({
    total_users: 0,
    total_revenue: 0,
    total_webinars: 0,
    total_leads: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/admin/stats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setMetrics(data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();

    const channel = supabase
      .channel('dashboard-metrics')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'dashboard_daily_metrics'
        },
        () => {
          fetchMetrics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { metrics, loading };
}
