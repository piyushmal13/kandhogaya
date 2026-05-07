// Barrel export for unified Supabase access
// Browser client with circuit breaker & utilities
export * from '@/utils/supabase/client';

// Server-side admin client & helpers (for Node/Express backends)
export { supabaseAdmin, createAuthedClient } from '@/utils/supabase/server';
