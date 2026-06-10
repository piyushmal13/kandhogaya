import { supabaseAdmin, safeQuery } from "../utils/supabase";

export const ContentService = {
  getPosts: async (type = 'blog', page = 1, limit = 9, search = "") => {
    const offset = (page - 1) * limit;
    let query = supabaseAdmin
      .from('content_posts')
      .select('*')
      .eq('content_type', type)
      .eq('status', 'published');

    if (search) {
      query = query.or(`title.ilike.%${search}%,body.ilike.%${search}%`);
    }

    return safeQuery<any[]>(
      async () => await query.order('created_at', { ascending: false }).range(offset, offset + limit - 1),
      "ContentService.getPosts"
    );
  },

  getPostBySlug: async (slug: string) => {
    return safeQuery<any>(
      async () => await supabaseAdmin.from('content_posts').select('*').eq('slug', slug).single(),
      "ContentService.getPostBySlug"
    );
  },

  getWebinars: async () => {
    return safeQuery<any[]>(
      async () => await supabaseAdmin.from('webinars').select('*').order('date_time', { ascending: true }),
      "ContentService.getWebinars"
    );
  },

  registerForWebinar: async (webinarId: string, name: string, email: string) => {
    // Lead acquisition simulation
    console.log(`[SOVEREIGN LEAD] Confirming ${email} for session ${webinarId}`);
    return { 
      success: true, 
      message: "Access Granted",
      calendar_details: {
        title: "IFX Intelligence Session",
        reminder_sent: true
      }
    };
  },

  getProducts: async () => {
    return safeQuery<any[]>(
      async () => await supabaseAdmin.from('products').select('*, product_variants(*)'),
      "ContentService.getProducts"
    );
  }
};
