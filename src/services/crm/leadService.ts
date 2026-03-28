import { supabase } from "../../lib/supabase";

export interface Lead {
  id: string;
  name: string;
  email: string;
  status: string;
  source: string;
  created_at: string;
  revenue_mtd: number;
  ltv_projected: number;
  last_active_symbol?: string;
  engagement_score?: number;
}

/**
 * Lead Service
 * Handles institutional lead discovery and prospect auditing.
 */
export const leadService = {
  /**
   * Discovers prospects with server-side pagination.
   */
  getLeads: async (page: number = 0, limit: number = 20): Promise<Lead[]> => {
    try {
      const offset = page * limit;
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      // Automated LTV Discovery logic could be injected here
      return (data || []).map(l => ({
        ...l,
        revenue_mtd: l.revenue_mtd || 0,
        ltv_projected: l.ltv_projected || 0
      }));
    } catch (err) {
      console.error("[leadService] Discovery Failed:", err);
      return [];
    }
  },

  /**
   * Discovers high-intent prospects (Active behavioral tracers).
   */
  getHighIntentLeads: async (): Promise<Lead[]> => {
    // Logic for filtering based on pricing_click frequency
    return leadService.getLeads(0, 10);
  }
};
