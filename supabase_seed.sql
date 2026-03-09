-- Supabase Seed Data Script
-- Run this script in your Supabase SQL Editor to populate your tables with 5 example rows each.

-- 1. Update Reviews Table Schema (if needed) to match frontend expectations
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS role text;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS text text;
ALTER TABLE public.webinars ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.webinars ADD COLUMN IF NOT EXISTS status text DEFAULT 'upcoming';
ALTER TABLE public.webinars ADD COLUMN IF NOT EXISTS max_attendees integer DEFAULT 500;
ALTER TABLE public.webinars ADD COLUMN IF NOT EXISTS registration_count integer DEFAULT 0;
ALTER TABLE public.content_posts ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;

-- 2. Populate Products (Algo Bots)
INSERT INTO public.products (name, description, type, strategy_type, risk_level, price, metadata) VALUES
('Quantum Scalper Pro', 'High-frequency scalping algorithm designed for major forex pairs. Executes trades in milliseconds.', 'algo_bot', 'High-Frequency Scalping', 'High', 149, '{"win_rate": 82, "supported_assets": ["EUR/USD", "GBP/USD", "USD/JPY"], "monthly_price": 149, "yearly_price": 1490, "features": ["Sub-millisecond execution", "Dynamic stop-loss", "News filter integration"]}'),
('Trend Rider AI', 'Machine learning model that identifies and rides long-term macroeconomic trends.', 'algo_bot', 'Trend Following', 'Medium', 99, '{"win_rate": 65, "supported_assets": ["XAU/USD", "BTC/USD", "S&P500"], "monthly_price": 99, "yearly_price": 990, "features": ["Deep learning trend analysis", "Trailing stop optimization", "Multi-timeframe confirmation"]}'),
('Mean Reversion Master', 'Capitalizes on temporary price deviations from historical averages in ranging markets.', 'algo_bot', 'Mean Reversion', 'Low', 79, '{"win_rate": 75, "supported_assets": ["AUD/CAD", "NZD/USD", "EUR/GBP"], "monthly_price": 79, "yearly_price": 790, "features": ["Statistical arbitrage", "Low drawdown", "Grid management"]}'),
('Crypto Arbitrage Bot', 'Exploits price inefficiencies across multiple cryptocurrency exchanges simultaneously.', 'algo_bot', 'Arbitrage', 'Low', 199, '{"win_rate": 95, "supported_assets": ["BTC", "ETH", "SOL", "XRP"], "monthly_price": 199, "yearly_price": 1990, "features": ["Cross-exchange execution", "Risk-free arbitrage", "API latency optimization"]}'),
('Breakout Hunter', 'Identifies key support/resistance levels and trades momentum breakouts with high precision.', 'algo_bot', 'Breakout Momentum', 'High', 129, '{"win_rate": 58, "supported_assets": ["GBP/JPY", "US30", "NAS100"], "monthly_price": 129, "yearly_price": 1290, "features": ["Volatility expansion detection", "Volume profile analysis", "Trailing profit capture"]}');

-- 3. Populate Webinars
INSERT INTO public.webinars (title, description, date_time, speaker, is_paid, price, metadata) VALUES
('Mastering Institutional Order Flow', 'Learn how to read the tape and trade alongside smart money institutions.', now() + interval '2 days', 'Michael Chen', false, 0, '{"duration": "90 mins", "level": "Advanced"}'),
('Algorithmic Trading for Beginners', 'A step-by-step guide to setting up your first automated trading bot.', now() + interval '5 days', 'Sarah Jenkins', false, 0, '{"duration": "60 mins", "level": "Beginner"}'),
('Live NFP Trading Session', 'Watch our head traders navigate the Non-Farm Payrolls volatility live.', now() + interval '10 days', 'David Ross', true, 49, '{"duration": "120 mins", "level": "All Levels"}'),
('Advanced Risk Management Strategies', 'Protect your capital and maximize returns using institutional risk models.', now() + interval '15 days', 'Elena Rodriguez', false, 0, '{"duration": "45 mins", "level": "Intermediate"}'),
('Crypto Market Outlook Q3', 'Deep dive into on-chain metrics and macroeconomic factors affecting crypto.', now() + interval '20 days', 'Alex Wong', true, 29, '{"duration": "60 mins", "level": "Intermediate"}');

