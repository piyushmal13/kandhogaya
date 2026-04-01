import { supabase, safeQuery } from "../lib/supabase";
import { Webinar } from "../types";
import { mapWebinar } from "../utils/dataMapper";

/**
 * Webinar Service - Institutional Data Layer
 */
export const webinarService = {
  /**
   * Fetch all webinars with normalization
   */
  getWebinars: async (): Promise<Webinar[]> => {
    console.log("🎥 [WEBINAR FETCH] START");
    try {
      const query = supabase
        .from("webinars")
        .select("*, sponsors:webinar_sponsors(*)")
        .order("date_time", { ascending: true });

      const rawData = await safeQuery<any[]>(query);
      console.log("🎥 [WEBINAR FETCH] RESPONSE", rawData.length, "webinars");

      let webinars = (rawData as any[]).map(mapWebinar);
      return webinars;
    } catch (error) {
      console.error("🎥 [WEBINAR FETCH] ERROR", error);
      return [];
    }
  },


  /**
   * Fetch a single webinar by ID with normalization
   */
  getWebinarById: async (id: string): Promise<Webinar | null> => {
    console.log(`🎥 [WEBINAR ID FETCH] START: ${id}`);
    try {
      const { data, error } = await supabase
        .from("webinars")
        .select("*, sponsors:webinar_sponsors(*)")
        .eq("id", id)
        .single();
      
      if (error) {
        console.error(`🎥 [WEBINAR ID FETCH] ERROR for ID ${id}:`, error);
        return null;
      }

      console.log(`🎥 [WEBINAR ID FETCH] RESPONSE: ${data?.id}`);
      return mapWebinar(data);
    } catch (error) {
      console.error(`🎥 [WEBINAR ID FETCH] CRITICAL ERROR:`, error);
      return null;
    }
  },


  /**
   * Check if a user is registered for a webinar
   */
  checkRegistration: async (webinarId: string, userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from("webinar_registrations")
        .select("id")
        .eq("webinar_id", webinarId)
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        return false;
      }
      return !!data;
    } catch {
      return false;
    }
  },

  /**
   * Register a user for a webinar
   */
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

      // Increment registration count via RPC if available
      void supabase.rpc('increment_webinar_registrations', { webinar_id: webinarId });

      return { success: true };
    } catch (err) {
      console.error("🎥 [WEBINAR REG] ERROR:", err);
      return { success: false, error: "Something went wrong. Please try again." };
    }
  },

  /**
   * Subscribe to real-time webinar changes
   */
  subscribe: (callback: (payload: any) => void) => {
    return supabase
      .channel('public:webinars')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'webinars' }, callback)
      .subscribe();
  }
};
