import { supabase, safeQuery } from '../lib/supabase';

export const fetchReviews = async () => {
  return safeQuery<any[]>(
    supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })
  );
};
