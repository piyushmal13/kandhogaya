import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing Supabase URL or Anon Key in environment!");
  process.exit(1);
}

console.log("Connecting to Supabase URL:", supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log("\n--- Testing Webinars ---");
  const { data: webinars, error: webError } = await supabase.from('webinars').select('*');
  if (webError) {
    console.error("❌ Webinars error:", webError.message);
  } else {
    console.log(`✅ Webinars table readable. Count: ${webinars?.length}`);
    if (webinars && webinars.length > 0) {
      console.log("Sample webinar:", webinars[0].title);
    }
  }

  console.log("\n--- Testing Products (Marketplace) ---");
  const { data: products, error: prodError } = await supabase.from('products').select('*');
  if (prodError) {
    console.error("❌ Products error:", prodError.message);
  } else {
    console.log(`✅ Products table readable. Count: ${products?.length}`);
    if (products && products.length > 0) {
      console.log("Sample product:", products[0].name);
    }
  }

  console.log("\n--- Testing Blogs (content_posts) ---");
  const { data: blogs, error: blogError } = await supabase.from('content_posts').select('*');
  if (blogError) {
    console.error("❌ Blogs error:", blogError.message);
  } else {
    console.log(`✅ Blogs (content_posts) table readable. Count: ${blogs?.length}`);
    if (blogs && blogs.length > 0) {
      console.log("Sample blog:", blogs[0].title);
    }
  }

  console.log("\n--- Testing Reviews ---");
  const { data: reviews, error: revError } = await supabase.from('reviews').select('*');
  if (revError) {
    console.error("❌ Reviews error:", revError.message);
  } else {
    console.log(`✅ Reviews table readable. Count: ${reviews?.length}`);
  }

  console.log("\n--- Testing Leads ---");
  const { data: leads, error: leadError } = await supabase.from('leads').select('*');
  if (leadError) {
    console.error("❌ Leads error:", leadError.message);
  } else {
    console.log(`✅ Leads table readable. Count: ${leads?.length}`);
  }

  console.log("\n--- Testing Affiliate Codes ---");
  const { data: affs, error: affError } = await supabase.from('affiliate_codes').select('*');
  if (affError) {
    console.error("❌ Affiliate codes error:", affError.message);
  } else {
    console.log(`✅ Affiliate codes table readable. Count: ${affs?.length}`);
  }

  console.log("\n--- Testing Feature Flags (feature_flags) ---");
  const { data: flags, error: flagError } = await supabase.from('feature_flags').select('*');
  if (flagError) {
    console.error("❌ Feature flags error:", flagError.message);
  } else {
    console.log(`✅ Feature flags table readable. Count: ${flags?.length}`);
    if (flags) {
      flags.forEach((f: any) => console.log(`  Flag "${f.key}": ${f.enabled}`));
    }
  }
}

testConnection();
