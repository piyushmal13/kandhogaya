-- Enhance performance_results with additional metrics required by UI
-- This migration adds columns that were missing in the initial schema but are required by the frontend components.

ALTER TABLE performance_results
  ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS drawdown DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS total_trades INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS equity_curve JSONB,
  ADD COLUMN IF NOT EXISTS is_live BOOLEAN DEFAULT true;

-- Optimize queries with indexes
CREATE INDEX IF NOT EXISTS idx_performance_results_product_id ON performance_results(product_id);
CREATE INDEX IF NOT EXISTS idx_performance_results_is_live ON performance_results(is_live);
