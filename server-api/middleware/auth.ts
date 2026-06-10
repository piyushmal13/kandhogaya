import { Request, Response, NextFunction } from "express";
import { createAuthedClient, supabaseAdmin, safeQuery } from "../utils/supabase";
import { logger } from "../config";

export interface AuthenticatedRequest extends Request {
  user?: any;
  supabase?: any;
}

const normalizeRole = (role: unknown): string | null => {
  const validRoles = ["user", "admin", "agent", "sales_agent", "support", "analyst"];
  return typeof role === "string" && validRoles.includes(role) ? role : null;
};

const resolveUserRole = async (authUser: any, authedClient: any): Promise<string> => {
  const appMetadataRole = normalizeRole(authUser.app_metadata?.role);
  
  try {
    const data = await safeQuery<any>(
      () => supabaseAdmin.from("users").select("role").eq("id", authUser.id).maybeSingle(),
      "resolveUserRole"
    );

    return normalizeRole(data?.role) || appMetadataRole || "user";
  } catch (err) {
    logger.warn({ userId: authUser.id }, "Database role resolution failed, falling back to metadata");
    return appMetadataRole || "user";
  }
};

export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized: No token provided" });

  try {
    const authClient = createAuthedClient(token);
    const { data: { user: authUser }, error: authError } = await authClient.auth.getUser(token);
    
    if (authError || !authUser) {
      throw authError || new Error("User not found");
    }
    
    req.supabase = authClient;
    const role = await resolveUserRole(authUser, req.supabase);

    req.user = { ...authUser, role };
    next();
  } catch (e: any) {
    logger.warn({ err: e.message }, "Authentication failed");
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
