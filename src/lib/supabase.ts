import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fail loudly if keys are missing
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("CRITICAL: Supabase credentials missing. Check your .env file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export const safeQuery = async <T>(query: any): Promise<T | []> => {
  try {
    const { data, error } = await query;
    if (error) {
      console.error("[Supabase Error]:", error.message);
      return [] as any;
    }
    return data || [] as any;
  } catch (err) {
    console.error("[Database Exception]:", err);
    return [] as any;
  }
};
