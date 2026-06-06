import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

try {
  console.log("=== ALL PUBLIC SCHEMATABLES ===");
  const res = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    ORDER BY table_name;
  `);
  console.log(JSON.stringify(res.rows.map(r => r.table_name), null, 2));

  console.log("\n=== ALL PRIVATE SCHEMATABLES ===");
  const resPrivate = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'private' AND table_type = 'BASE TABLE'
    ORDER BY table_name;
  `);
  console.log(JSON.stringify(resPrivate.rows.map(r => r.table_name), null, 2));

  console.log("\n=== ALL SCHEMAVIEWS ===");
  const resViews = await client.query(`
    SELECT table_name, table_schema
    FROM information_schema.views 
    WHERE table_schema IN ('public', 'private')
    ORDER BY table_name;
  `);
  console.log(JSON.stringify(resViews.rows, null, 2));

} catch (err) {
  console.error("Error:", err);
} finally {
  await client.end();
}
