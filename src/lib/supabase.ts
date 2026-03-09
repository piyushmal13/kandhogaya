import { createClient } from '@supabase/supabase-js';

/**
 * Centralized Supabase Client for IFXTrades
 * Handles connection to the database and authentication.
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your environment.");
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

/**
 * Defensive query wrapper to ensure consistent error handling and performance tracking.
 * Use this for all data fetching operations to catch errors gracefully.
 */
export const safeQuery = async <T>(query: any): Promise<T | []> => {
  const start = performance.now();
  try {
    const { data, error } = await query;
    const duration = performance.now() - start;
    
    // Log slow queries for optimization (IT Head monitoring)
    if (duration > 500) {
      console.warn(`[DB Performance] Slow query detected (${Math.round(duration)}ms):`, query);
    }

    if (error) {
      console.error("[Supabase Error]:", error.message, error.details);
      return [] as any;
    }
    
    if (!data) return [] as any;
    return data;
  } catch (err) {
    console.error("[Database Exception]:", err);
    return [] as any;
  }
};
