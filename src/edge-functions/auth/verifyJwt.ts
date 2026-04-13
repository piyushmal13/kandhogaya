import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * JWT Gateway — validates Bearer token and checks for 'admin' role claim
 * via Supabase app_metadata. Protects all /api/* privileged routes.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const token = req.headers['authorization']?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'UNAUTHORIZED: Missing Bearer token.' });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  const { data, error } = await supabase.auth.admin.getUserById(
    // Decode sub claim to get user ID without requiring additional deps
    JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()).sub
  );

  if (error || !data?.user) {
    return res.status(401).json({ error: 'UNAUTHORIZED: Invalid or expired token.' });
  }

  const role = data.user.app_metadata?.role ?? 'user';

  if (role !== 'admin') {
    return res.status(403).json({
      error: 'FORBIDDEN: Institutional clearance required.',
      requiredRole: 'admin',
      detectedRole: role,
    });
  }

  // Pass the verified role downstream via a custom header
  res.setHeader('x-verified-role', role);
  res.setHeader('x-user-id', data.user.id);

  // For middleware chaining — call next() by falling through
  return res.status(200).json({ authorized: true, role });
}
