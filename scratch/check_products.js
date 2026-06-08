import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function run() {
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, category, price');
  
  if (error) {
    console.error('Error fetching products:', error);
    return;
  }
  console.log('--- PRODUCTS IN SUPABASE ---');
  products.forEach(p => {
    console.log(`ID: ${p.id} | Name: ${p.name} | Category: "${p.category}" | Price: ${p.price}`);
  });
}

run();
