import { supabase } from "@/lib/supabase";
import { safeQuery, DataMapper } from "./dataMapper";

/**
 * Institutional CRM & Signal Integration Layer
 * Standardizes interest-discovery and lead-capture events across the platform.
 * Prepared for external CRM (HubSpot/Salesforce) synchronization.
 */
export const CRMService = {
  /**
   * Captures a high-intent discovery signal (Lead).
   */
  async captureLead(email: string, source: string = "Global_Discovery") {
    console.log(`[CRM] Capturing Lead Signal: ${email} (Source: ${source})`);
    return await supabase.from("leads").insert([{ 
      email, 
      source,
      metadata: { captured_at: new Date().toISOString() }
    }]);
  },

  /**
   * Captures a direct inquiry signal (Contact Message).
   */
  async captureInquiry(payload: { full_name: string; email: string; subject: string; message: string }) {
    console.log(`[CRM] Capturing Inquiry Signal: ${payload.email}`);
    return await supabase.from("contact_messages").insert([{
      ...payload,
      metadata: { priority: "Discovery_Standard" }
    }]);
  },

  /**
   * Registers a user for an institutional education session (Webinar).
   */
  async registerForWebinar(userId: string, webinarId: string) {
    console.log(`[CRM] Registering User ${userId} for Webinar ${webinarId}`);
    return await supabase.from("webinar_registrations").insert([{ 
      user_id: userId, 
      webinar_id: webinarId 
    }]);
  }
};
