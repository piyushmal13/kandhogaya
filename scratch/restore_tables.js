import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL || process.env.SUPABASE_DB_URL;

const sql = `
-- ==========================================
-- RESTORE DROPPED TABLES
-- ==========================================

-- 1. Create algo_bots table
CREATE TABLE IF NOT EXISTS algo_bots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  version TEXT,
  download_url TEXT,
  checksum TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS for algo_bots
ALTER TABLE algo_bots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read algo catalog" ON algo_bots;
CREATE POLICY "Users read algo catalog" ON algo_bots
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins manage algo bots" ON algo_bots;
CREATE POLICY "Admins manage algo bots" ON algo_bots
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- 2. Create bot_licenses table
CREATE TABLE IF NOT EXISTS bot_licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  algo_id UUID REFERENCES algo_bots(id) ON DELETE SET NULL,
  license_key TEXT UNIQUE NOT NULL,
  account_id TEXT,
  hardware_id TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_validated_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS for bot_licenses
ALTER TABLE bot_licenses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own licenses" ON bot_licenses;
CREATE POLICY "Users can view their own licenses" ON bot_licenses
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins manage licenses" ON bot_licenses;
CREATE POLICY "Admins manage licenses" ON bot_licenses
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

CREATE INDEX IF NOT EXISTS idx_bot_licenses_key ON bot_licenses(license_key);
CREATE INDEX IF NOT EXISTS idx_bot_licenses_user ON bot_licenses(user_id);

-- 3. Create sales_tracking table
CREATE TABLE IF NOT EXISTS sales_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES users(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  sale_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS for sales_tracking
ALTER TABLE sales_tracking ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage sales tracking" ON sales_tracking;
CREATE POLICY "Admins manage sales tracking" ON sales_tracking
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Agents view own sales tracking" ON sales_tracking;
CREATE POLICY "Agents view own sales tracking" ON sales_tracking
  FOR SELECT TO authenticated
  USING (agent_id = auth.uid());
`;

async function run() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  try {
    console.log("Restoring database tables...");
    await client.query(sql);
    console.log("SUCCESS: algo_bots, bot_licenses, and sales_tracking have been restored!");
  } catch (err) {
    console.error("Failed to restore tables:", err);
  } finally {
    await client.end();
  }
}

run();
