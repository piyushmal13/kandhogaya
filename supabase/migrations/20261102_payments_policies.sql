-- Enable row level security for payments and add basic policies
ALTER TABLE IF EXISTS payments ENABLE ROW LEVEL SECURITY;

-- Allow users to select only their own payment records
DROP POLICY IF EXISTS "Select own payments" ON payments;
CREATE POLICY "Select own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert payment records where user_id matches their auth.uid()
DROP POLICY IF EXISTS "Insert payments by user" ON payments;
CREATE POLICY "Insert payments by user" ON payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own payment records
DROP POLICY IF EXISTS "Update own payments" ON payments;
CREATE POLICY "Update own payments" ON payments
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Note: server-side operations using the Supabase service role will bypass RLS and are expected
-- to perform payment status updates and reconciliation.
