-- ====================================================================
-- IFX TRADES — DATABASE CLEANUP & ARCHITECTURAL PURGE
-- TARGETS: Drop unused legacy schemas, clean redundant tables.
-- ====================================================================

-- 1. Conditionally drop redundant or legacy public tables
DROP TABLE IF EXISTS public.bot_licenses CASCADE;
DROP TABLE IF EXISTS public.algo_bots CASCADE;
DROP TABLE IF EXISTS public.algorithms CASCADE;
DROP TABLE IF EXISTS public.lessons CASCADE;
DROP TABLE IF EXISTS public.courses CASCADE;
DROP TABLE IF EXISTS public.payment_proofs CASCADE;
DROP TABLE IF EXISTS public.sales_tracking CASCADE;
DROP TABLE IF EXISTS public.sales_pipeline CASCADE;
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.user_access CASCADE;
DROP TABLE IF EXISTS public.user_events CASCADE;

-- 2. Handle commissions and leads constraints before dropping agent schemas
ALTER TABLE IF EXISTS public.commissions DROP CONSTRAINT IF EXISTS commissions_agent_id_fkey;
ALTER TABLE IF EXISTS public.leads DROP CONSTRAINT IF EXISTS leads_assigned_to_fkey;

-- Drop legacy agent lists
DROP TABLE IF EXISTS public.agents CASCADE;
DROP TABLE IF EXISTS public.agent_accounts CASCADE;

-- Re-align leads and commissions to target auth.users(id) or public.users(id) directly
ALTER TABLE IF EXISTS public.commissions 
  ADD CONSTRAINT commissions_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.leads 
  ADD CONSTRAINT leads_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.users(id) ON DELETE SET NULL;
