import { supabase } from '../lib/supabase';
import { getCache, setCache } from '@/utils/cache';

const cacheKey = "service_reviews";

export const fetchReviews = async () => {
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const res = await supabase
    .from('reviews')
    .select('id, name, content, rating, created_at, avatar_url, verified_trade, trade_type, pnl')
    .order('created_at', { ascending: false });
    
  const data = res?.data ?? [];
  setCache(cacheKey, data, 30000);
  return data;
};
