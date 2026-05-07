import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export type RealtimeEvent<T> = {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: T | null;
  old: T | null;
  timestamp: number;
};

/**
 * Generic hook for subscribing to Supabase Realtime changes on any table
 * 
 * Usage:
 *   const { rows, loading, error } = useRealtimeTable<Signal>('signals', 'status=eq.active');
 *   const { rows } = useRealtimeTable<Webinar>('webinars', 'status=eq.upcoming');
 */
export function useRealtimeTable<T>(
  table: string,
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

  // Initial fetch
  const fetchInitial = useCallback(async () => {
    if (!enabled) return;
    
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from(table)
        .select('*')
        .limit(initialPageSize);
      
      if (filter) {
        query = query.or(filter);
      }
      
      const { data, error: fetchError } = await query;
      
      if (fetchError) throw fetchError;
      
      setRows((data || []) as T[]);
    } catch (err: any) {
      setError(err);
      console.error(`[Realtime] Failed to fetch ${table}:`, err);
    } finally {
      setLoading(false);
    }
  }, [table, filter, initialPageSize, enabled]);

  // Subscribe to real-time changes
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

          // Invoke custom callback if provided
          if (onChange) {
            onChange(event);
          }

          // Update local state
          setRows(prev => {
            switch (payload.eventType) {
              case 'INSERT':
                // Avoid duplicates
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
          });
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
 * Specialized hook for webinars with registration count tracking
 */
export function useWebinars(status?: 'upcoming' | 'live' | 'past' | 'all') {
  const filter = status && status !== 'all' ? `status=eq.${status}` : undefined;
  
  const { rows: webinars, loading, error, refresh } = useRealtimeTable<any>(
    'webinars',
    filter,
    { initialPageSize: 20 }
  );

  return {
    webinars: webinars || [],
    loading,
    error,
    refreshWebinars: refresh
  };
}

/**
 * Specialized hook for marketplace products
 */
export function useProducts(category?: string, includeInactive = false) {
  const filter = includeInactive 
    ? undefined 
    : `is_active=eq.true${category ? `,category=eq.${category}` : ''}`;
  
  const { rows: products, loading, error, refresh } = useRealtimeTable<any>(
    'products',
    filter,
    { initialPageSize: 100 }
  );

  return {
    products: products || [],
    loading,
    error,
    refreshProducts: refresh
  };
}

/**
 * Hook for user's active algo licenses
 */
export function useUserLicenses(userId: string) {
  const { rows: licenses, loading, error, refresh } = useRealtimeTable<any>(
    'algo_licenses',
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

    return () => supabase.removeChannel(channel);
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

  // Initial fetch
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

    // Subscribe to metric update events (via a dedicated channel)
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
          // Refresh metrics on any dashboard table change
          fetchMetrics();
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return { metrics, loading };
}
