import type { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

// General API rate limiting - generous for authenticated users
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  validate: false
});

export const sensitiveLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Rate limit exceeded for this operation.' },
  keyGenerator: (req: Request) => (req.headers as any)['x-user-id'] || req.ip || 'anonymous',
  validate: false
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many login attempts. Please try again later.' },
  validate: false
});

/**
 * Maintenance mode guard
 * Blocks requests during scheduled maintenance windows
 */
export const maintenanceGuard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check feature flag for maintenance mode
    const { data } = await (supabase.from('feature_flags' as any)
      .select('value')
      .eq('key', 'maintenance_mode')
      .single() as any);

    const isMaintenance = (data as any)?.value?.enabled === true;

    if (isMaintenance && req.method !== 'GET' && req.path !== '/api/health') {
      return res.status(503).json({
        error: 'System maintenance in progress',
        retry_after: 300, // 5 minutes
        message: 'The platform is undergoing scheduled maintenance. Please check back shortly.'
      });
    }

    next();
  } catch (err) {
    // If DB check fails, allow through (fail open)
    next();
  }
};

/**
 * Error handling middleware
 * Centralized error response formatting
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('[API Error]:', {
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString()
  });

  // Don't leak implementation details in production
  const isDev = process.env.NODE_ENV === 'development';
  
  res.status(500).json({
    error: isDev ? err.message : 'Internal server error',
    ...(isDev && { stack: err.stack })
  });
};

/**
 * CORS middleware for API routes
 */
export const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  
  // Allow specific origins in production
  const allowedOrigins = [
    'https://ifxtrades.com',
    'https://app.ifxtrades.com',
    'http://localhost:5173',
    'http://localhost:3000'
  ];

  if (!origin || allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-verified-role, x-user-id');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
};

/**
 * Request validation middleware factory
 * Usage: validateRequest(schema)
 */
export const validateRequest = (schema: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parse(req.body);
      next();
    } catch (err: any) {
      res.status(400).json({
        error: 'Validation failed',
        details: err.errors?.map((e: any) => ({
          field: e.path.join('.'),
          message: e.message
        }))
      });
    }
  };
};

// Re-export supabase for middleware use
import { supabase } from '../../lib/supabase';
