import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
  process.exit(1);
}

const supabase = createClient(url, key);

async function run() {
  console.log("URL:", url);
  console.log("Fetching products...");
  const { data, error } = await supabase
    .from("products")
    .select(`
      id, name, description, price, category, video_explanation_url, image_url, created_at, 
      performance_data, long_plan_offers, strategy_details, risk_profile, q_and_a, 
      terms_and_conditions, strategy_graph_url, backtesting_result_url, metadata
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase Query Error:", error);
  } else {
    console.log("Success! Products fetched:", data?.length);
    console.log(JSON.stringify(data, null, 2));
  }
}

run();
