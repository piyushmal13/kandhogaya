import { Request, Response, NextFunction } from "express";
import { AdminService } from "../services/adminService";
import { logger } from "../config";

export const AdminController = {
  /**
   * Fetches high-level CRM and platform statistics for admin command.
   */
  getDashboardStats: async (req: any, res: Response, next: NextFunction) => {
    try {
      if (req.user?.role !== "admin") return res.status(403).json({ error: "Access Denied: Insufficient Clearance" });
      const stats = await AdminService.getStats(req.supabase);
      res.json(stats);
    } catch (err: any) {
      logger.error({ err: err.message }, "AdminController.getDashboardStats Failure");
      next(err);
    }
  },

  /**
   * Fetches all registered agents.
   */
  getAgents: async (req: any, res: Response, next: NextFunction) => {
    try {
      if (req.user?.role !== "admin") return res.status(403).json({ error: "Access Denied" });
      const agents = await AdminService.getAgents(req.supabase);
      res.json(agents);
    } catch (err: any) {
      logger.error({ err: err.message }, "AdminController.getAgents Failure");
      next(err);
    }
  },

  /**
   * Manually creates a new bot license.
   */
  createLicense: async (req: any, res: Response, next: NextFunction) => {
    try {
      if (req.user?.role !== "admin") return res.status(403).json({ error: "Access Denied" });
      const license = await AdminService.createLicense(req.supabase, req.body);
      res.json(license);
    } catch (err: any) {
      logger.error({ err: err.message }, "AdminController.createLicense Failure");
      next(err);
    }
  },

  /**
   * Creates a new content post.
   */
  createContent: async (req: any, res: Response, next: NextFunction) => {
    try {
      if (req.user?.role !== "admin") return res.status(403).json({ error: "Access Denied" });
      const result = await AdminService.createContent(req.supabase, {
        ...req.body,
        author_id: req.user.id
      });
      res.json(result);
    } catch (err: any) {
      logger.error({ err: err.message }, "AdminController.createContent Failure");
      next(err);
    }
  }
};
