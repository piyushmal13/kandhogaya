import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkWebinars() {
  const { data, error } = await supabase.from('webinars').select('*').limit(1);
  if (error) {
    console.error('Error fetching webinars:', error.message);
  } else {
    console.log('Webinars columns:', Object.keys(data[0] || {}));
  }
}

checkWebinars();
