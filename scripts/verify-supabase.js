import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    const { data: pData, error: pError } = await supabase.from("products").select("id, name, description, price, category, video_explanation_url, image_url, created_at, performance_data, long_plan_offers, strategy_details, risk_profile, q_and_a, terms_and_conditions, strategy_graph_url, backtesting_result_url, metadata").limit(1);
    
    if (pError) console.error("Products error:", pError);
    else console.log("Products fetch success:", pData);

    const { data: rData, error: rError } = await supabase.from("reviews").select("id, name, role, text, rating, created_at, image_url, region, user_name, status").limit(1);

    if (rError) console.error("Reviews error:", rError);
    else console.log("Reviews fetch success:", rData);

  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

testConnection();
