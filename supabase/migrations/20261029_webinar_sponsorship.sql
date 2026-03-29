-- Create webinar_sponsors table
CREATE TABLE IF NOT EXISTS webinar_sponsors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  webinar_id UUID REFERENCES webinars(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('Headline', 'Partner', 'Supporter')),
  logo_url TEXT,
  website_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on webinar_sponsors
ALTER TABLE webinar_sponsors ENABLE ROW LEVEL SECURITY;

-- Public read access for sponsors
CREATE POLICY "Public Read Access" ON webinar_sponsors
  FOR SELECT TO public USING (true);

-- Admin-only write access for sponsors (assuming authenticated users for now)
CREATE POLICY "Admin All Access" ON webinar_sponsors
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create storage bucket for sponsor logos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('sponsor-logos', 'sponsor-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Public read
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'sponsor-logos');

-- Storage RLS: Admin-only write
CREATE POLICY "Admin Full Access" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'sponsor-logos')
  WITH CHECK (bucket_id = 'sponsor-logos');

-- Insert dummy sponsor data for demonstration
-- First, get a webinar_id from the table
DO $$
DECLARE
  gold_webinar_id UUID;
  algo_webinar_id UUID;
BEGIN
  SELECT id INTO gold_webinar_id FROM webinars WHERE title = 'Gold Market Outlook — Q3 2026' LIMIT 1;
  SELECT id INTO algo_webinar_id FROM webinars WHERE title = 'Algorithmic Trading Masterclass' LIMIT 1;

  IF gold_webinar_id IS NOT NULL THEN
    INSERT INTO webinar_sponsors (webinar_id, name, tier, logo_url)
    VALUES 
      (gold_webinar_id, 'Bullion Global', 'Headline', 'https://api.dicebear.com/7.x/initials/svg?seed=BG'),
      (gold_webinar_id, 'XAU Capital', 'Partner', 'https://api.dicebear.com/7.x/initials/svg?seed=XC');
  END IF;

  IF algo_webinar_id IS NOT NULL THEN
    INSERT INTO webinar_sponsors (webinar_id, name, tier, logo_url)
    VALUES 
      (algo_webinar_id, 'Algo Labs', 'Headline', 'https://api.dicebear.com/7.x/initials/svg?seed=AL'),
      (algo_webinar_id, 'Quant Systems', 'Partner', 'https://api.dicebear.com/7.x/initials/svg?seed=QS');
  END IF;
END $$;
