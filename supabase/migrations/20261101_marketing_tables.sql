-- Create table for lead inquiries (if not exists)
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT,
  source TEXT DEFAULT 'website',
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create table for consultation requests (if not exists)
CREATE TABLE IF NOT EXISTS consultations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  account_size TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- RLS Policies (Allow anonymous inserts for public forms)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable anonymous insert for leads" ON leads FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Enable service role full access for leads" ON leads TO service_role USING (true);

ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable anonymous insert for consultations" ON consultations FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Enable service role full access for consultations" ON consultations TO service_role USING (true);
