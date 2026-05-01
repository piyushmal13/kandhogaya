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
          id, title, description, date_time, speaker_name,
          speaker_images, type, max_attendees, registration_count,
          status, webinar_image_url, recording_url, sponsor_logos,
          q_and_a, about_content, advanced_features
        `)
        .eq("status", "scheduled")
        .order("date_time", { ascending: true })
        .limit(20);

      const rawData = await safeQuery<any[]>(query);
      return (rawData as any[]).map(mapWebinar);
    } catch {
      return [];
    }
  },

  getWebinarById: async (id: string): Promise<Webinar | null> => {
    try {
      const { data, error } = await supabase
        .from("webinars")
        .select(`
          id, title, description, date_time, speaker_name,
          speaker_images, type, max_attendees, registration_count,
          status, webinar_image_url, recording_url, sponsor_logos,
          q_and_a, about_content, advanced_features
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
