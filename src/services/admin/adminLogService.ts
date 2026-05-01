import { supabase } from "../../lib/supabase";

export interface SystemLog {
  id: string;
  type: string;
  message: string;
  metadata: any;
  user_id: string | null;
  severity: "info" | "warning" | "critical";
  created_at: string;
}

/**
 * Admin Log Service
 * Handles institutional system health monitoring and audit trails.
 */
export const adminLogService = {
  /**
   * Discovers system logs with pagination.
   */
  getLogs: async (page: number = 0, limit: number = 20, severity?: string): Promise<SystemLog[]> => {
    try {
      const offset = page * limit;
      let query = supabase
        .from('system_logs')
        .select('id, type, message, metadata, user_id, severity, created_at')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (severity) {
        query = query.eq('severity', severity);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data || [];
    } catch (err) {
      console.error("[adminLogService] Discovery Failed:", err);
      return [];
    }
  },

  /**
   * Discovers critical system alerts.
   */
  getCriticalAlerts: async (): Promise<SystemLog[]> => {
    return adminLogService.getLogs(0, 10, "critical");
  }
};
