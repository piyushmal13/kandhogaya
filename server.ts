import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import helmet from "helmet";
import compression from "compression";
import fs from "node:fs";
import { injectMetaTags } from "./src/utils/seoRoutes";

// Modular Imports
import { config, logger } from "./server-api/config";
import { authenticate } from "./server-api/middleware/auth";
import { errorHandler, globalLimiter, sensitiveLimiter } from "./server-api/middleware";
import { maintenanceGuard } from "./server-api/middleware/maintenance";
import { ContentController } from "./server-api/controllers/ContentController";
import { LicenseController } from "./server-api/controllers/LicenseController";
import { AdminController } from "./server-api/controllers/AdminController";
import { SystemController } from "./server-api/controllers/SystemController";
import { RequestController } from "./server-api/controllers/RequestController";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();

  // --- SOVEREIGN SECURITY & PERFORMANCE ---
  app.use(helmet({
    contentSecurityPolicy: !config.isProduction ? false : {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "img-src": ["'self'", "data:", "https://*.supabase.co", "file:", "*"],
        "script-src": ["'self'", "'unsafe-inline'", "https://*.supabase.co"],
        "connect-src": ["'self'", "https://*.supabase.co", "wss://*.supabase.co"],
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
  apiRouter.post("/ai/advisor", sensitiveLimiter, RequestController.askAiAdvisor);

  // Administrative Command
  apiRouter.get("/admin/stats", authenticate, AdminController.getDashboardStats);
  apiRouter.get("/admin/agents", authenticate, AdminController.getAgents);
  apiRouter.post("/admin/licenses", authenticate, AdminController.createLicense);
  apiRouter.post("/admin/content", authenticate, AdminController.createContent);

  // --- LOCAL SUPABASE PROXY (Mimics Vercel rewrites for local development) ---
  app.all("/supabase-proxy/*", async (req, res) => {
    try {
      const targetUrl = config.supabaseUrl;
      if (!targetUrl || targetUrl.includes('placeholder')) {
        return res.status(500).json({ error: "Supabase URL is not configured in local environment." });
      }

      const path = req.originalUrl.replace(/^\/supabase-proxy/, "");
      const destination = `${targetUrl}${path}`;

      const headers = { ...req.headers } as any;
      delete headers.host;
      delete headers.connection;

      const fetchOptions: any = {
        method: req.method,
        headers,
      };

      if (req.method !== "GET" && req.method !== "HEAD" && req.body && Object.keys(req.body).length > 0) {
        fetchOptions.body = JSON.stringify(req.body);
      }

      const response = await fetch(destination, fetchOptions);
      const data = await response.text();

      response.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });

      res.status(response.status).send(data);
    } catch (error: any) {
      logger.error(`[Local Supabase Proxy Error]: ${error.message}`);
      res.status(500).send(`Supabase proxy failed: ${error.message}`);
    }
  });

  app.use("/api", apiRouter);
  app.use(errorHandler);


  // --- FRONTEND INTEGRATION ---
  if (config.isProduction) {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath, { index: false }));
    app.get("*", (req, res) => {
      const indexPath = path.join(distPath, "index.html");
      if (fs.existsSync(indexPath)) {
        let html = fs.readFileSync(indexPath, 'utf8');
        html = injectMetaTags(html, req.originalUrl);
        res.send(html);
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
        html = injectMetaTags(html, req.originalUrl);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e) { next(e); }
    });
  }

  app.listen(config.port, "0.0.0.0", () => {
    logger.info(`[IFX SOVEREIGN NODE]: OPERATIONAL ON PORT ${config.port}`);
  });
}

startServer().catch(err => {
  console.error("[CRITICAL SHUTDOWN]:", err);
  process.exit(1);
});
