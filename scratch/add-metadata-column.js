import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL || process.env.SUPABASE_DB_URL;

async function run() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  try {
    console.log("Adding 'metadata' JSONB column to 'products' table...");
    await client.query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
    `);
    console.log("Column added successfully!");
  } catch (err) {
    console.error("Migration Error:", err);
  } finally {
    await client.end();
  }
}

run();
