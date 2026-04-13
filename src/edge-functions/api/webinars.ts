import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * GET /api/webinars
 * Returns upcoming and live webinar sessions for the platform's intelligence hub.
 */
export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );

    const { data, error } = await supabase
      .from('webinars')
      .select('id, title, description, scheduled_at, status, thumbnail_url, speaker_name, is_free')
      .in('status', ['upcoming', 'live'])
      .order('scheduled_at', { ascending: true })
      .limit(20);

    if (error) throw error;

    return res.status(200).json({ webinars: data ?? [] });
  } catch (err: any) {
    console.error('[Edge: /api/webinars] Error:', err.message);
    return res.status(500).json({ error: 'Webinar pulse unavailable.' });
  }
}
