import { supabaseAdmin, safeQuery } from "../utils/supabase";
import { logger } from "../config";

export const RequestService = {
  /**
   * Submits a custom engineering (Deep Coding) request.
   * Persists as a high-intent lead with specific CRM metadata.
   */
  submitDeepCodingRequest: async (data: {
    name: string;
    email: string;
    project_type: string;
    description: string;
    budget?: string;
    timeline?: string;
    user_id?: string;
  }) => {
    const { name, email, project_type, description, budget, timeline, user_id } = data;

    return safeQuery(
      async () => {
        // 1. Upsert Lead (Institutional CRM)
        const { data: lead, error } = await supabaseAdmin
          .from('leads')
          .upsert({
            email,
            user_id,
            source: 'deep_coding_terminal',
            stage: 'NEW_REQUEST',
            is_hot: true,
            priority_tag: 'INSTITUTIONAL_CUSTOM',
            crm_metadata: {
              full_name: name,
              project_type,
              description,
              budget,
              timeline,
              submitted_at: new Date().toISOString()
            }
          }, { onConflict: 'email' })
          .select()
          .single();

        if (error) throw error;

        // 2. Log System Event
        await supabaseAdmin.from('system_logs').insert({
          type: 'CUSTOM_REQUEST',
          severity: 'info',
          message: `New Deep Coding request from ${email}: ${project_type}`,
          user_id,
          metadata: { lead_id: lead.id }
        });

        return { success: true, lead_id: lead.id };
      },
      "RequestService.submitDeepCodingRequest"
    );
  }
};
