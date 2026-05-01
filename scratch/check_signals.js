import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkSignals() {
  const { data, error } = await supabase.from('signals').select('*').limit(1);
  if (error) {
    console.error('Error fetching signals:', error.message);
  } else {
    console.log('Signals columns:', Object.keys(data[0] || {}));
  }
}

checkSignals();
