import { Client } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

try {
  const tables = [
    "affiliate_codes",
    "analytics_events",
    "api_keys",
    "banners",
    "commissions",
    "consultations",
    "contact_messages",
    "content_categories",
    "content_posts",
    "faqs",
    "feature_flags",
    "hiring_applications",
    "hiring_positions",
    "leads",
    "manual_payment_receipts",
    "market_data",
    "notification_queue",
    "payouts",
    "performance_results",
    "platform_flags",
    "product_variants",
    "products",
    "reviews",
    "subscriptions",
    "system_logs",
    "user_entitlements",
    "users",
    "webinar_registrations",
    "webinar_sponsors",
    "webinars",
    "api_audit_logs"
  ];

  const results = {};
  for (const table of tables) {
    const schema = table === 'api_audit_logs' ? 'private' : 'public';
    const cols = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = $1 AND table_schema = $2
      ORDER BY ordinal_position;
    `, [table, schema]);
    
    results[`${schema}.${table}`] = cols.rows.map(c => ({
      name: c.column_name,
      type: c.data_type,
      nullable: c.is_nullable === 'YES',
      default: c.column_default
    }));
  }

  fs.writeFileSync('scratch/schemas_utf8.json', JSON.stringify(results, null, 2), 'utf8');
  console.log("SUCCESS: schemas_utf8.json written successfully!");

} catch (err) {
  console.error("Error:", err);
} finally {
  await client.end();
}
