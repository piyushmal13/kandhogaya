import { Request, Response, NextFunction } from "express";
import { logger } from "../config";
import rateLimit from "express-rate-limit";

/**
 * Global Error Handler
 */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  
  logger.error({ 
    err: {
      message: err.message,
      stack: err.stack,
      status
    },
    url: req.url,
    method: req.method
  }, "Unhandled API Error");

  res.status(status).json({ 
    error: message,
    correlationId: req.headers['x-request-id'] // Useful for Sentry/Logtail correlation
  });
};

/**
 * Global Rate Limiter
 */
export const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 600,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please slow down." }
});

/**
 * Sensitive Endpoint Limiter (Auth/Payments/Licenses)
 */
export const sensitiveLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Security threshold reached. Please try again later." }
});
