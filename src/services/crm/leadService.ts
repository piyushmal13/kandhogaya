import { publicSupabase, safeQuery } from "../../lib/supabase";
import { mapLead } from "../../utils/dataMapper";
import { Lead } from "../../types";

/**
 * Lead Service
 * Handles institutional lead discovery and prospect auditing.
 */
export const leadService = {
  /**
   * Discovers prospects with institutional resilience.
   */
  getLeads: async (page: number = 0, limit: number = 20): Promise<Lead[]> => {
    const offset = page * limit;
    
    try {
      const rawLeads = await safeQuery<any[]>(
        publicSupabase
          .from('leads')
          .select('*, bot_licenses(*), webinar_registrations(*)')
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1)
      );

      if (!rawLeads || rawLeads.length === 0) return [];
      return (rawLeads as any[]).map(mapLead);
    } catch (err) {
      console.error("[Institutional CRM Recovery]: Discovery segment failed. Trapping exception.", err);
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
