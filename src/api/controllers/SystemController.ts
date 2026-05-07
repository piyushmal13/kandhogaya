import { supabaseAdmin as supabase } from '@/lib/supabase';
import type { Request, Response } from 'express';

/**
 * SystemController — Infrastructure & Configuration Endpoints
 * Routes:
 *   GET    /api/health        - Service health check (no auth)
 *   GET    /api/config        - Client-side feature configuration
 *   GET    /api/metrics       - System metrics (admin only)
 *   POST   /api/maintenance   - Toggle maintenance mode (admin only)
 */
export const SystemController = {
  /**
   * GET /api/health
   * Public endpoint for uptime monitoring
   */
  getHealth: async (_req: Request, res: Response) => {
    try {
      // Check Supabase connectivity
      const { error } = await supabase
        .from('users')
        .select('count', { count: 'exact' })
        .limit(1);
      
      const dbHealthy = !error;

      res.json({
        status: dbHealthy ? 'healthy' : 'degraded',
        timestamp: new Date().toISOString(),
        version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'dev',
        env: process.env.NODE_ENV || 'development',
        platform: 'IFX Trades Institutional',
        database: dbHealthy ? 'connected' : 'disconnected',
        uptime: process.uptime()
      });
    } catch (err) {
      res.status(500).json({
        status: 'unhealthy',
        error: 'System check failed',
        timestamp: new Date().toISOString()
      });
    }
  },

  /**
   * GET /api/config
   * Returns client-side feature flags and configuration
   * Optionally authenticated for user-specific configs
   */
  getConfig: async (req: Request, res: Response) => {
    try {
      const auth = validateAuth(req);
      
      // Fetch active feature flags
      const { data: flags, error } = await (supabase
        .from('feature_flags' as any)
        .select('*')
        .eq('enabled', true) as any);

      const featureFlags: Record<string, any> = {};
      (flags || []).forEach(flag => {
        featureFlags[flag.key] = flag.value;
      });

      // Get site-wide config
      const config: any = {
        features: featureFlags,
        maintenance_mode: false,
        max_upload_size: 10 * 1024 * 1024, // 10MB
        allowed_file_types: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
        stripe_publishable_key: process.env.STRIPE_PUBLISHABLE_KEY || '',
        razorpay_key_id: process.env.RAZORPAY_KEY_ID || '',
        support_email: process.env.SUPPORT_EMAIL || 'support@ifxtrades.com',
        whatsapp_number: process.env.WHATSAPP_NUMBER || '+1234567890',
        version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'dev',
        deployed_at: new Date().toISOString()
      };

      // If authenticated, add user-specific config
      if (auth) {
        const { data: userProfile } = await (supabase
          .from('users' as any)
          .select('role, is_pro')
          .eq('id', auth.userId)
          .single() as any);

        const { data: entitlements } = await (supabase
          .from('user_entitlements' as any)
          .select('feature, active, expires_at')
          .eq('user_id', auth.userId) as any);

        config.user = {
          role: userProfile?.role || 'user',
          is_pro: userProfile?.is_pro || false,
          entitlements: (entitlements || []).filter(e => 
            e.active && (!e.expires_at || new Date(e.expires_at) > new Date())
          ).map(e => e.feature)
        };
      }

      res.json(config);
    } catch (err: any) {
      res.status(500).json({ error: 'Config retrieval failed' });
    }
  },

  /**
   * GET /api/metrics
   * Admin-only system metrics
   */
  getMetrics: async (req: Request, res: Response) => {
    const auth = validateAuth(req);
    if (!auth || !['admin', 'superadmin', 'analyst'].includes(auth.role)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    try {
      // Get counts from various tables
      const [
        users24h,
        registrations24h,
        payments24h,
        avgSessionDuration,
        webinarRegistrations
      ] = await Promise.all([
        // New users in last 24h
        supabase
          .from('users')
          .select('count', { count: 'exact' })
          .gte('created_at', new Date(Date.now() - 24*60*60*1000).toISOString()),
        
        // Registrations (new users via signup)
        supabase
          .from('users')
          .select('count', { count: 'exact' })
          .gte('created_at', new Date(Date.now() - 24*60*60*1000).toISOString()),
        
        // Payments in last 24h
        (supabase
          .from('payments' as any)
          .select('sum(amount)')
          .gte('created_at', new Date(Date.now() - 24*60*60*1000).toISOString()) as any),
        
        // Average session duration from analytics_events
        (supabase.rpc('avg_session_duration' as any, { hours: 24 }) as any).catch(() => ({ data: 0 })),
        
        // Webinar registrations today
        supabase
          .from('webinar_registrations')
          .select('count', { count: 'exact' })
          .gte('registration_date', new Date(Date.now() - 24*60*60*1000).toISOString())
      ]);

      res.json({
        period: '24h',
        users: users24h.count || 0,
        registrations: registrations24h.count || 0,
        revenue: payments24h.data?.sum || 0,
        avg_session_seconds: avgSessionDuration || 0,
        webinar_registrations: webinarRegistrations.count || 0,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Metrics retrieval failed' });
    }
  }
};

// Helper for auth validation
const validateAuth = (req: Request) => {
  const role = (req.headers as any)['x-verified-role'];
  const userId = (req.headers as any)['x-user-id'];
  if (!role || !userId) return null;
  return { userId, role };
};
