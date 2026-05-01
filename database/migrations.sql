-- Trading Intelligence Hub: Production Schema (PostgreSQL/Supabase)
-- This script is designed to be idempotent (can be run multiple times safely)

-- 1. Identity Service
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT auth.uid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'editor')),
    referred_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Admins can view all users" ON users FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
ALTER TABLE users ADD COLUMN IF NOT EXISTS referred_by UUID;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS crm_metadata JSONB DEFAULT '{}';

-- 2. Product Service (Algos/Bots)
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL DEFAULT 'algo_bot',
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE products ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'algo_bot';
ALTER TABLE products ADD COLUMN IF NOT EXISTS price DECIMAL(12,2) DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS strategy_details TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS risk_profile TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS performance_data JSONB DEFAULT '[]';
ALTER TABLE products ADD COLUMN IF NOT EXISTS q_and_a JSONB DEFAULT '[]';
ALTER TABLE products ADD COLUMN IF NOT EXISTS terms_and_conditions TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS strategy_graph_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS backtesting_result_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS video_explanation_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS long_plan_offers JSONB DEFAULT '[]';
ALTER TABLE products ADD COLUMN IF NOT EXISTS category TEXT;

CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    duration_days INTEGER NOT NULL,
    stripe_price_id TEXT,
    razorpay_plan_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    variant_id UUID REFERENCES product_variants(id),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled', 'past_due')),
    current_period_start TIMESTAMPTZ DEFAULT NOW(),
    current_period_end TIMESTAMPTZ NOT NULL,
    stripe_subscription_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Content Service (Signals, Blogs, Reports)
CREATE TABLE IF NOT EXISTS content_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS content_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES users(id),
    category_id UUID REFERENCES content_categories(id),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content_type TEXT NOT NULL DEFAULT 'blog',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
    body TEXT,
    featured_image TEXT,
    data JSONB DEFAULT '{}',
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure content_type exists before creating index
ALTER TABLE content_posts ADD COLUMN IF NOT EXISTS content_type TEXT NOT NULL DEFAULT 'blog';
ALTER TABLE content_posts ADD COLUMN IF NOT EXISTS body TEXT;
ALTER TABLE content_posts ADD COLUMN IF NOT EXISTS featured_image TEXT;
ALTER TABLE content_posts ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES users(id);

-- 4. Algo & License Service
CREATE TABLE IF NOT EXISTS algo_bots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id),
    name TEXT NOT NULL,
    version TEXT,
    download_url TEXT,
    checksum TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bot_licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    algo_id UUID REFERENCES algo_bots(id),
    license_key TEXT UNIQUE NOT NULL,
    account_id TEXT, -- MT5 Account Number
    hardware_id TEXT,
    is_active BOOLEAN DEFAULT true,
    last_validated_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE bot_licenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own licenses" ON bot_licenses FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins have full access to licenses" ON bot_licenses FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- 5. Event & Education Service
CREATE TABLE IF NOT EXISTS webinars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    zoom_link TEXT,
    type TEXT DEFAULT 'free' CHECK (type IN ('free', 'paid', 'sponsor')),
    recording_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE webinars ADD COLUMN IF NOT EXISTS recording_url TEXT;
