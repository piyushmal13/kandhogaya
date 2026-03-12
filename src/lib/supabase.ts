import { createClient } from '@supabase/supabase-js';

// Resolve environment variables with fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || (typeof process !== 'undefined' ? process.env.VITE_SUPABASE_URL : '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || (typeof process !== 'undefined' ? process.env.VITE_SUPABASE_ANON_KEY : '');

// Fail loudly if keys are missing
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("[Supabase Config Error]: Missing URL or Anon Key. Check environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    // Add a small timeout to prevent indefinite hanging on poor connections
    fetch: (url, options) => {
      const signal = options?.signal || (typeof AbortSignal !== 'undefined' && 'timeout' in AbortSignal ? (AbortSignal as any).timeout(10000) : undefined);
      return fetch(url, { ...options, signal });
    }
  }
});

export const safeQuery = async <T>(query: any): Promise<T | []> => {
  try {
    const { data, error } = await query;
    if (error) {
      // Handle "Failed to fetch" which is usually a network/ad-blocker issue
      if (error.message === 'Failed to fetch' || (error as any).name === 'TypeError') {
        console.error("[Supabase Connection Error]: Failed to reach Supabase. This is likely due to an ad-blocker, VPN, or the project being paused.");
      } else {
        console.error("[Supabase Error]:", error.message);
      }
      return [] as any;
    }
    return data || [] as any;
  } catch (err: any) {
    if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
      console.error("[Supabase Network Exception]: Connection failed. Check your internet or ad-blocker.");
    } else {
      console.error("[Database Exception]:", err);
    }
    return [] as any;
  }
};
