import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Missing credentials in .env file! URL:", url, "Key:", key);
  process.exit(1);
}

const supabase = createClient(url, key);

async function check() {
  try {
    const { data: banners, error } = await supabase
      .from("banners")
      .select("*");
    
    if (error) {
      console.error("Error fetching banners:", error);
    } else {
      console.log("ALL BANNERS IN DB:", JSON.stringify(banners, null, 2));
    }
  } catch (err) {
    console.error("Crash:", err);
  }
}

check();
