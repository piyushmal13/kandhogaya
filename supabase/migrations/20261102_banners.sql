-- Create banners table for editable advertisement banners
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  placement TEXT NOT NULL, -- e.g. 'home','header','footer','sidebar'
  html_content TEXT,
  image_url TEXT,
  link_url TEXT,
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  start_at TIMESTAMPTZ,
  end_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security and allow public reads for active banners
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public active banners" ON banners FOR SELECT TO public
  USING (
    is_active = true AND
    (start_at IS NULL OR start_at <= now()) AND
    (end_at IS NULL OR end_at >= now())
  );

-- Admin full access (requires users table with role column)
CREATE POLICY "Admin full access" ON banners FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Ensure a storage bucket for banner images exists
INSERT INTO storage.buckets (id, name, public) VALUES ('banners', 'banners', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: public read for banner objects
CREATE POLICY "Public storage read for banners" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'banners');

-- Insert a demo banner
INSERT INTO banners (name, placement, html_content, image_url, link_url, priority)
VALUES
( 'Launch Promo', 'home', '<div style="background:#0B1221;color:#fff;padding:12px;border-radius:6px;text-align:center;">Launching Institutional Platform — <strong>Join the Webinar</strong></div>', NULL, 'https://example.com/webinar', 10)
ON CONFLICT DO NOTHING;
