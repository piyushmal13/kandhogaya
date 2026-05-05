import { supabase } from "../lib/supabase";

export interface Banner {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  is_active: boolean;
  placement: string;
  priority: number;
  metadata: any;
  created_at: string;
}

export const bannerService = {
  async getBanners(placement?: string): Promise<Banner[]> {
    let query = supabase
      .from('banners')
      .select('*')
      .eq('is_active', true)
      .order('priority', { ascending: false });

    if (placement) {
      query = query.eq('placement', placement);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Institutional Banner Fetch Error:", error);
      return [];
    }
    return data as Banner[];
  },

  async getAllBanners(): Promise<Banner[]> {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('priority', { ascending: false });

    if (error) {
      console.error("Institutional Banner Fetch Error:", error);
      return [];
    }
    return data as Banner[];
  },

  async createBanner(banner: Partial<Banner>): Promise<Banner | null> {
    const { data, error } = await supabase
      .from('banners')
      .insert([banner])
      .select()
      .single();

    if (error) {
      console.error("Institutional Banner Creation Error:", error);
      return null;
    }
    return data as Banner;
  },

  async updateBanner(id: string, updates: Partial<Banner>): Promise<Banner | null> {
    const { data, error } = await supabase
      .from('banners')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Institutional Banner Update Error:", error);
      return null;
    }
    return data as Banner;
  },

  async deleteBanner(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('banners')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Institutional Banner Deletion Error:", error);
      return false;
    }
    return true;
  }
};
