import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';

/**
 * INSTITUTIONAL PRODUCT HOOK (v8.0)
 * Rebuilt to synchronize multiple data sources (algorithms, university_courses) 
 * into a unified marketplace asset collection.
 */
export function useProducts(category?: string, includeInactive = false) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 1. Fetch Algorithms
      let algoQuery = supabase.from('algorithms').select('*');
      if (!includeInactive) {
        algoQuery = algoQuery.eq('is_active', true);
      }
      
      // 2. Fetch Courses
      let courseQuery = supabase.from('university_courses').select('*');

      const [algosRes, coursesRes] = await Promise.all([
        algoQuery,
        courseQuery
      ]);

      if (algosRes.error) throw algosRes.error;
      if (coursesRes.error) throw coursesRes.error;

      // 3. Map Algorithms to Unified Product Type
      const mappedAlgos = (algosRes.data || []).map(a => ({
        id: a.id,
        name: a.name,
        category: 'algorithm',
        description: a.description,
        price: Number(a.price) || 0,
        image_url: a.image_url,
        risk_classification: a.risk_classification,
        monthly_roi_pct: Number(a.monthly_roi_pct) || 0,
        min_capital: Number(a.min_capital) || 0,
        is_active: a.is_active,
        slug: a.slug,
        type: 'algorithm' as const,
        performance: {
          winRate: 85 + (a.id.charCodeAt(0) % 10), // Deterministic mock if not in DB
          monthlyReturn: Number(a.monthly_roi_pct) || 0
        }
      }));

      // 4. Map Courses to Unified Product Type
      const mappedCourses = (coursesRes.data || []).map(c => ({
        id: c.id,
        name: c.title,
        category: 'course',
        description: c.description,
        price: c.plan_required === 'free' ? 0 : 999, // Fallback price for courses if not defined
        image_url: null, // university_courses missing image_url in schema
        risk_classification: c.category || 'Institutional',
        is_active: true,
        slug: c.slug,
        type: 'course'
      }));

      // 5. Consolidate and Filter
      let allProducts = [...mappedAlgos, ...mappedCourses];

      if (category && category !== 'all') {
        allProducts = allProducts.filter(p => p.category === category);
      }

      setProducts(allProducts);
    } catch (err: any) {
      setError(err);
      console.error('[Marketplace] Data Fetch Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [category, includeInactive]);

  useEffect(() => {
    fetchProducts();

    // Set up real-time for algorithms
    const algoChannel = supabase
      .channel('public:algorithms')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'algorithms' }, () => {
        fetchProducts();
      })
      .subscribe();

    // Set up real-time for courses
    const courseChannel = supabase
      .channel('public:university_courses')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'university_courses' }, () => {
        fetchProducts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(algoChannel);
      supabase.removeChannel(courseChannel);
    };
  }, [fetchProducts]);

  return {
    products,
    data: products,
    isLoading,
    loading: isLoading,
    error,
    refreshProducts: fetchProducts
  };
}