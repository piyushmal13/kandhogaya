-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  strategy_type TEXT NOT NULL,
  description TEXT,
  monthly_price DECIMAL(10, 2) NOT NULL,
  yearly_price DECIMAL(10, 2) NOT NULL,
  risk_level TEXT, -- 'Low', 'Medium', 'High'
  win_rate DECIMAL(5, 2),
  supported_assets TEXT[],
  type TEXT DEFAULT 'algorithm', -- 'algorithm', 'indicator', etc.
  features TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create algo_subscriptions table
CREATE TABLE IF NOT EXISTS algo_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  algo_id UUID REFERENCES products(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL, -- 'Monthly', 'Yearly'
  subscription_status TEXT DEFAULT 'active', -- 'active', 'expired', 'cancelled'
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial algorithms
INSERT INTO products (name, strategy_type, description, monthly_price, yearly_price, risk_level, win_rate, supported_assets, features)
VALUES
  (
    'Gold Scalper Algorithm',
    'High-Frequency Scalping',
    'High-frequency scalping strategy designed for XAUUSD volatility. Capitalizes on short-term price movements during London and NY sessions.',
    49.00,
    399.00,
    'Medium',
    78.5,
    ARRAY['Gold (XAUUSD)'],
    ARRAY['Auto-Stop Loss', 'News Filter', 'Trailing Stop', 'M1/M5 Timeframe']
  ),
  (
    'Trend Capture Algorithm',
    'Trend Following',
    'Identifies and rides major market trends. Best for swing traders looking for larger moves with lower frequency.',
    59.00,
    499.00,
    'Low',
    65.2,
    ARRAY['EURUSD', 'GBPUSD', 'USDJPY'],
    ARRAY['Multi-Timeframe Analysis', 'Breakout Detection', 'Pyramiding Logic']
  ),
  (
    'News Reaction Algorithm',
    'Event-Driven',
    'Executes trades based on high-impact economic news releases. Ultra-low latency execution required.',
    99.00,
    899.00,
    'High',
    82.0,
    ARRAY['Major Pairs', 'Gold', 'Indices'],
    ARRAY['Economic Calendar Integration', 'Slippage Protection', 'Volatility Breakout']
  ),
  (
    'Momentum Swing Algorithm',
    'Swing Trading',
    'Captures medium-term momentum shifts. Holds trades for days to weeks.',
    69.00,
    599.00,
    'Medium',
    72.4,
    ARRAY['US30', 'NAS100', 'SPX500'],
    ARRAY['Dynamic Position Sizing', 'Mean Reversion Filter', 'H4/D1 Timeframe']
  );
