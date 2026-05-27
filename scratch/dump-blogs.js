import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(url, key);

async function run() {
  const { data, error } = await supabase
    .from("content_posts")
    .select(`id, title, slug, content, body, metadata`)
    .eq("status", "published");

  if (error) {
    console.error("Supabase Query Error:", error);
  } else {
    console.log("Success! Blogs fetched:", data?.length);
    console.log(JSON.stringify(data, null, 2));
  }
}

run();
