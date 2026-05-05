import { supabase } from "@/lib/supabase";

/**
 * Institutional CRM & Signal Integration Layer (v2.5)
 * 
 * Standardizes interest-discovery and lead-capture events across the platform.
 * Implements "Upsert-and-Update" logic to maintain single-source-of-truth for leads.
 */
export const CRMService = {
  /**
   * Captures a high-intent discovery signal (Lead).
   * Implements upsert logic to track returning institutional interests.
   */
  async captureLead(email: string, source: string = "Global_Discovery", actionDetail?: string) {
    // 1. Fetch existing lead to preserve metadata if possible
    const { data: existing } = await supabase
      .from("leads")
      .select("crm_metadata, score")
      .eq("email", email)
      .maybeSingle();

    const newMetadata = {
      ...(existing?.crm_metadata || {}),
      last_action: actionDetail || source,
      last_action_at: new Date().toISOString(),
      [new Date().getTime()]: actionDetail || source // Simple activity log
    };

    return await supabase.from("leads").upsert({ 
      email, 
      source,
      last_action_at: new Date().toISOString(),
      crm_metadata: newMetadata,
      score: (existing?.score || 0) + 1, // Increase interest score
    }, { onConflict: 'email' });
  },

  /**
   * Captures a direct inquiry signal (Contact Message).
   */
  async captureInquiry(payload: { name: string; email: string; subject: string; message: string }) {
    // 1. Sync to CRM Leads first
    await this.captureLead(payload.email, "Contact_Form", `Sent Inquiry: ${payload.subject}`);

    // 2. Log message
    return await supabase.from("contact_messages").insert([{
      name: payload.name,
      email: payload.email,
      subject: payload.subject,
      message: payload.message
    }]);
  },

  /**
   * Registers a user for an institutional education session (Webinar).
   */
  async registerForWebinar(userId: string, webinarId: string, email: string, webinarTitle?: string) {
    // 1. Sync to CRM Leads
    await this.captureLead(email, "Webinar_Registration", `Registered for: ${webinarTitle || webinarId}`);

    // 2. Perform registration
    return await supabase.from("webinar_registrations").insert([{ 
      user_id: userId, 
      webinar_id: webinarId,
      email: email,
      payment_status: 'completed'
    }]);
  }
};
