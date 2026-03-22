-- SUPABASE DATABASE SYNC REPAIR SCRIPT 
-- Run this securely in the Supabase SQL Editor if any fields are failing on product saves/reviews.

-- 1. Addition of product 'type' for Algo Marketplace Filtering
-- The UI requires "type" to discern between algo_bot, indicator, and course displays properly.
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS type text DEFAULT 'algo_bot';

-- 2. Ensure explicit reviews text field (Alias used in UI)
-- The UI previously mapped 'comment' logic into the 'text' column, making sure to preserve 'text'.
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS comment text;

-- 3. (Optional) Reviews Targeting
-- If you ever wish to attach specific Reviews towards Specific Products
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS target_id uuid REFERENCES public.products(id);

-- 4. Content Metadata and Publishing Timestamp 
-- The UI/Admin Content Management expects a JSON construct for metadata and timestamps
ALTER TABLE public.content_posts ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.content_posts ADD COLUMN IF NOT EXISTS published_at timestamp with time zone;
