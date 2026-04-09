-- Run once in Supabase SQL Editor
-- Creates the platform_flags table used by the Feature Flag admin panel

CREATE TABLE IF NOT EXISTS public.platform_flags (
  key         TEXT        PRIMARY KEY,
  value       BOOLEAN     NOT NULL DEFAULT false,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed with defaults (all off)
INSERT INTO public.platform_flags (key, value) VALUES
  ('show_retail_brokers',       false),
  ('webinar_registration_open', true),
  ('show_affiliate_hub',        true),
  ('algo_marketplace_live',     true),
  ('urgency_banner_active',     true),
  ('maintenance_mode',          false)
ON CONFLICT (key) DO NOTHING;

-- Row-Level Security — only service-role or admin JWT can mutate
ALTER TABLE public.platform_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin read flags"
  ON public.platform_flags FOR SELECT
  USING (true);   -- readable by all authenticated users (needed for front-end flag checks)

CREATE POLICY "Admin write flags"
  ON public.platform_flags FOR ALL
  USING (
    (auth.jwt() ->> 'role') = 'admin'
    OR (auth.jwt() ->> 'app_role') = 'admin'
  );
