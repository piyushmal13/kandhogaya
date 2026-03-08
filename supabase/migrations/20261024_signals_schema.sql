-- Create table for signal subscriptions
CREATE TABLE IF NOT EXISTS signal_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  user_phone TEXT NOT NULL,
  plan_duration TEXT NOT NULL, -- '1 Month', '3 Months', '6 Months'
  amount DECIMAL(10, 2) NOT NULL,
  transaction_id TEXT,
  screenshot_url TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create storage bucket for payment screenshots
INSERT INTO storage.buckets (id, name, public) 
VALUES ('payment-proofs', 'payment-proofs', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow public uploads (for simplicity in this demo, ideally authenticated)
CREATE POLICY "Allow public uploads" ON storage.objects
FOR INSERT TO public
WITH CHECK (bucket_id = 'payment-proofs');

-- Policy to allow public reads (so admins can see proofs)
CREATE POLICY "Allow public reads" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'payment-proofs');
