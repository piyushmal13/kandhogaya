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
  if (typeof process === "undefined" || !process.env) return fallback;
  return process.env[key] || fallback;
};

export const config = {
  get isProduction(): boolean {
    const env = getEnvVal("NODE_ENV");
    return env === "production" || env === "prod";
  },
  get port(): number {
    return parseInt(getEnvVal("PORT", "3000"), 10);
  },
  get jwtSecret(): string {
    const isProd = getEnvVal("NODE_ENV") === "production" || getEnvVal("NODE_ENV") === "prod";
    return getEnvVal("JWT_SECRET") || (isProd ? "" : "dev-only-jwt-secret");
  },
  get supabaseUrl(): string {
    return getEnvVal("VITE_SUPABASE_URL");
  },
  get supabaseAnonKey(): string {
    return getEnvVal("VITE_SUPABASE_ANON_KEY");
  },
  get supabaseServiceKey(): string | undefined {
    return getEnvVal("SUPABASE_SERVICE_ROLE_KEY") || undefined;
  },
  get stripeSecretKey(): string | undefined {
    return getEnvVal("STRIPE_SECRET_KEY") || undefined;
  },
  get appUrl(): string {
    return getEnvVal("APP_URL") || getEnvVal("BASE_URL") || "http://localhost:3000";
  },
  get corsAllow(): string[] {
    return getEnvVal("CORS_ALLOW").split(",").map(s => s.trim()).filter(Boolean);
  }
};

if (!config.supabaseUrl || !config.supabaseAnonKey) {
  logger.error("Missing critical Supabase environment variables.");
}

if (config.isProduction && !config.jwtSecret) {
  logger.error("JWT_SECRET must be set in production.");
  process.exit(1);
}
