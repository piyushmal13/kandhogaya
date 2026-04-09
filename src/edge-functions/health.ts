import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * GET /api/health
 * Institutional resilience heartbeat — always live, no DB access.
 * Returns build version (git SHA), timestamp, and environment tier.
 */
export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    status: 'ok',
    timestamp: Date.now(),
    version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? 'dev',
    env: process.env.NODE_ENV ?? 'unknown',
    platform: 'IFX Trades Institutional Edge',
  });
}
