import { createAuthedClient, supabaseAdmin } from '@/lib/supabase';
import type { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: any;
  supabase?: any;
}

const normalizeRole = (role: unknown): string | null => {
  const validRoles = ['user', 'admin', 'agent', 'sales_agent', 'support', 'analyst'];
  return typeof role === 'string' && validRoles.includes(role) ? role : null;
};

const resolveUserRole = async (authUser: any): Promise<string> => {
  const appMetadataRole = normalizeRole(authUser.app_metadata?.role);
  try {
    const { data } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', authUser.id)
      .single();
    return normalizeRole(data?.role) || appMetadataRole || 'user';
  } catch (err) {
    console.warn({ userId: authUser.id }, 'Database role resolution failed, falling back to metadata');
    return appMetadataRole || 'user';
  }
};

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const authClient = createAuthedClient(token);
    const { data: { user: authUser }, error: authError } = await authClient.auth.getUser(token);

    if (authError || !authUser) {
      throw authError || new Error('User not found');
    }

    req.supabase = authClient;
    const role = await resolveUserRole(authUser);

    req.user = { ...authUser, role };
    next();
  } catch (e: any) {
    console.warn({ err: e.message }, 'Authentication failed');
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const authorize = (allowedRoles: string[]) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.headers['x-verified-role'] || !req.headers['x-user-id']) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userRole = req.headers['x-verified-role'];

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        required_roles: allowedRoles,
        current_role: userRole,
        code: 'FORBIDDEN'
      });
    }

    next();
  };
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const authClient = createAuthedClient(token);
      const { data: { user: authUser } } = await authClient.auth.getUser(token);

      if (authUser && !authUser.banned_at) {
        const role = await resolveUserRole(authUser);
        (req as any).user = {
          id: authUser.id,
          email: authUser.email,
          role,
          app_metadata: authUser.app_metadata
        };
        req.headers['x-verified-role'] = role;
        req.headers['x-user-id'] = authUser.id;
      }
    }
  } catch (err) {
    // Silent fail - continue without auth
  } finally {
    next();
  }
};
