import { createClient } from '@supabase/supabase-js';

const getSupabaseConfig = () => {
  // Priority 1: Server-side runtime injection (globalThis scope)
  const injectedUrl = (globalThis as any)._SUPABASE_URL;
  const injectedKey = (globalThis as any)._SUPABASE_ANON_KEY;

  if (!injectedUrl || injectedUrl.includes('placeholder')) {
    console.warn("⚠️ [INSTITUTIONAL DIAGNOSTIC]: Supabase URL missing or placeholder. Running in RESILIENCE MODE.");
  } else {
    console.log("✅ [INSTITUTIONAL DIAGNOSTIC]: Multi-cluster Cloud Active:", injectedUrl.split('.')[0]);
  }

  // Priority 2: Build-time baked variables
  const bakedUrl = import.meta.env.VITE_SUPABASE_URL;
  const bakedKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (injectedUrl && injectedKey && !injectedUrl.includes('placeholder')) {
    return { url: injectedUrl, key: injectedKey };
  }

  if (bakedUrl && bakedKey && !bakedUrl.includes('placeholder')) {
    return { url: bakedUrl, key: bakedKey };
  }

  // Fallback: Environment variables (for Node/Vite fallback contexts)
  return {
    url: process.env.VITE_SUPABASE_URL || '',
    key: process.env.VITE_SUPABASE_ANON_KEY || ''
  };
};

const { url, key } = getSupabaseConfig();

// Standard Institutional Client
export const supabase = createClient(url || 'https://placeholder.supabase.co', key || 'placeholder', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true 
  }
});

// Alias for public data usage (used for backwards compatibility in existing hooks)
export const publicSupabase = supabase;

/**
 * safeQuery - Institutional Data Error Boundary
 * Wraps Supabase query execution to ensure predictable return shapes. 
 * Prevents logic-level exceptions from ever reaching the UI layer.
 */
export const safeQuery = async <T>(query: any): Promise<T | []> => {
  try {
    const { data, error } = await query;
    if (error) {
      console.error(`[Institutional Data Error] [${new Date().toISOString()}]:`, {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      return [] as any;
    }
    return (data || []) as T;
  } catch (err: unknown) {
    console.error("[Institutional Data Crash]: Exception trapped in safeQuery:", err);
    return [] as any;
  }
};

export const getSupabasePublicUrl = (bucket: string, path: string): string => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const bakedUrl = import.meta.env.VITE_SUPABASE_URL;
  return `${bakedUrl}/storage/v1/object/public/${bucket}/${path}`;
};

export const getAvatarUrl = (path: string) => getSupabasePublicUrl("avatars", path);
export const getProductUrl = (path: string) => getSupabasePublicUrl("products", path);
export const getWebinarUrl = (path: string) => getSupabasePublicUrl("webinars", path);

// HARD DEBUG LOG (Step 4 recovery)
// Initialized with high-fidelity resilience
