-- Trading Intelligence Hub: Production Schema (PostgreSQL/Supabase)

-- 1. Identity Service
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT auth.uid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'editor')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Product Service
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('signal_sub', 'algo_bot', 'course', 'indicator')),
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

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
    content_type TEXT NOT NULL CHECK (content_type IN ('signal', 'blog', 'market_report', 'announcement')),
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
    body TEXT,
    featured_image TEXT,
    data JSONB DEFAULT '{}', -- Stores signal data (entry, sl, tp)
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

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
    target_id UUID NOT NULL, -- product_id or course_id
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    event_type TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_content_slug ON content_posts(slug);
CREATE INDEX idx_content_type ON content_posts(content_type);
CREATE INDEX idx_license_key ON bot_licenses(license_key);
CREATE INDEX idx_sub_user ON subscriptions(user_id);
