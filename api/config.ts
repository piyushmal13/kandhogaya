import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true
    }
  }
});

// Safely retrieve environment configuration values
const getEnvVal = (key: string, fallback = ""): string => {
  return typeof process !== "undefined" && process.env ? (process.env[key] || fallback) : fallback;
};

const isProdTier = getEnvVal("NODE_ENV") === "production" || getEnvVal("NODE_ENV") === "prod";

export const config = {
  isProduction: isProdTier,
  port: parseInt(getEnvVal("PORT", "3000"), 10),
  jwtSecret: getEnvVal("JWT_SECRET") || (isProdTier ? "" : "dev-only-jwt-secret"),
  supabaseUrl: getEnvVal("VITE_SUPABASE_URL"),
  supabaseAnonKey: getEnvVal("VITE_SUPABASE_ANON_KEY"),
  supabaseServiceKey: getEnvVal("SUPABASE_SERVICE_ROLE_KEY") || undefined,
  stripeSecretKey: getEnvVal("STRIPE_SECRET_KEY") || undefined,
  appUrl: getEnvVal("APP_URL") || getEnvVal("BASE_URL") || "http://localhost:3000",
  corsAllow: (getEnvVal("CORS_ALLOW")).split(",").map(s => s.trim()).filter(Boolean)
};

if (!config.supabaseUrl || !config.supabaseAnonKey) {
  logger.error("Missing critical Supabase environment variables.");
}

if (config.isProduction && !config.jwtSecret) {
  logger.error("JWT_SECRET must be set in production.");
  process.exit(1);
}
