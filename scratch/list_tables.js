
import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
console.log(JSON.stringify(res.rows, null, 2));
await client.end();
