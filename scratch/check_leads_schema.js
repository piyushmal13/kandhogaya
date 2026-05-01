import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkLeadsSchema() {
  const { data, error } = await supabase.from('leads').insert([{}]).select('*');
  if (error) {
    console.error('Error inserting into leads:', error);
  } else {
    console.log('Inserted:', data);
  }
}

checkLeadsSchema();
