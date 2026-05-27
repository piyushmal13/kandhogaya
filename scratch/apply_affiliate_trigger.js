import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

const query = `
-- Drop existing trigger and function if they exist to be idempotent
DROP TRIGGER IF EXISTS trigger_increment_affiliate_stats ON user_events;
DROP FUNCTION IF EXISTS increment_affiliate_stats();

-- Function to automatically increment click and registration counts in affiliate_codes table
CREATE OR REPLACE FUNCTION increment_affiliate_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.event_type = 'referral_capture' AND NEW.metadata->>'code' IS NOT NULL THEN
    UPDATE affiliate_codes 
    SET total_clicks = total_clicks + 1
    WHERE code = NEW.metadata->>'code';
  ELSIF NEW.event_type = 'referral_resolved' AND NEW.metadata->>'code' IS NOT NULL THEN
    UPDATE affiliate_codes 
    SET total_registrations = total_registrations + 1
    WHERE code = NEW.metadata->>'code';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to execute the function on user_events inserts
CREATE TRIGGER trigger_increment_affiliate_stats
AFTER INSERT ON user_events
FOR EACH ROW
EXECUTE FUNCTION increment_affiliate_stats();
`;

try {
  await client.query(query);
  console.log("SUCCESS: Dynamic real-time affiliate stats trigger applied to Supabase database successfully!");
} catch (err) {
  console.error("ERROR applying trigger:", err);
} finally {
  await client.end();
}
