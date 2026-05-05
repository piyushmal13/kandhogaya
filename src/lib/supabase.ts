import { createClient } from '@supabase/supabase-js';

const getSupabaseConfig = () => {
  const injectedUrl = (globalThis as any)._SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
  const injectedKey = (globalThis as any)._SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!injectedUrl || injectedUrl.includes('placeholder')) {
    console.warn("⚠️ [INSTITUTIONAL DIAGNOSTIC]: Supabase credentials missing. Running in RESILIENCE MODE.");
  }

  return {
    url: injectedUrl || 'https://placeholder.supabase.co',
    key: injectedKey || 'placeholder'
  };
};

const { url: supabaseUrl, key: supabaseAnonKey } = getSupabaseConfig();

// Hardened Institutional Supabase Client v3 (Elite Pod)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: { 'x-institutional-resilience': 'active-v3' }
  }
});

// Alias for public data usage
export const publicSupabase = supabase;

// --- AUTONOMOUS DATA LAYER (FORGE AGENT) ---

// Circuit Breaker State
let consecutiveFailures = 0;
const MAX_FAILURES = 5;
let isCircuitOpen = false;
let circuitResetTimer: NodeJS.Timeout | null = null;

// Memory Cache for "Resilience Mode" Fallback
const memoryCache = new Map<string, any>();

export const getCircuitStatus = () => {
  if (isCircuitOpen) return 'OPEN';
  return consecutiveFailures > 0 ? 'DEGRADED' : 'CLOSED';
};

const openCircuit = () => {
  if (isCircuitOpen) return;
  isCircuitOpen = true;
  console.warn("🔥 [FORGE]: CIRCUIT BREAKER OPENED. Supabase connection degraded. Entering Resilience Mode.");
  
  if (circuitResetTimer) clearTimeout(circuitResetTimer);
  circuitResetTimer = setTimeout(() => {
    isCircuitOpen = false;
    consecutiveFailures = 0;
    console.info("🛡️ [FORGE]: Circuit Breaker resetting to HALF-OPEN.");
  }, 30000);
};

const recordSuccess = () => {
  if (isCircuitOpen) return;
  consecutiveFailures = 0;
};

const recordFailure = () => {
  consecutiveFailures++;
  if (consecutiveFailures >= MAX_FAILURES) {
    openCircuit();
  }
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const handleQueryError = (error: any, cacheKey?: string) => {
  console.error(`[Institutional Data Error] [${new Date().toISOString()}]:`, {
    message: error.message,
    code: error.code,
    details: error.details
  });
  
  if (cacheKey && memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey);
  }
  return [];
};

const executeWithRetry = async <T>(query: any, cacheKey?: string): Promise<T | []> => {
  const MAX_RETRIES = 3;
  let attempt = 0;
  
  while (attempt < MAX_RETRIES) {
    try {
      const { data, error } = await query;
      
      if (error) {
        const isTransient = ['408', '502', '503'].includes(error.code) || 
                           error.message.includes('fetch') || 
                           error.message.includes('network');
                           
        if (isTransient) throw error;
        return handleQueryError(error, cacheKey) as T;
      }
      
      recordSuccess();
      if (cacheKey) memoryCache.set(cacheKey, data);
      return (data || []) as T;
      
    } catch (err: any) {
      attempt++;
      recordFailure();
      
      if (attempt >= MAX_RETRIES) {
        console.error(`[Institutional Data Crash]: Query failed after ${MAX_RETRIES} attempts.`, err);
        if (cacheKey && memoryCache.has(cacheKey)) return memoryCache.get(cacheKey) as T;
        return [];
      }
      
      const backoffMs = Math.min(500 * Math.pow(2, attempt - 1), 2000);
      await sleep(backoffMs);
    }
  }
  return [];
};

/**
 * safeQuery v3 - The Circuit Breaker
 * Features: Exponential Backoff, Circuit Breaking, and Memory Caching.
 */
export const safeQuery = async <T>(query: any, cacheKey?: string): Promise<T | []> => {
  if (isCircuitOpen && cacheKey && memoryCache.has(cacheKey)) {
    console.warn(`[FORGE]: Circuit open. Returning cached data for ${cacheKey}`);
    return memoryCache.get(cacheKey) as T;
  }

  return executeWithRetry<T>(query, cacheKey);
};

// --- UTILS ---

export const getSupabasePublicUrl = (bucket: string, path: string): string => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const bakedUrl = import.meta.env.VITE_SUPABASE_URL || getSupabaseConfig().url;
  return `${bakedUrl}/storage/v1/object/public/${bucket}/${path}`;
};

export const getAvatarUrl = (path: string) => getSupabasePublicUrl("avatars", path);
export const getProductUrl = (path: string) => getSupabasePublicUrl("products", path);
export const getWebinarUrl = (path: string) => getSupabasePublicUrl("webinars", path);
