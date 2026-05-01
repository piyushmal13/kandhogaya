import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function testInsert() {
  const { error } = await supabase.from('leads').insert({
    email: 'test@example.com',
    user_id: '00000000-0000-0000-0000-000000000000'
  });
  if (error) {
    console.error('Insert error:', error.message);
  } else {
    console.log('Insert success: user_id exists');
  }
}

testInsert();
