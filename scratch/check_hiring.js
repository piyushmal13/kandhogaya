import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
const res = await client.query("SELECT id, title, department, type FROM hiring_positions");
console.log(JSON.stringify(res.rows, null, 2));
await client.end();
