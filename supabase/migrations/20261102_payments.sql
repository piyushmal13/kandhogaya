-- Migration: payments table
-- Creates a payments table to track Stripe payment intents and outcomes
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_payment_intent_id text UNIQUE,
  user_id uuid,
  amount bigint NOT NULL,
  currency text NOT NULL DEFAULT 'usd',
  status text NOT NULL DEFAULT 'created',
  affiliate_code text,
  metadata jsonb,
  raw jsonb,
  created_at timestamptz DEFAULT now()
);

-- Index for lookup by stripe id
CREATE INDEX IF NOT EXISTS idx_payments_stripe_id ON payments (stripe_payment_intent_id);

-- NOTE: RLS policies are intentionally left to the security review step.
-- Apply policies so only server-side/service-role or authorized users can modify records.
