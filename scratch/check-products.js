import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const DATABASE_URL = process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL || process.env.SUPABASE_DB_URL;

async function run() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  try {
    const products = await client.query("SELECT * FROM products WHERE category = 'algorithm'");
    console.log(JSON.stringify(products.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
