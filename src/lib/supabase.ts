import { createClient } from '@supabase/supabase-js';

const getSupabaseConfig = () => {
  // Priority 1: Server-side runtime injection (globalThis scope)
  const injectedUrl = (globalThis as any)._SUPABASE_URL || (window as any)._SUPABASE_URL;
  const injectedKey = (globalThis as any)._SUPABASE_ANON_KEY || (window as any)._SUPABASE_ANON_KEY;

  if (injectedUrl && injectedKey && !injectedUrl.includes('placeholder')) {
    return { url: injectedUrl, key: injectedKey };
  }

  // Priority 2: Build-time baked variables
  const bakedUrl = import.meta.env.VITE_SUPABASE_URL;
  const bakedKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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

export const supabase = createClient(url || 'https://placeholder.supabase.co', key || 'placeholder', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true 
  }
});

// Dedicated client for public Data Pulse (bypasses Auth-state RLS locking)
export const publicSupabase = createClient(url || 'https://placeholder.supabase.co', key || 'placeholder', {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

// Build Recovery: Restore safeQuery for dependency resolution
export const safeQuery = async <T>(query: unknown): Promise<T | []> => {
  try {
    const { data, error } = await (query as Promise<{data: T, error: any}>);
    if (error) {
      console.error("[Supabase Error]:", error.message);
      return [];
    }
    return data || [];
  } catch (err: unknown) {
    console.error("[Database Exception]:", err);
    return [];
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
