-- Create product_images table and products storage bucket
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  alt_text TEXT,
  is_primary BOOLEAN DEFAULT false,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read product images" ON product_images FOR SELECT TO public USING (true);

-- Ensure storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true)
  ON CONFLICT (id) DO NOTHING;

-- Storage RLS: public read for product images
CREATE POLICY "Public storage read for products" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'products');
