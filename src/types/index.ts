/**
 * Global Type Definitions
 * Exactly mirrors the Supabase public schema — do not add fields not in the DB.
 */

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

export interface QA {
  question: string;
  answer: string;
}

// ---------------------------------------------------------------------------
// users
// ---------------------------------------------------------------------------
export interface User {
  id: string;
  email?: string;
  full_name?: string;
  referred_by?: string;
  created_at: string;
  avatar_url?: string;
  role: 'user' | 'admin' | 'agent';
}

// ---------------------------------------------------------------------------
// webinars
// ---------------------------------------------------------------------------
export interface WebinarSponsor {
  id: string;
  webinar_id: string;
  name: string;
  tier: 'Headline' | 'Partner' | 'Supporter';
  logo_url: string;
  website_url?: string;
}

export interface Webinar {
  id: string;
  title: string;
  description?: string;
  date_time: string;          // timestamptz
  speaker: string;            // normalized field
  speaker_name?: string;      // legacy DB field
  status: 'upcoming' | 'live' | 'past';
  is_paid?: boolean;
  price?: number;
  created_at: string;
  speaker_profile_url?: string;
  brand_logo_url?: string;
  webinar_image_url?: string;
  sponsor_logos?: string[];   // jsonb array
  speaker_images?: string[];  // jsonb array
  about_content?: string;
  q_and_a?: QA[];             // jsonb array
  advanced_features?: Record<string, unknown>; // jsonb object
  max_attendees: number;
  registration_count: number;
  metadata?: Record<string, any>;
  sponsors?: WebinarSponsor[];
}

// ---------------------------------------------------------------------------
// signals  (flat table — NOT a content_post)
// ---------------------------------------------------------------------------
export interface Signal {
  id: string;
  type?: 'TRADE' | 'ANALYSIS' | 'NEWS';
  symbol: string;
  asset?: string;             // legacy DB field
  direction?: 'BUY' | 'SELL';
  entry?: number;
  entry_price?: number;       // legacy DB field
  stop_loss?: number;
  take_profit?: number;
  status: 'active' | 'closed' | 'cancelled' | 'pending';
  created_at: string;
  metadata?: Record<string, any>;
  result?: 'WIN' | 'LOSS' | 'BREAKEVEN' | null;
  pips?: number;
}

// ---------------------------------------------------------------------------
// products
// ---------------------------------------------------------------------------
export interface LongPlanOffer {
  duration: string;   // e.g. "1 Year"
  price: number;
  discount: string;   // e.g. "20% Off"
}

export interface PerformanceResult {
  id: string;
  product_id: string;
  win_rate: number;
  monthly_return: number;
  drawdown: number;
  total_trades: number;
  is_live: boolean;
  equity_curve: number[];
  last_updated: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  created_at: string;
  strategy_details?: string;
  risk_profile?: string;
  performance_data: { type: 'text' | 'image'; content: string }[]; // jsonb
  q_and_a: QA[];              // jsonb
  terms_and_conditions?: string;
  strategy_graph_url?: string;
  backtesting_result_url?: string;
  video_explanation_url?: string;
  long_plan_offers: LongPlanOffer[]; // jsonb
  category?: string;
  supported_assets?: string[];
  // joined via query
  product_variants?: ProductVariant[];
  reviews?: Review[];
  performance?: PerformanceResult;
}

// ---------------------------------------------------------------------------
// product_variants
// ---------------------------------------------------------------------------
export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  price: number;
  currency: string;
  duration_days: number;
  stripe_price_id?: string;
  razorpay_plan_id?: string;
  created_at: string;
}

// ---------------------------------------------------------------------------
// reviews  (column is "text", NOT "comment")
// ---------------------------------------------------------------------------
export interface Review {
  id?: string;
  user_id?: string;    // References auth.users(id)
  name: string;        // Fallback for anonymous or custom name
  user_name?: string;  // Internal identifier
  rating: number;
  text: string;
  role?: string;
  image_url?: string;
  region?: string;     // e.g. IN, US, EU
  source?: string;     // e.g. web, referral, campaign
  status: 'pending' | 'approved' | 'rejected' | 'hidden';
  priority?: number;   // show best first
  rejection_reason?: string;
  flagged?: boolean;    // for spam/fraud detection
  ip_address?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
}

// ---------------------------------------------------------------------------
// content_posts  (maps to Blog page)
// ---------------------------------------------------------------------------
export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;    // main text content column
  body?: string;      // alternate rich-text body column
  image_url?: string;
  featured_image?: string;
  category?: string;
  status: string;
  created_at: string;
  content_type: string;
  author_id?: string;
  // joined via apiHandlers
  author?: {
    full_name?: string;
    avatar_url?: string;
  };
  // Extended fields — add via ALTER TABLE if you need these stored in Supabase
  bold_headline?: string;
  author_name?: string;
  author_profile_url?: string;
  author_bio?: string;
  video_url?: string;
}

// ---------------------------------------------------------------------------
// courses / lessons
// ---------------------------------------------------------------------------
export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  video_url?: string;
  content?: string;
  sort_order: number;
  created_at: string;
  // UI fields
  is_free?: boolean;
  duration?: string;
}

// Chapter is an alias for Lesson — used in CourseDetail.tsx
export type Chapter = Lesson;

export interface Course {
  id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  image_url?: string;   // alias used in UI getCourseImage()
  price: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  created_at: string;
  // UI display fields (add via ALTER TABLE to persist in Supabase)
  duration?: string;
  instructor_name?: string;
  // joined via lessons query — alias used in pages
  chapters?: Lesson[];
  lessons?: Lesson[];
}

// ---------------------------------------------------------------------------
// agent_accounts
// ---------------------------------------------------------------------------
export interface AgentAccount {
  id: string;
  user_id: string;
  account_status: string;   // 'pending' | 'active' | etc.
  commission_rate: number;
  created_at: string;
}

// ---------------------------------------------------------------------------
// sales_tracking
// ---------------------------------------------------------------------------
export interface SaleTracking {
  id: string;
  agent_id: string;
  user_id: string;
  product_id: string;
  sale_amount: number;
  created_at: string;
}

// ---------------------------------------------------------------------------
// algo_bots / bot_licenses
// ---------------------------------------------------------------------------
export interface AlgoBot {
  id: string;
  product_id?: string;
  name: string;
  version?: string;
  download_url?: string;
  checksum?: string;
  created_at: string;
}

export interface BotLicense {
  id: string;
  user_id?: string;
  algo_id?: string;
  license_key: string;
  account_id?: string;
  hardware_id?: string;
  is_active: boolean;
  last_validated_at?: string;
  expires_at?: string;
  created_at: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  status: 'cold' | 'warm' | 'hot' | 'active' | 'churned' | 'converted' | 'interested' | 'HIGH_INTENT';
  source?: string;
  created_at: string;
  revenue_mtd: number;
  ltv_projected: number;
  last_active_symbol?: string;
  engagement_score?: number;
  referred_by_code?: string;
  metadata?: Record<string, any>;
}

export interface WebinarRegistration {
  id: string;
  webinar_id: string;
  user_id: string;
  email?: string;
  attended: boolean;
  payment_status: string;
  payment_id?: string;
  created_at: string;
}
