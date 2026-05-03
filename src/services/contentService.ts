import { supabase, safeQuery } from "../lib/supabase";

/**
 * Content Service — Elite Hub for Blogs, Research, and FAQs
 */
export const ContentService = {
  getPosts: async (type = 'blog', page = 1, limit = 9, search = "") => {
    const offset = (page - 1) * limit;
    let query = supabase
      .from('content_posts')
      .select('*')
      .eq('content_type', type)
      .eq('status', 'published');

    if (search) {
      query = query.or(`title.ilike.%${search}%,body.ilike.%${search}%`);
    }

    const data = await safeQuery<any[]>(
      query.order('created_at', { ascending: false }).range(offset, offset + limit - 1)
    );

    return data || [];
  },

  getPostBySlug: async (slug: string) => {
    const { data, error } = await supabase
      .from('content_posts')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) return null;
    return data;
  }
};
