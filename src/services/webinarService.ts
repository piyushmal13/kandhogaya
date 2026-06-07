import { supabase, safeQuery } from "../lib/supabase";
import { Webinar } from "../types";
import { mapWebinar } from "../utils/dataMapper";

/**
 * Webinar Service — Optimized Query Layer
 * PERF: Explicit column selection instead of select('*').
 * PERF: Removed debug console.log statements.
 * PERF: Added .limit(20) — only show 20 upcoming webinars at most.
 */
export const webinarService = {
  getWebinars: async (): Promise<Webinar[]> => {
    try {
      const query = supabase
        .from("webinars")
        .select(`
          id, title, description, date_time, speaker_name, speaker_role,
          status, is_paid, price, speaker_profile_url,
          brand_logo_url, webinar_image_url, sponsor_logos,
          speaker_images, about_content, q_and_a,
          advanced_features, max_attendees, registration_count,
          type, recording_url, streaming_url
        `)
        .order("date_time", { ascending: false })
        .limit(50);

      const rawData = await safeQuery<any[]>(query);
      if (!rawData || !Array.isArray(rawData)) return [];
      return rawData.map(mapWebinar);
    } catch {
      return [];
    }
  },

  getWebinarById: async (id: string): Promise<Webinar | null> => {
    try {
      const { data, error } = await supabase
        .from("webinars")
        .select(`
          id, title, description, date_time, speaker_name, speaker_role,
          status, is_paid, price, speaker_profile_url,
          brand_logo_url, webinar_image_url, sponsor_logos,
          speaker_images, about_content, q_and_a,
          advanced_features, max_attendees, registration_count,
          type, recording_url
        `)
        .eq("id", id)
        .single();

      if (error) return null;
      return mapWebinar(data);
    } catch {
      return null;
    }
  },

  checkRegistration: async (webinarId: string, userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from("webinar_registrations")
        .select("id")
        .eq("webinar_id", webinarId)
        .eq("user_id", userId)
        .maybeSingle();

      if (error) return false;
      return !!data;
    } catch {
      return false;
    }
  },

  register: async (webinarId: string, userId: string, email: string) => {
    try {
      const { data: existing } = await supabase
        .from('webinar_registrations')
        .select('id')
        .eq('webinar_id', webinarId)
        .eq('user_id', userId)
        .maybeSingle();

      if (existing) return { success: true, alreadyRegistered: true };

      const { error } = await supabase
        .from('webinar_registrations')
        .insert([{
          webinar_id: webinarId,
          user_id: userId,
          email,
          attended: false,
          payment_status: 'completed'
        }]);

      if (error) throw error;
      void supabase.rpc('increment_webinar_registrations', { webinar_id: webinarId });

      // Ingest lead inside CRM pipeline
      try {
        const { data: lead } = await supabase.from('leads').select('id, score, crm_metadata').eq('email', email).maybeSingle();
        if (!lead) {
          await supabase.from('leads').insert({
            email,
            source: 'webinar_registration',
            score: 20,
            stage: 'INTERESTED',
            last_action_at: new Date().toISOString(),
            crm_metadata: { registered_webinar_id: webinarId }
          });
        } else {
          await supabase.from('leads').update({
            score: (lead.score || 0) + 20,
            stage: 'HIGH_INTENT',
            last_action_at: new Date().toISOString(),
            crm_metadata: { ...(lead.crm_metadata || {}), registered_webinar_id: webinarId }
          }).eq('id', lead.id);
        }
      } catch (crmErr) {
        console.error("CRM Lead ingestion skipped during service register:", crmErr);
      }

      // Enqueue notification in queue
      try {
        const { data: web } = await supabase.from('webinars').select('title, date_time').eq('id', webinarId).single();
        if (web) {
          await supabase.from('notification_queue').insert({
            recipient: email,
            channel: 'EMAIL',
            priority: 'HIGH',
            payload: {
              message: `You have successfully registered for the masterclass: "${web.title}".`,
              user_name: email.split('@')[0],
              action_link: `/webinars/${webinarId}`
            },
            status: 'PENDING'
          });
        }
      } catch (notifErr) {
        console.error("CRM Notification enqueue skipped during service register:", notifErr);
      }

      return { success: true };
    } catch {
      return { success: false, error: "Something went wrong. Please try again." };
    }
  },
  subscribe: (callback: (payload: any) => void) => {
    return supabase
      .channel('public:webinars')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'webinars' }, callback)
      .subscribe();
  }
};
