-- Create Master Brokers / Sponsors table
CREATE TABLE IF NOT EXISTS public.brokers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  logo_url TEXT NOT NULL,
  website_url TEXT,
  tagline TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.brokers ENABLE ROW LEVEL SECURITY;

-- Establish select policy for public (everyone)
CREATE POLICY "Allow public read access to active brokers"
  ON public.brokers FOR SELECT TO public USING (is_active = true);

-- Establish full management policies for admins
CREATE POLICY "Allow admins full access to brokers"
  ON public.brokers FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Seed Initial Broker Profiles
INSERT INTO public.brokers (name, logo_url, website_url, tagline, description, is_active)
VALUES
('Vantage Markets', '/vantage.svg', 'https://www.vantagemarkets.com', 'Raw Spreads ECN Broker', 'Access institutional liquidity, tight spreads, and sub-millisecond execution inside Equinix NY4.', true),
('VT Markets', '/vtmarkets.svg', 'https://www.vtmarkets.com', 'Low-Latency CFD Enclave', 'Deploy systematic algo desks with deep tier-1 liquidity, competitive leverage, and secure execution bridging.', true),
('Binance Institutional', '/binance.svg', 'https://accounts.binance.com/register?ref=IFXTRADES', 'Deep Liquidity Corridor', 'Access the world''s deepest digital asset order books, sovereign OTC desks, and secure custodial vaults.', true),
('Swissquote Bank', 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Swissquote_logo.svg', 'https://www.swissquote.com', 'Swiss Custody & Capital Protection', 'Experience Swiss banking security, sovereign margin optimization, and institutional capital preservation.', true),
('Interactive Brokers', 'https://upload.wikimedia.org/wikipedia/commons/1/12/Interactive_Brokers_Logo.svg', 'https://www.interactivebrokers.com', 'Direct Market Access (DMA)', 'Execute systematic volumes directly into global exchange matching engines with transparent low-cost routing.', true)
ON CONFLICT (name) DO UPDATE SET
  logo_url = EXCLUDED.logo_url,
  website_url = EXCLUDED.website_url,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description;
