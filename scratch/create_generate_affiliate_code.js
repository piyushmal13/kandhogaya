import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

const query = `
-- Drop existing function if it exists to be idempotent
DROP FUNCTION IF EXISTS public.generate_affiliate_code(uuid);

-- Function: generate_affiliate_code
-- Purpose: Generates a unique, human-readable affiliate code for a given user.
--          If the user already has an affiliate code, returns the existing one.
--          The code format is: IFX-<6 random alphanumeric chars>
CREATE OR REPLACE FUNCTION public.generate_affiliate_code(user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  existing_code text;
  new_code text;
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- No I, O, 0, 1 to avoid confusion
  i int;
BEGIN
  -- 1. Check if this user already has an affiliate code
  SELECT code INTO existing_code
  FROM affiliate_codes
  WHERE affiliate_codes.user_id = generate_affiliate_code.user_id;

  IF existing_code IS NOT NULL THEN
    RETURN existing_code;
  END IF;

  -- 2. Generate a unique code with retry loop
  LOOP
    new_code := 'IFX-';
    FOR i IN 1..6 LOOP
      new_code := new_code || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;

    -- Try to insert; if code collision, retry
    BEGIN
      INSERT INTO affiliate_codes (user_id, code, total_clicks, total_registrations, commission_rate)
      VALUES (generate_affiliate_code.user_id, new_code, 0, 0, 10.0);
      
      RETURN new_code;
    EXCEPTION WHEN unique_violation THEN
      -- Code already exists, loop and try again
      CONTINUE;
    END;
  END LOOP;
END;
$$;

-- Grant execute permission to authenticated users (Supabase auth)
GRANT EXECUTE ON FUNCTION public.generate_affiliate_code(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.generate_affiliate_code(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.generate_affiliate_code(uuid) TO service_role;
`;

try {
  await client.query(query);
  console.log("✅ SUCCESS: public.generate_affiliate_code(user_id) function created in Supabase!");
  
  // Verify it works with a quick schema check
  const verify = await client.query(`
    SELECT routine_name, data_type 
    FROM information_schema.routines 
    WHERE routine_name = 'generate_affiliate_code' 
      AND routine_schema = 'public';
  `);
  console.log("🔍 Verification:", JSON.stringify(verify.rows, null, 2));
} catch (err) {
  console.error("❌ ERROR creating function:", err);
} finally {
  await client.end();
}
