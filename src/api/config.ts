import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Environment configuration
 */
const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 3000;

// Validate critical environment variables
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];
const missingVars = requiredEnvVars.filter(key => !process.env[key]);

if (missingVars.length > 0) {
  console.warn(`[Config] Missing environment variables: ${missingVars.join(', ')}`);
  if (NODE_ENV === 'production') {
    console.error('[FATAL] Missing required environment variables in production');
    process.exit(1);
  }
}

/**
 * Configuration object
 */
export const config = {
  port: PORT,
  env: NODE_ENV,
  isProduction: NODE_ENV === 'production',
  isDevelopment: NODE_ENV === 'development',
  
  // File upload limits
  maxUploadSize: '10mb',
  
  // JWT & Auth
  jwtExpiry: '7d',
  
  // Pagination defaults
  defaultLimit: 20,
  maxLimit: 100
};

/**
 * Logger wrapper - production uses structured logging
 */
export const logger = {
  info: (msg: string, meta?: any) => {
    if (NODE_ENV === 'production') {
      console.log(JSON.stringify({ level: 'info', message: msg, ...meta }));
    } else {
      console.info(`[INFO] ${msg}`, meta || '');
    }
  },
  
  warn: (msg: string, meta?: any) => {
    if (NODE_ENV === 'production') {
      console.log(JSON.stringify({ level: 'warn', message: msg, ...meta }));
    } else {
      console.warn(`[WARN] ${msg}`, meta || '');
    }
  },
  
  error: (msg: string, error?: Error) => {
    if (NODE_ENV === 'production') {
      console.error(JSON.stringify({ 
        level: 'error', 
        message: msg, 
        error: error?.message,
        stack: error?.stack 
      }));
    } else {
      console.error(`[ERROR] ${msg}`, error?.stack || '');
    }
  }
};

/**
 * Helper: Ensure directory exists
 */
export const ensureDir = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

/**
 * Helper: Read JSON file safely
 */
export const readJson = (filePath: string, fallback: any = {}) => {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (err) {
    console.error(`Failed to read ${filePath}:`, err);
  }
  return fallback;
};