-- 4. Populate Content Posts (Blog)
INSERT INTO public.content_posts (title, slug, content, content_type, status, published_at, metadata) VALUES
('5 Habits of Highly Profitable Traders', '5-habits-profitable-traders', 'Trading is 80% psychology and 20% strategy. In this article, we explore the daily habits that separate the top 1% of traders from the rest...', 'blog', 'published', now() - interval '1 day', '{"author": "IFXTrades Team", "read_time": "5 min read", "image": "https://picsum.photos/seed/trading1/800/400"}'),
('Understanding Market Structure Shifts', 'understanding-market-structure-shifts', 'Market structure is the foundation of price action trading. Learn how to identify true breaks of structure versus fakeouts...', 'blog', 'published', now() - interval '3 days', '{"author": "Michael Chen", "read_time": "8 min read", "image": "https://picsum.photos/seed/trading2/800/400"}'),
('The Rise of AI in Algorithmic Trading', 'rise-of-ai-algo-trading', 'Artificial intelligence is revolutionizing how we approach the financial markets. Discover how machine learning models are outperforming traditional indicators...', 'blog', 'published', now() - interval '7 days', '{"author": "Sarah Jenkins", "read_time": "6 min read", "image": "https://picsum.photos/seed/trading3/800/400"}'),
('How to Trade the Non-Farm Payrolls (NFP)', 'how-to-trade-nfp', 'The NFP report is notorious for causing massive volatility. Here is our step-by-step institutional approach to trading this major economic event safely...', 'blog', 'published', now() - interval '14 days', '{"author": "David Ross", "read_time": "10 min read", "image": "https://picsum.photos/seed/trading4/800/400"}'),
('Risk Management: The Holy Grail of Trading', 'risk-management-holy-grail', 'You can have a strategy with a 90% win rate, but without proper risk management, you will eventually blow your account. Here is how to protect your capital...', 'blog', 'published', now() - interval '21 days', '{"author": "Elena Rodriguez", "read_time": "7 min read", "image": "https://picsum.photos/seed/trading5/800/400"}');

-- 5. Populate Reviews
INSERT INTO public.reviews (rating, text, name, role, created_at) VALUES
(5, 'The Quantum Scalper Pro completely changed my trading. I went from blowing accounts to consistent 5% monthly returns. The execution speed is unmatched.', 'James T.', 'Prop Firm Trader', now() - interval '2 days'),
(5, 'IFXTrades Academy provided the structure I needed. The institutional order flow concepts finally made price action click for me.', 'Sarah M.', 'Retail Trader', now() - interval '5 days'),
(4, 'Great signals, very accurate. I just wish there were more setups during the Asian session, but the London and NY calls are spot on.', 'David K.', 'Part-time Trader', now() - interval '10 days'),
(5, 'I have been using the Trend Rider AI for 6 months. It caught the entire gold rally perfectly. Best investment I have made in my trading career.', 'Elena R.', 'Portfolio Manager', now() - interval '15 days'),
(5, 'The live webinar sessions are pure gold. Watching Michael trade live and explain his thought process is invaluable for any aspiring trader.', 'Alex W.', 'Student', now() - interval '20 days');

-- 6. Populate Signals (Optional, if used)
INSERT INTO public.signals (asset, direction, entry_price, stop_loss, take_profit, status, created_at) VALUES
('XAU/USD', 'BUY', 2350.50, 2340.00, 2380.00, 'active', now() - interval '1 hour'),
('EUR/USD', 'SELL', 1.0850, 1.0880, 1.0750, 'closed', now() - interval '1 day'),
('GBP/JPY', 'BUY', 192.30, 191.50, 194.00, 'active', now() - interval '2 hours'),
('BTC/USD', 'BUY', 65000, 62000, 72000, 'active', now() - interval '5 hours'),
('US30', 'SELL', 39500, 39700, 39000, 'closed', now() - interval '2 days');

-- 7. Populate Algorithms (Optional, if used separately from products)
INSERT INTO public.algorithms (name, description, created_at) VALUES
('Alpha Trend', 'Follows major market trends using moving average crossovers.', now()),
('Beta Revert', 'Mean reversion strategy for ranging markets.', now()),
('Gamma Scalp', 'High frequency scalping for low volatility periods.', now()),
('Delta Hedge', 'Options hedging strategy for portfolio protection.', now()),
('Omega Arbitrage', 'Statistical arbitrage across correlated assets.', now());
