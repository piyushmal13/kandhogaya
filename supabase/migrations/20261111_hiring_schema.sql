-- Create hiring_positions table for internal and B2B broker talent
CREATE TABLE IF NOT EXISTS hiring_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT[] NOT NULL DEFAULT '{}'::text[],
  is_active BOOLEAN DEFAULT true,
  type TEXT NOT NULL CHECK (type IN ('internal', 'broker_talent')),
  location TEXT DEFAULT 'Remote',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create hiring_applications table for storing candidate CVs and submissions
CREATE TABLE IF NOT EXISTS hiring_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  position_id UUID REFERENCES hiring_positions(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  resume_url TEXT NOT NULL,
  portfolio_url TEXT,
  cover_letter TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE hiring_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE hiring_applications ENABLE ROW LEVEL SECURITY;

-- Select policies
DROP POLICY IF EXISTS "Public view active positions" ON hiring_positions;
CREATE POLICY "Public view active positions" ON hiring_positions
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "Public submit applications" ON hiring_applications;
CREATE POLICY "Public submit applications" ON hiring_applications
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Admin policies
DROP POLICY IF EXISTS "Admins manage positions" ON hiring_positions;
CREATE POLICY "Admins manage positions" ON hiring_positions
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admins view applications" ON hiring_applications;
CREATE POLICY "Admins view applications" ON hiring_applications
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Ensure resumes storage bucket exists
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for resumes
DROP POLICY IF EXISTS "Public insert resumes" ON storage.objects;
CREATE POLICY "Public insert resumes" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'resumes');

DROP POLICY IF EXISTS "Public read resumes" ON storage.objects;
CREATE POLICY "Public read resumes" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'resumes');
