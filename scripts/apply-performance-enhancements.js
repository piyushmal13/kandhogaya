import { Client } from 'pg';
import { config } from 'dotenv';

config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

const client = new Client({ connectionString });

async function run() {
  await client.connect();
  try {
    // Add missing columns to performance_results
    await client.query(`
      ALTER TABLE performance_results
      ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES products(id) ON DELETE CASCADE,
      ADD COLUMN IF NOT EXISTS drawdown DECIMAL(5,2),
      ADD COLUMN IF NOT EXISTS total_trades INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS equity_curve JSONB,
      ADD COLUMN IF NOT EXISTS is_live BOOLEAN DEFAULT true;
    `);
    console.log('✅ Added performance_results columns (if missing)');

    // Create indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_performance_results_product_id ON performance_results(product_id);
      CREATE INDEX IF NOT EXISTS idx_performance_results_is_live ON performance_results(is_live);
    `);
    console.log('✅ Created performance indexes (if missing)');

    // Ensure RLS is enabled on performance_results (should be already)
    await client.query(`ALTER TABLE performance_results ENABLE ROW LEVEL SECURITY;`);
    console.log('✅ RLS enabled on performance_results');

    // Ensure public read policy exists
    const policyExists = await client.query(`
      SELECT 1 FROM pg_policies 
      WHERE schemaname = 'public' 
        AND tablename = 'performance_results' 
        AND policyname = 'Public Read Access'
    `);
    if (policyExists.rows.length === 0) {
      await client.query(`
        CREATE POLICY "Public Read Access" ON performance_results FOR SELECT TO public USING (true);
      `);
      console.log('✅ Added public read policy for performance_results');
    } else {
      console.log('✅ Public read policy already exists');
    }
  } catch (err) {
    console.error('❌ Error applying enhancements:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
