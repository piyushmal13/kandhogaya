-- Access, fulfillment, revenue, and system tables used by the application.

ALTER TABLE products ADD COLUMN IF NOT EXISTS price DECIMAL(12,2) DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE products ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS strategy_details TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS risk_profile TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS performance_data JSONB DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS q_and_a JSONB DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS terms_and_conditions TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS strategy_graph_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS backtesting_result_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS video_explanation_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS long_plan_offers JSONB DEFAULT '[]'::jsonb;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'products'
      AND column_name = 'strategy_type'
  ) THEN
    EXECUTE 'ALTER TABLE products ALTER COLUMN strategy_type DROP NOT NULL';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'products'
      AND column_name = 'monthly_price'
  ) THEN
    EXECUTE 'ALTER TABLE products ALTER COLUMN monthly_price DROP NOT NULL';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'products'
      AND column_name = 'yearly_price'
  ) THEN
    EXECUTE 'ALTER TABLE products ALTER COLUMN yearly_price DROP NOT NULL';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'products'
      AND column_name = 'monthly_price'
  ) THEN
    EXECUTE 'UPDATE products SET price = monthly_price WHERE COALESCE(price, 0) = 0 AND monthly_price IS NOT NULL';
  END IF;
END $$;

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active products" ON products;
CREATE POLICY "Public read active products" ON products
  FOR SELECT TO anon, authenticated
  USING (COALESCE(is_active, true) = true);

DROP POLICY IF EXISTS "Admins manage products" ON products;
CREATE POLICY "Admins manage products" ON products
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

CREATE TABLE IF NOT EXISTS algo_bots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  version TEXT,
  download_url TEXT,
  checksum TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS user_entitlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id TEXT,
  feature TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE user_entitlements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own entitlements" ON user_entitlements;
CREATE POLICY "Users can view own entitlements" ON user_entitlements
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins manage entitlements" ON user_entitlements;
CREATE POLICY "Admins manage entitlements" ON user_entitlements
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

CREATE TABLE IF NOT EXISTS manual_payment_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  amount DECIMAL(12,2) NOT NULL,
  storage_path TEXT NOT NULL,
  whatsapp_number TEXT,
  referred_by_code TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE manual_payment_receipts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users create own manual receipts" ON manual_payment_receipts;
CREATE POLICY "Users create own manual receipts" ON manual_payment_receipts
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users view own manual receipts" ON manual_payment_receipts;
CREATE POLICY "Users view own manual receipts" ON manual_payment_receipts
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins manage manual receipts" ON manual_payment_receipts;
CREATE POLICY "Admins manage manual receipts" ON manual_payment_receipts
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

CREATE TABLE IF NOT EXISTS "payment-proofs" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  proof_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE "payment-proofs" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users create own payment proofs" ON "payment-proofs";
CREATE POLICY "Users create own payment proofs" ON "payment-proofs"
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users view own payment proofs" ON "payment-proofs";
CREATE POLICY "Users view own payment proofs" ON "payment-proofs"
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins manage payment proofs" ON "payment-proofs";
CREATE POLICY "Admins manage payment proofs" ON "payment-proofs"
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

CREATE TABLE IF NOT EXISTS sales_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES users(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  sale_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE sales_tracking ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage sales tracking" ON sales_tracking;
CREATE POLICY "Admins manage sales tracking" ON sales_tracking
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Agents read own sales tracking" ON sales_tracking;
CREATE POLICY "Agents read own sales tracking" ON sales_tracking
  FOR SELECT TO authenticated
  USING (agent_id = auth.uid());

CREATE TABLE IF NOT EXISTS commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID,
  agent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
  source TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING'
    CHECK (status IN ('PENDING', 'PAID', 'VOID')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage commissions" ON commissions;
CREATE POLICY "Admins manage commissions" ON commissions
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

CREATE TABLE IF NOT EXISTS feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read feature flags" ON feature_flags;
CREATE POLICY "Public read feature flags" ON feature_flags
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins manage feature flags" ON feature_flags;
CREATE POLICY "Admins manage feature flags" ON feature_flags
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

INSERT INTO feature_flags (key, enabled)
VALUES
  ('maintenance_mode', false),
  ('beta_signals', true),
  ('webinar_registration_open', true)
ON CONFLICT (key) DO NOTHING;

CREATE TABLE IF NOT EXISTS system_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL DEFAULT 'system',
  level TEXT,
  severity TEXT,
  message TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated insert system logs" ON system_logs;
CREATE POLICY "Authenticated insert system logs" ON system_logs
  FOR INSERT TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins read system logs" ON system_logs;
CREATE POLICY "Admins read system logs" ON system_logs
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  anon_id TEXT,
  event_type TEXT NOT NULL,
  priority TEXT DEFAULT 'LOW',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public insert analytics events" ON analytics_events;
CREATE POLICY "Public insert analytics events" ON analytics_events
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users read own analytics events" ON analytics_events;
CREATE POLICY "Users read own analytics events" ON analytics_events
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS notification_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient TEXT NOT NULL,
  channel TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'MEDIUM',
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'PENDING',
  attempts INTEGER NOT NULL DEFAULT 0,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE notification_queue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage notification queue" ON notification_queue;
CREATE POLICY "Admins manage notification queue" ON notification_queue
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
