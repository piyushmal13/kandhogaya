import { createClient } from '@supabase/supabase-js';

// Resolve environment variables with fallbacks
// 1. Try baked-in Vite variables (build time)
// 2. Try window._SUPABASE_* (runtime injection from server.ts)
// 3. Try process.env (for SSR/Node environments)
const getSupabaseConfig = () => {
  const bakedUrl = import.meta.env.VITE_SUPABASE_URL;
  const bakedKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (bakedUrl && bakedKey && !bakedUrl.includes('placeholder')) {
    return { url: bakedUrl, key: bakedKey };
  }

  if (typeof globalThis !== 'undefined') {
    const injectedUrl = (globalThis as any)._SUPABASE_URL;
    const injectedKey = (globalThis as any)._SUPABASE_ANON_KEY;
    if (injectedUrl && injectedKey && !injectedUrl.includes('placeholder')) {
      return { url: injectedUrl, key: injectedKey };
    }
  }

  return {
    url: process.env.VITE_SUPABASE_URL || '',
    key: process.env.VITE_SUPABASE_ANON_KEY || ''
  };
};

const { url: initialUrl, key: initialKey } = getSupabaseConfig();

export const supabase = createClient(initialUrl || 'https://placeholder.supabase.co', initialKey || 'placeholder', {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    fetch: (fetchUrl, options) => {
      const signal = options?.signal || (typeof AbortSignal !== 'undefined' && 'timeout' in AbortSignal ? (AbortSignal as any).timeout(10000) : undefined);
      return fetch(fetchUrl, { ...options, signal });
    }
  }
});

export const safeQuery = async <T>(query: unknown): Promise<T | []> => {
  try {
    const { data, error } = await (query as Promise<{data: T, error: any}>);
    if (error) {
      // Handle "Failed to fetch" which is usually a network/ad-blocker issue
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        console.error("[Supabase Connection Error]: Failed to reach Supabase. This is likely due to an ad-blocker, VPN, or the project being paused.");
      } else {
        console.error("[Supabase Error]:", error.message);
      }
      return [];
    }
    return data || [];
  } catch (err: unknown) {
    const error = err as Error;
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      console.error("[Supabase Network Exception]: Connection failed. Check your internet or ad-blocker.");
    } else {
      console.error("[Database Exception]:", error);
    }
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
