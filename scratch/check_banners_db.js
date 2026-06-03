import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Missing credentials!");
  process.exit(1);
}

const supabase = createClient(url, key);

async function run() {
  const { data, error } = await supabase
    .from("banners")
    .select("*");

  if (error) {
    console.error("Supabase Error:", error);
  } else {
    console.log("SUCCESS! Banners fetched:", data.length);
    console.log(JSON.stringify(data, null, 2));
  }
}

run();
