import { createClient } from '@supabase/supabase-js';

/**
 * Centralized Supabase Client
 * Handles connection to the IFXTrades database.
 * Environment variables are required for production stability.
 */

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.");
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

/**
 * Defensive query wrapper to ensure consistent error handling and response validation
 */
export const safeQuery = async <T>(query: any): Promise<T | []> => {
  try {
    const { data, error } = await query;
    if (error) {
      console.error("Supabase Query Error:", error);
      return [] as any;
    }
    if (!data) return [] as any;
    return data;
  } catch (err) {
    console.error("Unexpected Database Error:", err);
    return [] as any;
  }
};
