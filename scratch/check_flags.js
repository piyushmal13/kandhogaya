import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkFlags() {
  const { data, error } = await supabase.from('feature_flags').select('*').limit(1);
  if (error) {
    console.error('Error fetching flags:', error.message);
  } else {
    console.log('Flags columns:', Object.keys(data[0] || {}));
  }
}

checkFlags();
