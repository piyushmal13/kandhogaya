import { supabaseAdmin as supabase } from '@/lib/supabase';
import type { Request, Response } from 'express';

/**
 * RequestController — Custom Services Request Management
 * Routes:
 *   POST   /api/custom-request      - Submit deep coding/custom strategy request
 *   GET    /api/custom-request/:id  - Retrieve request status (auth required)
 *   GET    /api/custom-request      - List all requests (admin only)
 *   PUT    /api/custom-request/:id  - Update request status (admin only)
 */
export const RequestController = {
  /**
   * POST /api/custom-request
   * Public endpoint for submitting custom coding/strategy requests
   * Body: {
   *   full_name, email, service_type, description, budget, timeline, attachment_url?
   * }
   */
  submitDeepCoding: async (req: Request, res: Response) => {
    const {
      full_name,
      email,
      service_type,
      description,
      budget,
      timeline,
      attachment_url,
      phone
    } = req.body;

    // Validation
    if (!full_name || !email || !service_type || !description) {
      return res.status(400).json({ 
        error: 'Missing required fields: full_name, email, service_type, description' 
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    try {
      // Check for spam rate limiting (IP-based)
      const clientIp = req.ip || req.connection?.remoteAddress || 'unknown';
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      
      const { count: recentCount } = await supabase
        .from('custom_requests')
        .select('*', { count: 'exact' })
        .eq('ip_address', clientIp)
        .gte('created_at', oneHourAgo);

      if (recentCount && recentCount > 5) {
        return res.status(429).json({ 
          error: 'Too many requests. Please try again later.' 
        });
      }

      // Determine priority based on service_type and budget
      let priority = 'MEDIUM';
      if (service_type.includes('VIP') || (budget && budget >= 10000)) {
        priority = 'CRITICAL';
      } else if (service_type.includes('Premium') || (budget && budget >= 5000)) {
        priority = 'HIGH';
      } else if (service_type.includes('Basic')) {
        priority = 'LOW';
      }

      // Create request record
      const { data, error } = await supabase
        .from('custom_requests')
        .insert({
          full_name,
          email,
          service_type,
          description,
          budget: budget || null,
          timeline: timeline || null,
          phone: phone || null,
          attachment_url: attachment_url || null,
          ip_address: clientIp,
          user_agent: req.headers['user-agent'] || null,
          priority,
          status: 'new',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('[Custom Request Error]:', error);
        return res.status(500).json({ 
          error: 'Failed to submit request. Please try again.' 
        });
      }

      // Trigger CRM automation pipeline
      await triggerCRMPipeline(data);

      // Send confirmation email (async)
      await sendConfirmationEmail(email, data.id);

      res.status(201).json({ 
        success: true, 
        message: 'Request submitted successfully. Our team will contact you within 24 hours.',
        request_id: data.id,
        estimated_response: getEstimatedResponseTime(priority)
      });
    } catch (err: any) {
      console.error('[Custom Request Exception]:', err);
      res.status(500).json({ error: 'Service temporarily unavailable' });
    }
  },

  /**
   * GET /api/custom-request/:id
   * Authenticated user can check their request status
   */
  getRequestById: async (req: Request, res: Response) => {
    const auth = validateAuth(req);
    const { id } = req.params;

    try {
      const { data, error } = await supabase
        .from('custom_requests')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        return res.status(404).json({ error: 'Request not found' });
      }

      // If authenticated, verify ownership or admin role
      if (auth) {
        const isAdmin = ['admin', 'superadmin', 'analyst'].includes(auth.role);
        const isOwner = data.email === (await getEmailById(auth.userId));
        
        if (!isAdmin && !isOwner) {
          return res.status(403).json({ error: 'Access denied' });
        }
      } else {
        // Guest access: Only allow check via email token (simplified: just return generic)
        return res.status(401).json({ 
          error: 'Authentication required to view request details' 
        });
      }

      res.json({
        request: {
          id: data.id,
          service_type: data.service_type,
          description: data.description,
          budget: data.budget,
          timeline: data.timeline,
          status: data.status,
          priority: data.priority,
          created_at: data.created_at,
          updated_at: data.updated_at,
          // Don't expose internal fields
          assigned_to: data.assigned_to ? 'Agent Assigned' : null
        }
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Request retrieval failed' });
    }
  },

  /**
   * GET /api/custom-request
   * Admin only - list all requests with filtering
   */
  getAllRequests: async (req: Request, res: Response) => {
    const auth = validateAuth(req);
    if (!auth || !['admin', 'superadmin', 'analyst'].includes(auth.role)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const status = url.searchParams.get('status');
    const priority = url.searchParams.get('priority');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100);
    const offset = parseInt(url.searchParams.get('offset') || '0');

    try {
      let query = supabase
        .from('custom_requests')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (status) query = query.eq('status', status);
      if (priority) query = query.eq('priority', priority);

      const { data, error, count } = await query
        .range(offset, offset + limit - 1);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      // Sanitize data (remove internal IP/User-Agent from public response)
      const sanitized = (data || []).map((req: any) => ({
        id: req.id,
        full_name: req.full_name,
        email: req.email,
        service_type: req.service_type,
        budget: req.budget,
        timeline: req.timeline,
        status: req.status,
        priority: req.priority,
        created_at: req.created_at,
        updated_at: req.updated_at,
        assigned_to: req.assigned_to
      }));

      res.json({
        requests: sanitized,
        total: count || 0,
        pagination: { limit, offset, total: count || 0 }
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Request retrieval failed' });
    }
  },

  /**
   * PUT /api/custom-request/:id
   * Update request status (assigned, in-progress, completed, rejected)
   */
  updateRequest: async (req: Request, res: Response) => {
    const auth = validateAuth(req);
    if (!auth || !['admin', 'superadmin', 'analyst'].includes(auth.role)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    const { status, assigned_to, notes } = req.body;

    const validStatuses = ['new', 'reviewing', 'quoted', 'in_progress', 'completed', 'rejected'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    try {
      const updates: any = { updated_at: new Date().toISOString() };
      if (status) updates.status = status;
      if (assigned_to) updates.assigned_to = assigned_to;
      if (notes) updates.notes = notes;

      const { error } = await supabase
        .from('custom_requests')
        .update(updates)
        .eq('id', id);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      // Send notification to user if status changed to 'quoted' or 'in_progress'
      if (status === 'quoted' || status === 'in_progress') {
        const { data: request } = await supabase
          .from('custom_requests')
          .select('email')
          .eq('id', id)
          .single();
        
        if (request) {
          await sendStatusUpdateEmail(request.email, id, status);
        }
      }

      res.json({ success: true, message: 'Request updated' });
    } catch (err: any) {
      res.status(500).json({ error: 'Update failed' });
    }
  }
};

// Helper functions
const validateAuth = (req: Request) => {
  const role = req.headers.get('x-verified-role');
  const userId = req.headers.get('x-user-id');
  if (!role || !userId) return null;
  return { userId, role };
};

const getEmailById = async (userId: string): Promise<string> => {
  const { data } = await supabase
    .from('users')
    .select('email')
    .eq('id', userId)
    .single();
  return data?.email || '';
};

const triggerCRMPipeline = async (request: any) => {
  // Create lead in CRM pipeline
  try {
    await supabase.from('leads').insert({
      email: request.email,
      full_name: request.full_name,
      subject: `Custom Request: ${request.service_type}`,
      message: request.description,
      source: 'custom_request',
      status: 'new',
      stage: 'QUALIFIED',
      score: 80,
      metadata: {
        request_id: request.id,
        budget: request.budget,
        timeline: request.timeline,
        priority: request.priority
      }
    });
  } catch (err) {
    console.error('[CRM Pipeline Error]:', err);
  }
};

const sendConfirmationEmail = async (email: string, requestId: string) => {
  // Integration with email service (Resend/SendGrid) would go here
  console.log(`[Email] Confirmation sent to ${email} for request ${requestId}`);
};

const sendStatusUpdateEmail = async (email: string, requestId: string, status: string) => {
  console.log(`[Email] Status update ${status} sent to ${email} for request ${requestId}`);
};

const getEstimatedResponseTime = (priority: string): string => {
  switch (priority) {
    case 'CRITICAL': return '2-4 hours';
    case 'HIGH': return '8-12 hours';
    case 'MEDIUM': return '24 hours';
    case 'LOW': return '48 hours';
    default: return '24 hours';
  }
};
