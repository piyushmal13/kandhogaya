-- Core identity, CRM, and operational tables required by later migrations.

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'user'
    CHECK (role IN ('user', 'admin', 'agent', 'sales_agent', 'support', 'analyst')),
  referred_by UUID REFERENCES users(id) ON DELETE SET NULL,
  crm_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile" ON users;
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT TO authenticated
  USING (id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "Admins can view all users" ON users;
CREATE POLICY "Admins can view all users" ON users
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users AS admin_user
      WHERE admin_user.id = auth.uid() AND admin_user.role = 'admin'
    )
  );

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  subject TEXT,
  message TEXT,
  source TEXT DEFAULT 'website',
  status TEXT DEFAULT 'new',
  stage TEXT DEFAULT 'NEW',
  score INTEGER DEFAULT 0,
  is_hot BOOLEAN DEFAULT false,
  last_action_at TIMESTAMPTZ,
  conversion_probability DECIMAL(5,2) DEFAULT 0,
  priority_tag TEXT,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  referred_by_code TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  crm_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_referred_by_code ON leads(referred_by_code);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT,
  name TEXT,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anonymous contact insert" ON contact_messages;
CREATE POLICY "Anonymous contact insert" ON contact_messages
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS content_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS content_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  category_id UUID REFERENCES content_categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  body TEXT,
  content_type TEXT NOT NULL DEFAULT 'blog',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
  featured_image TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE content_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read content categories" ON content_categories;
CREATE POLICY "Public read content categories" ON content_categories
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public read published content" ON content_posts;
CREATE POLICY "Public read published content" ON content_posts
  FOR SELECT TO anon, authenticated
  USING (status = 'published');

DROP POLICY IF EXISTS "Admins manage content" ON content_posts;
CREATE POLICY "Admins manage content" ON content_posts
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

CREATE INDEX IF NOT EXISTS idx_content_posts_slug ON content_posts(slug);
CREATE INDEX IF NOT EXISTS idx_content_posts_type_status ON content_posts(content_type, status);

CREATE TABLE IF NOT EXISTS agent_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_status TEXT NOT NULL DEFAULT 'pending',
  commission_rate DECIMAL(5,2) NOT NULL DEFAULT 10.00,
  is_online BOOLEAN NOT NULL DEFAULT true,
  current_load INTEGER NOT NULL DEFAULT 0,
  performance_score DECIMAL(5,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE agent_accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Agents can view own account" ON agent_accounts;
CREATE POLICY "Agents can view own account" ON agent_accounts
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins manage agent accounts" ON agent_accounts;
CREATE POLICY "Admins manage agent accounts" ON agent_accounts
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE OR REPLACE VIEW agents
WITH (security_invoker = true) AS
SELECT
  u.id,
  u.id AS user_id,
  u.full_name AS name,
  u.email,
  u.phone,
  aa.account_status,
  aa.is_online,
  aa.current_load,
  aa.performance_score,
  aa.commission_rate
FROM users u
LEFT JOIN agent_accounts aa ON aa.user_id = u.id
WHERE u.role IN ('agent', 'sales_agent', 'admin');
