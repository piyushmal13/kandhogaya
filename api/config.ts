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

export const config = {
  isProduction: process.env.NODE_ENV === "production",
  port: parseInt(process.env.PORT || "3000", 10),
  jwtSecret: process.env.JWT_SECRET || (process.env.NODE_ENV === "production" ? "" : "dev-only-jwt-secret"),
  supabaseUrl: process.env.VITE_SUPABASE_URL || "",
  supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY || "",
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  appUrl: process.env.APP_URL || process.env.BASE_URL || "http://localhost:3000",
  corsAllow: (process.env.CORS_ALLOW || "").split(",").map(s => s.trim()).filter(Boolean)
};

if (!config.supabaseUrl || !config.supabaseAnonKey) {
  logger.error("Missing critical Supabase environment variables.");
}

if (config.isProduction && !config.jwtSecret) {
  logger.error("JWT_SECRET must be set in production.");
  process.exit(1);
}
