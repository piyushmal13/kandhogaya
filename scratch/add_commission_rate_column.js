import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

const query = `
-- 1. Add commission_rate column to affiliate_codes table
ALTER TABLE affiliate_codes ADD COLUMN IF NOT EXISTS commission_rate DECIMAL(5,2) DEFAULT 10.00;
`;

try {
  await client.query(query);
  console.log("SUCCESS: Database migrated. commission_rate column added to affiliate_codes, and agents view updated successfully!");
} catch (err) {
  console.error("ERROR migrating database:", err);
} finally {
  await client.end();
}
