import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkBlogs() {
  const { data, error } = await supabase.from('content_posts').select('*').limit(1);
  if (error) {
    console.error('Error fetching content_posts:', error.message);
  } else {
    console.log('Content_posts columns:', Object.keys(data[0] || {}));
  }
}

checkBlogs();
