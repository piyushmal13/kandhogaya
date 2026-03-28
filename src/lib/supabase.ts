import { createClient } from '@supabase/supabase-js';

const getSupabaseConfig = () => {
  const bakedUrl = import.meta.env.VITE_SUPABASE_URL;
  const bakedKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (bakedUrl && bakedKey && !bakedUrl.includes('placeholder')) {
    return { url: bakedUrl, key: bakedKey };
  }

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
    detectSessionInUrl: true // Required for Google/OAuth redirection
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
console.log("💎 [DB RECOVERY] CLIENT INITIALIZED - PERSISTENT SESSION ACTIVE");
