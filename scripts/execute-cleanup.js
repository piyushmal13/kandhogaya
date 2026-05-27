import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("Missing DATABASE_URL");
  process.exit(1);
}

async function runCleanup() {
  const client = new pg.Client({ connectionString: DATABASE_URL });
  await client.connect();
  
  try {
    console.log("Reading cleanup script...");
    const sqlPath = path.join(process.cwd(), 'supabase', 'migrations', '20261108_database_cleanup.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log("Applying cleanup transaction...");
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log("✅ Database architecture purged and hardened successfully!");
  } catch (err) {
    await client.query('ROLLBACK');
    console.error("❌ Failed to apply database cleanup:", err);
  } finally {
    await client.end();
  }
}

runCleanup();
