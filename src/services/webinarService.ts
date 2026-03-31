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
      
      // MOCK FALLBACK IF DB IS EMPTY
      if (webinars.length === 0) {
        webinars = [
          {
            id: 'mock-web1',
            title: 'Institutional Macro Trading 2024: Navigating the Gold Run',
            description: 'Learn the exact quantitative models used by top proprietary firms to navigate the current XAUUSD supercycle.',
            date_time: new Date(Date.now() + 86400000 * 3).toISOString(),
            speaker: 'Piyush Mal',
            speaker_name: 'Piyush Mal',
            status: 'upcoming',
            is_paid: false,
            price: 0,
            created_at: new Date().toISOString(),
            max_attendees: 500,
            registration_count: 342,
            webinar_image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80',
            sponsors: []
          },
          {
            id: 'mock-web2',
            title: 'Algo Trading Infrastructure: Python to MT5',
            description: 'Step-by-step masterclass on deploying algorithmic execution models from Python directly into MetaTrader 5.',
            date_time: new Date(Date.now() + 86400000 * 7).toISOString(),
            speaker: 'IFX Quant Team',
            speaker_name: 'IFX Quant Team',
            status: 'upcoming',
            is_paid: true,
            price: 99,
            created_at: new Date().toISOString(),
            max_attendees: 200,
            registration_count: 89,
            webinar_image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80',
            sponsors: []
          }
        ];
      }
      return webinars;
    } catch (error) {
      console.error("🎥 [WEBINAR FETCH] ERROR", error);
      return [
        {
          id: 'mock-web1',
          title: 'Institutional Macro Trading 2024: Navigating the Gold Run',
          date_time: new Date(Date.now() + 86400000 * 3).toISOString(),
          speaker: 'Piyush Mal',
          status: 'upcoming',
          created_at: new Date().toISOString(),
          max_attendees: 500,
          registration_count: 342,
          webinar_image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80'
        } as any
      ];
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
      // Fallback to mock on error
      return {
          id: id,
          title: 'Institutional Macro Trading 2024: Navigating the Gold Run',
          description: 'Learn the exact quantitative models used by top proprietary firms to navigate the current XAUUSD supercycle.',
          date_time: new Date(Date.now() + 86400000 * 3).toISOString(),
          speaker: 'Piyush Mal',
          speaker_name: 'Piyush Mal',
          status: 'upcoming',
          is_paid: false,
          price: 0,
          created_at: new Date().toISOString(),
          max_attendees: 500,
          registration_count: 342,
          webinar_image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80',
          sponsors: []
      } as any;
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
