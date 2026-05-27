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
    console.log("Deactivating duplicate 'Institutional Masterclass' banner...");
    await client.query(`
      UPDATE banners 
      SET is_active = false 
      WHERE title = 'Institutional Masterclass' AND placement = 'home'
    `);

    console.log("Activating 'Institutional Alpha Registry' banner for homepage authority...");
    await client.query(`
      UPDATE banners 
      SET is_active = true, link_url = '#performance'
      WHERE title = 'Institutional Alpha Registry' AND placement = 'home'
    `);

    console.log("Successfully overhauled homepage banners!");
  } catch (err) {
    console.error("Error updating banners:", err);
  } finally {
    await client.end();
  }
}

run();
