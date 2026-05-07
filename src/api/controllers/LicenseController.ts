import { supabaseAdmin as supabase } from '@/lib/supabase';
import type { Request, Response } from 'express';

/**
 * LicenseController — Algorithm License Management & Validation
 * Routes:
 *   POST   /api/license/validate      - Validate license key + hardware binding
 *   GET    /api/licenses/:userId      - List user's licenses (protected)
 *   POST   /api/licenses/generate     - Bulk generate licenses (admin only)
 *   PUT    /api/licenses/:id          - Update license (status, expiry)
 *   DELETE /api/licenses/:id          - Revoke license
 */
export const LicenseController = {
  /**
   * POST /api/license/validate
   * Body: { licenseKey: string, hardwareId?: string, appVersion?: string }
   * Used by algo bots to authenticate with server
   */
  validateLicense: async (req: Request, res: Response) => {
    const { licenseKey, hardwareId, appVersion } = req.body;

    if (!licenseKey || typeof licenseKey !== 'string') {
      return res.status(400).json({ 
        valid: false, 
        error: 'License key required' 
      });
    }

    try {
      // Fetch license with joined data
      const { data: license, error } = await supabase
        .from('bot_licenses')
        .select(`
          *,
          algo:algo_id (
            id, name, version, download_url, 
            product:product_id (name, category, risk_level)
          ),
          user:user_id (id, email, full_name, role)
        `)
        .eq('license_key', licenseKey)
        .maybeSingle();

      if (error || !license) {
        return res.status(404).json({ 
          valid: false, 
          error: 'License not found',
          code: 'NOT_FOUND'
        });
      }

      // Check expiration
      if (license.expires_at && new Date(license.expires_at) < new Date()) {
        return res.status(403).json({ 
          valid: false, 
          error: 'License expired',
          expires_at: license.expires_at,
          code: 'EXPIRED'
        });
      }

      // Check active status
      if (!license.is_active) {
        return res.status(403).json({ 
          valid: false, 
          error: 'License revoked',
          code: 'REVOKED'
        });
      }

      // Validate hardware binding if provided
      if (hardwareId && license.hardware_id) {
        if (license.hardware_id !== hardwareId) {
          return res.status(403).json({ 
            valid: false, 
            error: 'Hardware mismatch',
            code: 'HARDWARE_MISMATCH'
          });
        }
      }

      // Update last validated timestamp (async, non-blocking)
      supabase
        .from('bot_licenses')
        .update({ 
          last_validated_at: new Date().toISOString(),
          last_ip_address: req.ip || req.connection?.remoteAddress,
          last_user_agent: req.headers['user-agent'] || null
        })
        .eq('id', license.id)
        .catch(() => {}); // Fire and forget

      // Log validation attempt for audit
      supabase.from('audit_logs').insert({
        actor_id: license.user_id,
        action: 'license_validation',
        entity_type: 'bot_license',
        entity_id: license.id,
        details: JSON.stringify({
          license_key: licenseKey.substring(0, 8) + '...',
          hardware_id: hardwareId ? 'provided' : 'none',
          app_version: appVersion,
          ip_address: req.ip || req.connection?.remoteAddress,
          user_agent: req.headers['user-agent']
        })
      }).catch(() => {});

      res.json({
        valid: true,
        license: {
          id: license.id,
          key: licenseKey,
          algo: license.algo,
          user: {
            id: license.user.id,
            email: license.user.email,
            name: license.user.full_name
          },
          expires_at: license.expires_at,
          account_id: license.account_id,
          created_at: license.created_at
        }
      });
    } catch (err: any) {
      console.error('[License Validation Error]:', err);
      res.status(500).json({ 
        valid: false, 
        error: 'Validation service unavailable',
        code: 'SERVICE_ERROR'
      });
    }
  },

  /**
   * GET /api/licenses/me
   * Requires auth header (via verifyJwt middleware)
   */
  getUserLicenses: async (req: Request, res: Response) => {
    const auth = validateAuth(req);
    if (!auth) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const { data, error } = await supabase
        .from('bot_licenses')
        .select(`
          *,
          algo:algo_id (
            id, name, version, download_url,
            product:product_id (name, category, image_url)
          )
        `)
        .eq('user_id', auth.userId)
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      // Add entitlement status from user_entitlements
      const { data: entitlements } = await supabase
        .from('user_entitlements')
        .select('feature, active, expires_at')
        .eq('user_id', auth.userId);

      const activeFeatures = (entitlements || [])
        .filter(e => e.active && (!e.expires_at || new Date(e.expires_at) > new Date()))
        .map(e => e.feature);

      res.json({
        licenses: data || [],
        entitlements: activeFeatures
      });
    } catch (err: any) {
      res.status(500).json({ error: 'License retrieval failed' });
    }
  },

  /**
   * POST /api/licenses/generate
   * Admin only - bulk license generation
   * Body: { algoId: string, count: number, durationDays: number, prefixes?: string[] }
   */
  generateLicenses: async (req: Request, res: Response) => {
    const auth = validateAuth(req);
    if (!auth || !['admin', 'superadmin'].includes(auth.role)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { algoId, count = 1, durationDays = 365, prefixes = [] } = req.body;
    const validCount = Math.min(Math.max(parseInt(count) || 1, 1), 1000); // Cap at 1000

    if (!algoId) {
      return res.status(400).json({ error: 'Algorithm ID required' });
    }

    try {
      const licenses = [];
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + durationDays);

      for (let i = 0; i < validCount; i++) {
        // Generate cryptographically secure license key
        const segments = [
          prefixes[Math.floor(Math.random() * prefixes.length)] || 'IFX',
          Math.random().toString(36).substring(2, 6).toUpperCase(),
          Math.random().toString(36).substring(2, 6).toUpperCase()
        ];
        const licenseKey = segments.join('-');

        licenses.push({
          algo_id: algoId,
          license_key: licenseKey,
          status: 'active',
          is_active: true,
          expires_at: expiresAt.toISOString(),
          created_at: new Date().toISOString()
        });
      }

      const { error: insertError } = await supabase
        .from('bot_licenses')
        .insert(licenses);

      if (insertError) {
        return res.status(500).json({ error: insertError.message });
      }

      // Audit log
      await supabase.from('audit_logs').insert({
        actor_id: auth.userId,
        action: 'bulk_license_generation',
        entity_type: 'bot_licenses',
        details: JSON.stringify({
          algo_id: algoId,
          count: validCount,
          duration_days: durationDays
        })
      });

      res.status(201).json({ 
        success: true, 
        generated: validCount,
        expires_at: expiresAt.toISOString()
      });
    } catch (err: any) {
      res.status(500).json({ error: 'License generation failed' });
    }
  },

  /**
   * PUT /api/licenses/:id
   * Update license status/expiry
   */
  updateLicense: async (req: Request, res: Response) => {
    const auth = validateAuth(req);
    if (!auth || !['admin', 'superadmin'].includes(auth.role)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    const { is_active, expires_at, account_id, hardware_id } = req.body;

    try {
      const updates: any = {};
      if (typeof is_active === 'boolean') updates.is_active = is_active;
      if (expires_at) updates.expires_at = expires_at;
      if (account_id) updates.account_id = account_id;
      if (hardware_id) updates.hardware_id = hardware_id;

      const { error } = await supabase
        .from('bot_licenses')
        .update(updates)
        .eq('id', id);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.json({ success: true, message: 'License updated' });
    } catch (err: any) {
      res.status(500).json({ error: 'Update failed' });
    }
  },

  /**
   * DELETE /api/licenses/:id
   * Revoke license
   */
  revokeLicense: async (req: Request, res: Response) => {
    const auth = validateAuth(req);
    if (!auth || !['admin', 'superadmin'].includes(auth.role)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;

    try {
      const { error } = await supabase
        .from('bot_licenses')
        .update({ 
          is_active: false,
          status: 'revoked',
          expires_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.json({ success: true, message: 'License revoked' });
    } catch (err: any) {
      res.status(500).json({ error: 'Revocation failed' });
    }
  }
};
