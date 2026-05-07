import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import helmet from "helmet";
import compression from "compression";
import fs from "node:fs";

// Modular Imports
import { config, logger } from "./src/api/config";
import { authenticate } from "./src/api/middleware/auth";
import { errorHandler, globalLimiter, sensitiveLimiter, maintenanceGuard } from "./src/api/middleware";
import { ContentController } from "./src/api/controllers/ContentController";
import { LicenseController } from "./src/api/controllers/LicenseController";
import { AdminController } from "./src/api/controllers/AdminController";
import { SystemController } from "./src/api/controllers/SystemController";
import { RequestController } from "./src/api/controllers/RequestController";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();

  // --- SOVEREIGN SECURITY & PERFORMANCE ---
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "img-src": ["'self'", "data:", "https://*.supabase.co", "file:", "*", "https://*.twelvedata.com"],
        "script-src": ["'self'", "'unsafe-inline'", "https://*.supabase.co"],
        "connect-src": ["'self'", "https://*.supabase.co", "wss://*.supabase.co", "https://api.twelvedata.com", "ws://localhost:*", "http://localhost:*"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));
  app.use(compression());
  app.use(express.json());

  // --- API ROUTING (SOVEREIGN CONTROLLER PATTERN) ---
  const apiRouter = express.Router();
  apiRouter.use(globalLimiter);
  apiRouter.use(maintenanceGuard);

  // System
  apiRouter.get("/health", SystemController.getHealth);
  apiRouter.get("/config", SystemController.getConfig);

  // Institutional Content & Products
  apiRouter.get("/content", ContentController.getPosts);
  apiRouter.get("/content/:slug", ContentController.getPostBySlug);
  apiRouter.get("/webinars", ContentController.getWebinars);
  apiRouter.post("/webinars/register", authenticate, ContentController.registerWebinar);
  apiRouter.get("/products", ContentController.getProducts);

  // Infrastructure Fulfillment
  apiRouter.post("/license/validate", sensitiveLimiter, LicenseController.validateLicense);
  apiRouter.post("/custom-request", RequestController.submitDeepCoding);

  // Administrative Command
  apiRouter.get("/admin/stats", authenticate, AdminController.getDashboardStats);
  apiRouter.get("/admin/agents", authenticate, AdminController.getAgents);
  apiRouter.post("/admin/licenses", authenticate, AdminController.createLicense);
  apiRouter.post("/admin/content", authenticate, AdminController.createContent);

  app.use("/api", apiRouter);
  app.use(errorHandler);

  // --- FRONTEND INTEGRATION ---
  if (config.isProduction) {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath, { index: false }));
    app.get("*", (req, res) => {
      const indexPath = path.join(distPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.send(fs.readFileSync(indexPath, 'utf8'));
      } else {
        res.status(404).send("Protocol Error: Index Manifest Missing");
      }
    });
  } else {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
    app.use("*", async (req, res, next) => {
      try {
        const indexPath = path.join(__dirname, "index.html");
        let html = fs.readFileSync(indexPath, 'utf8');
        html = await vite.transformIndexHtml(req.originalUrl, html);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e) { next(e); }
    });
  }

  const MAX_RETRIES = 5;
  let retryCount = 0;

  const startListening = () => {
    const server = app.listen(config.port, "0.0.0.0", () => {
      logger.info(`[IFX SOVEREIGN NODE]: OPERATIONAL ON PORT ${config.port}`);
    });

    server.on('error', (e: NodeJS.ErrnoException) => {
      if (e.code === 'EADDRINUSE') {
        logger.warn(`[TELEMETRY] PORT ${config.port} IN USE. RETRYING (ATTEMPT ${retryCount + 1}/${MAX_RETRIES})...`);
        if (retryCount < MAX_RETRIES) {
          retryCount++;
          const backoff = Math.pow(2, retryCount) * 1000;
          setTimeout(() => {
            server.close();
            startListening();
          }, backoff);
        } else {
          logger.error(`[CRITICAL] FAILED TO BIND TO PORT ${config.port} AFTER ${MAX_RETRIES} ATTEMPTS.`);
          process.exit(1);
        }
      } else {
        logger.error(`[CRITICAL SHUTDOWN]: ${e}`);
        process.exit(1);
      }
    });

    // Graceful Shutdown
    const gracefulShutdown = () => {
      logger.info("[IFX SOVEREIGN NODE]: INITIATING GRACEFUL SHUTDOWN...");
      server.close(() => {
        logger.info("[IFX SOVEREIGN NODE]: CONNECTIONS CLOSED. TERMINATING PROCESS.");
        process.exit(0);
      });
      setTimeout(() => {
        logger.error("[CRITICAL] FORCE TERMINATING DUE TO HANGING CONNECTIONS.");
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
  };

  startListening();
}

startServer().catch(err => {
  console.error("[CRITICAL SHUTDOWN]:", err);
  process.exit(1);
});