ALTER TABLE webinars ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'free';
ALTER TABLE webinars ADD COLUMN IF NOT EXISTS speaker_name TEXT;
ALTER TABLE webinars ADD COLUMN IF NOT EXISTS speaker_profile_url TEXT;
ALTER TABLE webinars ADD COLUMN IF NOT EXISTS brand_logo_url TEXT;
ALTER TABLE webinars ADD COLUMN IF NOT EXISTS webinar_image_url TEXT;
ALTER TABLE webinars ADD COLUMN IF NOT EXISTS sponsor_logos JSONB DEFAULT '[]';
ALTER TABLE webinars ADD COLUMN IF NOT EXISTS speaker_images JSONB DEFAULT '[]';
ALTER TABLE webinars ADD COLUMN IF NOT EXISTS about_content TEXT;
ALTER TABLE webinars ADD COLUMN IF NOT EXISTS q_and_a JSONB DEFAULT '[]';
ALTER TABLE webinars ADD COLUMN IF NOT EXISTS advanced_features JSONB DEFAULT '{}';
ALTER TABLE webinars ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'upcoming';
ALTER TABLE webinars ADD COLUMN IF NOT EXISTS max_attendees INTEGER DEFAULT 500;
ALTER TABLE webinars ADD COLUMN IF NOT EXISTS registration_count INTEGER DEFAULT 0;
ALTER TABLE webinars ADD COLUMN IF NOT EXISTS date_time TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id),
    title TEXT NOT NULL,
    description TEXT,
    thumbnail TEXT,
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    video_url TEXT,
    content TEXT,
    sort_order INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Analytics & Reviews
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    target_id UUID, -- product_id or course_id (optional for general testimonials)
    name TEXT NOT NULL, -- Display Name
    user_name TEXT, -- Legacy/Alternative name field
    role TEXT, -- e.g., 'Prop Firm Trader'
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    comment TEXT, -- Legacy comment field
    text TEXT NOT NULL, -- Main review content
    image_url TEXT,
    region TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure all columns exist for existing tables
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS text TEXT;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS role TEXT;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS region TEXT;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS user_name TEXT;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS target_id UUID;

-- 7. Market Data & Signals
CREATE TABLE IF NOT EXISTS market_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol TEXT UNIQUE NOT NULL,
    price TEXT NOT NULL,
    change TEXT NOT NULL,
    up BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS signals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset TEXT NOT NULL,
    direction TEXT NOT NULL CHECK (direction IN ('BUY', 'SELL')),
    entry_price DECIMAL(18,8),
    stop_loss DECIMAL(18,8),
    take_profit DECIMAL(18,8),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Access & Sales Tracking
CREATE TABLE IF NOT EXISTS user_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    item_id UUID NOT NULL, -- product_id or course_id
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, item_id)
);

CREATE TABLE IF NOT EXISTS sales_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES users(id),
    user_id UUID REFERENCES users(id),
    product_id UUID REFERENCES products(id),
    sale_amount DECIMAL(12,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS agent_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    account_status TEXT DEFAULT 'pending',
    commission_rate DECIMAL(5,2) DEFAULT 10.00,
    is_online BOOLEAN DEFAULT true,
    current_load INTEGER DEFAULT 0,
    performance_score DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Idempotent column additions for agent_accounts
ALTER TABLE agent_accounts ADD COLUMN IF NOT EXISTS is_online BOOLEAN DEFAULT true;
ALTER TABLE agent_accounts ADD COLUMN IF NOT EXISTS current_load INTEGER DEFAULT 0;
ALTER TABLE agent_accounts ADD COLUMN IF NOT EXISTS performance_score DECIMAL(5,2) DEFAULT 0;

-- Create agents view for compatibility with legacy services
CREATE OR REPLACE VIEW agents AS
SELECT 
    u.id,
    u.full_name as name,
    u.email,
    u.phone,
    aa.account_status,
    aa.is_online,
    aa.current_load,
    aa.performance_score
FROM users u
JOIN agent_accounts aa ON u.id = aa.user_id;

-- 9. Marketing & Support
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id),
    anon_id TEXT,
    source TEXT,
    score INTEGER DEFAULT 0,
    stage TEXT DEFAULT 'NEW',
    is_hot BOOLEAN DEFAULT false,
    last_action_at TIMESTAMPTZ,
    conversion_probability DECIMAL(5,2) DEFAULT 0,
    priority_tag TEXT,
    assigned_to UUID REFERENCES users(id),
    referred_by_code TEXT,
    crm_metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Idempotent column additions for leads
