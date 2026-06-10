/*
  Migration: Allow authenticated users to insert leads
  This policy enables legitimate lead creation from the client application while maintaining security.
*/

CREATE POLICY "Authenticated users can insert leads"
  ON leads
  FOR INSERT TO authenticated
  WITH CHECK (
    email IS NOT NULL AND
    source IS NOT NULL
  );

-- Optional: Allow anonymous inserts if desired (e.g., public web forms)
-- CREATE POLICY "Anonymous can insert leads"
--   ON leads
--   FOR INSERT TO anon
--   WITH CHECK (
--     email IS NOT NULL AND
--     source IS NOT NULL
--   );
