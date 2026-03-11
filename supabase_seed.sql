-- Supabase Seed Data Script
-- Run this script in your Supabase SQL Editor to populate your tables with professional institutional examples.

-- 1. Populate Products (Institutional Algos)
INSERT INTO public.products (name, description, category, price, image_url, strategy_details, risk_profile, performance_data, terms_and_conditions) VALUES
(
  'Apex Alpha V4', 
  'High-frequency quantitative model designed for XAUUSD and Major FX pairs. Executes trades in sub-millisecond environments.', 
  'Quantitative', 
  199.00, 
  'https://images.unsplash.com/photo-1642790103517-181294696222?auto=format&fit=crop&q=80&w=800',
  'Utilizes a proprietary mean-reversion algorithm combined with institutional order flow tracking. It identifies liquidity voids and enters trades with 0.1ms execution logic.',
  'Conservative: Max Drawdown 4.2%. Dynamic position sizing based on ATR volatility.',
  '[{"type": "text", "content": "92% Win Rate over 24 months"}, {"type": "image", "content": "https://picsum.photos/seed/apex/800/400"}]'::jsonb,
  'Standard institutional license applies. No redistribution.'
),
(
  'QuantFlow HFT', 
  'Sub-millisecond execution engine for scalping the New York session. Optimized for ECN bridges.', 
  'HFT Scalping', 
  299.00, 
  'https://images.unsplash.com/photo-1611974717535-7c446a0564cb?auto=format&fit=crop&q=80&w=800',
  'Focuses on micro-inefficiencies in the ECN bridge. Best used with low-spread institutional brokers.',
  'Aggressive: Designed for high-frequency turnover. Requires minimum $10k equity.',
  '[{"type": "text", "content": "Average Monthly Return: 18.4%"}]'::jsonb,
  'Requires VPS with <1ms latency to broker server.'
),
(
  'Macro Trend AI', 
  'Long-term trend following model using deep learning to analyze macroeconomic cycles.', 
  'Trend Following', 
  149.00, 
  'https://images.unsplash.com/photo-1611974717535-7c446a0564cb?auto=format&fit=crop&q=80&w=800',
  'Analyzes interest rate differentials, inflation data, and central bank sentiment to position for multi-month trends.',
  'Moderate: Targeted Sharpe Ratio of 1.8. Diversified across 12 major pairs.',
  '[{"type": "text", "content": "Annualized Return: 42%"}]'::jsonb,
  'Best suited for long-term capital appreciation.'
);

-- 2. Populate Webinars
INSERT INTO public.webinars (title, description, date_time, speaker_name, status, is_paid, price, webinar_image_url, about_content, sponsor_logos) VALUES
(
  'Institutional Order Flow Masterclass', 
  'Learn how to track "Smart Money" using advanced footprint charts and liquidity analysis.', 
  NOW() + INTERVAL '2 days', 
  'Alex Wright', 
  'upcoming', 
  false, 
  0, 
  'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=1200',
  'In this session, we break down the exact mechanics of how hedge funds move the market. We will look at real-time XAUUSD data and identify the next major liquidity grab.',
  '["https://logo.clearbit.com/goldmansachs.com", "https://logo.clearbit.com/bloomberg.com"]'
),
(
  'Macroeconomic Outlook 2026', 
  'Deep dive into interest rates, inflation, and the future of the USD in the global economy.', 
  NOW() - INTERVAL '5 days', 
  'Sarah Chen', 
  'past', 
  true, 
  49.00, 
  'https://images.unsplash.com/photo-1611974717535-7c446a0564cb?auto=format&fit=crop&q=80&w=1200',
  'This session concluded with a 94% accuracy rating on the subsequent NFP release. We analyzed the yield curve inversion and its implications for the upcoming quarter.',
  '[]'
);

-- 3. Populate Signals
INSERT INTO public.signals (asset, direction, entry_price, stop_loss, take_profit, status) VALUES
('XAUUSD', 'BUY', 2042.50, 2035.00, 2065.00, 'active'),
('EURUSD', 'SELL', 1.0850, 1.0890, 1.0720, 'active'),
('BTCUSD', 'BUY', 64200.00, 62000.00, 72000.00, 'closed');

-- 4. Populate Reviews
INSERT INTO public.reviews (name, user_name, role, region, rating, text, image_url) VALUES
(
  'James Miller', 
  'James Miller', 
  'Prop Firm Trader', 
  'United Kingdom', 
  5, 
  'The Apex Alpha V4 has completely transformed my trading. The drawdown management is unlike anything I have seen in the retail space.', 
  'https://i.pravatar.cc/150?u=james'
),
(
  'Elena Rodriguez', 
  'Elena Rodriguez', 
  'Portfolio Manager', 
  'Spain', 
  5, 
  'The institutional webinars are worth the subscription alone. The level of detail on order flow is professional grade.', 
  'https://i.pravatar.cc/150?u=elena'
);

-- 5. Populate Market Data
INSERT INTO public.market_data (symbol, price, change, up) VALUES
('XAUUSD', '2150.45', '+0.45%', true),
('EURUSD', '1.0845', '-0.12%', false),
('BTCUSD', '64230.00', '+2.40%', true),
('NASDAQ', '18240.50', '+1.10%', true);
