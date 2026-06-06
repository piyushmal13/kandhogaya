-- Migration: Drop signals and signal_subscriptions tables
-- Removes all database-level references to signals as they are not sold or tracked in the database.

DROP TABLE IF EXISTS public.signal_subscriptions CASCADE;
DROP TABLE IF EXISTS public.signals CASCADE;
