import { useRealtimeTable } from './useRealtime';
import { Product } from '../types';

/**
 * Hook for fetching a list of products with real-time updates
 * @param category Optional filter by category
 * @param includeInactive Whether to include inactive products
 */
export function useProducts(category?: string, includeInactive = false) {
  // Build filter: if not including inactive, only get active products
  let filter = '';
  if (!includeInactive) {
    filter = 'is_active=eq.true';
  }
  if (category) {
    filter = filter ? `${filter},category=eq.${category}` : `category=eq.${category}`;
  }

  const { rows, loading, error, refresh } = useRealtimeTable<Product>(
    'products',
    filter || undefined,
    { initialPageSize: 100 }
  );

  return {
    products: rows || [],
    data: rows || [], // alias for compatibility
    loading,
    isLoading: loading,
    error,
    refreshProducts: refresh
  };
}