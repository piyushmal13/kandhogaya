import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkLeadsSchema() {
  const { data, error } = await supabase.from('leads').select('anon_id, email, source, score, stage, is_hot, last_action_at').limit(0);
  if (error) {
    console.error('Leads schema error:', error.message);
  } else {
    console.log('Leads schema looks okay (excluding user_id)');
  }
}

checkLeadsSchema();
