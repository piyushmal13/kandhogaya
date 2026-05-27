import fs from 'fs';
import path from 'path';
import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL || process.env.SUPABASE_DB_URL;

if (!DATABASE_URL) {
  console.error("Missing DATABASE_URL");
  process.exit(1);
}

async function run() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  try {
    const sqlPath = path.join(process.cwd(), 'supabase', 'migrations', '20261107_institutional_hardening.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log("Applying institutional hardening migration directly...");
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log("Migration applied successfully!");
  } catch (err) {
    await client.query('ROLLBACK');
    console.error("Migration failed:", err);
  } finally {
    await client.end();
  }
}

run();
