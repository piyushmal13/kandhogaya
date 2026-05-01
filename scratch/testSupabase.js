import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log("Testing connection to:", supabaseUrl);
  try {
    const { data, error } = await supabase.from('products').select('count').limit(1);
    if (error) {
      console.error("Connection Error:", error.message);
    } else {
      console.log("Connection Successful! Found products:", data);
    }
  } catch (err) {
    console.error("Crash during connection test:", err);
  }
}

testConnection();
