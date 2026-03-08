-- Create webinars table
CREATE TABLE IF NOT EXISTS webinars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  speaker_name TEXT,
  speaker_role TEXT,
  speaker_image TEXT,
  date_time TIMESTAMPTZ NOT NULL,
  duration INTEGER, -- in minutes
  price DECIMAL(10, 2) DEFAULT 0,
  is_paid BOOLEAN DEFAULT false,
  max_attendees INTEGER,
  registration_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'upcoming', -- 'upcoming', 'live', 'ended'
  cover_image TEXT,
  agenda TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create webinar_registrations table
CREATE TABLE IF NOT EXISTS webinar_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  webinar_id UUID REFERENCES webinars(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT,
  name TEXT,
  registration_date TIMESTAMPTZ DEFAULT NOW(),
  payment_status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'free'
  attended BOOLEAN DEFAULT false
);

-- Insert dummy data for demonstration
INSERT INTO webinars (title, description, speaker_name, speaker_role, date_time, duration, price, is_paid, max_attendees, registration_count, status, cover_image, agenda)
VALUES
  (
    'Gold Market Outlook — Q3 2026',
    'Comprehensive analysis of XAUUSD market structure, institutional order flow, and macroeconomic drivers for the upcoming quarter.',
    'Sarah Jenkins',
    'Head of Commodities Research',
    NOW() + INTERVAL '2 days',
    60,
    0,
    false,
    500,
    468,
    'upcoming',
    'https://picsum.photos/seed/goldwebinar/800/450',
    ARRAY['Macroeconomic Drivers', 'Technical Analysis (D1/H4)', 'Key Liquidity Zones', 'Q&A Session']
  ),
  (
    'Algorithmic Trading Masterclass',
    'Deep dive into building high-frequency trading systems using Python and MQL5. Learn how to backtest and deploy institutional-grade bots.',
    'Dr. Alex Chen',
    'Lead Quant Developer',
    NOW() + INTERVAL '9 days',
    120,
    199.00,
    true,
    100,
    45,
    'upcoming',
    'https://picsum.photos/seed/algowebinar/800/450',
    ARRAY['Strategy Design', 'Backtesting Frameworks', 'Risk Management Logic', 'Live Deployment']
  ),
  (
    'Forex Macro Outlook',
    'Analyzing the impact of central bank policies on major currency pairs. EURUSD, GBPUSD, and USDJPY focus.',
    'Michael Ross',
    'Senior FX Strategist',
    NOW() + INTERVAL '16 days',
    45,
    0,
    false,
    1000,
    128,
    'upcoming',
    'https://picsum.photos/seed/forexwebinar/800/450',
    ARRAY['Central Bank Policies', 'Interest Rate Projections', 'Geopolitical Risks', 'Trade Setups']
  );
