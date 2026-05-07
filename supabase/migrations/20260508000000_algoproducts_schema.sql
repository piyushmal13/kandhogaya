-- ==============================================================================
-- PHASE 3: ENTERPRISE-GRADE DATA MODELING (SQL MIGRATION SUITE)
-- ==============================================================================
-- Highly Normalized Relational Schema for algoproducts

-- 1. Create Custom ENUMs
DO $$ BEGIN
    CREATE TYPE strategy_type AS ENUM ('HFT', 'MEAN_REVERSION', 'TREND_FOLLOWING', 'STATISTICAL_ARBITRAGE', 'NEURAL_LOGIC');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create the core algoproducts table
CREATE TABLE IF NOT EXISTS public.algoproducts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Quant Metrics
    risk_reward_ratio NUMERIC(5,2),
    win_rate NUMERIC(5,2) CHECK (win_rate >= 0 AND win_rate <= 100),
    max_drawdown NUMERIC(5,2) CHECK (max_drawdown >= 0 AND max_drawdown <= 100),
    sharpe_ratio NUMERIC(5,2),
    
    -- Intelligence Layer
    strategy strategy_type NOT NULL DEFAULT 'TREND_FOLLOWING',
    execution_logic TEXT,
    mechanism_description TEXT,
    
    -- Capital Management
    min_capital NUMERIC(15,2) NOT NULL DEFAULT 500.00,
    recommended_capital NUMERIC(15,2) NOT NULL DEFAULT 2000.00,
    expected_roi NUMERIC(5,2),
    
    -- Metadata
    risk_profile VARCHAR(50) DEFAULT 'MODERATE',
    asset_classes TEXT[] DEFAULT '{}',
    deployment_guide TEXT
);

-- 3. Trigger for updated_at
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_timestamp ON public.algoproducts;
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON public.algoproducts
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.algoproducts ENABLE ROW LEVEL SECURITY;

-- 5. Role-Based Access Control (RBAC) Policies

-- Public users have SELECT access only
DROP POLICY IF EXISTS "Public users can view algoproducts" ON public.algoproducts;
CREATE POLICY "Public users can view algoproducts" 
ON public.algoproducts 
FOR SELECT 
USING (true);

-- Authenticated administrators possess full CRUD capabilities
DROP POLICY IF EXISTS "Admins can manage algoproducts" ON public.algoproducts;
CREATE POLICY "Admins can manage algoproducts" 
ON public.algoproducts 
USING (
  (auth.jwt() ->> 'role') = 'admin' OR 
  (auth.jwt() ->> 'role') = 'superadmin'
)
WITH CHECK (
  (auth.jwt() ->> 'role') = 'admin' OR 
  (auth.jwt() ->> 'role') = 'superadmin'
);
