-- Add onboarding_completed column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

-- Update existing users to have onboarding completed (assuming they are existing)
-- Comment out if you want new users only
-- UPDATE users SET onboarding_completed = true WHERE created_at < NOW();