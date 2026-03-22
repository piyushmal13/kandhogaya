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

// Create a proxy-like object or a getter to handle late initialization
let supabaseClient = createClient(initialUrl || 'https://placeholder.supabase.co', initialKey || 'placeholder', {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    fetch: (url, options) => {
      const signal = options?.signal || (typeof AbortSignal !== 'undefined' && 'timeout' in AbortSignal ? (AbortSignal as any).timeout(10000) : undefined);
      return fetch(url, { ...options, signal });
    }
  }
});

export const supabase = supabaseClient;

// Helper to re-initialize if keys are found later (e.g. after fetching from /api/config)
export const reinitializeSupabase = (url: string, key: string) => {
  if (!url || !key || url.includes('placeholder')) return;
  
  console.log("[Supabase]: Re-initializing with runtime config...");
  const newClient = createClient(url, key, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    global: {
      fetch: (url, options) => {
        const signal = options?.signal || (typeof AbortSignal !== 'undefined' && 'timeout' in AbortSignal ? (AbortSignal as any).timeout(10000) : undefined);
        return fetch(url, { ...options, signal });
      }
    }
  });
  
  // Update the exported client properties
  // Since we can't re-assign the export, we have to rely on the fact that 
  // most Supabase operations are called on the object.
  // This is tricky. A better way is to export a getter.
  Object.assign(supabase, newClient);
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
