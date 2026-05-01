import { supabase } from '../lib/supabase';
import { getCache, setCache } from '@/utils/cache';

const cacheKey = "service_reviews";

export const fetchReviews = async () => {
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const res = await supabase
    .from('reviews')
    .select('id, name, text, rating, role, image_url, region, created_at')
    .order('created_at', { ascending: false });
    
  const data = res?.data ?? [];
  setCache(cacheKey, data, 30000);
  return data;
};
