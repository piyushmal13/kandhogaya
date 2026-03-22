ALTER TABLE products ADD COLUMN IF NOT EXISTS video_url TEXT; COMMENT ON COLUMN products.video_url IS 'URL for the algorithmic trading breakdown video (YouTube/Vimeo)';
