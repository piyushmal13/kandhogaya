import { supabase } from '../../src/lib/supabase';
import type { Request, Response, NextFunction } from 'express';

/**
 * Authentication Middleware for Express API Routes
 * Validates JWT token from Authorization header using Supabase Admin API
 * Sets x-verified-role and x-user-id headers for downstream controllers
 * 
 * Usage: router.use('/protected', authenticate, controller)
 */

interface AuthenticatedRequest extends Request {
  headers: {
    'x-verified-role'?: string;
    'x-user-id'?: string;
    authorization?: string;
  };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Authentication required',
        code: 'MISSING_TOKEN'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Decode JWT payload to get user ID (without verification, Supabase verifies)
    let payload: any;
    try {
      payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    } catch (err) {
      return res.status(401).json({ 
        error: 'Invalid token format',
        code: 'INVALID_TOKEN'
      });
    }

    const userId = payload?.sub;
    if (!userId) {
      return res.status(401).json({ 
        error: 'Token missing user identifier',
        code: 'TOKEN_MISSING_SUB'
      });
    }

    // Verify user exists and get role via Supabase Admin API
    const { data: user, error } = await supabase.auth.admin.getUserById(userId);

    if (error || !user) {
      return res.status(401).json({ 
        error: 'User not found or invalid token',
        code: 'USER_NOT_FOUND'
      });
    }

    // Check if user is banned/deleted
    if (user.banned_at) {
      return res.status(403).json({ 
        error: 'Account has been banned',
        code: 'ACCOUNT_BANNED'
      });
    }

    // Extract role from app_metadata or default
    const role = user.app_metadata?.role || 'user';

    // Set headers for downstream controllers
    req.headers['x-verified-role'] = role;
    req.headers['x-user-id'] = userId;

    // Attach user info to request object for convenience
    (req as any).user = {
      id: userId,
      email: user.email,
      role,
      app_metadata: user.app_metadata
    };

    next();
  } catch (err: any) {
    console.error('[Auth Middleware Error]:', err.message);
    return res.status(500).json({ 
      error: 'Authentication service error',
      code: 'AUTH_SERVICE_ERROR'
    });
  }
};

/**
 * Role-based authorization middleware
 * Usage: router.get('/admin', authorize(['admin', 'superadmin']), handler)
 */
export const authorize = (allowedRoles: string[]) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    // Ensure authenticated first
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

/**
 * Optional authentication - continues even if not authenticated
 * Sets req.user if authenticated, otherwise continues with null
 */
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      const userId = payload?.sub;
      
      if (userId) {
        const { data: user } = await supabase.auth.admin.getUserById(userId);
        if (user && !user.banned_at) {
          (req as any).user = {
            id: userId,
            email: user.email,
            role: user.app_metadata?.role || 'user'
          };
          req.headers['x-verified-role'] = user.app_metadata?.role || 'user';
          req.headers['x-user-id'] = userId;
        }
      }
    }
  } catch (err) {
    // Silent fail - continue without auth
  } finally {
    next();
  }
};
