import { supabase } from "../../lib/supabase";

export interface ExecutiveStats {
  revenueToday: number;
  revenueMTD: number;
  activeUsers: number;
  conversionRate: number;
  systemHealth: string;
}

/**
 * Admin Revenue Service
 * Handles institutional revenue discovery and financial auditing.
 */
export const adminRevenueService = {
  /**
   * Discovers executive intelligence for the CEO Terminal.
   */
  getExecutiveIntelligence: async (): Promise<ExecutiveStats> => {
    try {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      // 1. Revenue Realization
      const { data: sales, error: salesError } = await supabase
        .from('sales_tracking')
        .select('sale_amount, created_at');

      if (salesError) {
        console.error("[Institutional Revenue Recovery]: Financial signal lost.", salesError);
      }

      const salesData = sales || [];
      const today = salesData
        .filter(s => s.created_at >= startOfDay)
        .reduce((sum, s) => sum + s.sale_amount, 0);
      
      const mtd = salesData
        .filter(s => s.created_at >= startOfMonth)
        .reduce((sum, s) => sum + s.sale_amount, 0);

      // 2. Engagement Discovery
      const { count: users, error: userError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      if (userError) {
        console.error("[Institutional CRM Recovery]: User identity signal lost.", userError);
      }

      const { count: converted, error: pipelineError } = await supabase
        .from('sales_pipeline')
        .select('*', { count: 'exact', head: true })
        .eq('stage', 'converted');

      if (pipelineError) {
        console.error("[Institutional CRM Recovery]: Pipeline signal lost.", pipelineError);
      }

      // 3. Health Signals
      const { count: errors, error: logError } = await supabase
        .from('system_logs')
        .select('*', { count: 'exact', head: true })
        .eq('severity', 'critical');

      if (logError) {
        console.error("[Institutional Cluster Recovery]: Health signal lost.", logError);
      }

      return {
        revenueToday: today || 0,
        revenueMTD: mtd || 0,
        activeUsers: users || 0,
        conversionRate: users ? ((converted || 0) / users) * 100 : 0,
        systemHealth: (errors || 0) > 0 ? "Critical Action Required" : "Optimal"
      };
    } catch (err) {
      console.error("[adminRevenueService] Discovery Failed:", err);
      return {
        revenueToday: 0,
        revenueMTD: 0,
        activeUsers: 0,
        conversionRate: 0,
        systemHealth: "Unknown"
      };
    }
  }
};
