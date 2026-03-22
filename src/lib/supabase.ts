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

// Keep a reference to the active client instance
let activeClient = createClient(initialUrl || 'https://placeholder.supabase.co', initialKey || 'placeholder', {
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

// Export a Proxy so that consumers always interact with the most current client instance
export const supabase = new Proxy({} as any, {
  get: (_, prop) => {
    const value = (activeClient as any)[prop];
    return typeof value === 'function' ? value.bind(activeClient) : value;
  }
});

// Helper to re-initialize if keys are found later (e.g. after fetching from /api/config)
export const reinitializeSupabase = (url: string, key: string) => {
  if (!url || !key || url.includes('placeholder')) return;
  
  // Prevent unnecessary re-initialization if the URL and Key haven't changed
  if ((activeClient as any).supabaseUrl === url && (activeClient as any).supabaseKey === key) {
    return;
  }

  console.log("[Supabase]: Initializing with runtime config...");
  activeClient = createClient(url, key, {
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
};

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
