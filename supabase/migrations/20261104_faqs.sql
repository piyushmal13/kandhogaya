-- Create faqs table
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Access" ON faqs 
  FOR SELECT TO anon, authenticated 
  USING (true);

CREATE POLICY "Admin All Access" ON faqs 
  FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Seed FAQs
INSERT INTO faqs (question, answer, priority) VALUES
('What is IFX Trades?', 'IFX Trades is Asia''s #1 institutional forex education and research platform, providing professional quantitative analysis and algorithmic infrastructure for modern market participants.', 1),
('Do you provide financial advice or signals?', 'No. IFX Trades is strictly an educational and research desk. We do not provide financial advice, trading signals, or manage funds. All materials are for research and educational purposes only.', 2),
('How do I access the Master Terminal?', 'Access to the Master Terminal is granted to members who have completed the institutional onboarding and verified their algorithmic infrastructure compatibility.', 3),
('What is the Sovereign Node protocol?', 'The Sovereign Node protocol is our proprietary framework for ensuring decentralized data integrity and low-latency execution across institutional research nodes.', 4)
ON CONFLICT DO NOTHING;
