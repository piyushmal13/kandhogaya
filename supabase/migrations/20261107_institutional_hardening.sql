-- ====================================================================
-- IFX TRADES — INSTITUTIONAL HARDENING MIGRATION
-- SCHEMA: public, private
-- TARGETS: api_keys, system_logs, signals, RLS Policies & Performance Indices
-- ====================================================================

-- 1. Create Private Audit Log Table
CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO postgres, service_role;

CREATE TABLE IF NOT EXISTS private.api_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key_id UUID NOT NULL,
    client_ip INET,
    endpoint VARCHAR(512) NOT NULL,
    status_code INTEGER NOT NULL,
    request_timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Secure API Key Management Table
CREATE TABLE IF NOT EXISTS public.api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    key_name VARCHAR(255) NOT NULL,
    hashed_key VARCHAR(64) UNIQUE NOT NULL, -- SHA-256 Hash of the client key
    scopes TEXT[] DEFAULT ARRAY['signals:read']::TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Enable RLS on API Keys
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Enforce RLS policies so users only see their own keys
DROP POLICY IF EXISTS "Users manage own API keys" ON public.api_keys;
CREATE POLICY "Users manage own API keys" ON public.api_keys
    FOR ALL TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- 3. Time-Series Performance Optimization Indices
-- High-frequency reads target recent active signals, system logs, and portfolio values.
-- Enforce composite B-Tree indexing on active/time fields.

CREATE INDEX IF NOT EXISTS idx_signals_asset_status 
    ON public.signals (asset, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_api_keys_hash_active 
    ON public.api_keys (hashed_key) 
    WHERE is_active = TRUE;

-- Composite index for fast quantitative log retrievals (corrected severity column name)
CREATE INDEX IF NOT EXISTS idx_system_logs_level_timestamp 
    ON public.system_logs (severity, created_at DESC);

-- 4. Strict Row Level Security policies on Live Signals table
ALTER TABLE public.signals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Active subscribers read signals" ON public.signals;
CREATE POLICY "Active subscribers read signals" ON public.signals
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            -- Verify active license or subscription in user_entitlements (corrected active boolean column)
            SELECT 1 FROM public.user_entitlements
            WHERE user_entitlements.user_id = auth.uid()
            AND user_entitlements.active = TRUE
        )
    );

-- 5. Enforce security-definer helper to write audits safely from public transactions
CREATE OR REPLACE FUNCTION private.log_api_access(
    p_key_id UUID,
    p_ip TEXT,
    p_endpoint TEXT,
    p_status INTEGER
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = private, pg_temp
AS $$
BEGIN
    INSERT INTO api_audit_logs (key_id, client_ip, endpoint, status_code)
    VALUES (p_key_id, p_ip::INET, p_endpoint, p_status);
END;
$$;
