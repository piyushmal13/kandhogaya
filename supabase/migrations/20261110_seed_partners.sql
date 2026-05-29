-- IFX TRADES — INTEGRATION PARTNER DATA SEEDING & SCHEMA HARDENING
-- Checks and creates expected columns 'title' and 'description' to prevent UI query boundary crashes.

-- 1. Ensure 'title' column exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'banners' 
    AND column_name = 'title'
  ) THEN
    ALTER TABLE public.banners ADD COLUMN title TEXT;
    -- Backfill from name
    UPDATE public.banners SET title = name;
  END IF;
END $$;

-- 2. Ensure 'description' column exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'banners' 
    AND column_name = 'description'
  ) THEN
    ALTER TABLE public.banners ADD COLUMN description TEXT;
    -- Backfill from html_content
    UPDATE public.banners SET description = html_content;
  END IF;
END $$;

-- 3. Delete existing dynamic partners to avoid duplicate entries when re-seeded
DELETE FROM public.banners WHERE placement = 'partner';

-- 4. Seed Dynamic Partners with precise categories, priorities, and image URLs
INSERT INTO public.banners (name, title, placement, image_url, description, is_active, priority)
VALUES
('MetaTrader 5', 'MetaTrader 5', 'partner', '/metatrader5.png', 'Trading Platform', true, 1),
('TradingView', 'TradingView', 'partner', '/tradingview.png', 'Charting Terminal', true, 2),
('Vantage Markets', 'Vantage Markets', 'partner', '', 'Liquidity Bridge', true, 3),
('VT Markets', 'VT Markets', 'partner', '', 'Execution Partner', true, 4),
('Markets4you', 'Markets4you', 'partner', '', 'CFD Provider', true, 5)
ON CONFLICT DO NOTHING;
