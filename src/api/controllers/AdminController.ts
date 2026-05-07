import { supabaseAdmin as supabase } from '@/lib/supabase';
import type { Request, Response } from 'express';

/**
 * AdminController — Institutional Administrative Panel
 * Routes:
 *   GET    /api/admin/stats            - Dashboard metrics (users, revenue, etc.)
 *   GET    /api/admin/agents           - List agents with performance
 *   POST   /api/admin/licenses         - Bulk license generation
 *   POST   /api/admin/content          - Create blog/course content
 *   GET    /api/admin/users            - User management
 *   PUT    /api/admin/users/:id        - Update user role/status
 *   GET    /api/admin/leads            - CRM lead pipeline
 *   PUT    /api/admin/leads/:id        - Update lead status/stage
 *   GET    /api/admin/payments         - Payment tracking
 *   GET    /api/admin/commissions      - Commission tracking
 *   PUT    /api/admin/commissions/:id  - Mark commission paid
 *   GET    /api/admin/system-logs      - System monitoring
 *   GET    /api/admin/feature-flags    - Feature flag management
 *   PUT    /api/admin/feature-flags/:id
 */
export const AdminController = {
  /**
   * GET /api/admin/stats
   * Returns KPI dashboard data
   */
  getDashboardStats: async (req: Request, res: Response) => {
    const auth = validateAuth(req);
    if (!auth || !['admin', 'superadmin', 'analyst'].includes(auth.role)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    try {
      const [
        usersResult,
        revenueResult,
        webinarsResult,
        leadsResult,
        licensesResult,
        ordersResult
      ] = await Promise.all([
        supabase.from('users' as any).select('count', { count: 'exact' }),
        supabase.from('sales_tracking' as any).select('sum(sale_amount)'),
        supabase.from('webinars' as any).select('count', { count: 'exact' }),
        supabase.from('leads' as any).select('count', { count: 'exact' }),
        supabase.from('bot_licenses' as any).select('count', { count: 'exact' }),
        supabase.from('payments' as any).select('sum(amount)')
      ]);

      // Get last 7 days trend data
      const { data: trendData } = await (supabase.rpc('get_revenue_trend' as any, {
        days: 7
      }) as any).catch(() => ({ data: [] }));

      res.json({
        total_users: (usersResult as any).count || 0,
        total_revenue: (revenueResult as any).data?.sum || 0,
        total_webinars: (webinarsResult as any).count || 0,
        total_leads: (leadsResult as any).count || 0,
        total_licenses: (licensesResult as any).count || 0,
        total_orders: (ordersResult as any).data?.sum || 0,
        revenue_trend: trendData,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Stats retrieval failed' });
    }
  },

  /**
   * GET /api/admin/agents
   * List agent accounts with performance metrics
   */
  getAgents: async (req: Request, res: Response) => {
    const auth = validateAuth(req);
    if (!auth || !['admin', 'superadmin'].includes(auth.role)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    try {
      const { data, error } = await supabase
        .from('agent_accounts')
        .select(`
          *,
          user:user_id (
            id, email, full_name, avatar_url, created_at
          ),
          _count:salerefs(
            sale_amount,
            COUNT(salerefs.id)
          )
        `)
        .order('performance_score', { ascending: false });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      // Enrich with commission totals
      const agents = await Promise.all((data || []).map(async (agent: any) => {
        const { count } = await (supabase
          .from('commissions' as any)
          .select('*', { count: 'exact' })
          .eq('agent_id', agent.id)
          .eq('status', 'PENDING' as any) as any);
        
        return {
          ...agent,
          pending_commissions: count || 0
        };
      }));

      res.json({ agents });
    } catch (err: any) {
      res.status(500).json({ error: 'Agent retrieval failed' });
    }
  },

  /**
   * GET /api/admin/users
   * Query: ?role=admin&limit=50&offset=0&search=query
   */
  getUsers: async (req: Request, res: Response) => {
    const auth = validateAuth(req);
    if (!auth || !['admin', 'superadmin'].includes(auth.role)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const role = url.searchParams.get('role');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100);
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const search = url.searchParams.get('search');

    try {
      let query = (supabase
        .from('users' as any)
        .select(`
          *,
          entitlements:user_entitlements(*),
          _count:algo_licenses(count)
        `, { count: 'exact' }) as any);

      if (role) query = query.eq('role', role);
      if (search) {
        query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.json({
        users: data || [],
        total: count || 0,
        pagination: { limit, offset, total: count || 0 }
      });
    } catch (err: any) {
      res.status(500).json({ error: 'User retrieval failed' });
    }
  },

  /**
   * PUT /api/admin/users/:id
   * Update user role, status
   */
  updateUser: async (req: Request, res: Response) => {
    const auth = validateAuth(req);
    if (!auth || !['admin', 'superadmin'].includes(auth.role)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    const { role, is_active, crm_metadata } = req.body;

    // Only superadmin can change role to superadmin
    if (role === 'superadmin' && auth.role !== 'superadmin') {
      return res.status(403).json({ error: 'Superadmin privileges required' });
    }

    try {
      const updates: any = {};
      if (role) updates.role = role;
      if (typeof is_active === 'boolean') updates.is_active = is_active;
      if (crm_metadata) updates.crm_metadata = crm_metadata;

      const { error } = await (supabase
        .from('users' as any)
        .update(updates)
        .eq('id', id) as any);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.json({ success: true, message: 'User updated' });
    } catch (err: any) {
      res.status(500).json({ error: 'Update failed' });
    }
  },

  /**
   * GET /api/admin/leads
   * CRM lead pipeline
   */
  getLeads: async (req: Request, res: Response) => {
    const auth = validateAuth(req);
    if (!auth || !['admin', 'sales_agent', 'support'].includes(auth.role)) {
      return res.status(403).json({ error: 'CRM access required' });
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const stage = url.searchParams.get('stage');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100);
    const offset = parseInt(url.searchParams.get('offset') || '0');

    try {
      let query = (supabase
        .from('leads' as any)
        .select(`
          *,
          assigned_to_user:assigned_to (
            id, full_name, email, role
          )
        `, { count: 'exact' })
        .order('score', { ascending: false })
        .order('created_at', { ascending: false }) as any);

      if (stage) query = query.eq('stage', stage);
      if (auth.role === 'agent') {
        query = query.eq('assigned_to', auth.userId);
      }

      const { data, error, count } = await query
        .range(offset, offset + limit - 1);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.json({
        leads: data || [],
        total: count || 0,
        pagination: { limit, offset, total: count || 0 }
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Lead retrieval failed' });
    }
  },

  /**
   * PUT /api/admin/leads/:id
   * Update lead stage, score, assign agent
   */
  updateLead: async (req: Request, res: Response) => {
    const auth = validateAuth(req);
    if (!auth || !['admin', 'sales_agent', 'support'].includes(auth.role)) {
      return res.status(403).json({ error: 'CRM access required' });
    }

    const { id } = req.params;
    const { stage, score, assigned_to, metadata } = req.body;

    try {
      const updates: any = {};
      if (stage) updates.stage = stage;
      if (typeof score === 'number') updates.score = score;
      if (assigned_to) updates.assigned_to = assigned_to;
      if (metadata) updates.metadata = { ...metadata };
      updates.last_action_at = new Date().toISOString();

      const { error } = await (supabase
        .from('leads' as any)
        .update(updates as any)
        .eq('id', id) as any);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.json({ success: true, message: 'Lead updated' });
    } catch (err: any) {
      res.status(500).json({ error: 'Update failed' });
    }
  },

  /**
   * GET /api/admin/commissions
   * Commission tracking for agents
   */
  getCommissions: async (req: Request, res: Response) => {
    const auth = validateAuth(req);
    if (!auth || !['admin', 'superadmin'].includes(auth.role)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const agentId = url.searchParams.get('agent_id');
    const status = url.searchParams.get('status');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100);
    const offset = parseInt(url.searchParams.get('offset') || '0');

    try {
      let query = (supabase
        .from('commissions' as any)
        .select(`
          *,
          agent:agent_id (
            user:user_id (full_name, email)
          ),
          product:product_id (name, category)
        `, { count: 'exact' })
        .order('created_at', { ascending: false }) as any);

      if (agentId) query = query.eq('agent_id', agentId);
      if (status) query = query.eq('status', status);

      const { data, error, count } = await query
        .range(offset, offset + limit - 1);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      // Calculate summary
      const { data: totalAmount } = await (supabase
        .from('commissions' as any)
        .select('sum(amount)')
        .eq('status', 'PENDING' as any) as any);

      res.json({
        commissions: data || [],
        total_pending: (totalAmount as any)?.sum || 0,
        total: count || 0,
        pagination: { limit, offset, total: count || 0 }
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Commission retrieval failed' });
    }
  },

  /**
   * PUT /api/admin/commissions/:id/pay
   * Mark commission as paid
   */
  payCommission: async (req: Request, res: Response) => {
    const auth = validateAuth(req);
    if (!auth || !['admin', 'superadmin'].includes(auth.role)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;

    try {
      const { error } = await (supabase
        .from('commissions' as any)
        .update({ 
          status: 'PAID' as any,
          paid_at: new Date().toISOString()
        } as any)
        .eq('id', id) as any);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.json({ success: true, message: 'Commission marked as paid' });
    } catch (err: any) {
      res.status(500).json({ error: 'Payment update failed' });
    }
  },

  /**
   * GET /api/admin/system-logs
   * System monitoring & error tracking
   */
  getSystemLogs: async (req: Request, res: Response) => {
    const auth = validateAuth(req);
    if (!auth || !['admin', 'superadmin', 'analyst'].includes(auth.role)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const level = url.searchParams.get('level');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '100'), 1000);
    const offset = parseInt(url.searchParams.get('offset') || '0');

    try {
      let query = (supabase
        .from('system_logs' as any)
        .select('*')
        .order('created_at', { ascending: false }) as any);

      if (level) query = query.eq('severity' as any, level);

      const { data, error, count } = await query
        .range(offset, offset + limit - 1);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.json({
        logs: data || [],
        total: count || 0,
        pagination: { limit, offset, total: count || 0 }
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Log retrieval failed' });
    }
  },

  /**
   * GET /api/admin/feature-flags
   * Feature flag management for gradual rollouts
   */
  getFeatureFlags: async (req: Request, res: Response) => {
    const auth = validateAuth(req);
    if (!auth || !['admin', 'superadmin'].includes(auth.role)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    try {
      const { data, error } = await (supabase
        .from('feature_flags' as any)
        .select('*')
        .order('key', { ascending: true }) as any);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.json({ flags: data || [] });
    } catch (err: any) {
      res.status(500).json({ error: 'Feature flag retrieval failed' });
    }
  },

  /**
   * POST /api/admin/licenses
   * Bulk generate licenses
   */
  createLicense: async (req: Request, res: Response) => {
    const auth = validateAuth(req);
    if (!auth || !['admin', 'superadmin'].includes(auth.role)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { algo_id, count, duration_days } = req.body;
    
    try {
      const { data, error } = await (supabase
        .from('algo_licenses' as any)
        .insert(Array.from({ length: count || 1 }).map(() => ({
          algo_id,
          license_key: `IFX-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          is_active: true,
          expires_at: new Date(Date.now() + (duration_days || 30) * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString()
        } as any)) as any)
        .select() as any);

      if (error) throw error;
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  /**
   * POST /api/admin/content
   * Create blog or course content
   */
  createContent: async (req: Request, res: Response) => {
    const auth = validateAuth(req);
    if (!auth || !['admin', 'superadmin'].includes(auth.role)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    try {
      const { title, content, type, metadata } = req.body;
      const { data, error } = await (supabase
        .from('content_posts' as any)
        .insert({
          title,
          body: content,
          author_name: 'IFX Research Desk',
          category: type || 'Macro',
          metadata: metadata || {},
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        } as any)
        .select()
        .single() as any);

      if (error) throw error;
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  /**
   * PUT /api/admin/feature-flags/:key
   * Update feature flag value
   */
  updateFeatureFlag: async (req: Request, res: Response) => {
    const auth = validateAuth(req);
    if (!auth || !['admin', 'superadmin'].includes(auth.role)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { key } = req.params;
    const { enabled, value } = req.body;

    try {
      const { error } = await (supabase
        .from('feature_flags' as any)
        .update({ 
          enabled: typeof enabled === 'boolean' ? enabled : true,
          value: value || null,
          updated_at: new Date().toISOString()
        } as any)
        .eq('key', key) as any);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.json({ success: true, message: 'Feature flag updated' });
    } catch (err: any) {
      res.status(500).json({ error: 'Update failed' });
    }
  }
};

// Helper function duplicated here since this file stands alone
const validateAuth = (req: Request) => {
  const role = (req.headers as any)['x-verified-role'];
  const userId = (req.headers as any)['x-user-id'];
  if (!role || !userId) return null;
  return { userId, role };
};