ALTER TABLE leads ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS anon_id TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS score INTEGER DEFAULT 0;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS stage TEXT DEFAULT 'NEW';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS is_hot BOOLEAN DEFAULT false;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_action_at TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS conversion_probability DECIMAL(5,2) DEFAULT 0;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS priority_tag TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES users(id);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS referred_by_code TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS crm_metadata JSONB DEFAULT '{}';

CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    email TEXT,
    subject TEXT,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS webinar_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    webinar_id UUID REFERENCES webinars(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    email TEXT,
    attended BOOLEAN DEFAULT FALSE,
    payment_status TEXT DEFAULT 'completed',
    payment_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(webinar_id, user_id)
);

-- 10. Payments & Subscriptions
CREATE TABLE IF NOT EXISTS signal_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_type TEXT,
    status TEXT DEFAULT 'active',
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "payment-proofs" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(12,2),
    proof_url TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notification_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient TEXT NOT NULL,
    channel TEXT NOT NULL,
    priority TEXT DEFAULT 'MEDIUM',
    payload JSONB DEFAULT '{}',
    status TEXT DEFAULT 'PENDING',
    attempts INTEGER DEFAULT 0,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Legacy Algorithms (Optional)
CREATE TABLE IF NOT EXISTS algorithms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    anon_id TEXT,
    event_type TEXT NOT NULL,
    priority TEXT DEFAULT 'LOW',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Idempotent column additions for analytics_events
ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS anon_id TEXT;
ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'LOW';

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_content_slug ON content_posts(slug);
CREATE INDEX IF NOT EXISTS idx_content_type ON content_posts(content_type);
CREATE INDEX IF NOT EXISTS idx_license_key ON bot_licenses(license_key);
CREATE INDEX IF NOT EXISTS idx_sub_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_signals_status ON signals(status);
CREATE INDEX IF NOT EXISTS idx_market_symbol ON market_data(symbol);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_webinar_reg_email ON webinar_registrations(email);
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id),
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(255) NOT NULL,
  entity_id VARCHAR(255),
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for audit_logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view audit logs" ON audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can insert audit logs" ON audit_logs FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- 12. Systems & Intelligence Hub
CREATE TABLE IF NOT EXISTS system_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    severity TEXT DEFAULT 'info',
    user_id UUID REFERENCES users(id),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RPC functions for high-stakes intelligence updates
CREATE OR REPLACE FUNCTION update_lead_score(p_user_id UUID, p_increment INTEGER)
RETURNS VOID AS 
BEGIN
    UPDATE leads 
    SET score = score + p_increment,
        last_action_at = NOW()
    WHERE user_id = p_user_id;
END;
 LANGUAGE plpgsql;

-- 13. Institutional Performance & Feature Management
CREATE TABLE IF NOT EXISTS feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value JSONB DEFAULT '{}',
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS performance_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    month TEXT NOT NULL,
    year INTEGER NOT NULL,
    win_rate DECIMAL(5,2),
    pips INTEGER,
    return_pct DECIMAL(10,2),
    is_featured BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(month, year)
);

-- Final Column Audit (Production Resilience)
ALTER TABLE webinars ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'free';
ALTER TABLE webinars ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'upcoming';
ALTER TABLE webinars ADD COLUMN IF NOT EXISTS date_time TIMESTAMPTZ;

ALTER TABLE leads ADD COLUMN IF NOT EXISTS crm_metadata JSONB DEFAULT '{}';

-- Seed initial feature flags if missing
INSERT INTO feature_flags (key, enabled)
VALUES 
    ('maintenance_mode', false),
    ('beta_signals', true),
    ('webinar_registration_open', true)
ON CONFLICT (key) DO NOTHING;

-- Seed initial performance placeholders
INSERT INTO performance_results (month, year, win_rate, pips, return_pct, is_featured)
VALUES 
    ('January', 2026, 74.5, 3200, 12.4, true),
    ('February', 2026, 78.2, 4100, 15.1, true)
ON CONFLICT (month, year) DO NOTHING;
