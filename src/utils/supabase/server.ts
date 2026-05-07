import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import pino from 'pino';
import type { Database } from '@/types/database.types';

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: { colorize: true }
  }
});

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || (!supabaseServiceKey && !supabaseAnonKey)) {
  logger.error("Missing Supabase configuration environment variables.");
}

/**
 * Institutional Admin Client
 * Uses service role key for privileged server operations.
 */
export const supabaseAdmin: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    global: {
      headers: { 'x-institutional-admin': 'true' }
    }
  }
);

/**
 * Creates a Supabase client authenticated as a specific user.
 * Used for server-side operations that require user context.
 */
export function createAuthedClient(token: string): SupabaseClient<Database> {
  return createClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false, autoRefreshToken: false }
    }
  );
}

/**
 * Executes a Supabase query with built-in retry logic and structured logging.
 * Addresses transient failures and connection "cracking" gracefully.
 */
export async function safeQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  context: string,
  retries = 3
): Promise<T> {
  let lastError: any;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const { data, error } = await queryFn();

      if (error) {
        lastError = error;
        // Only retry on potential transient errors (e.g. 5xx, network)
        if (error.code && !error.code.startsWith('5') && error.code !== 'PGRST116') {
          break;
        }
        logger.warn({ attempt, context, error: error.message }, "Supabase query attempt failed");
        if (attempt < retries) await new Promise(r => setTimeout(r, 100 * attempt));
        continue;
      }

      if (data === null) {
        logger.debug({ context }, "Supabase query returned null data");
      }

      return data as T;
    } catch (err: any) {
      lastError = err;
      logger.error({ attempt, context, err: err.message }, "Supabase query exception");
      if (attempt < retries) await new Promise(r => setTimeout(r, 200 * attempt));
    }
  }

  logger.error({ context, lastError }, "Supabase query failed all attempts");
  throw lastError || new Error(`Query failed: ${context}`);
}
