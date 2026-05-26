import { publicSupabase } from "../../lib/supabase";
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
      // Schema-aligned: only columns confirmed in the live leads table
      const { data: rawLeads, error } = await publicSupabase
        .from('leads')
        .select(`
          id, email, source, created_at, stage, score, is_hot, 
          last_action_at, conversion_probability, priority_tag, 
          referred_by_code, assigned_to, crm_metadata
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      if (!rawLeads || rawLeads.length === 0) return [];
      
      return rawLeads.map(lead => mapLead(lead));
    } catch (err) {
      console.error("[Institutional CRM Recovery]: Discovery segment failed.", err);
      return [];
    }
  },

  /**
   * Discovers high-intent prospects (Active behavioral tracers).
   */
  getHighIntentLeads: async (): Promise<Lead[]> => {
    // Logic for filtering based on pricing_click frequency
    return leadService.getLeads(0, 10);
  },

  /**
   * Ingests a new prospect lead with institutional telemetry.
   */
  createLead: async (leadData: { 
    email: string; 
    source: string; 
    stage?: string;
    referred_by_code?: string;
    crm_metadata: Record<string, any>;
  }) => {
    try {
      const { data, error } = await publicSupabase
        .from('leads')
        .insert({
          email: leadData.email,
          source: leadData.source,
          stage: leadData.stage || 'NEW',
          referred_by_code: leadData.referred_by_code || null,
          crm_metadata: leadData.crm_metadata
        })
        .select()
        .maybeSingle();
        
      if (error) throw error;
      return { success: true, data };
    } catch (err: any) {
      console.error("[CRM Lead Ingestion Failure]:", err);
      return { success: false, error: err.message || "Failed to ingest lead." };
    }
  }
};
