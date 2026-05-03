import { Request, Response, NextFunction } from "express";
import { supabaseAdmin, safeQuery, createAuthedClient } from "../utils/supabase";
import { logger } from "../config";

let isMaintenanceMode = false;
let lastCheck = 0;
const CACHE_TTL = 30000; // 30 seconds

async function checkMaintenanceStatus(): Promise<boolean> {
  const now = Date.now();
  if (now - lastCheck < CACHE_TTL) return isMaintenanceMode;

  try {
    const flag = await safeQuery<any>(
      () => supabaseAdmin
        .from('platform_flags')
        .select('value')
        .eq('key', 'maintenance_mode')
        .single(),
      "MaintenanceMiddleware.checkStatus"
    );
    
    isMaintenanceMode = flag?.value || false;
    lastCheck = now;
  } catch (err: any) {
    logger.error({ err: err.message }, "Failed to fetch maintenance status");
  }
  
  return isMaintenanceMode;
}

/**
 * Rejects requests if maintenance mode is active, unless the user is an admin.
 * Attempts to resolve user if a token is present but does not fail if it isn't (for public routes).
 */
export const maintenanceGuard = async (req: any, res: Response, next: NextFunction) => {
  const maintenanceActive = await checkMaintenanceStatus();
  
  if (!maintenanceActive) return next();

  // If maintenance is active, check if user is admin
  const token = req.headers.authorization?.split(" ")[1];
  
  if (token) {
    try {
      // If we already have req.user (from previous authenticate middleware), use it
      if (req.user?.role === "admin") return next();

      // Otherwise, try a quick resolution
      const authClient = createAuthedClient(token);
      const { data: { user } } = await authClient.auth.getUser(token);
      
      if (user) {
        const { data: userData } = await supabaseAdmin.from("users").select("role").eq("id", user.id).maybeSingle();
        if (userData?.role === "admin" || user.app_metadata?.role === "admin") {
          return next();
        }
      }
    } catch (e) {
      // Ignore resolution errors during maintenance, we'll just reject
    }
  }

  return res.status(503).json({
    error: "System Maintenance",
    message: "The IFX Sovereign Node is currently undergoing scheduled maintenance. Please try again shortly.",
    status: "maintenance"
  });
};
