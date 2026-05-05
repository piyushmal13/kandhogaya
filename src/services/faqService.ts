import { supabase, safeQuery } from "../lib/supabase";

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  priority: number;
  is_active: boolean;
  created_at: string;
}

export const faqService = {
  async getFaqs(limit = 10): Promise<FAQ[]> {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('is_active', true)
      .order('priority', { ascending: true })
      .limit(limit);

    if (error) {
      console.error("Institutional FAQ Fetch Error:", error);
      return [];
    }
    return data as FAQ[];
  },

  async getAllFaqs(): Promise<FAQ[]> {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('priority', { ascending: true });

    if (error) {
      console.error("Institutional FAQ Fetch Error:", error);
      return [];
    }
    return data as FAQ[];
  },

  async createFaq(faq: Partial<FAQ>): Promise<FAQ | null> {
    const { data, error } = await supabase
      .from('faqs')
      .insert([faq])
      .select()
      .single();

    if (error) {
      console.error("Institutional FAQ Creation Error:", error);
      return null;
    }
    return data as FAQ;
  },

  async updateFaq(id: string, updates: Partial<FAQ>): Promise<FAQ | null> {
    const { data, error } = await supabase
      .from('faqs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Institutional FAQ Update Error:", error);
      return null;
    }
    return data as FAQ;
  },

  async deleteFaq(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('faqs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Institutional FAQ Deletion Error:", error);
      return false;
    }
    return true;
  }
};
