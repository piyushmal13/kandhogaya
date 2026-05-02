-- Sprint 4: The Growth Engine (CRM & Affiliate Network)
-- Objective: Exponential Scale, CRM Terminal, and Affiliate Performance Tracking

-- 1. Affiliate Infrastructure
CREATE TABLE IF NOT EXISTS affiliate_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  total_clicks INTEGER DEFAULT 0,
  total_registrations INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure unique code constraint
CREATE INDEX IF NOT EXISTS idx_affiliate_codes_code ON affiliate_codes(code);

-- 2. Enhance Lead Tracking with Referral Attribution
ALTER TABLE leads ADD COLUMN IF NOT EXISTS referred_by_code TEXT;

-- 3. Revenue Attribution in Manual Pipeline
ALTER TABLE manual_payment_receipts ADD COLUMN IF NOT EXISTS referred_by_code TEXT;

-- 4. CRM Stages logic (Lead Stage is already defined, ensuring it aligns)
-- lead_stage enum was already created in Sprint 5 (interestingly, Sprint 5 was done before Sprint 4 in this timeline, but I will maintain consistency)
-- Statuses: NEW, INTERESTED, HIGH_INTENT, PAYMENT_PENDING, CONVERTED

-- 5. Row Level Security (RLS) Policies

-- Affiliate Codes: Users can see their own codes
ALTER TABLE affiliate_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own affiliate codes"
ON affiliate_codes FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own affiliate codes"
ON affiliate_codes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Leads: Affiliates can see leads they referred (limited view)
CREATE POLICY "Affiliates can view leads they referred"
ON leads FOR SELECT
TO authenticated
USING (
  referred_by_code IN (
    SELECT code FROM affiliate_codes WHERE user_id = auth.uid()
  )
);

-- Commissions: Affiliates see their own earnings
-- (Table commissions already exists from Sprint 6 preview)
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Affiliates can view their own commissions"
ON commissions FOR SELECT
TO authenticated
USING (
  agent_id = auth.uid()
);

-- Admin Global Access (Assuming 'admin' role in users table)
CREATE POLICY "Admins have full access to affiliate_codes"
ON affiliate_codes FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins have full access to leads"
ON leads FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 6. Helper Functions
CREATE OR REPLACE FUNCTION generate_affiliate_code(user_id UUID)
RETURNS TEXT AS $$
DECLARE
  new_code TEXT;
  done BOOL;
BEGIN
  done := false;
  WHILE NOT done LOOP
    new_code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
    INSERT INTO affiliate_codes (user_id, code) VALUES ($1, new_code)
    ON CONFLICT (code) DO NOTHING
    RETURNING code INTO new_code;
    IF new_code IS NOT NULL THEN
      done := true;
    END IF;
  END LOOP;
  RETURN new_code;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = public, pg_temp;
