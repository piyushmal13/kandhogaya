-- Intelligence Hub Migration
CREATE TABLE IF NOT EXISTS market_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol TEXT NOT NULL UNIQUE,
  asset_class TEXT NOT NULL, -- 'Forex', 'Crypto', 'Indices'
  price DECIMAL(18, 6) NOT NULL,
  change_24h DECIMAL(10, 2),
  volume_24h DECIMAL(18, 2),
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS performance_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  win_rate DECIMAL(5, 2) NOT NULL,
  monthly_return DECIMAL(10, 2) NOT NULL,
  drawdown DECIMAL(5, 2),
  total_trades INTEGER DEFAULT 0,
  is_live BOOLEAN DEFAULT true,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  equity_curve DECIMAL[] -- Array for sparklines
);

-- Enable RLS
ALTER TABLE market_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_results ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public Read Access" ON market_data FOR SELECT TO public USING (true);
CREATE POLICY "Public Read Access" ON performance_results FOR SELECT TO public USING (true);

-- Insert dummy performance metrics for existing products
DO $$
DECLARE
  gold_algo_id UUID;
  trend_algo_id UUID;
  news_algo_id UUID;
  momentum_algo_id UUID;
BEGIN
  SELECT id INTO gold_algo_id FROM products WHERE name = 'Gold Scalper Algorithm' LIMIT 1;
  SELECT id INTO trend_algo_id FROM products WHERE name = 'Trend Capture Algorithm' LIMIT 1;
  SELECT id INTO news_algo_id FROM products WHERE name = 'News Reaction Algorithm' LIMIT 1;
  SELECT id INTO momentum_algo_id FROM products WHERE name = 'Momentum Swing Algorithm' LIMIT 1;

  IF gold_algo_id IS NOT NULL THEN
    INSERT INTO performance_results (product_id, win_rate, monthly_return, drawdown, total_trades, equity_curve)
    VALUES (gold_algo_id, 78.5, 12.4, 4.2, 1420, ARRAY[100, 102, 101, 105, 108, 107, 112, 115, 124]);
  END IF;

  IF trend_algo_id IS NOT NULL THEN
    INSERT INTO performance_results (product_id, win_rate, monthly_return, drawdown, total_trades, equity_curve)
    VALUES (trend_algo_id, 65.2, 8.1, 2.5, 450, ARRAY[100, 101, 103, 104, 102, 105, 107, 108]);
  END IF;

  IF news_algo_id IS NOT NULL THEN
    INSERT INTO performance_results (product_id, win_rate, monthly_return, drawdown, total_trades, equity_curve)
    VALUES (news_algo_id, 82.0, 19.5, 8.4, 320, ARRAY[100, 105, 115, 112, 108, 118, 125, 119]);
  END IF;

  IF momentum_algo_id IS NOT NULL THEN
    INSERT INTO performance_results (product_id, win_rate, monthly_return, drawdown, total_trades, equity_curve)
    VALUES (momentum_algo_id, 72.4, 10.2, 5.1, 890, ARRAY[100, 102, 104, 103, 106, 108, 110]);
  END IF;
  
  -- Insert Market Data
  INSERT INTO market_data (symbol, asset_class, price, change_24h)
  VALUES 
    ('XAUUSD', 'Forex', 2415.42, 1.2),
    ('EURUSD', 'Forex', 1.0854, -0.4),
    ('NAS100', 'Indices', 18245.10, 0.8),
    ('BTCUSD', 'Crypto', 64230.15, 2.5)
  ON CONFLICT (symbol) DO NOTHING;
END $$;
