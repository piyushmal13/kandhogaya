import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * GET /api/signals
 * Institutional signal delivery endpoint.
 * Reads from Supabase using the service role key (no RLS bypass — signals are public).
 * Cache-controlled at the edge via Vercel's s-maxage header (set in vercel.json).
 */
export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from('signals')
      .select('id, symbol, type, direction, entry_price, take_profit, stop_loss, created_at')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    return res.status(200).json({ signals: data ?? [] });
  } catch (err: any) {
    console.error('[Edge: /api/signals] Error:', err.message);
    return res.status(500).json({ error: 'Signal pulse unavailable. Retry in 30s.' });
  }
}
