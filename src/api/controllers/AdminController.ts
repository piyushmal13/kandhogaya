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
        supabase.from('users').select('count', { count: 'exact' }),
        supabase.from('sales_tracking').select('sum(sale_amount)'),
        supabase.from('webinars').select('count', { count: 'exact' }),
        supabase.from('leads').select('count', { count: 'exact' }),
        supabase.from('bot_licenses').select('count', { count: 'exact' }),
        supabase.from('payments').select('sum(amount)')
      ]);

      // Get last 7 days trend data
      const { data: trendData } = await supabase.rpc('get_revenue_trend', {
        days: 7
      }).catch(() => ({ data: [] }));

      res.json({
        total_users: usersResult.count || 0,
        total_revenue: revenueResult.data?.sum || 0,
        total_webinars: webinarsResult.count || 0,
        total_leads: leadsResult.count || 0,
        total_licenses: licensesResult.count || 0,
        total_orders: ordersResult.data?.sum || 0,
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
      const agents = await Promise.all((data || []).map(async (agent) => {
        const { count } = await supabase
          .from('commissions')
          .select('*', { count: 'exact' })
          .eq('agent_id', agent.id)
          .eq('status', 'PENDING');
        
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
      let query = supabase
        .from('users')
        .select(`
          *,
          entitlements:user_entitlements(*),
          _count:algo_licenses(count)
        `, { count: 'exact' });

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

      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id);

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
      let query = supabase
        .from('leads')
        .select(`
          *,
          assigned_to_user:assigned_to (
            id, full_name, email, role
          )
        `, { count: 'exact' })
        .order('score', { ascending: false })
        .order('created_at', { ascending: false });

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

      const { error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', id);

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
      let query = supabase
        .from('commissions')
        .select(`
          *,
          agent:agent_id (
            user:user_id (full_name, email)
          ),
          product:product_id (name, category)
        `, { count: 'exact' })
        .order('created_at', { ascending: false });

      if (agentId) query = query.eq('agent_id', agentId);
      if (status) query = query.eq('status', status);

      const { data, error, count } = await query
        .range(offset, offset + limit - 1);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      // Calculate summary
      const { data: totalAmount } = await supabase
        .from('commissions')
        .select('sum(amount)')
        .eq('status', 'PENDING');

      res.json({
        commissions: data || [],
        total_pending: totalAmount?.sum || 0,
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
      const { error } = await supabase
        .from('commissions')
        .update({ 
          status: 'PAID',
          paid_at: new Date().toISOString()
        })
        .eq('id', id);

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
      let query = supabase
        .from('system_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (level) query = query.eq('level', level);

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
      const { data, error } = await supabase
        .from('feature_flags')
        .select('*')
        .order('key', { ascending: true });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.json({ flags: data || [] });
    } catch (err: any) {
      res.status(500).json({ error: 'Feature flag retrieval failed' });
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
      const { error } = await supabase
        .from('feature_flags')
        .update({ 
          enabled: typeof enabled === 'boolean' ? enabled : true,
          value: value || null,
          updated_at: new Date().toISOString()
        })
        .eq('key', key);

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
  const role = req.headers.get('x-verified-role');
  const userId = req.headers.get('x-user-id');
  if (!role || !userId) return null;
  return { userId, role };
};
