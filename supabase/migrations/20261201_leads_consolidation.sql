-- Migration: Consolidate leads table schema and add missing columns
-- Created: 2026-12-01
-- Purpose: Fix schema conflict between 20261023 and 20261101 migrations

-- First, check if the leads table exists and add missing columns
DO $$
DECLARE
  col_exists boolean;
BEGIN
  -- Check and add full_name if missing (partial schema from 20261101 only had 13 cols)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'leads' 
      AND column_name = 'full_name'
  ) THEN
    ALTER TABLE leads ADD COLUMN full_name TEXT;
    RAISE NOTICE 'Added full_name column';
  END IF;

  -- Check and add stage if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'leads' 
      AND column_name = 'stage'
  ) THEN
    ALTER TABLE leads ADD COLUMN stage TEXT DEFAULT 'NEW'::text;
    RAISE NOTICE 'Added stage column';
  END IF;

  -- Check and add score if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'leads' 
      AND column_name = 'score'
  ) THEN
    ALTER TABLE leads ADD COLUMN score INTEGER DEFAULT 0;
    RAISE NOTICE 'Added score column';
  END IF;

  -- Check and add is_hot if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'leads' 
      AND column_name = 'is_hot'
  ) THEN
    ALTER TABLE leads ADD COLUMN is_hot BOOLEAN DEFAULT false;
    RAISE NOTICE 'Added is_hot column';
  END IF;

  -- Check and add last_action_at if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'leads' 
      AND column_name = 'last_action_at'
  ) THEN
    ALTER TABLE leads ADD COLUMN last_action_at TIMESTAMPTZ;
    RAISE NOTICE 'Added last_action_at column';
  END IF;

  -- Check and add conversion_probability if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'leads' 
      AND column_name = 'conversion_probability'
  ) THEN
    ALTER TABLE leads ADD COLUMN conversion_probability DECIMAL(5,2) DEFAULT 0;
    RAISE NOTICE 'Added conversion_probability column';
  END IF;

  -- Check and add priority_tag if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'leads' 
      AND column_name = 'priority_tag'
  ) THEN
    ALTER TABLE leads ADD COLUMN priority_tag TEXT;
    RAISE NOTICE 'Added priority_tag column';
  END IF;

  -- Check and add assigned_to if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'leads' 
      AND column_name = 'assigned_to'
  ) THEN
    ALTER TABLE leads ADD COLUMN assigned_to UUID REFERENCES users(id) ON DELETE SET NULL;
    RAISE NOTICE 'Added assigned_to column';
  END IF;

  -- Check and add crm_metadata if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'leads' 
      AND column_name = 'crm_metadata'
  ) THEN
    ALTER TABLE leads ADD COLUMN crm_metadata JSONB DEFAULT '{}'::jsonb;
    RAISE NOTICE 'Added crm_metadata column';
  END IF;

  -- Ensure stage has proper check constraint
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'leads_stage_check'
  ) THEN
    ALTER TABLE leads ADD CONSTRAINT leads_stage_check 
      CHECK (stage IN ('NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST'));
    RAISE NOTICE 'Added stage check constraint';
  END IF;
END $$;

-- Create missing indexes for lead management
CREATE INDEX IF NOT EXISTS idx_leads_stage ON leads(stage);
CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_last_action ON leads(last_action_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_conversion_prob ON leads(conversion_probability DESC);
CREATE INDEX IF NOT EXISTS idx_leads_stage_score ON leads(stage, score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_stage ON leads(assigned_to, stage);

-- Full-text search index for message content
CREATE INDEX IF NOT EXISTS idx_leads_message_fts ON leads USING GIN (
  to_tsvector('english', 
    COALESCE(message, '') || ' ' || 
    COALESCE(subject, '') || ' ' || 
    COALESCE(full_name, '')
  )
);

-- Composite index for CRM dashboard queries
CREATE INDEX IF NOT EXISTS idx_leads_dashboard 
  ON leads(created_at DESC, stage, score DESC) 
WHERE stage NOT IN ('CLOSED_WON', 'CLOSED_LOST');

-- Comments for documentation
COMMENT ON COLUMN leads.full_name IS 'Lead full name from contact form';
COMMENT ON COLUMN leads.stage IS 'CRM pipeline stage';
COMMENT ON COLUMN leads.score IS 'Lead scoring 0-100 based on engagement';
COMMENT ON COLUMN leads.is_hot IS 'Flag for high-intent leads requiring immediate follow-up';
COMMENT ON COLUMN leads.last_action_at IS 'Timestamp of last agent interaction';
COMMENT ON COLUMN leads.conversion_probability IS 'AI-predicted conversion probability percentage';
COMMENT ON COLUMN leads.priority_tag IS 'Manual priority override (HIGH, MEDIUM, LOW)';
COMMENT ON COLUMN leads.assigned_to IS 'Agent responsible for this lead';
COMMENT ON COLUMN leads.crm_metadata IS 'Additional CRM data - tags, notes, custom fields';
