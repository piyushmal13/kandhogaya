import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
const res = await client.query(`
  SELECT column_name, data_type 
  FROM information_schema.columns 
  WHERE table_schema = 'public' AND table_name = 'banners'
`);
console.log(JSON.stringify(res.rows, null, 2));
await client.end();
